import express from 'express';
import Keycloak from 'keycloak-connect';
import session from 'express-session';
import db from './mongodb/conn.mjs';
import User from './models/user.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

var memoryStore = new session.MemoryStore();

app.use( session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
} ))

// Middleware configuration loaded from keycloak.json file.
const keycloak = new Keycloak({
    store: memoryStore
});

app.use(keycloak.middleware(
    {
        logout: '/logout',
        admin: '/'
    }
));

app.get('/', (req, res) => {
    res.json({message: "Public route !"});
});

app.get('/get-items', keycloak.protect(), async (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub.toString();
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            res.status(404);
            return res.json({message: "User not found", userId: userId});
        }
        return res.json({userId: userId, message:"List retrieved", itemList: user.itemList || []});
    } catch (error) {
        res.status(500);
        return res.json({message: "Get list error", error: error});
    }
});

app.post('/newUser', keycloak.protect(), async (req, res) => {
    try{
        const userId = req.kauth.grant.access_token.content.sub.toString();
        const newuser = new User({userId: userId, itemList: []});
        const result = await newuser.save();
        return res.json({message: "User initialized", userId: userId, data: result});
    } catch (error) {
        res.status(500);
        return res.json({message: "Error creating user", error: error});
    }
});


app.post('/add-item', keycloak.protect(), async (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub.toString();
    const newitem = req.body?.newitem;
    if (!newitem || newitem === "") {
        res.status(400);
        return res.json({message: "No item provided", userId: userId})
    }
    try {
        const user = await User.findOne({ userId });

        if (!user) {
            res.status(404);
            return res.json({message: "User not found", userId: userId});
        }

        user.itemList.push(newitem);
        await user.save();
        return res.json({ message: 'Item added', data: user, userId: userId});
      } catch (error) {
        res.status(500);
        return res.json({message: "Error adding item", error: error});
      }
});

app.delete('/remove-item/:index', keycloak.protect(), async (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub.toString();
    const index = req.params.index;
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            res.status(404);
            return res.json({message: "User not found", userId: userId});
        }
        if (index < 0 || index >= user.itemList.length) {
            res.status(400);
            return res.json({message: "Index out of bounds", userId: userId});
        }
        user.itemList.splice(index, 1);
        await user.save();
        return res.json({ message: 'Item removed', data: user, userId: userId});
    } catch (error) {
        res.status(500);
        return res.json({message: "Error removing item", error: error});
    }
});

app.use('*', (req, res) => {
    res.status(404);
    res.json({message: "Not found", error: 404});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
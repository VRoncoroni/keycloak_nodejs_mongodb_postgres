import express from 'express';
import Keycloak from 'keycloak-connect';
import session from 'express-session';
import db from './mongodb/conn.mjs';
import User from './models/user.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.options('*', cors());
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
    res.send('Public');
});

app.get('/get-items', keycloak.protect(), async (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub.toString();
    try {
        console.log("here");
        const user = await User.findById(userId);
        console.log();
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.json({itemList: user.itemList || []});
    } catch (error) {
        return res.json({message: "Get list error", error: error});
    }
});

app.post('/add-item', keycloak.protect(), async (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub;
    const newitem = req.body?.newitem;
    console.log(req.body)
    if (!newitem) {
        return res.status(400).send('No item provided');
    }
    try {
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $push: { itemList: newitem } },
          { new: true }
        );
        return res.send('Item added');
      } catch (error) {
        return res.status(500).send('Error adding item');
      }
});

app.use('*', (req, res) => {
    res.send('Route Not found!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
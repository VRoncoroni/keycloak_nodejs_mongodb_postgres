import mongoose from 'mongoose';

mongoose.connect('mongodb://mongodb:27017/node-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Vous pouvez éventuellement effectuer d'autres actions une fois la connexion établie
  // Par exemple : initialiser des schémas, des modèles ou d'autres configurations
});

export default db;

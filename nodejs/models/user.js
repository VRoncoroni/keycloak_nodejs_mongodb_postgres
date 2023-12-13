// models/user.js

import mongoose from 'mongoose';

// Définition du schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  itemList: {
    type: [String],
    default: []
  }
});

// Création du modèle User à partir du schéma
const User = mongoose.model('User', userSchema);

export default User;
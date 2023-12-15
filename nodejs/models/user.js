import mongoose from 'mongoose';

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

const User = mongoose.model('User', userSchema);

export default User;
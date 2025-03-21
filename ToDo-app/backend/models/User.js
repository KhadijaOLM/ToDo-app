const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },  
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
});
module.exports = mongoose.model('User', userSchema);
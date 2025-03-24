const mongoose = require('mongoose');
const listSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  title: { type: String, required: true },
  position: { type: Number, required: true },
});
module.exports = mongoose.model('List',  listSchema);
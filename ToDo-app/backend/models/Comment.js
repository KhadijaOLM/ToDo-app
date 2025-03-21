const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  comment: { type: String, required: false },
  created_at: { type: Date, required: true },
});
module.exports = mongoose.model('Card',  commentSchema);
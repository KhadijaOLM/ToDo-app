const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  comment: { type: String, required: false },
  created_at: { type: Date, required: true },
});
module.exports = mongoose.model('Comment',  commentSchema);
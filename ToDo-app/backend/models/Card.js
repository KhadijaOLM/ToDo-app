const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  position: { type: Number, required: true },
  due_date: { type: Date, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
});
const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);
module.exports = Card;

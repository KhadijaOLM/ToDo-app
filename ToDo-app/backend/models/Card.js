const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  position: { type: Number, required: true },
  due_date: { type: Date, required: true },
});
module.exports = mongoose.model('Card',  cardSchema);
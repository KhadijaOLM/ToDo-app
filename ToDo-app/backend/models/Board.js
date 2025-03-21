const mongoose = require('mongoose');
const boardSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
});
module.exports = mongoose.model('Board',  boardSchema);
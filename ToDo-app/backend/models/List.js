const mongoose = require('mongoose');
const listSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  position: { type: Number, required: true },
});
module.exports = mongoose.model('List',  listSchema);
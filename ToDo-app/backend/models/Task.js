
mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    due_date: Date,
    position: Number,
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ['A faire', 'En cours', 'Terminé'],
      default: 'A faire'
    },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' }
  });

  const Task = mongoose.model('Task', taskSchema);
  module.exports = Task;

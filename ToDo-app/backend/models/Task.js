const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    due_date: Date,
    position: Number,
    status: { 
      type: String, 
      enum: ['A faire', 'En cours', 'Terminé'],
      default: 'A faire'
    },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' }
  });
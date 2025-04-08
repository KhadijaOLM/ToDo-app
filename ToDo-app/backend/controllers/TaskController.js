
const mongoose = require('mongoose');
const Task = require('../models/Task');

// Créer une tâche
exports.createTask = async (req, res) => {
  try {
    const { title, description, due_date, status, boardId } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ 
        message: 'Le titre et l\'ID du tableau sont requis' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'ID de tableau invalide' });
    }

    const newTask = new Task({
      title,
      description,
      due_date: due_date || null,
      status: status || 'A faire',
      boardId
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      _id: savedTask._id,
      title: savedTask.title,
      description: savedTask.description,
      status: savedTask.status,
      due_date: savedTask.due_date,
      boardId: savedTask.boardId,
      createdAt: savedTask.createdAt
    });

  } catch (err) {
    console.error('Erreur createTask:', err);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Récupérer toutes les tâches d'un tableau
exports.getTasksByBoard = async (req, res) => {
  try {
    const { boardId } = req.query;

    if (!boardId) {
      return res.status(400).json({ message: 'boardId est requis' });
    }

    const tasks = await Task.find({ boardId })
      .sort({ createdAt: -1 }); 

    res.json(tasks.map(task => ({
      ...task.toObject(),
      id: task._id 
    })));

  } catch (err) {
    console.error('Erreur getTasksByBoard:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer une tâche spécifique
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({
      ...task.toObject(),
      id: task._id
    });

  } catch (err) {
    if (err instanceof mongoose.CastError) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status && !['A faire', 'En cours', 'Terminé'].includes(updates.status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({
      ...task.toObject(),
      id: task._id
    });

  } catch (err) {
    console.error('Erreur updateTask:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({ 
      message: 'Tâche supprimée avec succès',
      deletedId: deletedTask._id
    });

  } catch (err) {
    console.error('Erreur deleteTask:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Statistiques des tâches
exports.getTaskStats = async (req, res) => {
  try {
    const { boardId } = req.query;

    const stats = await Task.aggregate([
      { $match: { boardId: new mongoose.Types.ObjectId(boardId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);

  } catch (err) {
    console.error('Erreur getTaskStats:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

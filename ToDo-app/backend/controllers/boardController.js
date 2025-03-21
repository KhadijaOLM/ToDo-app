const Board = require('../models/Board');

// Créer un tableau
const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const board = new Board({
      title,
      userId: req.user.id,
    });

    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir tous les tableaux
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.id });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un tableau
const updateBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Tableau non trouvé' });
    }

    board.title = title;
    await board.save();
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un tableau
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Tableau non trouvé' });
    }

    await board.remove();
    res.status(200).json({ message: 'Tableau supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
};
const Board = require('../models/Board');

const checkBoardOwner = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    
    if (!board) {
      return res.status(404).json({ message: 'Tableau non trouvé' });
    }

    // Vérification renforcée
    if (!req.user || !board.userId || board.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    req.board = board;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un tableau
const createBoard = async (req, res) => {
  console.log('Utilisateur authentifié:', req.user);
  try {
    const { title, description } = req.body;

    
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'Utilisateur non authentifié' });
    }

    
    const board = new Board({
      title,
      description,
      userId: req.user.id,
    });

    await board.save();
    res.status(201).json(board);
  } catch (err) {
    console.error('Erreur lors de la création du tableau:', err);
    res.status(500).json({ message: err.message });
  }
};



// Obtenir tous les tableaux
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.id });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un tableau
const updateBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findById(req.params.id);
    if (board.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
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
    const board = await Board.findByIdAndDelete(req.params.id);
    if (board.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
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
  checkBoardOwner,
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
};
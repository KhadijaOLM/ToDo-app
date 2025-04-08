
const mongoose = require('mongoose');
const Board = require('../models/Board');

// Middleware de vérification de propriétaire
const checkBoardOwner = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de tableau invalide' });
    }

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Tableau non trouvé' });

    if (board.userId.toString() !== req.user.id.toString()) {
      console.log('Comparaison userId:',
        board.userId.toString(), 'vs', req.user.id.toString());
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    req.board = board;
    next();
  } catch (err) {
    console.error('Erreur checkBoardOwner:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Création d'un tableau
const createBoard = async (req, res) => {
  try {
    console.log('Request user:', req.user);

    const { title, description } = req.body;
    
    if (!title) {
      console.error('User ID missing in request');
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    if (!req.user?.id) {
      return res.status(400).json({ message: 'User ID manquant' });
    }

    const newBoard = new Board({
      title,
      description: description || '',
      userId: req.user.id, 
    });

    const savedBoard = await newBoard.save();
    
    res.status(201).json({
      id: savedBoard._id,
      title: savedBoard.title,
      description: savedBoard.description,
      userId: savedBoard.userId
    });
  } catch (err) {
    console.error('Erreur createBoard:', err);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: err.message
    });
  }
};

// getBoards - version optimisée
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
// Pour la méthode GET by ID (récupérer un tableau spécifique)
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Tableau non trouvé' });

    res.json({
      id: board._id.toString(),  // Conversion ici
      title: board.title,
      description: board.description
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un tableau
const updateBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const boardId = req.params.id;

    console.log('Received update for board ID:', req.params.id);
    console.log('Update data:', req.body);
    
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ 
        success: false,
        message: 'ID manquant dans l\'URL'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: 'Tableau non trouvé' });

    // Vérification du propriétaire
    if (board.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    board.title = title || board.title;
    board.description = description || board.description;
    await board.save();

    res.json({
      id: board._id,
      title: board.title,
      description: board.description,
      userId: board.userId
    });
  } catch (err) {
    console.error('Erreur updateBoard:', err);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Supprimer un tableau
const deleteBoard = async (req, res) => {
  try {
    const deletedBoard = await Board.findByIdAndDelete(req.params.id);
    
    if (!deletedBoard) {
      return res.status(404).json({ message: 'Tableau non trouvé' });
    }

    res.status(200).json({ message: 'Tableau supprimé avec succès' });
  } catch (err) {
    console.error('Erreur deleteBoard:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
//Fonction pour partager un tableau
const shareBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, permission } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur à partager existe
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher de se partager à soi-même
    if (userToShare._id.toString() === userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas partager avec vous-même' });
    }

    // Trouver et mettre à jour le tableau
    const board = await Board.findById(id);
    
    // Vérifier si le tableau est déjà partagé avec cet utilisateur
    const existingShareIndex = board.sharedWith.findIndex(
      s => s.user.toString() === userToShare._id.toString()
    );

    if (existingShareIndex >= 0) {
      // Mettre à jour la permission existante
      board.sharedWith[existingShareIndex].permission = permission;
    } else {
      // Ajouter un nouveau partage
      board.sharedWith.push({
        user: userToShare._id,
        permission
      });
    }

    await board.save();

    res.json({
      message: 'Tableau partagé avec succès',
      sharedWith: board.sharedWith
    });

  } catch (error) {
    console.error('Erreur partage tableau:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour récupérer les tableaux partagés
const getSharedBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      'sharedWith.user': req.user.id
    }).populate('owner', 'username email');

    res.json(boards);
  } catch (error) {
    console.error('Erreur récupération tableaux partagés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  checkBoardOwner,
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  shareBoard,
  getSharedBoards
};

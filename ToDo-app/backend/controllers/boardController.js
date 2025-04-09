const mongoose = require('mongoose');
const Board = require('../models/Board');
const User = require('../models/User');

// Middleware de vérification de propriétaire
const checkBoardOwner = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de tableau invalide' });
    }

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Tableau non trouvé' });

    if (board.userId.toString() !== req.user.id.toString()) {
      // Vérifier si le tableau est partagé avec l'utilisateur
      const isShared = board.sharedWith && board.sharedWith.some(
        share => share.user.toString() === req.user.id.toString() && share.permission === 'edit'
      );

      if (!isShared) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
    }

    req.board = board;
    next();
  } catch (err) {
    console.error('Erreur checkBoardOwner:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour vérifier l'accès en lecture au tableau
const checkBoardAccess = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de tableau invalide' });
    }

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Tableau non trouvé' });

    // Vérifier si l'utilisateur est propriétaire ou si le tableau est partagé avec lui
    if (board.userId.toString() === req.user.id.toString() ||
        (board.sharedWith && board.sharedWith.some(share => share.user.toString() === req.user.id.toString()))) {
      req.board = board;
      next();
    } else {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
  } catch (err) {
    console.error('Erreur checkBoardAccess:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Création d'un tableau
const createBoard = async (req, res) => {
  try {
    const { title, description, workspaceId } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    if (!workspaceId) {
      return res.status(400).json({ message: 'L\'ID de l\'espace de travail est requis' });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ message: 'ID d\'espace de travail invalide' });
    }

    // Vérifier que l'espace de travail existe et que l'utilisateur y a accès
    const Workspace = require('../models/Workspace');
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Espace de travail non trouvé' });
    }
    
    // Vérifier si l'utilisateur est propriétaire ou membre avec droits suffisants
    const isOwner = workspace.ownerId.toString() === req.user.id.toString();
    const isMemberWithRights = workspace.members.some(
      member => member.user.toString() === req.user.id.toString() && 
                ['admin', 'member'].includes(member.role)
    );
    
    if (!isOwner && !isMemberWithRights) {
      return res.status(403).json({ message: 'Vous n\'avez pas les droits pour créer un tableau dans cet espace de travail' });
    }

    const newBoard = new Board({
      title,
      description: description || '',
      userId: req.user.id,
      workspaceId
    });

    const savedBoard = await newBoard.save();
    
    res.status(201).json({
      id: savedBoard._id,
      title: savedBoard.title,
      description: savedBoard.description,
      userId: savedBoard.userId,
      workspaceId: savedBoard.workspaceId
    });
  } catch (err) {
    console.error('Erreur createBoard:', err);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: err.message
    });
  }
};

// Obtenir tous les tableaux de l'utilisateur par espace de travail
const getBoards = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    
    if (!workspaceId) {
      // Si aucun workspaceId n'est spécifié, renvoyer une erreur
      return res.status(400).json({ message: 'L\'ID de l\'espace de travail est requis' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({ message: 'ID d\'espace de travail invalide' });
    }
    
    // Vérifier l'accès à l'espace de travail
    const Workspace = require('../models/Workspace');
    const workspace = await Workspace.findById(workspaceId);
    
    if (!workspace) {
      return res.status(404).json({ message: 'Espace de travail non trouvé' });
    }
    
    const isOwnerOrMember = 
      workspace.ownerId.toString() === req.user.id.toString() ||
      workspace.members.some(member => member.user.toString() === req.user.id.toString());
    
    if (!isOwnerOrMember) {
      return res.status(403).json({ message: 'Accès non autorisé à cet espace de travail' });
    }
    
    // Rechercher les tableaux qui appartiennent à l'utilisateur dans cet espace de travail
    const userBoards = await Board.find({ 
      workspaceId, 
      userId: req.user.id 
    });
    
    // Rechercher également les tableaux partagés avec l'utilisateur
    const sharedBoards = await Board.find({ 
      workspaceId,
      'sharedWith.user': req.user.id
    });
    
    // Combiner les deux listes et éliminer les doublons
    const allBoards = [...userBoards];
    
    sharedBoards.forEach(board => {
      if (!allBoards.some(b => b._id.toString() === board._id.toString())) {
        allBoards.push(board);
      }
    });
    
    res.json(allBoards);
  } catch (err) {
    console.error('Erreur getBoards:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir un tableau spécifique
const getBoardById = async (req, res) => {
  try {
    // La vérification est déjà faite par checkBoardAccess
    const board = req.board;
    
    res.json({
      id: board._id.toString(),
      title: board.title,
      description: board.description,
      userId: board.userId,
      workspaceId: board.workspaceId,
      sharedWith: board.sharedWith || []
    });
  } catch (err) {
    console.error('Erreur getBoardById:', err);
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un tableau
const updateBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // La vérification est déjà faite par checkBoardOwner
    const board = req.board;
    
    if (title) board.title = title;
    if (description !== undefined) board.description = description;
    
    await board.save();

    res.json({
      id: board._id,
      title: board.title,
      description: board.description,
      userId: board.userId,
      workspaceId: board.workspaceId
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
    // La vérification est déjà faite par checkBoardOwner
    const board = req.board;
    
    // Supprimer toutes les tâches associées à ce tableau
    const Task = require('../models/Task');
    await Task.deleteMany({ boardId: board._id });
    
    // Supprimer le tableau
    await Board.findByIdAndDelete(board._id);
    
    res.status(200).json({ message: 'Tableau et toutes les tâches associées supprimés avec succès' });
  } catch (err) {
    console.error('Erreur deleteBoard:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Partager un tableau
const shareBoard = async (req, res) => {
  try {
    const { email, permission } = req.body;
    
    // La vérification est déjà faite par checkBoardOwner
    const board = req.board;

    if (!email) {
      return res.status(400).json({ message: 'L\'email est requis' });
    }
    
    // Vérifier que l'utilisateur existe
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher de partager avec soi-même
    if (userToShare._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'Vous ne pouvez pas partager avec vous-même' });
    }

    // Vérifier si le tableau est déjà partagé avec cet utilisateur
    if (!board.sharedWith) {
      board.sharedWith = [];
    }
    
    const existingShareIndex = board.sharedWith.findIndex(
      s => s.user && s.user.toString() === userToShare._id.toString()
    );

    if (existingShareIndex >= 0) {
      // Mettre à jour la permission existante
      board.sharedWith[existingShareIndex].permission = permission || 'view';
    } else {
      // Ajouter un nouveau partage
      board.sharedWith.push({
        user: userToShare._id,
        permission: permission || 'view'
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

// Obtenir les tableaux partagés avec l'utilisateur
const getSharedBoards = async (req, res) => {
  try {
    const { workspaceId } = req.query;
    
    let query = { 'sharedWith.user': req.user.id };
    
    if (workspaceId) {
      if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        return res.status(400).json({ message: 'ID d\'espace de travail invalide' });
      }
      query.workspaceId = workspaceId;
    }
    
    const boards = await Board.find(query)
      .populate('userId', 'username email')
      .populate('workspaceId', 'name');

    res.json(boards);
  } catch (error) {
    console.error('Erreur récupération tableaux partagés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  checkBoardOwner,
  checkBoardAccess,
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  shareBoard,
  getSharedBoards
};

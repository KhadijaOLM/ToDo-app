const mongoose = require('mongoose');
const Workspace = require('../models/Workspace');
const Board = require('../models/Board');

// Middleware de vérification de propriétaire d'un workspace
const checkWorkspaceOwner = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID d\'espace de travail invalide' });
    }

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Espace de travail non trouvé' });

    if (workspace.ownerId.toString() !== req.user.id.toString()) {
      // Vérifier si l'utilisateur est membre avec des droits d'admin
      const isMemberAdmin = workspace.members.some(
        member => member.user.toString() === req.user.id.toString() && member.role === 'admin'
      );

      if (!isMemberAdmin) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
    }

    req.workspace = workspace;
    next();
  } catch (err) {
    console.error('Erreur checkWorkspaceOwner:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour vérifier si l'utilisateur est membre de l'espace de travail
const checkWorkspaceMember = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID d\'espace de travail invalide' });
    }

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Espace de travail non trouvé' });

    // Vérifier si l'utilisateur est propriétaire ou membre
    if (workspace.ownerId.toString() === req.user.id.toString() ||
        workspace.members.some(member => member.user.toString() === req.user.id.toString())) {
      req.workspace = workspace;
      next();
    } else {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
  } catch (err) {
    console.error('Erreur checkWorkspaceMember:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Création d'un espace de travail
const createWorkspace = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est authentifié
    if (!req.user || (!req.user.id && !req.user._id)) {
      console.error('Tentative de création d\'un espace de travail sans utilisateur authentifié');
      console.log('req.user:', req.user);
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    // Utiliser soit req.user.id, soit req.user._id selon ce qui est disponible
    const userId = req.user.id || req.user._id;
    
    console.log('Création d\'un espace de travail avec les données:', { 
      name, 
      description, 
      ownerId: userId,
      user: req.user 
    });

    const newWorkspace = new Workspace({
      name,
      description: description || '',
      ownerId: userId,
      members: [] // Initialisation explicite d'un tableau vide pour les membres
    });

    const savedWorkspace = await newWorkspace.save();
    
    console.log('Espace de travail créé avec succès:', savedWorkspace._id);
    
    res.status(201).json({
      id: savedWorkspace._id,
      name: savedWorkspace.name,
      description: savedWorkspace.description,
      ownerId: savedWorkspace.ownerId,
      members: savedWorkspace.members
    });
  } catch (err) {
    console.error('Erreur complète lors de la création de l\'espace de travail:', err);
    res.status(500).json({ 
      message: 'Erreur lors de la création de l\'espace de travail',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Obtenir tous les espaces de travail de l'utilisateur
const getWorkspaces = async (req, res) => {
  try {
    // Rechercher les espaces de travail où l'utilisateur est propriétaire
    const ownedWorkspaces = await Workspace.find({ ownerId: req.user.id });
    
    // Rechercher les espaces de travail où l'utilisateur est membre
    const memberWorkspaces = await Workspace.find({
      'members.user': req.user.id
    });
    
    // Combiner les deux listes et éliminer les doublons
    const allWorkspaces = [...ownedWorkspaces];
    
    // Ajouter les espaces où l'utilisateur est membre, en évitant les doublons
    memberWorkspaces.forEach(workspace => {
      if (!allWorkspaces.some(w => w._id.toString() === workspace._id.toString())) {
        allWorkspaces.push(workspace);
      }
    });
    
    res.json(allWorkspaces);
  } catch (err) {
    console.error('Erreur getWorkspaces:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir un espace de travail spécifique
const getWorkspaceById = async (req, res) => {
  try {
    // La vérification et récupération est déjà faite par checkWorkspaceMember
    const workspace = req.workspace;
    
    // Récupérer les tableaux associés à cet espace de travail
    const boards = await Board.find({ workspaceId: workspace._id });
    
    res.json({
      id: workspace._id,
      name: workspace.name,
      description: workspace.description,
      ownerId: workspace.ownerId,
      members: workspace.members,
      boards: boards
    });
  } catch (err) {
    console.error('Erreur getWorkspaceById:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un espace de travail
const updateWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }
    
    const workspace = req.workspace;
    
    workspace.name = name;
    workspace.description = description || workspace.description;
    
    await workspace.save();
    
    res.json({
      id: workspace._id,
      name: workspace.name,
      description: workspace.description,
      ownerId: workspace.ownerId
    });
  } catch (err) {
    console.error('Erreur updateWorkspace:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un espace de travail
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = req.workspace;
    
    // Supprimer tous les tableaux associés à cet espace de travail
    await Board.deleteMany({ workspaceId: workspace._id });
    
    // Supprimer l'espace de travail
    await Workspace.findByIdAndDelete(workspace._id);
    
    res.status(200).json({ message: 'Espace de travail et tous les tableaux associés supprimés' });
  } catch (err) {
    console.error('Erreur deleteWorkspace:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un membre à l'espace de travail
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'L\'email est requis' });
    }
    
    // Rechercher l'utilisateur par email
    const User = require('../models/User');
    const userToAdd = await User.findOne({ email });
    
    if (!userToAdd) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const workspace = req.workspace;
    
    // Vérifier si l'utilisateur est déjà membre
    if (workspace.members.some(member => member.user.toString() === userToAdd._id.toString())) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà membre de l\'espace de travail' });
    }
    
    // Ajouter le membre
    workspace.members.push({
      user: userToAdd._id,
      role: role || 'member'
    });
    
    await workspace.save();
    
    res.status(200).json({ 
      message: 'Membre ajouté avec succès',
      member: {
        user: {
          _id: userToAdd._id,
          email: userToAdd.email,
          username: userToAdd.username
        },
        role: role || 'member'
      }
    });
  } catch (err) {
    console.error('Erreur addMember:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un membre de l'espace de travail
const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ message: 'ID de membre invalide' });
    }
    
    const workspace = req.workspace;
    
    // Trouver l'index du membre
    const memberIndex = workspace.members.findIndex(
      member => member.user.toString() === memberId
    );
    
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Membre non trouvé dans cet espace de travail' });
    }
    
    // Supprimer le membre
    workspace.members.splice(memberIndex, 1);
    await workspace.save();
    
    res.status(200).json({ message: 'Membre supprimé avec succès' });
  } catch (err) {
    console.error('Erreur removeMember:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  checkWorkspaceOwner,
  checkWorkspaceMember,
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
};
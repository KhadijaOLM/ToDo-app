const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  checkWorkspaceOwner,
  checkWorkspaceMember,
  addMember,
  removeMember
} = require('../controllers/workspaceController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes pour les espaces de travail
router.post('/', authMiddleware, createWorkspace);
router.get('/', authMiddleware, getWorkspaces);
router.get('/:id', authMiddleware, checkWorkspaceMember, getWorkspaceById);
router.put('/:id', authMiddleware, checkWorkspaceOwner, updateWorkspace);
router.delete('/:id', authMiddleware, checkWorkspaceOwner, deleteWorkspace);

// Routes pour la gestion des membres
router.post('/:id/members', authMiddleware, checkWorkspaceOwner, addMember);
router.delete('/:id/members/:memberId', authMiddleware, checkWorkspaceOwner, removeMember);

module.exports = router;
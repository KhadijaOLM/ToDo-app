const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  checkBoardOwner,
  checkBoardAccess,
  shareBoard,
  getSharedBoards
} = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes CRUD pour les tableaux
router.post('/', authMiddleware, createBoard);
router.get('/', authMiddleware, getBoards); 
router.get('/shared', authMiddleware, getSharedBoards);
router.get('/:id', authMiddleware, checkBoardAccess, getBoardById);
router.put('/:id', authMiddleware, checkBoardOwner, updateBoard);
router.delete('/:id', authMiddleware, checkBoardOwner, deleteBoard);

// Routes pour le partage
router.post('/:id/share', authMiddleware, checkBoardOwner, shareBoard);

module.exports = router;


const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  checkBoardOwner,
  shareBoard,
  getSharedBoards
} = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createBoard);
router.get('/', authMiddleware, getBoards); 
router.get('/:id', authMiddleware, getBoardById);
router.put('/api/boards/:id', authMiddleware, updateBoard);
router.delete('/:id', authMiddleware, checkBoardOwner, deleteBoard);

router.post('/:id/share', authMiddleware, checkBoardOwner, shareBoard);
router.get('/shared/me', authMiddleware, getSharedBoards);

module.exports = router;

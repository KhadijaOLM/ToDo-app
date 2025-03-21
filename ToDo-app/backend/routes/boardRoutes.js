const express = require('express');
const router = express.Router();
const { createBoard, getBoards, updateBoard, deleteBoard } = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer un tableau
router.post('/', authMiddleware, createBoard);

// Route pour obtenir tous les tableaux
router.get('/', authMiddleware, getBoards);

// Route pour mettre à jour un tableau
router.put('/:id', authMiddleware, updateBoard);

// Route pour supprimer un tableau
router.delete('/:id', authMiddleware, deleteBoard);

module.exports = router;
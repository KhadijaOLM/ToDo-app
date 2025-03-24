const express = require('express');
const router = express.Router();
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer un commentaire
router.post('/', authMiddleware, createComment);

// Route pour obtenir tous les commentaires d'une carte
router.get('/:cardId', authMiddleware, getComments);

// Route pour mettre à jour un commentaire
router.put('/:id', authMiddleware, updateComment);

// Route pour supprimer un commentaire
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
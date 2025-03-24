const express = require('express');
const router = express.Router();
const { createCard, getCards, updateCard, deleteCard } = require('../controllers/cardController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer une carte
router.post('/', authMiddleware, createCard);

// Route pour obtenir toutes les cartes d'un tableau
router.get('/:boardId', authMiddleware, getCards);

// Route pour mettre à jour une carte
router.put('/:id', authMiddleware, updateCard);

// Route pour supprimer une carte
router.delete('/:id', authMiddleware, deleteCard);

module.exports = router;
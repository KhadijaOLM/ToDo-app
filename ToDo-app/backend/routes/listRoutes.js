const express = require('express');
const router = express.Router();
const { createList, getLists, updateList, deleteList } = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer une liste
router.post('/', authMiddleware, createList);

// Route pour obtenir toutes les listes d'un tableau
router.get('/:boardId', authMiddleware, getLists);

// Route pour mettre à jour une liste
router.put('/:id', authMiddleware, updateList);

// Route pour supprimer une liste
router.delete('/:id', authMiddleware, deleteList);

module.exports = router;
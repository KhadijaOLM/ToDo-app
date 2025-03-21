const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Route pour obtenir tous les utilisateurs (admin seulement)
router.get('/', authMiddleware, adminMiddleware, getUsers);

// Route pour supprimer un utilisateur (admin seulement)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

// Route pour mettre à jour le rôle d'un utilisateur (admin seulement)
router.put('/:id/role', authMiddleware, adminMiddleware, updateUserRole);

module.exports = router;
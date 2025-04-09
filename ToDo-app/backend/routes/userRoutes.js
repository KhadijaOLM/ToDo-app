const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, updateUser, deleteUser, verifyToken } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour l'inscription
router.post('/register', registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour vérifier le token
router.get('/verify', verifyToken);

// Route pour obtenir les informations de l'utilisateur connecté
router.get('/me', authMiddleware, getCurrentUser);

// Route pour mettre à jour les informations de l'utilisateur
router.put('/me', authMiddleware, updateUser);

// Route pour supprimer un utilisateur
router.delete('/me', authMiddleware, deleteUser);

module.exports = router;
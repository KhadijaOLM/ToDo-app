const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Configuration du rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limite chaque IP à 10 requêtes
  message: { 
    success: false,
    error: 'Trop de tentatives, veuillez réessayer plus tard'
  },
  skipSuccessfulRequests: true
});

// Validation des données
const validateUserInput = (method) => {
  switch (method) {
    case 'register':
      return [
        body('email')
          .isEmail().withMessage('Email invalide')
          .normalizeEmail(),
        body('password')
          .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
          .matches(/[0-9]/).withMessage('Le mot de passe doit contenir un chiffre')
          .matches(/[a-zA-Z]/).withMessage('Le mot de passe doit contenir une lettre'),
        body('username')
          .trim()
          .notEmpty().withMessage('Le nom d\'utilisateur est requis')
          .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
      ];
    case 'login':
      return [
        body('email')
          .isEmail().withMessage('Email invalide')
          .normalizeEmail(),
        body('password')
          .notEmpty().withMessage('Le mot de passe est requis')
      ];
    default:
      return [];
  }
};

// Routes
router.post(
  '/register',
  authLimiter, // Applique le rate limiting
  validateUserInput('register'),
  registerUser
);

router.post(
  '/login', 
  authLimiter, // Applique le rate limiting
  validateUserInput('login'),
  loginUser // Utilise le contrôleur importé
);

module.exports = router;
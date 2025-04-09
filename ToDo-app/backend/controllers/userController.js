const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Inscription d'un utilisateur
const registerUser = async (req, res) => {
  try {
    console.log("Données reçues :", req.body); 
    const { username, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();
    
    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    console.log("Utilisateur enregistré :", user);
    
    // Ne pas renvoyer le mot de passe
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    res.status(201).json({
      user: userResponse,
      token
    });
  } catch (err) {
    console.error("Erreur lors de l'inscription :", err); 
    res.status(500).json({ message: err.message });
  }
};

// Connexion d'un utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Ne pas renvoyer le mot de passe
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(200).json({
      user: userResponse,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les informations de l'utilisateur connecté
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Vérifier le token JWT
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false, message: 'Aucun token fourni' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ valid: false, message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json({ valid: true, user });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Token invalide ou expiré' });
  }
};

// Mettre à jour les informations de l'utilisateur
const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.user.id }, 
      { username, email },
      { new: true } 
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.user.id }); 
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  verifyToken
};
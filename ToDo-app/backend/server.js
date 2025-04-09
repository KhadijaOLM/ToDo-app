const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const boardRoutes = require('./routes/boardRoutes');
const cardRoutes = require('./routes/cardRoutes');
const commentRoutes = require('./routes/commentRoutes');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/TaskRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes'); // Ajout des routes workspace
require('dotenv').config();

// Vérification de variables d'environnement critiques
if (!process.env.JWT_SECRET) {
  console.error('ERREUR: JWT_SECRET non défini dans .env');
  process.exit(1);
}

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
  exposedHeaders: ['Authorization']
}));

// Connexion à MongoDB
connectDB();

app.use(require('./middleware/debugRoutes'));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  console.log('\n=== REQUÊTE REÇUE ===');
  console.log('URL:', req.originalUrl);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('User:', req.user || 'Non authentifié');
  console.log('=====================\n');
  next();
});

// Middleware pour s'assurer que le Content-Type est défini
app.use((req, res, next) => {
  if (!req.headers['content-type']) {
    req.headers['content-type'] = 'application/json';
  }
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes); // Ajout de la route des espaces de travail

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

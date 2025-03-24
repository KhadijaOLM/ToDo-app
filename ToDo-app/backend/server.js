const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const boardRoutes = require('./routes/boardRoutes');
const cardRoutes = require('./routes/cardRoutes');
const commentRoutes = require('./routes/commentRoutes');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour CORS
app.use(cors());

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ToDo-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/boards', boardRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/users', userRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
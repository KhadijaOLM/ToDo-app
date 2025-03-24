const Card = require('../models/Card');

// Créer une carte
const createCard = async (req, res) => {
  try {
    const { title, description, boardId } = req.body;
    const card = new Card({
      title,
      description,
      userId: req.user.id, // Associe la carte à l'utilisateur connecté
      boardId, // Associe la carte à un tableau
    });

    await card.save();
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir toutes les cartes d'un tableau
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ boardId: req.params.boardId, userId: req.user.id }); // Filtre par tableau et utilisateur
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une carte
const updateCard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Vérifie que l'utilisateur est le propriétaire
      { title, description },
      { new: true } // Renvoie la carte mise à jour
    );

    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée ou action non autorisée' });
    }

    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une carte
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // Vérifie que l'utilisateur est le propriétaire
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée ou action non autorisée' });
    }

    res.status(200).json({ message: 'Carte supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCard,
  getCards,
  updateCard,
  deleteCard,
};
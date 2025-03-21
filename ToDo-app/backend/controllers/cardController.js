const Card = require('../models/Card');

// Créer une carte
const createCard = async (req, res) => {
  try {
    const { title, listId } = req.body;
    const card = new Card({
      title,
      listId,
    });

    await card.save();
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir toutes les cartes d'une liste
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ listId: req.params.listId });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une carte
const updateCard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    card.title = title;
    card.description = description;
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Déplacer une carte
const moveCard = async (req, res) => {
  try {
    const { listId } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    card.listId = listId;
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une carte
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    await card.remove();
    res.status(200).json({ message: 'Carte supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCard,
  getCards,
  updateCard,
  moveCard,
  deleteCard,
};
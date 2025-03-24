const List = require('../models/List');

// Créer une liste
const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const list = new List({
      title,
      userId: req.user.id, // Associe la liste à l'utilisateur connecté
      boardId, // Associe la liste à un tableau
    });

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir toutes les listes d'un tableau
const getLists = async (req, res) => {
  try {
    const lists = await List.find({ boardId: req.params.boardId, userId: req.user.id }); // Filtre par tableau et utilisateur
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une liste
const updateList = async (req, res) => {
  try {
    const { title } = req.body;
    const list = await List.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Vérifie que l'utilisateur est le propriétaire
      { title },
      { new: true } // Renvoie la liste mise à jour
    );

    if (!list) {
      return res.status(404).json({ message: 'Liste non trouvée ou action non autorisée' });
    }

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une liste
const deleteList = async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // Vérifie que l'utilisateur est le propriétaire
    if (!list) {
      return res.status(404).json({ message: 'Liste non trouvée ou action non autorisée' });
    }

    res.status(200).json({ message: 'Liste supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createList,
  getLists,
  updateList,
  deleteList,
};
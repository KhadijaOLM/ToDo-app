const List = require('../models/List');

// Créer une liste
const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const list = new List({
      title,
      boardId,
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
    const lists = await List.find({ boardId: req.params.boardId });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour une liste
const updateList = async (req, res) => {
  try {
    const { title } = req.body;
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Liste non trouvée' });
    }

    list.title = title;
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une liste
const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Liste non trouvée' });
    }

    await list.remove();
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
const Comment = require('../models/Comment');

// Créer un commentaire
const createComment = async (req, res) => {
  try {
    const { text, cardId } = req.body;
    const comment = new Comment({
      text,
      userId: req.user.id, // Associe le commentaire à l'utilisateur connecté
      cardId, // Associe le commentaire à une carte
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir tous les commentaires d'une carte
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ cardId: req.params.cardId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un commentaire
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Vérifie que l'utilisateur est le propriétaire
      { text },
      { new: true } // Renvoie le commentaire mis à jour
    );

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé ou action non autorisée' });
    }

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un commentaire
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // Vérifie que l'utilisateur est le propriétaire
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé ou action non autorisée' });
    }

    res.status(200).json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
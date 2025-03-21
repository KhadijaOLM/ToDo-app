const Comment = require('../models/Comment');

// Créer un commentaire
const createComment = async (req, res) => {
  try {
    const { cardId, text } = req.body;
    const comment = new Comment({
      cardId,
      text,
      userId: req.user.id,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtenir tous les commentaires d'une carte
const getCommentsByCard = async (req, res) => {
  try {
    const comments = await Comment.find({ cardId: req.params.cardId }).populate('userId', 'username');
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mettre à jour un commentaire
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    comment.text = text;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un commentaire
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Action non autorisée' });
    }

    await comment.remove();
    res.status(200).json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createComment,
  getCommentsByCard,
  updateComment,
  deleteComment,
};

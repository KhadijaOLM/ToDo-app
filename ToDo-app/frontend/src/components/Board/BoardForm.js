import React, { useState } from 'react';
import './BoardForm.css';

const BoardForm = ({ onSubmit, editingBoard }) => {
  const [title, setTitle] = useState(editingBoard?.title || '');
  const [description, setDescription] = useState(editingBoard?.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim()
      });
      
      if (!editingBoard) {
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>Titre*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">
        {editingBoard ? 'Mettre à jour' : 'Créer'}
      </button>
    </form>
  );
};

export default BoardForm;
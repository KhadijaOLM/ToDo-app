import React, { useState } from 'react';
import './BoardForm.css';

const BoardForm = ({ onSubmit, initialData = { title: '' } }) => {
  const [title, setTitle] = useState(initialData.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title });
  };

  return (
    <form className="board-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre du tableau"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default BoardForm;
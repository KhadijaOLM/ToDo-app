import React, { useState, useEffect } from 'react';
import './BoardForm.css';

function BoardForm({ onAddBoard, initialValue = " " }) {
  const [inputValue, setInputValue] = useState(initialValue); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return; // Empêche les noms vides
    onAddBoard(inputValue);
    setInputValue(""); // Réinitialise l'input après soumission
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nom du tableau"
      />
      <button type="submit">Créer</button>
    </form>
  );
};

export default BoardForm;
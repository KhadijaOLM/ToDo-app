import React, { useState, useEffect } from 'react';
import './BoardForm.css';

export default function BoardForm({ onAddBoard, initialValue = "" }) {
  const [inputValue, setInputValue] = useState(initialValue); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return; 
    
    console.log("Envoi du titre:", inputValue);
    onAddBoard(inputValue);
    setInputValue(""); 
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nom du tableau"
        required
      />
      <button type="submit">Créer</button>
    </form>
  );
};


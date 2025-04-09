import React, { useState } from 'react';
import './WorkspaceForm.css';

const WorkspaceForm = ({ workspace, onSubmit, onCancel }) => {
  const [name, setName] = useState(workspace ? workspace.name : '');
  const [description, setDescription] = useState(workspace ? workspace.description : '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Le nom de l\'espace de travail est requis');
      return;
    }
    
    onSubmit({ 
      name: name.trim(), 
      description: description.trim() 
    });
    
    // Réinitialiser le formulaire
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <div className="workspace-form-container">
      <form onSubmit={handleSubmit} className="workspace-form">
        <h3>{workspace ? 'Modifier' : 'Créer'} un espace de travail</h3>
        
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Nom*</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de l'espace de travail"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          {onCancel && (
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onCancel}
            >
              Annuler
            </button>
          )}
          <button type="submit" className="btn-submit">
            {workspace ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceForm;
import React, { useState, useEffect } from 'react';
import './ListForm.css';

const ListForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    ...initialData
  });

  // Update form data if initialData changes (for editing an existing list)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="list-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Titre de la liste</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Entrez un titre pour la liste"
          autoFocus
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {initialData && initialData._id ? 'Mettre à jour' : 'Créer'}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default ListForm;
import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import './TaskEditModal.css';

const TaskEditModal = ({ task, onSave, onCancel }) => {
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    status: 'A faire',
    due_date: ''
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
  };

  if (!task) return null;

  return (
    <div className="task-edit-modal-overlay">
      <div className="task-edit-modal">
        <div className="modal-header">
          <h2>Modifier la tâche</h2>
          <button onClick={onCancel} className="close-btn"><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editedTask.description || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date d'échéance</label>
            <input
              type="date"
              name="due_date"
              value={editedTask.due_date || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select
              name="status"
              value={editedTask.status}
              onChange={handleChange}
            >
              <option value="A faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FaSave /> Enregistrer
            </button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              <FaTimes /> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
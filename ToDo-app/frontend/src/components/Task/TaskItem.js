import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: name === 'due_date' ? new Date(value) : value
    }));
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.status.toLowerCase().replace(' ', '-')}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            placeholder="Titre de la tâche"
            required
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="date"
            name="due_date"
            value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
          >
            <option value="A faire">A faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <div className="task-actions">
            <button className="save-btn" onClick={handleSave}>
              <FaSave /> Enregistrer
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              <FaTimes /> Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link to={`/tasks/${task._id}`} className="task-content">
            <h4>{task.title}</h4>
            <p className="task-description">
              {task.description || 'Aucune description'}
            </p>
            <div className="task-meta">
              <span className="task-status">{task.status}</span>
              <span className="task-due-date">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Non définie'}
              </span>
            </div>
          </Link>
          <div className="task-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Modifier
            </button>
            <button className="delete-btn" onClick={() => onDelete(task._id)}>
              <FaTrash /> Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
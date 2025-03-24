import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
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
            <button onClick={handleSave}>Enregistrer</button>
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        </div>
      ) : (
        <>
          <Link to={`/tasks/${task._id}`} className="task-content">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-meta">
              <span>Statut: {task.status}</span>
              <span>Échéance: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Non définie'}</span>
            </div>
          </Link>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>Modifier</button>
            <button onClick={() => onDelete(task._id)}>Supprimer</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
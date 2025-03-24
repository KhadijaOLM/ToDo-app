import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './TaskPage.css';

const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        setEditedTask(response.data);
      } catch (err) {
        console.error('Erreur:', err);
        navigate('/404');
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/tasks/${id}`, editedTask);
      setTask(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${id}`);
      navigate('/boards');
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: name === 'due_date' ? new Date(value) : value
    }));
  };

  if (!task) return <div>Chargement...</div>;

  return (
    <div className="task-page">
      {isEditing ? (
        <div className="task-edit-form">
          <h2>Modifier la tâche</h2>
          <label>
            Titre:
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Échéance:
            <input
              type="date"
              name="due_date"
              value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().split('T')[0] : ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Statut:
            <select
              name="status"
              value={editedTask.status}
              onChange={handleChange}
            >
              <option value="A faire">A faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </label>
          <div className="form-actions">
            <button onClick={handleUpdate}>Enregistrer</button>
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h2>{task.title}</h2>
            <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
              {task.status}
            </span>
          </div>
          
          <div className="task-details">
            <p>{task.description || "Aucune description"}</p>
            <div className="task-meta">
              <p><strong>Échéance:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Non définie'}</p>
              <p><strong>Créé le:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="task-actions">
            <button onClick={() => setIsEditing(true)}>Modifier</button>
            <button onClick={handleDelete} className="delete-btn">Supprimer</button>
            <button onClick={() => navigate(-1)}>Retour</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskPage;
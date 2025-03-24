import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as locales from 'date-fns/locale';
import { fr } from 'date-fns/locale';
import api from '../../utils/api';
import './TaskDetail.css';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    status: 'A faire',
    due_date: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${taskId}`);
        setTask(response.data);
        setEditedTask({
          title: response.data.title,
          description: response.data.description || '',
          status: response.data.status,
          due_date: response.data.due_date ? format(parseISO(response.data.due_date), 'yyyy-MM-dd') : ''
        });
      } catch (err) {
        console.error('Failed to fetch task:', err);
        navigate('/not-found', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...editedTask,
        due_date: editedTask.due_date || null
      };
      
      const response = await api.put(`/tasks/${taskId}`, payload);
      setTask(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        navigate(-1); // Retour à la page précédente
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  if (!task) {
    return <div className="error-message">Tâche non trouvée</div>;
  }

  return (
    <div className="task-detail-container">
      <div className="task-header">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
            className="edit-title"
          />
        ) : (
          <h1>{task.title}</h1>
        )}
        <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
          {task.status}
        </span>
      </div>

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">Créé le :</span>
          <span className="meta-value">
            {format(new Date(task.createdAt), 'PPP', { locale: fr })}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Dernière modification :</span>
          <span className="meta-value">
            {format(new Date(task.updatedAt), 'PPPp', { locale: fr })}
          </span>
        </div>
      </div>

      <div className="task-content">
        <h3>Description</h3>
        {isEditing ? (
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            className="edit-description"
          />
        ) : (
          <p>{task.description || 'Aucune description fournie'}</p>
        )}
      </div>

      <div className="task-dates">
        <h3>Dates</h3>
        <div className="date-grid">
          <div className="date-item">
            <span className="date-label">Échéance :</span>
            {isEditing ? (
              <input
                type="date"
                name="due_date"
                value={editedTask.due_date}
                onChange={handleInputChange}
              />
            ) : (
              <span className="date-value">
                {task.due_date 
                  ? format(parseISO(task.due_date), 'PPP', { locale: fr })
                  : 'Non définie'}
              </span>
            )}
          </div>
          <div className="date-item">
            <span className="date-label">Statut :</span>
            {isEditing ? (
              <select
                name="status"
                value={editedTask.status}
                onChange={handleInputChange}
              >
                <option value="A faire">A faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            ) : (
              <span className="date-value">{task.status}</span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">
              Enregistrer
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              className="cancel-btn"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="edit-btn"
            >
              Modifier
            </button>
            <button 
              onClick={handleDelete} 
              className="delete-btn"
            >
              Supprimer
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="back-btn"
            >
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
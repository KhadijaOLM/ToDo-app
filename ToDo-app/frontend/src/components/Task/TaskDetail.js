import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../../utils/api';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPaperclip, FaCode } from 'react-icons/fa';
import './TaskDetail.css';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'A faire'
  });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Charger la tâche et ses données associées
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const [taskRes, commentsRes, attachmentsRes] = await Promise.all([
          api.get(`/tasks/${taskId}`),
          api.get(`/tasks/${taskId}/comments`),
          api.get(`/tasks/${taskId}/attachments`)
        ]);
        
        setTask(taskRes.data);
        setEditedTask({
          title: taskRes.data.title,
          description: taskRes.data.description,
          dueDate: taskRes.data.dueDate || '',
          status: taskRes.data.status
        });
        setComments(commentsRes.data);
        setAttachments(attachmentsRes.data);
      } catch (err) {
        console.error('Erreur chargement tâche:', err);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/tasks/${taskId}`, editedTask);
      setTask(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur mise à jour:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Supprimer cette tâche ?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        navigate(-1); // Retour à la page précédente
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTask(response.data);
      setEditedTask(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Erreur changement statut:', err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { text: comment });
      setComments([...comments, response.data]);
      setComment('');
    } catch (err) {
      console.error('Erreur ajout commentaire:', err);
    }
  };

  const handleAddAttachment = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAttachments([...attachments, response.data]);
    } catch (err) {
      console.error('Erreur ajout fichier:', err);
    }
  };

  const handleAddCodeSnippet = async () => {
    if (!codeSnippet.trim()) return;

    try {
      const response = await api.post(`/tasks/${taskId}/code`, { code: codeSnippet });
      // Supposons que l'API retourne la tâche mise à jour avec le code
      setTask(response.data);
      setCodeSnippet('');
    } catch (err) {
      console.error('Erreur ajout code:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!task) {
    return <div className="error">Tâche non trouvée</div>;
  }

  return (
    <div className="task-detail-container">
      <div className="task-header">
        {isEditing ? (
          <input
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
            className="edit-title"
          />
        ) : (
          <h1>{task.title}</h1>
        )}
        <div className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
          {task.status}
        </div>
      </div>

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">Créé le :</span>
          <span className="meta-value">
            {format(new Date(task.createdAt), 'PPP', { locale: fr })}
          </span>
        </div>
        {task.dueDate && (
          <div className="meta-item">
            <span className="meta-label">Échéance :</span>
            <span className="meta-value">
              {format(new Date(task.dueDate), 'PPP', { locale: fr })}
            </span>
          </div>
        )}
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
          <p>{task.description || 'Aucune description'}</p>
        )}
      </div>

      <div className="task-section">
        <h3>Statut</h3>
        <div className="status-actions">
          <button
            onClick={() => handleStatusChange('A faire')}
            className={task.status === 'A faire' ? 'active' : ''}
          >
            À faire
          </button>
          <button
            onClick={() => handleStatusChange('En cours')}
            className={task.status === 'En cours' ? 'active' : ''}
          >
            En cours
          </button>
          <button
            onClick={() => handleStatusChange('Terminé')}
            className={task.status === 'Terminé' ? 'active' : ''}
          >
            Terminé
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="task-section">
          <h3>Date d'échéance</h3>
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleInputChange}
          />
        </div>
      )}

      <div className="task-section">
        <h3>Commentaires ({comments.length})</h3>
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <p>{comment.text}</p>
              <small>
                {format(new Date(comment.createdAt), 'PPPp', { locale: fr })}
              </small>
            </div>
          ))}
        </div>
        <div className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
          />
          <button onClick={handleAddComment}>Ajouter</button>
        </div>
      </div>

      <div className="task-section">
        <h3>Fichiers joints ({attachments.length})</h3>
        <div className="attachment-list">
          {attachments.map(file => (
            <div key={file._id} className="attachment">
              <FaPaperclip />
              <a href={`${api.defaults.baseURL}/uploads/${file.path}`} target="_blank" rel="noopener noreferrer">
                {file.originalName}
              </a>
            </div>
          ))}
        </div>
        <label className="file-upload">
          <input type="file" onChange={handleAddAttachment} />
          <FaPaperclip /> Ajouter un fichier
        </label>
      </div>

      <div className="task-section">
        <h3>Extrait de code</h3>
        {task.codeSnippet ? (
          <pre className="code-snippet">
            <code>{task.codeSnippet}</code>
          </pre>
        ) : (
          <div className="code-form">
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Coller votre code ici..."
            />
            <button onClick={handleAddCodeSnippet}>
              <FaCode /> Enregistrer le code
            </button>
          </div>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">
              <FaSave /> Enregistrer
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              <FaTimes /> Annuler
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <FaEdit /> Modifier
            </button>
            <button onClick={handleDelete} className="delete-btn">
              <FaTrash /> Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
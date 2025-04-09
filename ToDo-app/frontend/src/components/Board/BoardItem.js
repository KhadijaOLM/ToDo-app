import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import TaskList from '../Task/TaskList';
import TaskForm from '../Task/TaskForm';
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes, FaArrowRight } from 'react-icons/fa';
import './BoardItem.css';

const BoardItem = ({ board, onEdit, onDelete, linkTo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: board.title || '',
    description: board.description || ''
  });

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const boardId = board._id || board.id;

  useEffect(() => {
    // Mettre à jour les données d'édition si le board change
    setEditData({
      title: board.title || '',
      description: board.description || ''
    });
  }, [board]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!boardId) return;
      
      setLoadingTasks(true);
      try {
        // Use the correct endpoint for getting tasks by board ID
        const response = await api.get(`/tasks/board/${boardId}`);
        setTasks(response.data || []);
      } catch (err) {
        console.error('Erreur chargement tâches:', err);
        // As a fallback, try getting all tasks and filter by boardId on the client side
        try {
          const response = await api.get('/tasks');
          if (response.data && Array.isArray(response.data)) {
            // Filter tasks by boardId manually
            const filteredTasks = response.data.filter(task => task.boardId === boardId);
            setTasks(filteredTasks);
          }
        } catch (fallbackErr) {
          console.error('Erreur fallback chargement tâches:', fallbackErr);
          setTasks([]);
        }
      } finally {
        setLoadingTasks(false);
      }
    };
    
    fetchTasks();
  }, [boardId]);

  const handleAddTask = async (newTask) => {
    try {
      const response = await api.post('/tasks', {
        ...newTask, 
        status: 'A faire', 
        boardId,
        createdAt: new Date()
      });
      
      setTasks([...tasks, response.data]);
      setShowTaskForm(false);
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      alert(`Échec de la création : ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSave = () => {
    if (onEdit && typeof onEdit === 'function') {
      onEdit({
        title: editData.title,
        description: editData.description
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete();
    }
  };

  const handleTaskClick = (taskId) => {
    // Utilisez un Link pour naviguer vers la tâche plutôt que window.location
    // pour garder l'état de l'application React
  }

  return (
    <div className="board-item">
      {isEditing ? (
        <div className="edit-mode">
          <input
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            placeholder="Titre du tableau"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            placeholder="Description"
          />
          <div className="board-actions">
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
          <div className="board-header">
            <h3>{board.title || 'Sans titre'}</h3>
            <p>{board.description || 'Aucune description'}</p>
          </div>

          {linkTo ? (
            <Link to={linkTo} className="board-link">
              Ouvrir le tableau <FaArrowRight />
            </Link>
          ) : (
            <>
              <button 
                onClick={() => setShowTaskForm(!showTaskForm)} 
                className="add-task-btn"
              >
                <FaPlus /> {showTaskForm ? 'Annuler' : 'Ajouter une tâche'}
              </button>

              {showTaskForm && (
                <TaskForm 
                  onSubmit={handleAddTask}
                  onCancel={() => setShowTaskForm(false)}
                />
              )}

              {loadingTasks ? (
                <p className="loading-tasks">Chargement des tâches...</p>
              ) : (
                tasks && tasks.length > 0 ? (
                  // Make sure tasks is an array before passing to TaskList
                  <TaskList 
                    tasks={Array.isArray(tasks) ? tasks : []}
                    onTaskClick={handleTaskClick} 
                  />
                ) : (
                  <p className="no-tasks">Aucune tâche dans ce tableau</p>
                )
              )}
            </>
          )}

          <div className="board-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Modifier
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <FaTrash /> Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardItem;

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import axios from 'axios';
import TaskList from '../Task/TaskList';
import TaskForm from '../Task/TaskForm';
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import './BoardItem.css';

const BoardItem = ({ board, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: board.title,
    description: board.description
  });

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const response = await api.get(`/tasks`, { 
          params: { boardId: board._id }, 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Erreur chargement tâches:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
      } finally {
        setLoadingTasks(false);
      }
    };
        fetchTasks();
      }, [board._id]);

      const handleAddTask = async (newTask) => {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/tasks', 
            {
              ...newTask, 
              status: 'A faire', 
              boardId: board._id,
              createdAt: new Date()
            },
            {
              headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json' 
              }
            }
          );
      
          setTasks([...tasks, response.data]);
          setShowTaskForm(false);
        } catch (err) {
          console.error('Erreur détaillée:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data 
          });
          alert(`Échec de la création : ${err.response?.data?.message || err.message}`);
        }
      };

      const handleSave = () => {
        console.log('Current board:', board);
        onEdit(board._id, {
          title: editData.title,
          description: editData.description
        });
        setIsEditing(false);
      };

  const handleTaskClick = (taskId) => {
    window.location.href = `/tasks/${taskId}`;
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
            <h3>{board.title}</h3>
            <p>{board.description}</p>
          </div>

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
            <p>Chargement des tâches...</p>
          ) : (
            <TaskList tasks={tasks}
            onTaskClick={handleTaskClick} />
          )}

          <div className="board-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Modifier
            </button>
            <button className="delete-btn" onClick={() => onDelete(board._id)}>
              <FaTrash /> Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardItem;
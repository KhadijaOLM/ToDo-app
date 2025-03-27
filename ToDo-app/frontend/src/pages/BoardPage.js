import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import BoardForm from '../components/Board/BoardForm';
import BoardItem from '../components/Board/BoardItem';
//import TaskForm from '../components/Task/TaskForm';
import KanbanView from '../components/KanbanBoard/KanbanView';
import api from '../utils/api';
import './BoardPage.css';

const BoardPage = () => {
  const [boards, setBoards] = useState([]);
  const [editingBoard, setEditingBoard] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les tableaux
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/boards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },}
        
        );
        console.log(response.data);
        setBoards(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, []);

  // Charger les tâches quand un tableau est sélectionné
  useEffect(() => {
    if (selectedBoard) {
      const fetchTasks = async () => {
        try {
          const response = await api.get(`/boards/${selectedBoard._id}/tasks`);
          setTasks(response.data);
        } catch (err) {
          console.error('Erreur:', err);
          setIsLoading(false);
        }
      };
      fetchTasks();
    }
  }, [selectedBoard]);

  // Créer un tableau
  const handleAddBoard = async (title) => {
    console.log("Titre reçu:", title);
    if (!title.trim()) return; // Bloquer les titres vides
    try {
      const response = await api.post('/boards', { title });
      console.log("Réponse API:", response.data);
      setBoards(prevBoards => [...prevBoards, response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // Modifier un tableau
  const handleUpdateBoard = async (id, newTitle) => {
    try {
      const response = await api.put(`/boards/${id}`, { title: newTitle });
      setBoards(boards.map(board => 
        board._id === id ? response.data : board
      ));
      setEditingBoard(null);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // Supprimer un tableau
  const handleDeleteBoard = async (id) => {
    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter(board => board._id !== id));
      if (selectedBoard && selectedBoard._id === id) {
        setSelectedBoard(null);
        setTasks([]);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // Handle new task creation
  const handleAddTask = async (status) => {
    if (!selectedBoard) return;

    const newTask = {
      title: 'Nouvelle tâche',
      description: '',
      status,
      boardId: selectedBoard._id,
      due_date: new Date()
    };

    try {
      const response = await api.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Handle task updates
  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await api.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks(tasks.map(t => 
        t._id === updatedTask._id ? response.data : t
      ));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  }; 

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Drag and Drop
  const onDragEnd = async (result) => {
    if (!result.destination || !selectedBoard) return;

    const { source, destination, draggableId } = result;
    
    // Trouver la tâche déplacée
    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    // Mettre à jour le statut
    const newStatus = destination.droppableId;

    try {
      // Mise à jour dans l'API
      const response = await api.put(`/tasks/${draggableId}`, {
        ...task,
        status: newStatus
      });
      
      // Mise à jour locale
      setTasks(tasks.map(t => 
        t._id === draggableId ? response.data : t
      ));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  if (isLoading) return <div className="loading">Chargement...</div>;

  return (
    <div className="boards-page">
      <h1>Mes Tableaux</h1>

      <BoardForm
  onAddBoard={editingBoard ? 
    (title) => handleUpdateBoard(editingBoard._id, title) : 
    handleAddBoard
  }
  initialValue={editingBoard?.title || ""} 
/>
      
      {editingBoard && (
        <button 
          onClick={() => setEditingBoard(null)}
          className="cancel-btn"
        >
          Annuler
        </button>
      )}

      <div className="boards-container">
        {boards.map((board) => (
          <BoardItem
          key={board._id}
          board={board}
          onDelete={handleDeleteBoard}
          onEdit={() => setEditingBoard(board)}
          />
        ))}
      </div>

      {selectedBoard && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-container">
            <h2>{selectedBoard.title}</h2>
            <button onClick={() => handleAddTask('A faire')}>
              Ajouter une tâche
            </button>
            
            <KanbanView
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
            />
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default BoardPage;
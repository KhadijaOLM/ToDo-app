import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import api from '../utils/api';
import BoardForm from '../components/Board/BoardForm';
import BoardItem from '../components/Board/BoardItem';
import KanbanView from '../components/KanbanBoard/KanbanView';
import TaskForm from '../components/Task/TaskForm';
import TaskEditModal from '../components/Task/TaskEditModal'; // Import the TaskEditModal
import ListForm from '../components/List/ListForm';
import ListItem from '../components/List/ListItem';
import { FaPlus, FaTimes } from 'react-icons/fa';
import './BoardPage.css';

const BoardPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // State variables for board details view
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('A faire');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'lists'
  
  // Add state for task editing
  const [editingTask, setEditingTask] = useState(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  // Checking for invalid board ID - set a state flag instead of early return
  useEffect(() => {
    if (location.pathname.includes('/boards/') && (!id || id === 'undefined')) {
      console.log("Invalid board ID detected, will redirect to workspaces");
      setShouldRedirect(true);
    }
  }, [location.pathname, id]);

  // Récupérer l'ID de l'espace de travail à partir des query params si disponible
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const workspace = params.get('workspace');
    if (workspace) {
      setWorkspaceId(workspace);
    }
  }, [location.search]);

  // Chargement des tableaux en fonction du contexte (tableau spécifique ou tous les tableaux)
  useEffect(() => {
    // Skip fetching if we're going to redirect anyway
    if (shouldRedirect) {
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (id && id !== 'undefined') {
          // Si nous avons un ID de tableau valide, récupérer ce tableau spécifique
          console.log(`Fetching specific board with ID: ${id}`);
          const response = await api.get(`/boards/${id}`);
          // Dans ce cas, nous avons un seul tableau
          setBoards([response.data]);
          
          // If it's a single board view, also get its workspace ID for navigation
          if (response.data && response.data.workspaceId) {
            setWorkspaceId(response.data.workspaceId);
          }
        } else if (workspaceId) {
          // Si nous avons un ID d'espace de travail, récupérer les tableaux de cet espace
          console.log(`Fetching boards for workspace: ${workspaceId}`);
          const response = await api.get(`/boards?workspaceId=${workspaceId}`);
          setBoards(response.data || []);
        } else {
          // Rediriger vers la page des espaces de travail
          // car maintenant tous les tableaux doivent être associés à un espace de travail
          console.log("No board ID or workspace ID, redirecting to workspaces");
          navigate('/workspaces');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des tableaux:', err);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Erreur lors du chargement des tableaux');
          setLoading(false);
        }
      }
    };

    // Only run fetchData if we have valid parameters
    if ((id && id !== 'undefined') || workspaceId) {
      fetchData();
    } else {
      // If no valid parameters, set loading to false and don't make API calls
      setLoading(false);
    }
  }, [id, workspaceId, navigate, shouldRedirect]);

  // Fetch tasks for a specific board
  useEffect(() => {
    const fetchTasks = async () => {
      if (!id || id === 'undefined') return;
      
      setLoadingTasks(true);
      try {
        // Use the correct endpoint for getting tasks by board ID
        console.log(`Fetching tasks for board ID: ${id}`);
        const response = await api.get(`/tasks/board/${id}`);
        setTasks(response.data || []);
      } catch (err) {
        console.error('Erreur chargement tâches:', err);
        // As a fallback, try getting all tasks and filter by boardId on the client side
        try {
          const response = await api.get('/tasks');
          if (response.data && Array.isArray(response.data)) {
            const filteredTasks = response.data.filter(task => task.boardId === id);
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
    
    if (id) {
      fetchTasks();
    }
  }, [id]);

  // Fetch lists for a specific board
  useEffect(() => {
    const fetchLists = async () => {
      if (!id || id === 'undefined') return;
      
      setLoadingLists(true);
      try {
        console.log(`Fetching lists for board ID: ${id}`);
        const response = await api.get(`/lists/${id}`);
        setLists(response.data || []);
      } catch (err) {
        console.error('Erreur chargement listes:', err);
        setLists([]);
      } finally {
        setLoadingLists(false);
      }
    };
    
    if (id) {
      fetchLists();
    }
  }, [id]);

  // Handle redirection if necessary
  if (shouldRedirect) {
    return <Navigate to="/workspaces" replace />;
  }

  // Création d'un nouveau tableau
  const handleCreateBoard = async (boardData) => {
    try {
      // Ajouter l'ID de l'espace de travail
      const dataWithWorkspace = {
        ...boardData,
        workspaceId: workspaceId
      };
      
      const response = await api.post('/boards', dataWithWorkspace);
      setBoards(prevBoards => [...prevBoards, response.data]);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Erreur lors de la création du tableau:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création du tableau');
    }
  };

  // Suppression d'un tableau
  const handleDelete = async (boardId) => {
    if (!boardId || !window.confirm('Confirmer la suppression ?')) return;
  
    try {
      await api.delete(`/boards/${boardId}`);
      setBoards(prev => prev.filter(board => board._id !== boardId && board.id !== boardId));
      
      // Si on a supprimé le tableau détaillé, revenir à la liste
      if (id === boardId) {
        navigate(`/workspaces/${workspaceId}`);
      }
    } catch (err) {
      console.error('Détails erreur suppression:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = async (boardId, newData) => {
    try {
      const response = await api.put(`/boards/${boardId}`, newData);
      
      setBoards(prev => prev.map(board => 
        (board._id === boardId || board.id === boardId) ? response.data : board
      ));
    } catch (err) {
      console.error('Erreur modification:', err);
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  // List CRUD operations
  const handleCreateList = async (listData) => {
    try {
      if (!id) return;
      
      const response = await api.post('/lists', {
        ...listData,
        boardId: id,
        position: lists.length // Add to the end by default
      });
      
      setLists([...lists, response.data]);
      setShowListForm(false);
    } catch (err) {
      console.error('Erreur lors de la création de la liste:', err);
      alert(`Échec de la création : ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleEditList = async (listId, updatedListData) => {
    try {
      const response = await api.put(`/lists/${listId}`, updatedListData);
      setLists(prev => prev.map(list => list._id === listId ? response.data : list));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la liste:', err);
      alert(`Échec de la mise à jour : ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleDeleteList = async (listId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette liste et toutes ses tâches ?')) return;
    
    try {
      await api.delete(`/lists/${listId}`);
      setLists(prev => prev.filter(list => list._id !== listId));
      
      // Also remove tasks associated with this list
      setTasks(prev => prev.filter(task => task.listId !== listId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la liste:', err);
      alert(`Échec de la suppression : ${err.response?.data?.message || err.message}`);
    }
  };

  // Task CRUD operations with list support
  const handleAddTask = async (status = 'A faire', listId = null) => {
    setNewTaskStatus(status);
    setShowTaskForm(true);
  };
  
  const handleSubmitTask = async (taskData) => {
    try {
      if (!id) return;
      
      const taskPayload = {
        ...taskData,
        status: newTaskStatus,
        boardId: id,
        createdAt: new Date()
      };
      
      const response = await api.post('/tasks', taskPayload);
      setTasks([...tasks, response.data]);
      setShowTaskForm(false);
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      alert(`Échec de la création : ${err.response?.data?.message || err.message}`);
    }
  };
  
  // Add listId to the task when creating from a list
  const handleAddTaskToList = async (taskData) => {
    try {
      if (!id) return;
      
      const response = await api.post('/tasks', {
        ...taskData,
        boardId: id,
        createdAt: new Date()
      });
      
      setTasks([...tasks, response.data]);
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      alert(`Échec de la création : ${err.response?.data?.message || err.message}`);
    }
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await api.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks(prev => prev.map(task => task._id === updatedTask._id ? response.data : task));
      // Close the edit modal after successful update
      setShowEditTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la tâche:', err);
      alert(`Échec de la mise à jour : ${err.response?.data?.message || err.message}`);
    }
  };
  
  // Modify this function to handle opening the edit modal
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      alert(`Échec de la suppression : ${err.response?.data?.message || err.message}`);
    }
  };

  const handleBackToWorkspace = () => {
    if (workspaceId) {
      navigate(`/workspaces/${workspaceId}`);
    } else {
      navigate('/workspaces');
    }
  };

  // Toggle view between Kanban and Lists
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'kanban' ? 'lists' : 'kanban');
  };

  if (loading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={handleBackToWorkspace} className="btn-back">
          Retour aux espaces de travail
        </button>
      </div>
    );
  }

  // If no valid data was fetched and we're not loading, redirect to workspaces
  if (!loading && (!boards || boards.length === 0)) {
    return (
      <div className="error-container">
        <p className="error-message">Aucun tableau trouvé</p>
        <button onClick={handleBackToWorkspace} className="btn-back">
          Retour aux espaces de travail
        </button>
      </div>
    );
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <div className="title-section">
          <h1>{id ? boards[0]?.title : 'Tableaux'}</h1>
          <button onClick={handleBackToWorkspace} className="btn-back">
            Retour à l'espace de travail
          </button>
        </div>
        
        {!id && (
          <div className="actions-section">
            <button 
              className="btn-add-board" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Annuler' : 'Créer un tableau'}
            </button>
          </div>
        )}
      </div>
      
      {showCreateForm && !id && (
        <BoardForm 
          onSubmit={handleCreateBoard} 
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      {id ? (
        // Affichage détaillé d'un seul tableau avec ses tâches
        <div className="board-detail">
          {boards[0] && (
            <>
              <p className="board-description">{boards[0].description}</p>
              
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} 
                  onClick={() => setViewMode('kanban')}
                >
                  Vue Kanban
                </button>
                <button 
                  className={`view-btn ${viewMode === 'lists' ? 'active' : ''}`} 
                  onClick={() => setViewMode('lists')}
                >
                  Vue Listes
                </button>
              </div>

              {/* Task edit modal */}
              {showEditTaskModal && (
                <TaskEditModal
                  task={editingTask}
                  onSave={handleTaskUpdate}
                  onCancel={() => {
                    setShowEditTaskModal(false);
                    setEditingTask(null);
                  }}
                />
              )}

              {viewMode === 'kanban' ? (
                // Kanban View
                <div className="board-tasks">
                  <div className="tasks-header">
                    <h2>Tâches</h2>
                    <button 
                      className="btn-add-task" 
                      onClick={() => handleAddTask()}
                    >
                      <FaPlus /> Ajouter une tâche
                    </button>
                  </div>
                  
                  {showTaskForm && (
                    <div className="task-form-container">
                      <h3>Nouvelle tâche ({newTaskStatus})</h3>
                      <TaskForm 
                        onSubmit={handleSubmitTask}
                        onCancel={() => setShowTaskForm(false)}
                      />
                      <button 
                        className="btn-cancel-task" 
                        onClick={() => setShowTaskForm(false)}
                      >
                        <FaTimes /> Annuler
                      </button>
                    </div>
                  )}
                  
                  {loadingTasks ? (
                    <div className="loading">Chargement des tâches...</div>
                  ) : tasks.length === 0 ? (
                    <p className="no-tasks">Aucune tâche dans ce tableau</p>
                  ) : (
                    <KanbanView 
                      tasks={tasks}
                      onTaskUpdate={handleTaskUpdate}
                      onDeleteTask={handleDeleteTask}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                    />
                  )}
                </div>
              ) : (
                // Lists View
                <div className="board-lists">
                  <div className="lists-header">
                    <h2>Listes</h2>
                    <button 
                      className="btn-add-list" 
                      onClick={() => setShowListForm(!showListForm)}
                    >
                      <FaPlus /> Ajouter une liste
                    </button>
                  </div>
                  
                  {showListForm && (
                    <div className="list-form-container">
                      <h3>Nouvelle liste</h3>
                      <ListForm 
                        onSubmit={handleCreateList}
                        onCancel={() => setShowListForm(false)}
                      />
                      <button 
                        className="btn-cancel-list" 
                        onClick={() => setShowListForm(false)}
                      >
                        <FaTimes /> Annuler
                      </button>
                    </div>
                  )}
                  
                  {loadingLists ? (
                    <div className="loading">Chargement des listes...</div>
                  ) : lists.length === 0 ? (
                    <p className="no-lists">Aucune liste dans ce tableau. Créez des listes pour organiser vos tâches.</p>
                  ) : (
                    <div className="lists-container">
                      {lists.map(list => (
                        <ListItem
                          key={list._id}
                          list={list}
                          tasks={tasks.filter(task => task.listId === list._id)}
                          onEditList={handleEditList}
                          onDeleteList={handleDeleteList}
                          onAddTask={handleAddTaskToList}
                          onEditTask={handleTaskUpdate}
                          onDeleteTask={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Affichage de la liste des tableaux
        <>
          {boards.length === 0 ? (
            <p className="no-boards">Aucun tableau disponible dans cet espace de travail</p>
          ) : (
            <div className="boards-grid">
              {boards.map(board => (
                <BoardItem
                  key={board._id || board.id}
                  board={board}
                  onEdit={(newData) => handleEdit(board._id || board.id, newData)}
                  onDelete={() => handleDelete(board._id || board.id)}
                  linkTo={`/boards/${board._id || board.id}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoardPage;
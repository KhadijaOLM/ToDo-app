import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import BoardForm from '../../components/Board/BoardForm';
import BoardItem from '../../components/Board/BoardItem';
import WorkspaceForm from '../../components/Workspace/WorkspaceForm';
import './WorkspacePage.css';

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBoardForm, setShowBoardForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const response = await api.get(`/workspaces/${workspaceId}`);
        setWorkspace(response.data);
        setBoards(response.data.boards || []);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'espace de travail:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement');
        setLoading(false);
        
        // Rediriger vers la liste des espaces de travail en cas d'erreur 404
        if (err.response?.status === 404) {
          navigate('/workspaces');
        }
      }
    };

    if (workspaceId) {
      fetchWorkspaceData();
    }
  }, [workspaceId, navigate]);

  const handleCreateBoard = async (boardData) => {
    try {
      // Ajouter l'ID de l'espace de travail à la demande de création de tableau
      const dataWithWorkspaceId = {
        ...boardData,
        workspaceId
      };
      
      const response = await api.post('/boards', dataWithWorkspaceId);
      setBoards(prevBoards => [...prevBoards, response.data]);
      setShowBoardForm(false);
    } catch (err) {
      console.error('Erreur lors de la création du tableau:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création du tableau');
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce tableau ?')) return;
    
    try {
      await api.delete(`/boards/${boardId}`);
      setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    } catch (err) {
      console.error('Erreur lors de la suppression du tableau:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleUpdateWorkspace = async (updatedData) => {
    try {
      const response = await api.put(`/workspaces/${workspaceId}`, updatedData);
      setWorkspace(response.data);
      setShowEditForm(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'espace de travail:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet espace de travail ? Tous les tableaux et tâches associés seront également supprimés.')) return;
    
    try {
      await api.delete(`/workspaces/${workspaceId}`);
      navigate('/workspaces');
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'espace de travail:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const startEditWorkspace = () => {
    setEditingWorkspace({
      name: workspace.name,
      description: workspace.description
    });
    setShowEditForm(true);
  };

  if (loading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/workspaces" className="back-link">Retour aux espaces de travail</Link>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="not-found">
        <h2>Espace de travail non trouvé</h2>
        <Link to="/workspaces" className="back-link">Retour aux espaces de travail</Link>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <div className="workspace-title-section">
          <h1>{workspace.name}</h1>
          {workspace.description && <p className="workspace-description">{workspace.description}</p>}
        </div>
        
        <div className="workspace-actions">
          <button className="btn-edit" onClick={startEditWorkspace}>Modifier</button>
          <button className="btn-delete" onClick={handleDeleteWorkspace}>Supprimer</button>
          <Link to="/workspaces" className="btn-back">Retour</Link>
        </div>
      </div>

      {showEditForm && (
        <div className="edit-workspace-section">
          <h2>Modifier l'espace de travail</h2>
          <WorkspaceForm 
            workspace={editingWorkspace} 
            onSubmit={handleUpdateWorkspace}
            onCancel={() => setShowEditForm(false)} 
          />
        </div>
      )}

      <div className="boards-section">
        <div className="boards-header">
          <h2>Tableaux</h2>
          <button 
            className="btn-add-board" 
            onClick={() => setShowBoardForm(!showBoardForm)}
          >
            {showBoardForm ? 'Annuler' : 'Créer un tableau'}
          </button>
        </div>

        {showBoardForm && (
          <BoardForm 
            onSubmit={handleCreateBoard}
            onCancel={() => setShowBoardForm(false)}
          />
        )}

        {boards.length === 0 ? (
          <p className="no-boards">Cet espace de travail ne contient pas encore de tableaux</p>
        ) : (
          <div className="boards-grid">
            {boards.map(board => (
              <BoardItem
                key={board._id || board.id}
                board={board}
                onDelete={() => handleDeleteBoard(board._id || board.id)}
                linkTo={`/boards/${board._id || board.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
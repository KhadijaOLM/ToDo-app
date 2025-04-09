import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './WorkspaceList.css';
import WorkspaceForm from './WorkspaceForm';

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get('/workspaces');
        setWorkspaces(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des espaces de travail:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des espaces de travail');
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (workspaceData) => {
    try {
      console.log('Token dans localStorage:', localStorage.getItem('token'));
      console.log('Données à envoyer:', workspaceData);
      
      const response = await api.post('/workspaces', workspaceData);
      setWorkspaces([...workspaces, response.data]);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Erreur lors de la création de l\'espace de travail:', err);
      console.error('Détails de l\'erreur:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        error: err.response?.data?.error
      });
      setError(err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la création de l\'espace de travail');
    }
  };

  if (loading) {
    return <div className="workspace-list loading">Chargement des espaces de travail...</div>;
  }

  if (error) {
    return <div className="workspace-list error">{error}</div>;
  }

  return (
    <div className="workspace-list">
      <div className="workspace-header">
        <h2>Mes Espaces de Travail</h2>
        <button 
          className="btn-add-workspace" 
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Annuler' : 'Créer un espace de travail'}
        </button>
      </div>

      {showCreateForm && (
        <WorkspaceForm onSubmit={handleCreateWorkspace} onCancel={() => setShowCreateForm(false)} />
      )}

      {workspaces.length === 0 ? (
        <p className="no-workspaces">Vous n'avez pas encore d'espaces de travail</p>
      ) : (
        <div className="workspace-grid">
          {workspaces.map(workspace => {
            // Log workspace to debug ID structure
            console.log('Workspace object:', workspace);
            
            // Use _id if available, otherwise fallback to id for key uniqueness
            const uniqueKey = workspace._id || workspace.id || `workspace-${Math.random()}`;
            
            return (
              <div className="workspace-card" key={uniqueKey}>
                <h3>{workspace.name}</h3>
                <p>{workspace.description || 'Aucune description'}</p>
                <Link to={`/workspaces/${workspace._id}`} className="workspace-link">
                  Ouvrir
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
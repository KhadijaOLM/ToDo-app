import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import BoardForm from '../components/Board/BoardForm';
import BoardItem from '../components/Board/BoardItem';

const BoardPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);

  // Chargement initial des tableaux
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get('/boards');
        setBoards(response.data);
      } catch (err) {
        console.error('Fetch boards error:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des tableaux');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoards();
  }, []);

  // Création d'un nouveau tableau
  const handleCreateBoard = async ({ title, description }) => {
    try {
      const response = await api.post('/boards', { 
        title: title.trim(),
        description: description?.trim() || '' 
      });
      
      setBoards(prevBoards => [...prevBoards, response.data]);
      setError(null);
    } catch (err) {
      console.error('Create board error:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création du tableau');
    }
  };

  // Suppression d'un tableau
  const handleDelete = async (id) => {
    if (!id || !window.confirm('Confirmer la suppression ?')) return;
  
    try {
      await api.delete(`/boards/${id}`);
      setBoards(prev => prev.filter(board => board._id !== id));
      setError(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = async (boardId, newData) => {
    try {
      const response = await api.put(`/boards/${boardId}`, newData);
      
      setBoards(prev => prev.map(board => 
        board._id === boardId ? response.data : board
      ));
      setError(null);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => setError(null)}>Fermer</button>
      </div>
    );
  }

  return (
    <div className="board-page">
      <h1>Mon espace de travail</h1>
      
      <BoardForm onSubmit={handleCreateBoard} />
      
      {boards.length === 0 ? (
        <p className="no-boards">Aucun tableau disponible</p>
      ) : (
        <div className="boards-grid">
          {boards.map(board => (
            <BoardItem
              key={board._id}
              board={board}
              onEdit={(newData) => handleEdit(board._id, newData)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardPage;
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
      try  {
        const token = localStorage.getItem('token');
        const response = await api.get('/boards', {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
    
        setBoards(response.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des tableaux:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError(err.response?.data?.message || 'Erreur lors du chargement des tableaux');
        }
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
    } catch (err) {
      console.error('Erreur lors de la création du tableau:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || 'Erreur lors de la création du tableau');
    }
  };

  // Suppression d'un tableau
  const handleDelete = async (id) => {
    if (!id || !window.confirm('Confirmer la suppression ?')) return;
  
    try {
      await api.delete(`/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBoards(prev => prev.filter(board => board._id !== id));
    } catch (err) {
      console.error('Détails erreur suppression:', {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = async (id, newData) => {
    try {
      const response = await api.put(`/boards/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setBoards(prev => prev.map(board => 
        board._id === id ? response.data : board
      ));
    } catch (err) {
      console.error('Erreur modification:', err.response?.data);
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  if (loading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="board-page">
      <h1>Mon espace de travaille </h1>
      
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
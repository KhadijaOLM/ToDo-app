import React from 'react';
import { Link } from 'react-router-dom';
import './BoardItem.css';

const BoardItem = ({ board, onDelete, onEdit }) => {
  return (
    <div className="board-item">
      <Link to={`/boards/${board._id}`} className="board-title">
        <h3>{board.title}</h3>
      </Link>
      
      <div className="board-actions">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(board);
          }}
          className="edit-btn"
        >
          Modifier
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(board._id);
          }}
          className="delete-btn"
        >
          Supprimer
        </button>
      </div>

      {/* Liste des tâches */}
      <ul className="task-list">
        {board.tasks?.map(task => (
          <li key={task._id} className="task-item">
            <Link to={`/tasks/${task._id}`}>
              {task.title} - {task.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardItem;
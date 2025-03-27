import React from 'react';
import './BoardItem.css';

const BoardItem = ({ board, onDelete, onEdit }) => {
  return (
    <div className="board-item">
      <h3>{board.title}</h3>
      <div className="board-actions">
        <button onClick={() => onEdit(board)}>Modifier</button>
        <button onClick={() => onDelete(board._id)}>Supprimer</button>
      </div>
    </div>
  );
};

export default BoardItem;
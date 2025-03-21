import React from 'react';
import { Link } from 'react-router-dom';
import './BoardItem.css';

const BoardItem = ({ board }) => {
  return (
    <div className="board-item">
      <Link to={`/boards/${board._id}`}>
        <h3>{board.title}</h3>
      </Link>
    </div>
  );
};

export default BoardItem;
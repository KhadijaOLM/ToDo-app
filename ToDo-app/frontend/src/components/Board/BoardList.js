import React from 'react';
import BoardItem from './BoardItem';
import './BoardList.css';

const BoardList = ({ boards }) => {
  return (
    <div className="board-list">
      {boards.map((board) => (
        <BoardItem key={board._id} board={board} />
      ))}
    </div>
  );
};

export default BoardList;
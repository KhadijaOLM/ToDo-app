import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import './TaskCard.css';

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${task.status.toLowerCase().replace(' ', '-')}`}
        >
          <Link to={`/tasks/${task._id}`} className="task-content">
            <h4>{task.title}</h4>
            {task.description && <p className="task-description">{task.description}</p>}
            <div className="task-meta">
              <span className="due-date">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sans échéance'}
              </span>
            </div>
          </Link>
          <div className="task-actions">
            <button onClick={() => onEdit(task)} className="edit-btn">
              ✏️
            </button>
            <button onClick={() => onDelete(task._id)} className="delete-btn">
              🗑️
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
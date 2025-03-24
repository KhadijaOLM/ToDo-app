import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './StatusColumn.css';

const StatusColumn = ({ status, tasks, onEditTask, onDeleteTask, onAddTask }) => {
  const statusId = status.toLowerCase().replace(' ', '-');

  return (
    <div className="status-column">
      <div className="column-header">
        <h3>{status}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <Droppable droppableId={statusId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="add-task">
        <button onClick={() => onAddTask(status)} className="add-btn">
          + Ajouter une tâche
        </button>
      </div>
    </div>
  );
};

export default StatusColumn;
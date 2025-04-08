import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './TaskList.css';

const TaskList = ({ tasks, onTaskClick }) => {
    return (
      <ul className="task-list">
        {tasks.map(task => (
          <li 
            key={task._id}
            className="task-item"
            onClick={() => onTaskClick(task._id)}
          >
            <h4>{task.title}</h4>
            <p>{task.description || 'Aucune description'}</p>
            <div className="task-meta">
              <span>Créé le {format(new Date(task.createdAt), 'PPP', { locale: fr })}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

export default TaskList;
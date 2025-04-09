import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import StatusColumn from './StatusColumn';
import './KanbanView.css';

const KanbanView = ({ tasks, onTaskUpdate, onDeleteTask, onAddTask, onEditTask }) => {
  const statusConfig = [
    { id: 'todo', title: 'A faire' },
    { id: 'in-progress', title: 'En cours' },
    { id: 'done', title: 'Terminé' }
  ];

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Annuler si drop invalide
    if (!destination || 
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;
    
    const newStatus = statusConfig.find(s => s.id === destination.droppableId)?.title;
    if (!newStatus || task.status === newStatus) return;

    onTaskUpdate({ ...task, status: newStatus });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container">
        {statusConfig.map(({ id, title }) => {
          const columnTasks = tasks.filter(task => task.status === title);
          
          return (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="status-column"
                >
                  <StatusColumn 
                    status={title}
                    tasks={columnTasks}
                    onEditTask={onEditTask} 
                    onDeleteTask={onDeleteTask}
                    onAddTask={() => onAddTask(title)}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import TaskItem from '../Task/TaskItem';
import ListForm from './ListForm';
import TaskForm from '../Task/TaskForm';
import './ListItem.css';

const ListItem = ({ 
  list, 
  tasks, 
  onEditList, 
  onDeleteList, 
  onAddTask,
  onEditTask,
  onDeleteTask 
}) => {
  const [editing, setEditing] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const handleEditList = (updatedListData) => {
    onEditList(list._id, updatedListData);
    setEditing(false);
  };

  const handleAddTask = (taskData) => {
    onAddTask({
      ...taskData,
      listId: list._id,
      status: 'A faire' // Default status
    });
    setShowAddTaskForm(false);
  };

  // Filter tasks that belong to this list
  const listTasks = tasks.filter(task => task.listId === list._id);

  return (
    <div className="list-item">
      {editing ? (
        <ListForm 
          initialData={list} 
          onSubmit={handleEditList} 
          onCancel={() => setEditing(false)} 
        />
      ) : (
        <>
          <div className="list-header">
            <h3 className="list-title">{list.title}</h3>
            <div className="list-actions">
              <button 
                className="btn-icon" 
                onClick={() => setEditing(true)}
                title="Modifier la liste"
              >
                <FaEdit />
              </button>
              <button 
                className="btn-icon btn-delete" 
                onClick={() => onDeleteList(list._id)}
                title="Supprimer la liste"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          
          {/* List tasks */}
          <div className="tasks-container">
            {listTasks.length > 0 ? (
              listTasks.map(task => (
                <TaskItem 
                  key={task._id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            ) : (
              <p className="no-tasks">Aucune tâche dans cette liste</p>
            )}
          </div>
          
          {showAddTaskForm ? (
            <div className="add-task-form">
              <TaskForm 
                onSubmit={handleAddTask}
                onCancel={() => setShowAddTaskForm(false)}
              />
            </div>
          ) : (
            <button 
              className="btn-add-task" 
              onClick={() => setShowAddTaskForm(true)}
            >
              <FaPlus /> Ajouter une tâche
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ListItem;
import React from 'react';
import './TaskForm.css';

const TaskForm = ({ task, handleChange, handleSubmit }) => {
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{task.id ? "Modifier la tâche" : "Ajouter une tâche"}</h2>
      
      <div className="form-group">
        <label>Titre</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Date limite</label>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="date-picker"
        />
      </div>

      <button type="submit" className="submit-btn">
        {task.id ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
};

export default TaskForm;
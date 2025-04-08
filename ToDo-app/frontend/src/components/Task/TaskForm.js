import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import '../Board/BoardItem.css'; 

const TaskForm = ({ onSubmit, onCancel }) => {
  const [task, setTask] = React.useState({
    title: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit triggered");
    if (task.title.trim()) {
      console.log("Submitting task:", task); 
      onSubmit(task);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="simple-task-form">
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Titre de la tâche"
        required
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <div className="simple-form-actions">
        <button type="submit" className="save-btn">
          <FaSave /> Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          <FaTimes /> Annuler
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
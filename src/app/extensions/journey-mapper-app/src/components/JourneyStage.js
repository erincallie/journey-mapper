import React, { useState } from 'react';
import './JourneyStage.css';

const JourneyStage = ({ stage, onUpdate, onDelete }) => {
  const [name, setName] = useState(stage.name);
  const [description, setDescription] = useState(stage.description);
  const [actions, setActions] = useState(stage.actions || []);
  const [newAction, setNewAction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...stage,
      name,
      description,
      actions
    });
  };

  const addAction = () => {
    if (newAction.trim()) {
      setActions([...actions, newAction]);
      setNewAction('');
    }
  };

  const removeAction = (index) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  return (
    <div className="journey-stage-editor">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="stage-name">Stage Name</label>
          <input
            id="stage-name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stage-description">Description</label>
          <textarea
            id="stage-description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Actions</label>
          <div className="action-input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add an action"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
            />
            <button 
              type="button" 
              className="btn btn-small"
              onClick={addAction}
            >
              Add
            </button>
          </div>

          <ul className="action-list">
            {actions.map((action, index) => (
              <li key={index} className="action-item">
                <span>{action}</span>
                <button 
                  type="button" 
                  className="btn-remove"
                  onClick={() => removeAction(index)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="actions">
          <button type="submit" className="btn">Save Changes</button>
          <button type="button" className="btn btn-danger" onClick={onDelete}>Delete Stage</button>
        </div>
      </form>
    </div>
  );
};

export default JourneyStage;

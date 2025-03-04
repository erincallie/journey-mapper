import React from 'react';
import './JourneyMap.css';

const JourneyMap = ({ stages, onStageClick }) => {
  return (
    <div className="journey-map">
      <div className="journey-map-stages">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="journey-map-stage"
            onClick={() => onStageClick(stage)}
          >
            <div className="journey-map-stage-number">{stage.id}</div>
            <div className="journey-map-stage-content">
              <h3>{stage.name}</h3>
              <p>{stage.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyMap;

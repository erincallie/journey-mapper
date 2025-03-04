import React, { useState, useEffect } from 'react';
import './BowtieModel.css';

const BowtieModel = ({ onStageSelect, lifecycleStageMapping, selectedContact }) => {
  const [activeTraps, setActiveTraps] = useState(['trap2', 'trap3']);
  
  // Map lifecycle stages to trap IDs based on the mapping
  const [stageConnectors, setStageConnectors] = useState({});
  
  // Highlight the contact's lifecycle stage if present
  const [highlightedTrap, setHighlightedTrap] = useState(null);

  // Update stage connectors when lifecycle mapping changes
  useEffect(() => {
    if (lifecycleStageMapping) {
      // Group HubSpot stages by their mapped Bowtie stages
      const connectorsByTrap = Object.entries(lifecycleStageMapping)
        .reduce((acc, [hsStage, trapId]) => {
          if (!acc[trapId]) {
            acc[trapId] = [];
          }
          acc[trapId].push(hsStage);
          return acc;
        }, {});
      
      setStageConnectors(connectorsByTrap);
    }
  }, [lifecycleStageMapping]);

  // Highlight the contact's current stage
  useEffect(() => {
    if (selectedContact && selectedContact.properties && selectedContact.properties.lifecyclestage && lifecycleStageMapping) {
      const contactStage = selectedContact.properties.lifecyclestage;
      const mappedTrapId = lifecycleStageMapping[contactStage];
      
      if (mappedTrapId) {
        setHighlightedTrap(mappedTrapId);
      } else {
        setHighlightedTrap(null);
      }
    } else {
      setHighlightedTrap(null);
    }
  }, [selectedContact, lifecycleStageMapping]);

  const toggleActive = (trapId) => {
    if (activeTraps.includes(trapId)) {
      setActiveTraps(activeTraps.filter(id => id !== trapId));
    } else {
      setActiveTraps([...activeTraps, trapId]);
    }
    
    // Call the parent component's handler with the selected stage
    if (onStageSelect) {
      onStageSelect(trapId);
    }
  };

  return (
    <div className="bowtie-container">
      <div className="bowtie">
        <div className="shapes flex middle">
          <div 
            id="trap1" 
            className={`trap ${activeTraps.includes('trap1') ? 'active' : ''}`} 
            style={{ transform: 'translate(0px, -50px)', '--clr-primary': activeTraps.includes('trap1') ? 'rgba(49,154,251,1)' : '#555970' }}
            onClick={() => toggleActive('trap1')}
          >
            <div className="connector" style={{ left: '2px', top: '98%' }}>
              <div className="line" style={{ height: '65px', transform: activeTraps.includes('trap1') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap1') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ left: '6px' }}>
                  Identified
                </div>
              </div>
            </div>

            <div className="shape-label">Attract</div>
            <svg className="front" preserveAspectRatio="none" viewBox="-2 -2 198 370" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M186.108 49.5671L11.1082 1.7613C6.01829 0.370874 1 4.20217 1 9.47854V354.642C1 359.882 5.9524 363.707 11.0216 362.383L186.022 316.677C189.543 315.757 192 312.576 192 308.937V57.2843C192 53.6779 189.587 50.5174 186.108 49.5671Z" fill="var(--clr-primary)" fillOpacity="0.2" stroke="var(--clr-primary)" strokeWidth="2"></path>
            </svg>
            <svg className="back" preserveAspectRatio="none" viewBox="-2 -2 198 370" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M186.108 49.5671L11.1082 1.7613C6.01829 0.370874 1 4.20217 1 9.47854V354.642C1 359.882 5.9524 363.707 11.0216 362.383L186.022 316.677C189.543 315.757 192 312.576 192 308.937V57.2843C192 53.6779 189.587 50.5174 186.108 49.5671Z" fill="var(--clr-bg)" fillOpacity="1"></path>
            </svg>
          </div>

          <div 
            id="trap2" 
            className={`trap ${activeTraps.includes('trap2') ? 'active' : ''}`}
            style={{ transform: 'translate(0px, -50px)', '--clr-primary': activeTraps.includes('trap2') ? 'rgba(49,154,251,1)' : '#555970' }}
            onClick={() => toggleActive('trap2')}
          >
            <div className="connector" style={{ left: '2px', top: '98%' }}>
              <div className="line" style={{ height: '60px', transform: activeTraps.includes('trap2') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap2') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ left: '6px' }}>
                  Interested
                </div>
              </div>
            </div>

            <div className="connector" style={{ left: '50%', top: '93%' }}>
              <div className="line" style={{ height: '45px', transform: activeTraps.includes('trap2') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap2') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ left: '6px' }}>
                  Engaged
                </div>
              </div>
            </div>

            <div className="shape-label">Educate</div>
            <svg className="front" preserveAspectRatio="none" viewBox="-2 -2 202 264" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M188.435 34.173L10.4349 1.72016C5.52306 0.824641 1 4.59761 1 9.59042V250.319C1 255.342 5.57484 259.122 10.5078 258.175L188.508 224.014C192.276 223.291 195 219.995 195 216.158V42.0432C195 38.1784 192.237 34.8662 188.435 34.173Z" fill="var(--clr-primary)" fillOpacity="0.2" stroke="var(--clr-primary)" strokeWidth="2"></path>
            </svg>
            <svg className="back" preserveAspectRatio="none" viewBox="-2 -2 202 264" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M188.435 34.173L10.4349 1.72016C5.52306 0.824641 1 4.59761 1 9.59042V250.319C1 255.342 5.57484 259.122 10.5078 258.175L188.508 224.014C192.276 223.291 195 219.995 195 216.158V42.0432C195 38.1784 192.237 34.8662 188.435 34.173Z" fill="var(--clr-bg)" fillOpacity="1"></path>
            </svg>
          </div>

          <div 
            id="trap3" 
            className={`trap ${activeTraps.includes('trap3') ? 'active' : ''}`}
            style={{ transform: 'translate(0px, -50px)', '--clr-primary': activeTraps.includes('trap3') ? 'rgba(49,154,251,1)' : '#555970' }}
            onClick={() => toggleActive('trap3')}
          >
            <div className="connector" style={{ left: '2px', top: '98%' }}>
              <div className="line" style={{ height: '35px', transform: activeTraps.includes('trap3') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap3') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ left: '6px' }}>
                  Priority
                </div>
              </div>
            </div>

            <div className="shape-label">Select</div>
            <svg className="front" preserveAspectRatio="none" viewBox="-2 -2 199 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M184.763 18.1066L9.763 1.3396C5.06477 0.889452 1 4.58339 1 9.30313V174.697C1 179.417 5.06478 183.111 9.763 182.66L184.763 165.893C188.867 165.5 192 162.053 192 157.93V26.0701C192 21.9474 188.867 18.4998 184.763 18.1066Z" fill="var(--clr-primary)" fillOpacity="0.2" stroke="var(--clr-primary)" strokeWidth="2"></path>
            </svg>
            <svg className="back" preserveAspectRatio="none" viewBox="-2 -2 199 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M184.763 18.1066L9.763 1.3396C5.06477 0.889452 1 4.58339 1 9.30313V174.697C1 179.417 5.06478 183.111 9.763 182.66L184.763 165.893C188.867 165.5 192 162.053 192 157.93V26.0701C192 21.9474 188.867 18.4998 184.763 18.1066Z" fill="var(--clr-bg)" fillOpacity="1"></path>
            </svg>
          </div>

          <div 
            id="trap4" 
            className={`trap ${activeTraps.includes('trap4') ? 'active' : ''}`}
            style={{ transform: 'translate(0px, -50px)', '--clr-primary': activeTraps.includes('trap4') ? 'rgba(49,154,251,1)' : '#555970' }}
            onClick={() => toggleActive('trap4')}
          >
            <div className="connector" style={{ left: '2px', top: '90%' }}>
              <div className="line" style={{ height: '20px', transform: activeTraps.includes('trap4') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap4') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ right: '1.5em' }}>
                  Committed
                </div>
              </div>
            </div>
            <div className="connector" style={{ right: '2px', top: '98%' }}>
              <div className="line" style={{ transform: activeTraps.includes('trap4') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap4') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ right: '1.5em' }}>
                  Ready
                </div>
              </div>
            </div>
            <div className="shape-label">Activate</div>
            <svg className="front" preserveAspectRatio="none" viewBox="-2 -2 199 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M8.237 18.1066L183.237 1.3396C187.935 0.889452 192 4.58339 192 9.30313V174.697C192 179.417 187.935 183.111 183.237 182.66L8.237 165.893C4.13307 165.5 1 162.053 1 157.93V26.0701C1 21.9474 4.13307 18.4998 8.237 18.1066Z" fill="var(--clr-primary)" fillOpacity="0.2" stroke="var(--clr-primary)" strokeWidth="2"></path>
            </svg>
            <svg className="back" preserveAspectRatio="none" viewBox="-2 -2 199 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M8.237 18.1066L183.237 1.3396C187.935 0.889452 192 4.58339 192 9.30313V174.697C192 179.417 187.935 183.111 183.237 182.66L8.237 165.893C4.13307 165.5 1 162.053 1 157.93V26.0701C1 21.9474 4.13307 18.4998 8.237 18.1066Z" fill="var(--clr-bg)" fillOpacity="1"></path>
            </svg>
          </div>

          <div 
            id="trap5" 
            className={`trap ${activeTraps.includes('trap5') ? 'active' : ''}`}
            style={{ transform: 'translate(0px, -50px)', '--clr-primary': activeTraps.includes('trap5') ? 'rgba(49,154,251,1)' : '#555970' }}
            onClick={() => toggleActive('trap5')}
          >
            <div className="connector" style={{ right: '2px', top: '98%' }}>
              <div className="line" style={{ transform: activeTraps.includes('trap5') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap5') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ right: '1.5em' }}>
                  Recurring<br />
                  Impact
                </div>
              </div>
            </div>
            <div className="shape-label">Impact</div>
            <svg className="front" preserveAspectRatio="none" viewBox="-2 -2 202 264" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M7.56512 34.173L185.565 1.72016C190.477 0.824641 195 4.59761 195 9.59042V250.319C195 255.342 190.425 259.122 185.492 258.175L7.4922 224.014C3.72409 223.291 1.00002 219.995 1.00002 216.158V42.0432C1.00002 38.1784 3.76297 34.8662 7.56512 34.173Z" fill="var(--clr-primary)" fillOpacity="0.2" stroke="var(--clr-primary)" strokeWidth="2"></path>
            </svg>
            <svg className="back" preserveAspectRatio="none" viewBox="-2 -2 202 264" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M7.56512 34.173L185.565 1.72016C190.477 0.824641 195 4.59761 195 9.59042V250.319C195 255.342 190.425 259.122 185.492 258.175L7.4922 224.014C3.72409 223.291 1.00002 219.995 1.00002 216.158V42.0432C1.00002 38.1784 3.76297 34.8662 7.56512 34.173Z" fill="var(--clr-bg)" fillOpacity="1"></path>
            </svg>
          </div>

          <div 
            id="trap6" 
            className={`trap ${activeTraps.includes('trap6') ? 'active' : ''}`}
            style={{ transform: 'translate(0px, -50px)', '--clr-primary': activeTraps.includes('trap6') ? 'rgba(49,154,251,1)' : '#555970' }}
            onClick={() => toggleActive('trap6')}
          >
            <div className="connector" style={{ right: '2px', top: '98%' }}>
              <div className="line" style={{ transform: activeTraps.includes('trap6') ? 'translate(0px, 0px)' : 'scale(1, 0)', transformOrigin: '50% 0%' }}>
              </div>
              <div className="circle" style={{ transform: activeTraps.includes('trap6') ? 'translate(0px, 0px)' : 'scale(0, 0)', transformOrigin: '50% 50%' }}>
                <div className="connector-label" style={{ right: '1.5em' }}>
                  Maximum<br />
                  Impact
                </div>
              </div>
            </div>
            <div className="shape-label">Expand</div>
            <svg className="front" preserveAspectRatio="none" viewBox="-2 -2 196 368" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M6.89183 49.5671L181.892 1.7613C186.982 0.370874 192 4.20217 192 9.47854V354.642C192 359.882 187.048 363.707 181.978 362.383L6.97841 316.677C3.45685 315.757 0.999985 312.576 0.999985 308.937V57.2843C0.999985 53.6779 3.41293 50.5174 6.89183 49.5671Z" fill="var(--clr-primary)" fillOpacity="0.2" stroke="var(--clr-primary)" strokeWidth="2"></path>
            </svg>
            <svg className="back" preserveAspectRatio="none" viewBox="-2 -2 196 368" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path vectorEffect="non-scaling-stroke" d="M6.89183 49.5671L181.892 1.7613C186.982 0.370874 192 4.20217 192 9.47854V354.642C192 359.882 187.048 363.707 181.978 362.383L6.97841 316.677C3.45685 315.757 0.999985 312.576 0.999985 308.937V57.2843C0.999985 53.6779 3.41293 50.5174 6.89183 49.5671Z" fill="var(--clr-bg)" fillOpacity="1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowtieModel;

import React, { useState, useEffect } from 'react';
import './App.css';
import BowtieModel from './components/BowtieModel';
import ContactSearch from './components/ContactSearch';
import { fetchLifecycleStageOptions, verifyAccessToken } from './utils/hubspotApi';
import { initializeOpenAI, mapLifecycleStagesToBowtie, saveStageMappingToDynamoDB, getStageMappingFromDynamoDB } from './utils/openaiService';

function App() {
  const [activeView, setActiveView] = useState('bowtie'); // 'bowtie' or 'details'
  const [selectedStage, setSelectedStage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [portalId, setPortalId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [initialContactId, setInitialContactId] = useState(null);
  const [lifecycleStages, setLifecycleStages] = useState([]);
  const [lifecycleStageMapping, setLifecycleStageMapping] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check URL for contact ID and portal ID parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contactId = params.get('contactId');
    const portal = params.get('portalId');
    
    if (contactId) {
      setInitialContactId(contactId);
      console.log(`Received contact ID from URL: ${contactId}`);
    }
    
    if (portal) {
      setPortalId(portal);
      console.log(`Received portal ID from URL: ${portal}`);
    }
  }, []);
  
  // Get the access token when portal ID is available
  useEffect(() => {
    if (portalId) {
      const getToken = async () => {
        try {
          const token = await verifyAccessToken(portalId);
          setAccessToken(token);
        } catch (err) {
          setError('Failed to get access token. Please refresh and try again.');
          console.error('Error getting access token:', err);
        }
      };
      
      getToken();
    }
  }, [portalId]);
  
  // Fetch lifecycle stages when access token is available
  useEffect(() => {
    if (accessToken && portalId) {
      const fetchStages = async () => {
        try {
          const stages = await fetchLifecycleStageOptions(portalId, accessToken);
          setLifecycleStages(stages);
          
          // Try to load existing mapping from DynamoDB
          const existingMapping = await getStageMappingFromDynamoDB(portalId);
          if (existingMapping) {
            setLifecycleStageMapping(existingMapping);
          }
        } catch (err) {
          setError('Failed to fetch lifecycle stages. Please try again later.');
          console.error('Error fetching lifecycle stages:', err);
        }
      };
      
      fetchStages();
    }
  }, [accessToken, portalId]);
  
  // Generate mapping with OpenAI
  const generateMapping = async () => {
    if (!lifecycleStages.length) {
      setError('No lifecycle stages available to map');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Initialize OpenAI with API key from environment or user input
      // In a real app, you'd get this securely from your backend
      const apiKey = prompt('Please enter your OpenAI API key:');
      if (!apiKey) {
        setIsLoading(false);
        return;
      }
      
      initializeOpenAI(apiKey);
      
      // Map lifecycle stages to Bowtie model stages
      const mapping = await mapLifecycleStagesToBowtie(lifecycleStages);
      setLifecycleStageMapping(mapping);
      
      // Save mapping to DynamoDB
      if (portalId) {
        await saveStageMappingToDynamoDB(portalId, mapping);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to generate mapping. Please try again.');
      console.error('Error generating mapping:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };
  
  // Stage details for the selected stage (when in 'details' view)
  const stageDetails = {
    'trap1': {
      name: 'Attract',
      description: 'In this stage, prospects become aware of your product/service through various marketing channels.',
      metrics: ['Website visitors', 'Social media engagement', 'Ad impressions'],
      touchpoints: ['Social media posts', 'Blog content', 'SEO', 'Paid advertising']
    },
    'trap2': {
      name: 'Educate',
      description: 'Prospects research your solutions and engage with your educational content to learn more.',
      metrics: ['Content downloads', 'Email opens', 'Webinar attendees'],
      touchpoints: ['Emails', 'Webinars', 'Whitepapers', 'Case studies']
    },
    'trap3': {
      name: 'Select',
      description: 'Prospects evaluate your offering against alternatives and determine if it meets their needs.',
      metrics: ['Product demos', 'Sales calls', 'Feature comparison views'],
      touchpoints: ['Product demos', 'Sales meetings', 'Free trials', 'Consultations']
    },
    'trap4': {
      name: 'Activate',
      description: 'Customers have chosen your solution and begin using it for the first time.',
      metrics: ['Onboarding completion rate', 'Feature adoption', 'Time to first value'],
      touchpoints: ['Onboarding sessions', 'Training', 'Welcome emails', 'Setup guidance']
    },
    'trap5': {
      name: 'Impact',
      description: 'Customers realize the value of your solution and integrate it into their workflow.',
      metrics: ['Usage frequency', 'Customer satisfaction', 'Support ticket volume'],
      touchpoints: ['Check-in calls', 'Success reviews', 'Support channels', 'Feature updates']
    },
    'trap6': {
      name: 'Expand',
      description: 'Customers deepen their relationship through upsells, cross-sells, and referrals.',
      metrics: ['Upsell/cross-sell rate', 'Referrals', 'Expansion revenue'],
      touchpoints: ['Account reviews', 'Loyalty programs', 'Advocacy campaigns', 'User communities']
    }
  };

  const handleStageSelect = (stageId) => {
    setSelectedStage(stageId);
    setActiveView('details');
  };

  const handleBackToBowtie = () => {
    setActiveView('bowtie');
    setSelectedStage(null);
  };

  return (
    <div className="journey-mapper-container">
      <header className="journey-mapper-header">
        <h1>Journey Mapper</h1>
        <p>Map and visualize your customer's journey</p>
      </header>

      <main className="journey-mapper-content">
        {error && (
          <div className="error-message">
            {error}
            <button className="btn btn-small" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {activeView === 'bowtie' ? (
          <div className="card bowtie-card">
            <h2>Customer Journey Stages</h2>
            <p>Click on any stage to view details and metrics</p>
            
            {accessToken && (
              <div className="contact-search-wrapper">
                <ContactSearch 
                  accessToken={accessToken} 
                  onContactSelect={handleContactSelect} 
                  initialContactId={initialContactId} 
                />
              </div>
            )}
            
            <div className="mapping-controls">
              {isLoading ? (
                <div className="loading">Generating mapping...</div>
              ) : lifecycleStageMapping ? (
                <div className="mapping-status success">
                  <span>✓ Lifecycle stages mapped to journey</span>
                  <button 
                    className="btn btn-small" 
                    onClick={generateMapping}
                  >
                    Regenerate Mapping
                  </button>
                </div>
              ) : (
                <button 
                  className="btn" 
                  onClick={generateMapping}
                  disabled={!lifecycleStages.length}
                >
                  Map HubSpot Lifecycle Stages to Journey
                </button>
              )}
            </div>
            
            <BowtieModel 
              onStageSelect={handleStageSelect} 
              lifecycleStageMapping={lifecycleStageMapping}
              selectedContact={selectedContact}
            />
          </div>
        ) : (
          <div className="card stage-details-card">
            <div className="card-header">
              <button className="btn btn-back" onClick={handleBackToBowtie}>
                ← Back to Journey Map
              </button>
              <h2>{selectedStage && stageDetails[selectedStage]?.name} Stage Details</h2>
            </div>
            
            {selectedStage && stageDetails[selectedStage] && (
              <div className="stage-details">
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{stageDetails[selectedStage].description}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Key Metrics</h3>
                  <ul className="metrics-list">
                    {stageDetails[selectedStage].metrics.map((metric, index) => (
                      <li key={index}>{metric}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h3>Touchpoints</h3>
                  <ul className="touchpoints-list">
                    {stageDetails[selectedStage].touchpoints.map((touchpoint, index) => (
                      <li key={index}>{touchpoint}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="actions">
                  <button className="btn">Edit Stage</button>
                  <button className="btn btn-secondary">Add Touchpoint</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  hubspot,
  IFrameExtension,
  Flex,
  Card,
  CardBody,
  LoadingSpinner
} from '@hubspot/ui-extensions';

// The URL of the React app that we'll load in the iframe
// For local development, you may use port 3000
// For production, this will be replaced with the deployed URL
const JOURNEY_MAPPER_APP_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : process.env.REACT_APP_JOURNEY_MAPPER_URL || 'https://journey-mapper-app.vercel.app';

const App = () => {
  const [showIFrame, setShowIFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [portalId, setPortalId] = useState(null);

  // Get HubSpot context on component mount
  useEffect(() => {
    const getContext = async () => {
      try {
        // Get the current context (contact record, etc.)
        const result = await hubspot.getContext();
        setContext(result);
        
        // Get portal ID
        const portalInfo = await hubspot.getCurrentPortal();
        setPortalId(portalInfo.id);
      } catch (error) {
        console.error('Error getting context:', error);
      }
    };
    
    getContext();
  }, []);

  // Construct the URL for the iframe with context information
  const getAppUrl = () => {
    const baseUrl = JOURNEY_MAPPER_APP_URL;
    const params = new URLSearchParams();
    
    // Add portal ID
    if (portalId) {
      params.append('portalId', portalId);
    }
    
    // Add contact ID if viewing a contact record
    if (context?.type === 'CONTACT' && context?.objectId) {
      params.append('contactId', context.objectId);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleOpenJourneyMapper = () => {
    setIsLoading(true);
    setShowIFrame(true);
  };

  const handleCloseIFrame = () => {
    setShowIFrame(false);
  };
  
  // Handle iframe load completion
  const handleIFrameLoad = () => {
    setIsLoading(false);
  };

  // Determine if we're viewing a contact record
  const isContactRecord = context?.type === 'CONTACT' && context?.objectId;

  return (
    <Card>
      <CardBody>
        <Flex direction="column" gap="md" align="start">
          <Text format={{ fontWeight: 'bold' }}>
            Journey Mapper Extension
          </Text>
          
          {isContactRecord ? (
            <Text>
              View this contact's journey in the Bowtie model by clicking the button below.
            </Text>
          ) : (
            <Text>
              Click the button below to open the Journey Mapper application.
              {!context && ' Loading context information...'}
            </Text>
          )}

          <Button 
            variant="primary" 
            onClick={handleOpenJourneyMapper}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Open Journey Mapper'}
            {isLoading && <LoadingSpinner size="sm" />}
          </Button>
          
          {isContactRecord && (
            <Text format={{ fontStyle: 'italic' }}>
              Contact ID: {context.objectId}
            </Text>
          )}

          {showIFrame && (
            <IFrameExtension
              width="100%"
              height="600px"
              url={getAppUrl()}
              onClose={handleCloseIFrame}
              title="Journey Mapper"
              onLoad={handleIFrameLoad}
            />
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default App;

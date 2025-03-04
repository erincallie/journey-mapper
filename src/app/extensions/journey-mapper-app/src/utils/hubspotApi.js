/**
 * HubSpot API utility functions
 * 
 * This module provides functions to interact with the HubSpot API.
 * It handles authentication and operations for contacts and properties.
 */

// Function to fetch contact lifecycle stage options from HubSpot
export const fetchLifecycleStageOptions = async (portalId, accessToken) => {
  try {
    const response = await fetch(
      'https://api.hubapi.com/properties/v1/contacts/properties/named/lifecyclestage',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API Error: ${response.statusText}`);
    }

    const propertyData = await response.json();
    return propertyData.options || [];
  } catch (error) {
    console.error('Error fetching lifecycle stage options:', error);
    throw error;
  }
};

// Function to fetch a specific contact by ID
export const fetchContactById = async (contactId, accessToken) => {
  try {
    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname,email,lifecyclestage`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw error;
  }
};

// Function to search contacts with typeahead functionality
export const searchContacts = async (query, accessToken) => {
  try {
    const response = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'firstname',
                  operator: 'CONTAINS_TOKEN',
                  value: query,
                },
              ],
            },
            {
              filters: [
                {
                  propertyName: 'lastname',
                  operator: 'CONTAINS_TOKEN',
                  value: query,
                },
              ],
            },
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'CONTAINS_TOKEN',
                  value: query,
                },
              ],
            },
          ],
          properties: ['firstname', 'lastname', 'email', 'lifecyclestage'],
          limit: 10,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HubSpot API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw error;
  }
};

// Function to verify and refresh access token when needed
export const verifyAccessToken = async (portalId) => {
  try {
    // This would call your Lambda function to check and refresh tokens if needed
    const response = await fetch(
      `https://your-lambda-url.amazonaws.com/getToken?portalId=${portalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Token verification failed: ${response.statusText}`);
    }

    const { accessToken } = await response.json();
    return accessToken;
  } catch (error) {
    console.error('Error verifying access token:', error);
    throw error;
  }
};

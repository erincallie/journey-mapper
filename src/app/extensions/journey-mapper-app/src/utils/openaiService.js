/**
 * OpenAI service for mapping HubSpot lifecycle stages to Bowtie model stages
 */

import OpenAI from 'openai';

// Initialize OpenAI client
// In production, you would get this from environment variables via your backend
// This is just a placeholder for the frontend code
let openai;

// Bowtie model stages that we want to map HubSpot lifecycle stages to
const bowtieStages = [
  { id: 'trap1', name: 'Attract', description: 'Initial awareness and attraction to your company/product' },
  { id: 'trap2', name: 'Educate', description: 'Learning about solutions and engaging with educational content' },
  { id: 'trap3', name: 'Select', description: 'Evaluation and selection of your offering' },
  { id: 'trap4', name: 'Activate', description: 'Initial onboarding and activation of the product/service' },
  { id: 'trap5', name: 'Impact', description: 'Realizing value and integrating the solution' },
  { id: 'trap6', name: 'Expand', description: 'Expanding relationship through upsells and referrals' }
];

// Initialize the OpenAI client - this would typically be done on the server side
export const initializeOpenAI = (apiKey) => {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
  });
};

/**
 * Maps HubSpot lifecycle stages to Bowtie model stages using OpenAI
 * @param {Array} lifecycleStages - Array of HubSpot lifecycle stage options
 * @returns {Object} Mapping of HubSpot lifecycle stages to Bowtie model stages
 */
export const mapLifecycleStagesToBowtie = async (lifecycleStages) => {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Call initializeOpenAI first.');
  }

  try {
    // Prepare the prompt for GPT-4
    const stageDescriptions = lifecycleStages.map(stage => 
      `"${stage.label}" (HubSpot value: "${stage.value}"): ${stage.description || 'No description provided'}`
    ).join('\n');

    const bowtieDescriptions = bowtieStages.map(stage => 
      `"${stage.name}" (ID: ${stage.id}): ${stage.description}`
    ).join('\n');

    const prompt = `
    I have two sets of customer journey stages that I need to map together:

    HubSpot Lifecycle Stages:
    ${stageDescriptions}

    Bowtie Model Stages:
    ${bowtieDescriptions}

    Please create a mapping that assigns each HubSpot lifecycle stage to the most appropriate Bowtie model stage.
    Return only a JSON object where keys are HubSpot lifecycle stage values and values are Bowtie stage IDs.
    Example format: {"subscriber": "trap1", "lead": "trap2", ...}
    `;

    // Call OpenAI's API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // or a more recent model
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that maps CRM lifecycle stages to customer journey stages. Return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more deterministic results
    });

    // Parse the response to get the mapping
    const responseText = completion.choices[0].message.content.trim();
    
    // Extract just the JSON part
    const jsonMatch = responseText.match(/\{[^]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse OpenAI response as JSON');
    }
    
    const mapping = JSON.parse(jsonMatch[0]);
    
    // Validate the mapping
    for (const hsStage in mapping) {
      const bowtieStageId = mapping[hsStage];
      if (!bowtieStages.some(stage => stage.id === bowtieStageId)) {
        console.warn(`Invalid Bowtie stage ID in mapping: ${bowtieStageId} for HubSpot stage ${hsStage}`);
      }
    }

    return mapping;
  } catch (error) {
    console.error('Error mapping lifecycle stages with OpenAI:', error);
    throw error;
  }
};

/**
 * Saves the stage mapping to AWS DynamoDB via Lambda
 * @param {string} portalId - HubSpot portal ID
 * @param {Object} mapping - Mapping of HubSpot lifecycle stages to Bowtie model stages
 */
export const saveStageMappingToDynamoDB = async (portalId, mapping) => {
  try {
    const response = await fetch('https://your-lambda-url.amazonaws.com/saveMapping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portalId,
        mapping,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save mapping: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving stage mapping:', error);
    throw error;
  }
};

/**
 * Retrieves the stage mapping from AWS DynamoDB via Lambda
 * @param {string} portalId - HubSpot portal ID
 * @returns {Object} Mapping of HubSpot lifecycle stages to Bowtie model stages
 */
export const getStageMappingFromDynamoDB = async (portalId) => {
  try {
    const response = await fetch(`https://your-lambda-url.amazonaws.com/getMapping?portalId=${portalId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If not found, we'll return null instead of throwing an error
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to retrieve mapping: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrieving stage mapping:', error);
    throw error;
  }
};

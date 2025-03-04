# Journey Mapper

A HubSpot UI extension that renders a custom React app in an iFrame modal.

## Project Overview

This project includes:

1. A HubSpot UI Extension that displays a button to open a modal
2. A custom React app that runs in an iFrame within the modal
3. A build and bundling process for both components

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- HubSpot CLI installed globally (`npm install -g @hubspot/cli`)
- HubSpot developer account

### Setup Steps

1. **Update CLI and authenticate:**

```
npm install -g @hubspot/cli@latest
hs init  # Create config file for your parent account
hs auth  # Authenticate your account
```

2. **Install project dependencies:**

```
npm install
```

This will install dependencies for both the UI extension and React app.

3. **Set up environment variables:**

Copy the `.env.template` file to create a new `.env` file and fill in the required values:

```
cp .env.template .env
```

Fill in the following variables in the `.env` file:
- `HUBSPOT_CLIENT_ID` - Your HubSpot API client ID
- `HUBSPOT_CLIENT_SECRET` - Your HubSpot API client secret
- `HUBSPOT_REDIRECT_URI` - The OAuth redirect URI
- `AWS_REGION` - AWS region for DynamoDB (default: us-east-1)
- `TOKEN_TABLE` - DynamoDB table name for tokens (default: journeyMapperTokens)
- `OPENAI_API_KEY` - Your OpenAI API key for stage mapping
- `REACT_APP_JOURNEY_MAPPER_URL` - Production URL of your deployed React app

4. **Start the React app development server:**

```
cd src/app/extensions/journey-mapper-app
npm start
```

4. **In a separate terminal, start the HubSpot development server:**

```
npm run dev
```

## Deployment

1. **Build the React app:**

```
cd src/app/extensions/journey-mapper-app
npm run build
```

2. **Deploy to HubSpot:**

```
npm run upload
```

## Usage

After deployment, you can access the Journey Mapper UI Extension in your HubSpot portal:

1. Navigate to Contacts > Contacts
2. Select any contact record
3. Go to the Custom tab in the middle pane
4. You'll see the Journey Mapper card with a button to open the modal
5. The contact's ID will be automatically passed to the Journey Mapper app, and their information will be displayed in the journey visualization

## Project Structure

```
journey-mapper/
├── hsproject.json        # HubSpot project configuration
├── package.json          # Project dependencies
├── src/
│   └── app/
│       └── extensions/
│           ├── journey-mapper-app/            # React application
│           │   ├── public/
│           │   │   ├── index.html
│           │   │   └── manifest.json
│           │   ├── src/
│           │   │   ├── components/
│           │   │   │   ├── BowtieModel.js     # Journey visualization component
│           │   │   │   ├── BowtieModel.css
│           │   │   │   ├── ContactSearch.js   # HubSpot contact search component
│           │   │   │   └── ContactSearch.css
│           │   │   ├── utils/
│           │   │   │   ├── hubspotApi.js      # HubSpot API integration
│           │   │   │   └── openaiService.js   # OpenAI integration for stage mapping
│           │   │   ├── App.js
│           │   │   ├── App.css
│           │   │   ├── index.js
│           │   │   └── index.css
│           │   └── package.json
│           └── journey-mapper-ui-extension/   # HubSpot UI Extension
│               ├── App.jsx                    # UI Extension entry point
```

## HubSpot Integration

This application integrates with HubSpot in several ways:

1. **Contact Context Integration** - When viewing a contact record in HubSpot, the UI Extension automatically passes the contact ID to the React application. The app then loads and displays that contact's information and highlights their current position in the journey.

2. **Lifecycle Stage Mapping** - The application maps HubSpot's standard lifecycle stages to the Bowtie model journey stages, providing a visual representation of where contacts are in their customer journey.

3. **Authentication** - OAuth tokens are managed securely through AWS DynamoDB for persistent storage and Lambda for token refresh.

4. **Portal-specific Configurations** - All settings and mappings are stored per-portal, allowing multiple HubSpot portals to use the extension with their own configurations.

## AI Integration

The Journey Mapper uses OpenAI's GPT-4 to intelligently map HubSpot lifecycle stages to the Bowtie journey model. This mapping is done automatically and stored in DynamoDB for future use.
```

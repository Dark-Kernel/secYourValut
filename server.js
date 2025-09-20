const express = require('express');
const cors = require('cors');

const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });
const axios = require('axios').create({ httpsAgent: agent });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Kasm Wrapper App Backend is running!' });
});

// Placeholder for Kasm API interaction
// In a real app, you'd store KASM_URL, KASM_USERNAME, KASM_PASSWORD securely (e.g., env variables)
const KASM_URL = 'https://34.226.215.131/'; // Replace with your Kasm server URL
const KASM_USERNAME = 'admin@kasm.local'; // Replace with your Kasm admin username
const KASM_PASSWORD = 'Sumit@kasm123'; // Replace with your Kasm admin password

// Function to get Kasm API token (simplified)
async function getKasmApiToken() {
    try {
        const response = await axios.post(`${KASM_URL}/api/public/login`, {
            username: KASM_USERNAME,
            password: KASM_PASSWORD
        });
        return response.data.token; // Assuming the token is returned like this
    } catch (error) {
        console.error('Error getting Kasm API token:', error);
        throw error;
    }
}

// Placeholder route for launching an app (simplified)
app.post('/launch-app', async (req, res) => {
    const { userId, appId } = req.body; // In a real app, userId would come from your auth system

    if (!userId || !appId) {
        return res.status(400).json({ error: 'userId and appId are required' });
    }

    try {
        const token = await getKasmApiToken();
        console.log('Kasm API Token:', token);
        // Here you would typically:
        // 1. Check if a Kasm user exists for 'userId'
        // 2. If not, create one
        // 3. Get or create a Kasm profile for that user
        // 4. Request a single-use token for launching 'appId' for that profile
        // For now, we'll just simulate a successful response
        // Simulate getting a launch token
        const launchToken = `simulated-launch-token-for-${userId}-${appId}`;
        res.json({ launchUrl: `${KASM_URL}/#/${launchToken}` });
    } catch (error) {
        console.error('Error launching app:', error);
        res.status(500).json({ error: 'Failed to launch application' });
    }
});

// curl request for above function route  /launch-app : 
// curl -X POST -H "Content-Type: application/json" -d '{"userId": "user123", "appId": "app456"}' http://localhost:5000/launch-app

app.post('/kasm/launch', async (req, res) => {
  const { userId, appId } = req.body;
  // 1. Try to fetch user
  let userDetails = await postKasm('/api/public/get_user', {
    api_key, api_key_secret, target_user: { username: userId }
  });
  if (userDetails.error_message) {
    // 2. If user not found, create user
    await postKasm('/api/public/create_user', {
      api_key, api_key_secret,
      target_user: { username: userId, password: generatePassword(), locked: false, disabled: false }
    });
  }
  // 3. Create session token for single-use launch
  let tokenResponse = await postKasm('/api/public/create_session_token', {
    api_key, api_key_secret, requesting_user: userId, app_id: appId
  });
  res.json(tokenResponse);
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

# Kasm Wrapper App

This is a minimal application that provides a simple interface to launch Kasm Workspaces applications.

## Prerequisites

- Node.js and npm installed
- A running Kasm Workspaces server

## Setup

1. Clone the repository (or copy the files).
2. Navigate to the project root directory.
3. Install backend dependencies:
   ```
   npm install
   ```
4. Navigate to the `frontend` directory and install frontend dependencies:
   ```
   cd frontend
   npm install
   cd ..
   ```

## Configuration

1. Update `server.js` with your Kasm server URL, admin username, and password.
   ```javascript
   const KASM_URL = 'http://your-kasm-server-url';
   const KASM_USERNAME = 'admin';
   const KASM_PASSWORD = 'admin_password';
   ```

## Running the Application

From the project root directory, you can start both the backend and frontend using:

```
npm start
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Log in with any username and password (for this minimal version, it's just a simulation).
3. Click on the application buttons to launch them in a new tab.

Note: The actual Kasm API integration and user profile management are placeholders in this minimal version.
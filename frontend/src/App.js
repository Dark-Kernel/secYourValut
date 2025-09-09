import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Simulate login
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd send credentials to your backend for verification
    console.log('Logging in with:', username, password);
    // For demo, just simulate successful login
    if (username && password) {
      setIsLoggedIn(true);
      setMessage('');
    } else {
      setMessage('Please enter username and password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Function to launch an app via the backend
  const launchApp = async (appId) => {
    try {
      // In a real app, userId would come from your auth system
      const userId = 'user123'; // Placeholder
      const response = await axios.post('http://localhost:5000/launch-app', { userId, appId });
      const launchUrl = response.data.launchUrl;
      // Open the Kasm app in a new tab
      window.open(launchUrl, '_blank');
    } catch (error) {
      console.error('Error launching app:', error);
      alert('Failed to launch application');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kasm Wrapper App</h1>
        {!isLoggedIn ? (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div>
                <label>Username: </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password: </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login</button>
            </form>
            {message && <p style={{ color: 'red' }}>{message}</p>}
          </div>
        ) : (
          <div>
            <h2>Welcome, {username}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <div className="tabs">
              <h3>Your Applications</h3>
              <button onClick={() => launchApp('firefox')}>Firefox Browser</button>
              <button onClick={() => launchApp('chrome')}>Chrome Browser</button>
              <button onClick={() => launchApp('vscode')}>VS Code</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
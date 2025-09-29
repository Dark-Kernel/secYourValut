'use client';

import { useState, useEffect } from 'react';
import SessionManager from '@/components/SessionManager';
import BrowserViewer from '@/components/BrowserViewer';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('securevault_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (id: string) => {
    setUserId(id);
    setIsAuthenticated(true);
    localStorage.setItem('securevault_user_id', id);
  };

  const handleLogout = () => {
    setUserId('');
    setIsAuthenticated(false);
    localStorage.removeItem('securevault_user_id');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">SecureVault</h1>
            <p className="text-slate-400">Ephemeral Browser Workspaces</p>
          </div>
          <input
            type="text"
            placeholder="Enter User ID"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                handleLogin(e.currentTarget.value);
              }
            }}
          />
          <p className="text-slate-500 text-sm mt-4 text-center">
            Press Enter to continue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">SecureVault</h1>
            <p className="text-slate-400 text-sm">User: {userId}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-6">
        <SessionManager userId={userId} />
      </main>
    </div>
  );
}


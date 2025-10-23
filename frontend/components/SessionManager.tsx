'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BrowserViewer from './BrowserViewer';

interface Session {
  session_id: string;
  browser_url: string | null;
  status: string;
  container_id: string | null;
}

interface SessionManagerProps {
  userId: string;
  authToken: string;
}

export default function SessionManager({ userId, authToken }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);
  const [expiresInMinutes, setExpiresInMinutes] = useState(60);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/sessions`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, [userId, authToken]);

  const createSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          persistence_enabled: persistenceEnabled,
          expires_in_minutes: expiresInMinutes,
        }),
      });
      const newSession = await res.json();
      await fetchSessions();
      setActiveSession(newSession);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setLoading(false);
    }
  };

  const controlSession = async (sessionId: string, action: string) => {
    try {
      await fetch(`${API_BASE}/sessions/${sessionId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      await fetchSessions();
    } catch (error) {
      console.error(`Failed to ${action} session:`, error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await fetch(`${API_BASE}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (activeSession?.session_id === sessionId) {
        setActiveSession(null);
      }
      await fetchSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'exited':
      case 'stopped':
        return 'bg-red-500';
      case 'creating':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-[100px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Body */}
      <main className='p-3'>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Session Controls */}
          <div className="lg:col-span-1 space-y-8">
            {/* Create New Session */}
            <div className="bg-slate-800/70 border border-slate-700/30 backdrop-blur-sm rounded-lg p-6 shadow-lg shadow-cyan-600/10">
              <h2 className="text-xl font-semibold mb-4">Create New Session</h2>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={persistenceEnabled}
                      onChange={(e) => setPersistenceEnabled(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                    <span>Enable Persistence</span>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">
                    Expires in (minutes)
                  </label>
                  <input
                    type="number"
                    value={expiresInMinutes}
                    onChange={(e) => setExpiresInMinutes(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600/30 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={createSession}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-cyan-600/10"
                >
                  {loading ? 'Creating...' : 'Create Session'}
                </button>
              </div>
            </div>

            {/* Sessions List */}
            <div className="bg-slate-800/70 border border-slate-700/30 backdrop-blur-sm rounded-lg p-2 shadow-lg shadow-cyan-600/10">
              <h2 className="text-xl font-semibold mb-2">
                Your Sessions ({sessions.length})
              </h2>

              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No active sessions</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.session_id}
                      className="bg-slate-900/70 border border-slate-700/30 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                          <span className="text-white font-medium">{session.status}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 mb-3 truncate">
                        {session.session_id}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {session.status === 'running' && (
                          <>
                            <button
                              onClick={() => setActiveSession(session)}
                              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => window.open(session.browser_url, '_blank')}
                              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-sm rounded transition-colors"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => controlSession(session.session_id, 'pause')}
                              className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm rounded transition-colors"
                            >
                              Pause
                            </button>
                          </>
                        )}
                        {session.status === 'paused' && (
                          <button
                            onClick={() => controlSession(session.session_id, 'unpause')}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors"
                          >
                            Resume
                          </button>
                        )}
                        {(session.status === 'exited' || session.status === 'stopped') && (
                          <button
                            onClick={() => controlSession(session.session_id, 'start')}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {session.status === 'running' && (
                          <button
                            onClick={() => controlSession(session.session_id, 'stop')}
                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm rounded transition-colors"
                          >
                            Stop
                          </button>
                        )}
                        <button
                          onClick={() => controlSession(session.session_id, 'restart')}
                          className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white text-sm rounded transition-colors"
                        >
                          Restart
                        </button>
                        <button
                          onClick={() => deleteSession(session.session_id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Browser Viewer */}
          <div className="lg:col-span-2">
            <BrowserViewer session={activeSession} />
          </div>
        </div>
      </main>
    </div>
  );
}

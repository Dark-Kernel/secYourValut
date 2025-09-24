// pages/kasm-instance.js (or app/kasm-instance/page.js for App Router)
'use client'; // Add this if using App Router

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/router' for Pages Router

export default function KasmInstancePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('sessions');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load existing sessions
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      
      // Here you'll add your KASM API calls to fetch existing sessions
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock session data - replace with actual API response
      const mockSessions = [
        {
          id: 'sess_001',
          name: 'Ubuntu Desktop',
          image: 'Ubuntu 22.04',
          status: 'running',
          created: new Date(Date.now() - 3600000).toISOString(),
          url: 'https://kasm-session1.com/vnc'
        },
        {
          id: 'sess_002',
          name: 'Firefox Browser',
          image: 'Firefox Latest',
          status: 'stopped',
          created: new Date(Date.now() - 7200000).toISOString(),
          url: 'https://kasm-session2.com/vnc'
        },
        {
          id: 'sess_003',
          name: 'Development Environment',
          image: 'VS Code Server',
          status: 'running',
          created: new Date(Date.now() - 1800000).toISOString(),
          url: 'https://kasm-session3.com/vnc'
        }
      ];
      
      setSessions(mockSessions);
      
    } catch (err) {
      setError('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setIsCreatingSession(true);
      
      // Here you'll add your KASM API call to create new session
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock new session creation
      const newSession = {
        id: `sess_${Date.now()}`,
        name: 'New Ubuntu Session',
        image: 'Ubuntu 22.04',
        status: 'starting',
        created: new Date().toISOString(),
        url: `https://kasm-new-${Date.now()}.com/vnc`
      };
      
      setSessions(prev => [newSession, ...prev]);
      
    } catch (err) {
      setError('Failed to create new session');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSessionAction = async (sessionId, action) => {
    try {
      // Here you'll add your KASM API calls for session actions
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          let newStatus = session.status;
          switch (action) {
            case 'restart':
              newStatus = 'restarting';
              break;
            case 'stop':
              newStatus = 'stopping';
              break;
            case 'visit':
              // Open session in new window/tab
              window.open(session.url, '_blank');
              return session;
            default:
              return session;
          }
          return { ...session, status: newStatus };
        }
        return session;
      }));

      // Simulate API call delay
      if (action !== 'visit') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSessions(prev => prev.map(session => {
          if (session.id === sessionId) {
            let finalStatus = session.status;
            switch (action) {
              case 'restart':
                finalStatus = 'running';
                break;
              case 'stop':
                finalStatus = 'stopped';
                break;
            }
            return { ...session, status: finalStatus };
          }
          return session;
        }));
      }
      
    } catch (err) {
      setError(`Failed to ${action} session`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/10';
      case 'stopped': return 'text-red-400 bg-red-400/10';
      case 'starting': return 'text-yellow-400 bg-yellow-400/10';
      case 'stopping': return 'text-orange-400 bg-orange-400/10';
      case 'restarting': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Sessions</h2>
          <p className="text-gray-400">Please wait while we fetch your container sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={loadSessions}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">KASM Session Manager</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Connected</span>
            </div>
            <button
              onClick={handleGoBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Tabs and Create Button */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'images'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Images
            </button>
          </div>
          
          <button
            onClick={createNewSession}
            disabled={isCreatingSession}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isCreatingSession ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Session
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden">
        {activeTab === 'sessions' && (
          <div className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Your Sessions ({sessions.length})</h2>
              <button
                onClick={loadSessions}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              {sessions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No Sessions Found</h3>
                  <p className="text-gray-400 mb-4">Create your first KASM session to get started</p>
                  <button
                    onClick={createNewSession}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Session
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-gray-750 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-white">{session.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-1">Image: {session.image}</p>
                          <p className="text-xs text-gray-500">Created: {formatDate(session.created)}</p>
                          <p className="text-xs text-gray-500">ID: {session.id}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleSessionAction(session.id, 'restart')}
                            disabled={session.status === 'restarting' || session.status === 'starting'}
                            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Restart
                          </button>
                          
                          <button
                            onClick={() => handleSessionAction(session.id, 'stop')}
                            disabled={session.status === 'stopped' || session.status === 'stopping'}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            Stop
                          </button>
                          
                          <button
                            onClick={() => handleSessionAction(session.id, 'visit')}
                            disabled={session.status !== 'running'}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'images' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Available Images</h3>
              <p className="text-gray-400">Container images will be displayed here</p>
            </div>
          </div>
        )}
      </main>

      {/* Status Bar */}
      <footer className="bg-gray-800 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Active Sessions: {sessions.filter(s => s.status === 'running').length}</span>
          <span>Total Sessions: {sessions.length}</span>
        </div>
      </footer>
    </div>
  );
}
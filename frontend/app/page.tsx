'use client';

import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react';
import SessionManager from '@/components/SessionManager';

export default function Home() {
  const CODE_LENGTH = 5;
  const [userCode, setUserCode] = useState(Array(CODE_LENGTH).fill(''));
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'pending' | 'approved' | 'denied'>('idle');
  const [authToken, setAuthToken] = useState('');
  const [sessionId, setSessionId] = useState('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('securevault_username');
    const storedCode = localStorage.getItem('securevault_user_code');
    const storedToken = localStorage.getItem('securevault_auth_token');
    if (storedUsername && storedCode && storedToken) {
      setUsername(storedUsername);
      setUserCode(storedCode.split(''));
      setAuthToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const startPolling = (sessionId: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    let pollCount = 0;
    const maxPolls = 30; // Poll for maximum 60 seconds (30 * 2 seconds)

    pollingIntervalRef.current = setInterval(async () => {
      pollCount++;
      
      try {
        const res = await fetch(`https://securevault-743s.onrender.com/api/auth/browser-login/status/${sessionId}`);
        const data = await res.json();

        if (data.success) {
          if (data.status === 'approved' && data.token) {
            setBiometricStatus('approved');
            setAuthToken(data.token);
            setIsAuthenticated(true);
            localStorage.setItem('securevault_username', username);
            localStorage.setItem('securevault_user_code', userCode.join(''));
            localStorage.setItem('securevault_auth_token', data.token);
            
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          } else if (data.status === 'denied') {
            setBiometricStatus('denied');
            setError('Biometric authentication was denied');
            setUserCode(Array(CODE_LENGTH).fill(''));
            inputsRef.current[0]?.focus();
            
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          } else if (data.status === 'pending') {
            setBiometricStatus('pending');
            // Continue polling if still pending
          }
        } else if (data.status === 'invalid_session' || data.status === 'expired') {
          // Session expired or invalid
          setBiometricStatus('denied');
          setError(data.status === 'expired' 
            ? 'Authentication request expired. Please try again.' 
            : 'Invalid session. Please try again.');
          setUserCode(Array(CODE_LENGTH).fill(''));
          inputsRef.current[0]?.focus();
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
        
        // Stop polling after maximum attempts
        if (pollCount >= maxPolls) {
          setBiometricStatus('denied');
          setError('Authentication timeout. Please try again.');
          setUserCode(Array(CODE_LENGTH).fill(''));
          inputsRef.current[0]?.focus();
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        // On network error, continue polling unless we've hit max attempts
        if (pollCount >= maxPolls) {
          setBiometricStatus('denied');
          setError('Network error. Please try again.');
          setUserCode(Array(CODE_LENGTH).fill(''));
          inputsRef.current[0]?.focus();
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }
    }, 2000); // Poll every 2 seconds
  };

  const handleLogin = async (code: string) => {
    setLoading(true);
    setError('');
    setBiometricStatus('idle');

    try {
      // First verify the code exists
      const verifyRes = await fetch(`https://securevault-743s.onrender.com/api/auth/code/${code}`);
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error('Invalid code');
      }

      setUsername(verifyData.username);

      // Initiate browser login (triggers biometric request)
      const loginRes = await fetch('https://securevault-743s.onrender.com/api/auth/browser-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authCode: code }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.success) {
        throw new Error(loginData.message || 'Failed to initiate biometric authentication');
      }

      // Store the sessionId and start polling for biometric status
      setSessionId(loginData.sessionId);
      setBiometricStatus('pending');
      startPolling(loginData.sessionId);

    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
      setUserCode(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserCode(Array(CODE_LENGTH).fill(''));
    setAuthToken('');
    setSessionId('');
    setBiometricStatus('idle');
    localStorage.removeItem('securevault_username');
    localStorage.removeItem('securevault_user_code');
    localStorage.removeItem('securevault_auth_token');
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newCode = [...userCode];
      newCode[index] = value.toUpperCase();
      setUserCode(newCode);

      if (value && index < CODE_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (newCode.every((char) => char !== '')) {
        handleLogin(newCode.join(''));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !userCode[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const getBiometricStatusIcon = () => {
    switch (biometricStatus) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getBiometricStatusText = () => {
    switch (biometricStatus) {
      case 'pending':
        return 'Waiting for biometric approval...';
      case 'approved':
        return 'Biometric authentication successful!';
      case 'denied':
        return 'Biometric authentication denied';
      default:
        return '';
    }
  };

  const getBiometricStatusColor = () => {
    switch (biometricStatus) {
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'approved':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'denied':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return '';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>

        <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureVault
              </h1>
            </div>
            <p className="text-slate-300 text-lg">Enter your 5-character secure code</p>
            <p className="text-slate-400 text-sm mt-2">Biometric authentication required</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {userCode.map((char, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                ref={(el) => (inputsRef.current[idx] = el)}
                value={char}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-14 h-14 text-center text-2xl font-bold bg-slate-700/50 border border-white/20 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white disabled:bg-slate-700/30 transition-all duration-200"
                disabled={loading || biometricStatus === 'pending'}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center space-x-2">
              <Lock className="w-4 h-4 text-blue-400 animate-pulse" />
              <p className="text-blue-400 text-sm">Initiating authentication...</p>
            </div>
          )}

          {biometricStatus !== 'idle' && (
            <div className={`mb-4 p-3 ${getBiometricStatusColor()} border rounded-lg flex items-center justify-center space-x-2`}>
              {getBiometricStatusIcon()}
              <p className="text-sm">{getBiometricStatusText()}</p>
            </div>
          )}

          {biometricStatus === 'pending' && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Please approve the login request on your mobile device</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
      <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureVault
              </h1>
              <p className="text-slate-400 text-sm">User: <span className="text-slate-300 font-medium">{username}</span></p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all duration-300 font-medium shadow-lg shadow-red-500/30 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <SessionManager userId={username} authToken={authToken} />
        </div>
      </main>
    </div>
  );
}

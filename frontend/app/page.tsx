'use client';

import { useState, useEffect, useRef } from 'react';
import SessionManager from '@/components/SessionManager';

export default function Home() {
  const CODE_LENGTH = 5;
  const [userCode, setUserCode] = useState(Array(CODE_LENGTH).fill(''));
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('securevault_username');
    const storedCode = localStorage.getItem('securevault_user_code');
    if (storedUsername && storedCode) {
      setUsername(storedUsername);
      setUserCode(storedCode.split(''));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/code/${code}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error('Invalid code');
      }

      // Save username and code locally
      setUsername(data.username);
      setIsAuthenticated(true);
      localStorage.setItem('securevault_username', data.username);
      localStorage.setItem('securevault_user_code', code);
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
    localStorage.removeItem('securevault_username');
    localStorage.removeItem('securevault_user_code');
  };

  const handleChange = (value: string, index: number) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newCode = [...userCode];
      newCode[index] = value.toUpperCase();
      setUserCode(newCode);

      if (value && index < CODE_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      // Auto-verify when full code entered
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-2">SecureVault</h1>
          <p className="text-slate-400 mb-6">Enter your 5-character secure code</p>
          <div className="flex justify-center gap-3">
            {userCode.map((char, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                ref={(el) => (inputsRef.current[idx] = el)}
                value={char}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-12 text-center text-xl font-bold bg-slate-900 border border-slate-600 rounded-lg focus:border-blue-500 focus:outline-none text-white disabled:bg-slate-700"
                disabled={loading}
              />
            ))}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {loading && <p className="text-blue-400 mt-2">Verifying code...</p>}
          <p className="text-slate-500 text-sm mt-4">
            Each box accepts 1 alphanumeric character
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SecureVault</h1>
          <p className="text-slate-400 text-sm">User: {username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>
      <main className="p-6">
        <SessionManager userId={username} />
      </main>
    </div>
  );
}

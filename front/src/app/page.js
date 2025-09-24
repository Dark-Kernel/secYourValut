// pages/index.js (or app/page.js for App Router)
'use client'; // Add this if using App Router

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/router' for Pages Router

export default function EntrancePage() {
  const [secretCode, setSecretCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle input change with validation
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Only allow alphanumeric characters and limit to 5 characters
    if (/^[A-Z0-9]*$/.test(value) && value.length <= 5) {
      setSecretCode(value);
      setError(''); // Clear error when user types
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (secretCode.length !== 5) {
      setError('Secret code must be exactly 5 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Here you can add your authentication logic
      // For now, we'll just simulate a delay and redirect
      
      // Example: Check against valid codes (replace with your logic)
      const validCodes = ['ABC12', 'XYZ99', 'TEST1']; // Replace with your validation
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (validCodes.includes(secretCode)) {
        // Redirect to the KASM instance page
        router.push('/kasm-instance');
      } else {
        setError('Invalid secret code. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Access</h1>
          <p className="text-blue-100">Enter your 5-character secret code</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="secretCode" className="block text-sm font-medium text-blue-100 mb-2">
              Secret Code
            </label>
            <input
              type="text"
              id="secretCode"
              value={secretCode}
              onChange={handleInputChange}
              placeholder="XXXXX"
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center text-lg font-mono tracking-widest"
              maxLength={5}
              autoComplete="off"
              disabled={isLoading}
            />
            <p className="text-xs text-blue-200 mt-1">
              {secretCode.length}/5 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || secretCode.length !== 5}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Access KASM Instance'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-200">
            Secure container access portal
          </p>
        </div>
      </div>
    </div>
  );
}
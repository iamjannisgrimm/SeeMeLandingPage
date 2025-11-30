'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set the auth cookie
    document.cookie = `analytics_auth=${token}; path=/; max-age=86400; samesite=strict`;
    
    // Try to access the dashboard
    const response = await fetch('/analytics-dashboard', {
      headers: {
        'x-analytics-auth': token
      }
    });
    
    if (response.ok) {
      router.push('/analytics-dashboard');
    } else {
      setError('Invalid access token');
      document.cookie = 'analytics_auth=; path=/; max-age=0';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">
              Access Token
            </label>
            <input
              type="password"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your access token"
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

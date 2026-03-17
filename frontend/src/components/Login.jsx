import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { authAPI } from '../api';

function Login({ onLogin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Sending PIN:', pin, 'Length:', pin.length, 'Type:', typeof pin);
      
      // Validate PIN format
      if (!/^\d{4}$/.test(pin)) {
        setError('PIN must be exactly 4 digits');
        setLoading(false);
        return;
      }

      const response = await authAPI.login(pin);
      console.log('Login response:', response.data);
      
      if (response.status === 200 && response.data.success) {
        console.log('✅ Login successful, storing PIN in localStorage');
        onLogin(pin);
      } else {
        setError(response.data?.message || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.status, err.response?.data?.message);
      console.log('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Invalid PIN - access denied');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white p-16 rounded-2xl shadow-xl text-center w-full max-w-sm animate-slideUp border border-slate-200">
        <div className="text-5xl text-blue-600 mb-4 flex justify-center">
          <FaLock />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Task Tracker</h1>
        <p className="text-slate-600 mb-8 text-lg font-medium">Admin Login</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-left">
            <label htmlFor="pin" className="block font-semibold text-gray-700 mb-2">
              Enter 4-Digit PIN
            </label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              maxLength="4"
              required
              className="form-input text-center text-2xl font-bold tracking-widest"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-900 px-4 py-3 rounded-lg mb-4 text-sm border-l-4 border-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-slate-500 text-xs">
          <p>This is a confidential admin portal. Keep your PIN safe.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;

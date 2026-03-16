import React, { useState, useEffect } from 'react';
import { FaLock, FaWhatsapp, FaCheckCircle, FaInfo, FaSave } from 'react-icons/fa';

function Settings() {
  const [adminPin, setAdminPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [adminPhone, setAdminPhone] = useState('+919908939746');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('adminPin');
    if (saved) setAdminPin(saved);
  }, []);

  const handleChangePIN = () => {
    if (!newPin || !confirmPin) {
      setMessage('Please fill in all PIN fields');
      return;
    }
    if (newPin !== confirmPin) {
      setMessage('PINs do not match');
      return;
    }
    if (newPin.length !== 4) {
      setMessage('PIN must be exactly 4 digits');
      return;
    }
    localStorage.setItem('adminPin', newPin);
    setMessage('✓ PIN updated successfully!');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangeAdminPhone = () => {
    localStorage.setItem('adminPhone', adminPhone);
    setMessage('✓ Admin phone updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-500 text-lg">Configure system preferences, security, and integrations</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-8 px-6 py-4 rounded-2xl font-semibold text-lg border-l-4 ${
          message.includes('✓') 
            ? 'bg-green-50 text-green-800 border-green-600' 
            : 'bg-amber-50 text-amber-800 border-amber-600'
        }`}>
          {message}
        </div>
      )}

      {/* PIN Security Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border-t-4 border-blue-600">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-xl">
            <FaLock className="text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">PIN Security</h2>
            <p className="text-gray-600">Change your 4-digit login PIN</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-3">New PIN</label>
              <input
                type="password"
                maxLength="4"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold text-2xl tracking-widest text-center focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-3">Confirm PIN</label>
              <input
                type="password"
                maxLength="4"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold text-2xl tracking-widest text-center focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleChangePIN}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FaSave /> Update PIN
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-bold">🔐 Security Tip:</span> Use a memorable 4-digit PIN. This PIN is stored locally on your device for security.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Integration Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border-t-4 border-green-600">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-600 text-white p-4 rounded-xl">
            <FaWhatsapp className="text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">WhatsApp Configuration</h2>
            <p className="text-gray-600">Current Status: <span className="font-bold text-green-600">✓ Manual Mode</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Current Configuration */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Current Configuration</h3>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-semibold mb-1">Method</p>
                <p className="text-2xl font-bold text-green-600">Manual (wa.me links)</p>
                <p className="text-xs text-gray-600 mt-2">Tasks are shared via WhatsApp using automatic message generation</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">Features Available:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <FaCheckCircle className="text-green-600" /> Message preview
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <FaCheckCircle className="text-green-600" /> Editable messages
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <FaCheckCircle className="text-green-600" /> Multi-contact support
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Update Admin Number */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Admin WhatsApp Number</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-semibold mb-1">Current</p>
                <p className="text-lg font-bold text-blue-600">{adminPhone}</p>
                <p className="text-xs text-gray-600 mt-2">Used for task notifications and updates</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-3">Update Number</label>
                <input
                  type="tel"
                  placeholder="Include country code (e.g., +919876543210)"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
              <button
                onClick={handleChangeAdminPhone}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Update Number
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Information Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-purple-600">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-purple-600 text-white p-4 rounded-xl">
            <FaInfo className="text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">System Information</h2>
            <p className="text-gray-600">Application performance and configuration details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">App Version</p>
            <p className="text-2xl font-bold text-purple-600">1.0.0</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Database Status</p>
            <p className="text-2xl font-bold text-green-600">✓ Connected</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">API Endpoint</p>
            <p className="text-lg font-bold text-blue-600">localhost:5000</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Last Sync</p>
            <p className="text-lg font-bold text-gray-700">Just now</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-600">
          <p className="text-sm text-gray-700">
            <span className="font-bold">ℹ️ About:</span> Task Tracker v1.0 - Professional task management system with WhatsApp integration. Built with React, Express.js, and MongoDB for Vignan University and Narasarapet Region.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;

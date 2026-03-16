import React, { useEffect, useState } from 'react';
import { FaCheck, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

function TaskAcknowledgement() {
  // Extract taskId and token from URL: /acknowledge/taskId/token
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const taskId = pathParts[1];
  const token = pathParts[2];
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTaskDetails();
  }, [token]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const apiBaseURL = (typeof window !== 'undefined') && (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
        ? 'https://tasktracker-4xm2.onrender.com/api'
        : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
      
      const response = await fetch(`${apiBaseURL}/tasks/acknowledge/${token}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Invalid or expired acknowledgement link. Please ask for a new link from the admin.');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to load task details');
        }
        return;
      }

      const data = await response.json();
      setTask(data);
      setError('');
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Failed to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setCompleting(true);
      setMessage('');

      const apiBaseURL = (typeof window !== 'undefined') && (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
        ? 'https://tasktracker-4xm2.onrender.com/api'
        : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

      const response = await fetch(`${apiBaseURL}/tasks/acknowledge/${token}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to mark task as complete');
        return;
      }

      const data = await response.json();
      setCompleted(true);
      setMessage('✅ Task marked as complete! Thank you for confirming.');
      setTask(data.task);
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FaArrowLeft /> Go Back
          </a>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">No task information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Acknowledgement</h1>
          <p className="text-gray-600">Confirm task completion with one click</p>
        </div>

        {/* Task Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${task.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}>
            <p className="text-white font-semibold text-lg">
              Status: {task.status}
            </p>
          </div>

          {/* Task Details */}
          <div className="p-8">
            {/* Priority Badge */}
            <div className="mb-4 inline-block">
              <span className={`px-4 py-2 rounded-full text-white font-semibold text-sm ${
                task.priority === 'High' ? 'bg-red-500' :
                task.priority === 'Medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                🎯 {task.priority} Priority
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{task.title}</h2>

            {/* Description */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Sector</p>
                <p className="text-lg text-gray-800 font-semibold">{task.sector}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Due Date</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {new Date(task.dueDate).toLocaleDateString('en-IN', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              {task.assignedToContact && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Assigned To</p>
                  <p className="text-lg text-gray-800 font-semibold">{task.assignedToContact}</p>
                </div>
              )}
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</p>
                <p className="text-lg text-gray-800 font-semibold">{task.category || 'N/A'}</p>
              </div>
            </div>

            {/* Photo if available */}
            {task.photo && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Attached Photo</p>
                <img 
                  src={task.photo} 
                  alt="Task" 
                  className="w-full max-h-80 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-green-700 font-semibold text-lg">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {task.status === 'Completed' ? (
                <button
                  disabled
                  className="flex-1 px-6 py-4 bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                >
                  <FaCheck /> Already Completed
                </button>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
                >
                  <FaCheck />
                  {completing ? 'Processing...' : 'Mark Task Complete'}
                </button>
              )}
            </div>

            {/* Info */}
            <p className="text-center text-sm text-gray-500 mt-6">
              This link will expire in 30 days. After clicking "Mark Task Complete", the task status will be updated in the admin portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAcknowledgement;

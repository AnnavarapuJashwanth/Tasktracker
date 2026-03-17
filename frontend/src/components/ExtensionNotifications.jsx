import React, { useEffect, useState } from 'react';
import { FaBell, FaCheck, FaTimes, FaEdit, FaPhone } from 'react-icons/fa';

function ExtensionNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchExtensionRequests();
    // Refresh every 10 seconds
    const interval = setInterval(fetchExtensionRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchExtensionRequests = async () => {
    try {
      const adminPin = localStorage.getItem('adminPin') || '1234';
      const response = await fetch('http://localhost:5000/api/tasks/extension-requests/all', {
        headers: {
          'admin-pin': adminPin,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const handleApprove = async (taskId, requestIndex) => {
    try {
      const adminPin = localStorage.getItem('adminPin') || '1234';
      const response = await fetch(`http://localhost:5000/api/tasks/extension-requests/${taskId}/approve`, {
        method: 'POST',
        headers: {
          'admin-pin': adminPin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestIndex }),
      });

      if (response.ok) {
        fetchExtensionRequests();
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error approving extension:', err);
    }
  };

  const handleReject = async (taskId, requestIndex) => {
    try {
      const adminPin = localStorage.getItem('adminPin') || '1234';
      const response = await fetch(`http://localhost:5000/api/tasks/extension-requests/${taskId}/reject`, {
        method: 'POST',
        headers: {
          'admin-pin': adminPin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestIndex }),
      });

      if (response.ok) {
        fetchExtensionRequests();
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error rejecting extension:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaBell className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Extension Requests</h2>
        </div>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <FaBell className="text-2xl text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Extension Requests 
          {notifications.length > 0 && (
            <span className="ml-2 inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {notifications.length}
            </span>
          )}
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pending extension requests</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <div
              key={`${notif._id}-${idx}`}
              className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(notif)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{notif.taskTitle}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    <FaPhone className="inline mr-1" />
                    {notif.assignedToContact} ({notif.assignedToPhone})
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Request:</strong> {notif.message.substring(0, 50)}...
                  </p>
                  <p className="text-xs text-orange-700 font-semibold mt-2">
                    Current Due: {new Date(notif.currentDueDate).toLocaleDateString('en-IN')}
                    {notif.requestedDeadlineExtension && (
                      <>
                        {' → '}
                        Proposed: {new Date(notif.requestedDeadlineExtension).toLocaleDateString('en-IN')}
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(notif);
                  }}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded font-semibold"
                >
                  <FaEdit className="inline mr-1" /> Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for detailed view */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">{selectedTask.taskTitle}</h2>
              <p className="text-gray-600 mt-1">{selectedTask.taskDescription}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Requester Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Requester Information</h3>
                <p className="text-gray-700">
                  <strong>Name:</strong> {selectedTask.assignedToContact}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {selectedTask.assignedToPhone}
                </p>
              </div>

              {/* Request Message */}
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Extension Message</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.message}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Requested: {new Date(selectedTask.requestedAt).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Task Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase">Current Due Date</p>
                  <p className="text-lg text-gray-800 font-semibold">
                    {new Date(selectedTask.currentDueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase">Proposed Date</p>
                  <p className="text-lg text-gray-800 font-semibold">
                    {selectedTask.requestedDeadlineExtension
                      ? new Date(selectedTask.requestedDeadlineExtension).toLocaleDateString('en-IN')
                      : 'Not specified'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase">Priority</p>
                  <p className="text-lg text-gray-800 font-semibold">{selectedTask.priority}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase">Category</p>
                  <p className="text-lg text-gray-800 font-semibold">{selectedTask.category}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleApprove(selectedTask._id, 0)}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FaCheck /> Approve Extension
                </button>
                <button
                  onClick={() => handleReject(selectedTask._id, 0)}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FaTimes /> Reject Request
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-4 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExtensionNotifications;

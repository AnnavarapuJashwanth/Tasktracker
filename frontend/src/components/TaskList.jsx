import React from 'react';
import { FaPlayCircle, FaCheckCircle, FaWhatsapp, FaTrash, FaClock, FaCheckDouble } from 'react-icons/fa';

function TaskList({ tasks, onStart, onComplete, onAssign, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-900 border-green-300';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="text-amber-600" />;
      case 'In Progress':
        return <FaPlayCircle className="text-blue-600" />;
      case 'Completed':
        return <FaCheckDouble className="text-green-600" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border border-amber-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-l-8"
          style={{
            borderLeftColor: task.status === 'Pending' ? '#f59e0b' : task.status === 'In Progress' ? '#3b82f6' : '#10b981'
          }}
        >
          {/* Header with Status and Priority */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(task.status)}
                <h4 className="font-bold text-xl text-gray-900">{task.title}</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border-2 ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Task Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-200">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Sector</p>
              <p className="text-sm font-bold text-gray-800">📍 {task.sector}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Category</p>
              <p className="text-sm font-bold text-gray-800">📂 {task.category || 'General'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Due Date</p>
              <p className="text-sm font-bold text-gray-800">📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Assigned</p>
              <p className="text-sm font-bold text-gray-800">👤 {task.assigned || 'Unassigned'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {task.status === 'Pending' && (
              <button
                onClick={() => onStart(task._id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <FaPlayCircle /> Start
              </button>
            )}
            {task.status === 'In Progress' && (
              <button
                onClick={() => onComplete(task._id)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <FaCheckCircle /> Complete
              </button>
            )}
            {!task.status === 'Pending' && !task.status === 'In Progress' && (
              <div></div>
            )}
            <button
              onClick={() => onAssign(task._id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <FaWhatsapp /> Assign
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
      
      {tasks.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <FaClock className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-semibold">No tasks to display</p>
          <p className="text-gray-400 text-sm mt-2">Create a new task to get started</p>
        </div>
      )}
    </div>
  );
}

export default TaskList;

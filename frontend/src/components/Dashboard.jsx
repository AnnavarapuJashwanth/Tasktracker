import React, { useEffect, useState } from 'react';
import { FaClipboard, FaClock, FaCheckCircle, FaExclamation, FaChartLine, FaArrowUp, FaCalendar } from 'react-icons/fa';
import { tasksAPI } from '../api';

function Dashboard({ adminPin }) {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStats();
    }, 100);
    
    const interval = setInterval(loadStats, 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [adminPin]);

  const loadStats = async () => {
    try {
      const pin = localStorage.getItem('adminPin');
      if (!pin) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }

      const response = await tasksAPI.getStats();
      setStats(response.data);
      
      // Fetch today's tasks
      const allTasks = await tasksAPI.getAllTasks();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTasksList = allTasks.data
        .filter(task => {
          const taskDate = new Date(task.createdAt);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10); // Show last 10 tasks from today
      
      setTodayTasks(todayTasksList);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Stats error:', err);
      setError('Failed to load statistics. Please try again.');
      setLoading(false);
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-lg">Real-time statistics and task management insights</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-900 font-semibold">{error}</p>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Tasks Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-t-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-4 rounded-xl">
              <FaClipboard className="text-blue-600 text-2xl" />
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <FaArrowUp className="text-xs" /> +12%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Total Tasks</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-gray-500 text-xs mt-3">This month's tasks</p>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-t-4 border-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-4 rounded-xl">
              <FaExclamation className="text-amber-600 text-2xl" />
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <FaArrowUp className="text-xs" /> +5%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Pending</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.pending}</p>
          <p className="text-gray-500 text-xs mt-3">Awaiting action</p>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-t-4 border-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-100 p-4 rounded-xl">
              <FaClock className="text-purple-600 text-2xl" />
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <FaArrowUp className="text-xs" /> -2%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">In Progress</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.inProgress}</p>
          <p className="text-gray-500 text-xs mt-3">Currently active</p>
        </div>

        {/* Completed Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-t-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-100 p-4 rounded-xl">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <FaArrowUp className="text-xs" /> +18%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">Completed</h3>
          <p className="text-4xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-gray-500 text-xs mt-3">Successfully finished</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Completion Overview - Left */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Task Overview</h2>
            <FaChartLine className="text-blue-600 text-2xl" />
          </div>

          {/* Progress Bars */}
          <div className="space-y-6">
            {/* Pending Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">Pending Tasks</span>
                <span className="text-amber-600 font-bold">{stats.pending}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">In Progress</span>
                <span className="text-purple-600 font-bold">{stats.inProgress}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">Completed</span>
                <span className="text-green-600 font-bold">{stats.completed}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-sm uppercase font-semibold mb-2">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm uppercase font-semibold mb-2">Avg. Per Day</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total > 0 ? Math.ceil(stats.total / 30) : 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm uppercase font-semibold mb-2">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Right */}
        <div className="space-y-6">
          {/* Total Categories */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Total Sectors</p>
                <p className="text-3xl font-bold text-blue-900">2</p>
              </div>
              <FaClipboard className="text-blue-600 text-4xl opacity-20" />
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-green-900">{completionRate}%</p>
              </div>
              <FaCheckCircle className="text-green-600 text-4xl opacity-20" />
            </div>
          </div>

          {/* Active Tasks */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-purple-900">{stats.inProgress}</p>
              </div>
              <FaClock className="text-purple-600 text-4xl opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaCalendar className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            {todayTasks.length} tasks
          </span>
        </div>

        {todayTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-md text-center">
            <p className="text-gray-500 text-lg">No tasks created today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {todayTasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 ${
                  task.status === 'Completed'
                    ? 'border-l-green-500 bg-green-50'
                    : task.status === 'In Progress'
                    ? 'border-l-blue-500 bg-blue-50'
                    : 'border-l-amber-500 bg-amber-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      {/* Status Badge */}
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          task.status === 'Completed'
                            ? 'bg-green-200 text-green-900'
                            : task.status === 'In Progress'
                            ? 'bg-blue-200 text-blue-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        ● {task.status}
                      </span>

                      {/* Priority */}
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          task.priority === 'High'
                            ? 'bg-red-200 text-red-900'
                            : task.priority === 'Medium'
                            ? 'bg-orange-200 text-orange-900'
                            : 'bg-green-200 text-green-900'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {/* Category */}
                      <span className="text-xs font-bold px-3 py-1 bg-purple-200 text-purple-900 rounded-full">
                        {task.category}
                      </span>

                      {/* Sector */}
                      <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-900 rounded-full">
                        {task.sector}
                      </span>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-600 font-semibold">
                      <span>📅 {new Date(task.dueDate).toLocaleDateString('en-IN')}</span>
                      <span>🕐 Created: {new Date(task.createdAt).toLocaleTimeString('en-IN')}</span>
                      {task.assignedToContact && (
                        <span>👤 {task.assignedToContact}</span>
                      )}
                      {task.referenceNumber && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">📌 {task.referenceNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Status Indicator */}
                  <div className="ml-4">
                    {task.status === 'Completed' && (
                      <div className="flex flex-col items-center gap-1">
                        <FaCheckCircle className="text-green-600 text-2xl" />
                        <span className="text-xs text-green-700 font-bold">Done</span>
                      </div>
                    )}
                    {task.status === 'In Progress' && (
                      <div className="flex flex-col items-center gap-1">
                        <FaClock className="text-blue-600 text-2xl animate-spin" />
                        <span className="text-xs text-blue-700 font-bold">Running</span>
                      </div>
                    )}
                    {task.status === 'Pending' && (
                      <div className="flex flex-col items-center gap-1">
                        <FaExclamation className="text-amber-600 text-2xl" />
                        <span className="text-xs text-amber-700 font-bold">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

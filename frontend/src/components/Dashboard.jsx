import React, { useEffect, useState } from 'react';
import { FaClipboard, FaClock, FaCheckCircle, FaExclamation, FaChartLine, FaArrowUp, FaCalendar, FaUser } from 'react-icons/fa';
import { tasksAPI, contactsAPI } from '../api';

function Dashboard({ adminPin, onNavigateToTasks }) {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const [assigneeStats, setAssigneeStats] = useState([]); // New state for assignee data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainCard, setMainCard] = useState('total'); // 'total', 'pending', 'inProgress', 'completed'

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStats();
    }, 100);
    
    // Load stats once on mount only - no auto-refresh to prevent excessive reloading
    return () => {
      clearTimeout(timer);
    };
  }, [adminPin]);

  const loadStats = async () => {
    try {
      // Use the passed adminPin prop instead of checking localStorage
      const pin = adminPin || localStorage.getItem('adminPin');
      if (!pin) {
        console.warn('No PIN found, may not be authenticated');
        setLoading(false);
        return;
      }

      const response = await tasksAPI.getStats();
      setStats(response.data);
      
      // Fetch all contacts for phone number lookup
      let contactsMap = new Map();
      try {
        const contactsResponse = await contactsAPI.getAllContacts();
        if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
          contactsResponse.data.forEach(contact => {
            // Store both exact name match and lowercase match
            contactsMap.set(contact.name, contact.phone);
            contactsMap.set(contact.name.toLowerCase(), contact.phone);
          });
        }
      } catch (contactErr) {
        console.warn('Could not fetch contacts:', contactErr.message);
      }
      
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

      // GROUP TASKS BY ASSIGNEE
      const assigneeMap = new Map();
      allTasks.data.forEach(task => {
        // Use assignedToContact since that's what gets set during task creation
        const assigneeName = task.assignedToContact || task.assignedTo;
        
        if (assigneeName) {
          if (!assigneeMap.has(assigneeName)) {
            // Try to get phone number from multiple sources
            let phone = task.assignedToPhone || task.referencePhone;
            
            // If no phone, try to extract from assignedToContact (format: "Name (+91...)")
            if (!phone && task.assignedToContact) {
              const phoneMatch = task.assignedToContact.match(/\(\+[\d\s\-]+\)/);
              if (phoneMatch) {
                phone = phoneMatch[0].replace(/[^\d+]/g, '');
              }
            }
            
            // If still no phone, look up from contacts database
            if (!phone) {
              const contactPhone = contactsMap.get(assigneeName) || contactsMap.get(assigneeName.toLowerCase());
              if (contactPhone) {
                phone = contactPhone;
              }
            }
            
            assigneeMap.set(assigneeName, {
              name: assigneeName,
              phone: phone || 'N/A',
              sector: task.sector || 'N/A',
              total: 0,
              pending: 0,
              inProgress: 0,
              completed: 0,
            });
          }
          const assignee = assigneeMap.get(assigneeName);
          assignee.total += 1;
          if (task.status === 'Pending') assignee.pending += 1;
          else if (task.status === 'In Progress') assignee.inProgress += 1;
          else if (task.status === 'Completed') assignee.completed += 1;
        }
      });

      // Convert map to array and sort by total tasks (descending)
      const assigneeArray = Array.from(assigneeMap.values())
        .sort((a, b) => b.total - a.total);
      
      setAssigneeStats(assigneeArray);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Stats error:', err);
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Not authenticated. Please login again.');
      } else {
        setError('Failed to load statistics. Please try again.');
      }
      setLoading(false);
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleAssigneeClick = (assigneeName) => {
    // Navigate to Tasks with assignee filter
    if (onNavigateToTasks) {
      onNavigateToTasks(assigneeName);
    }
  };

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

      {/* Statistics Grid - 2 Column Layout: Main Card (Left) + 3 Vertical Cards (Right) */}
      <div className="w-full mb-10 grid grid-cols-4 gap-4 auto-rows-max">
        
        {/* Left Column - Main Large Card (spans 2.5 columns) */}
        <div className="col-span-2 row-span-3">
          <div className="rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-t-4 h-full flex flex-col justify-between"
            style={{
              background: mainCard === 'total' ? 'linear-gradient(to right, #dbeafe, #dbeafe)' : 
                         mainCard === 'pending' ? 'linear-gradient(to right, #fef3c7, #fef3c7)' :
                         mainCard === 'inProgress' ? 'linear-gradient(to right, #ede9fe, #f3e8ff)' :
                         'linear-gradient(to right, #dcfce7, #f0fdf4)',
              borderColor: mainCard === 'total' ? '#3b82f6' : 
                          mainCard === 'pending' ? '#f59e0b' :
                          mainCard === 'inProgress' ? '#a855f7' :
                          '#22c55e'
            }}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-5 rounded-xl shadow-lg flex items-center justify-center w-20 h-20`}
                style={{
                  background: mainCard === 'total' ? '#2563eb' : 
                             mainCard === 'pending' ? '#d97706' :
                             mainCard === 'inProgress' ? '#a855f7' :
                             '#16a34a'
                }}>
                {mainCard === 'total' && <FaClipboard className="text-white text-4xl" />}
                {mainCard === 'pending' && <FaExclamation className="text-white text-4xl" />}
                {mainCard === 'inProgress' && <FaClock className="text-white text-4xl" />}
                {mainCard === 'completed' && <FaCheckCircle className="text-white text-4xl" />}
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <FaArrowUp className="text-xs" /> +12%
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
                {mainCard === 'total' && 'Total Tasks'}
                {mainCard === 'pending' && 'Pending Tasks'}
                {mainCard === 'inProgress' && 'In Progress'}
                {mainCard === 'completed' && 'Completed'}
              </h3>
              <p className="text-6xl font-bold text-gray-900 mb-3">
                {mainCard === 'total' && stats.total}
                {mainCard === 'pending' && stats.pending}
                {mainCard === 'inProgress' && stats.inProgress}
                {mainCard === 'completed' && stats.completed}
              </p>
              <p className="text-gray-600 text-sm">
                {mainCard === 'total' && "This month's tasks"}
                {mainCard === 'pending' && 'Awaiting action'}
                {mainCard === 'inProgress' && 'Currently active'}
                {mainCard === 'completed' && 'Successfully finished'}
              </p>
            </div>
            <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg border-l-4"
              style={{
                borderColor: mainCard === 'total' ? '#3b82f6' : 
                            mainCard === 'pending' ? '#f59e0b' :
                            mainCard === 'inProgress' ? '#a855f7' :
                            '#22c55e'
              }}>
              <p className="text-xs font-semibold text-gray-800">
                📊 Click a card on the right to view
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - 3 Vertical Cards */}
        
        {/* Pending Card */}
        {mainCard !== 'pending' && (
          <div 
            onClick={() => setMainCard('pending')}
            className="col-span-2 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 border-amber-500 cursor-pointer transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(to right, #fef3c7, #fef3c7)'
            }}>
            <div className="flex justify-between items-start mb-3">
              <div className="bg-amber-600 p-3 rounded-lg shadow-lg">
                <FaExclamation className="text-white text-xl" />
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">+5%</span>
            </div>
            <h3 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Pending</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        )}

        {/* In Progress Card */}
        {mainCard !== 'inProgress' && (
          <div 
            onClick={() => setMainCard('inProgress')}
            className="col-span-2 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 border-purple-500 cursor-pointer transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(to right, #ede9fe, #f3e8ff)'
            }}>
            <div className="flex justify-between items-start mb-3">
              <div className="bg-purple-600 p-3 rounded-lg shadow-lg">
                <FaClock className="text-white text-xl" />
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">-2%</span>
            </div>
            <h3 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">In Progress</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
          </div>
        )}

        {/* Completed Card */}
        {mainCard !== 'completed' && (
          <div 
            onClick={() => setMainCard('completed')}
            className="col-span-2 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 border-green-500 cursor-pointer transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(to right, #dcfce7, #f0fdf4)'
            }}>
            <div className="flex justify-between items-start mb-3">
              <div className="bg-green-600 p-3 rounded-lg shadow-lg">
                <FaCheckCircle className="text-white text-xl" />
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">+18%</span>
            </div>
            <h3 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Completed</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        )}

        {/* Total Card */}
        {mainCard !== 'total' && (
          <div 
            onClick={() => setMainCard('total')}
            className="col-span-2 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500 cursor-pointer transform hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(to right, #dbeafe, #dbeafe)'
            }}>
            <div className="flex justify-between items-start mb-3">
              <div className="bg-blue-600 p-3 rounded-lg shadow-lg">
                <FaClipboard className="text-white text-xl" />
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <h3 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">Total</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        )}

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

      {/* Works by Assignee Section */}
      <div className="mt-12 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaUser className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Works by Assignee</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            {assigneeStats.length} assignees
          </span>
        </div>

        {assigneeStats.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-md text-center">
            <p className="text-gray-500 text-lg">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assigneeStats.map((assignee) => (
              <div
                key={assignee.name}
                onClick={() => handleAssigneeClick(assignee.name)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between">
                  {/* Left: Assignee Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
                      {assignee.name.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Name and Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{assignee.name}</h3>
                      
                      {/* Phone - Clean Display */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-400">📱</span>
                        <p className="text-sm font-semibold text-gray-700">{assignee.phone}</p>
                      </div>
                      
                      {/* Sector - Clean Display */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400">🏢</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">{assignee.sector}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Task Counts */}
                  <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                    {/* Total */}
                    <div className="text-center">
                      <p className="text-4xl font-bold text-blue-600">{assignee.total}</p>
                      <p className="text-gray-600 text-xs uppercase font-semibold">Total</p>
                    </div>

                    {/* Status Breakdown - Clean Cards */}
                    <div className="flex gap-2">
                      {/* Pending */}
                      {assignee.pending > 0 && (
                        <div className="text-center border border-amber-200 rounded-lg px-2 py-1 bg-amber-50">
                          <p className="text-lg font-bold text-amber-600">{assignee.pending}</p>
                          <p className="text-amber-700 text-xs font-semibold">Pending</p>
                        </div>
                      )}

                      {/* In Progress */}
                      {assignee.inProgress > 0 && (
                        <div className="text-center border border-blue-200 rounded-lg px-2 py-1 bg-blue-50">
                          <p className="text-lg font-bold text-blue-600">{assignee.inProgress}</p>
                          <p className="text-blue-700 text-xs font-semibold">In Prog</p>
                        </div>
                      )}

                      {/* Completed */}
                      {assignee.completed > 0 && (
                        <div className="text-center border border-green-200 rounded-lg px-2 py-1 bg-green-50">
                          <p className="text-lg font-bold text-green-600">{assignee.completed}</p>
                          <p className="text-green-700 text-xs font-semibold">Done</p>
                        </div>
                      )}
                    </div>
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

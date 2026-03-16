import axios from 'axios';

// Get the correct API URL based on environment
function getAPIBaseURL() {
  // Check if we're in production (Netlify deployment)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1';
    
    if (isProduction) {
      // Production - use Render backend
      return 'https://tasktracker-4xm2.onrender.com/api';
    }
  }
  
  // Local development - use localhost or environment variable
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
}

const API_BASE_URL = getAPIBaseURL();

console.log('Environment:', window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('API Base URL:', API_BASE_URL);
console.log('Hostname:', window.location.hostname);

const getAuthHeader = () => {
  const pin = localStorage.getItem('adminPin');
  return {
    headers: {
      adminPin: pin,
    },
  };
};

export const authAPI = {
  login: (pin) => axios.post(`${API_BASE_URL}/auth/login`, { pin }),
};

export const tasksAPI = {
  createTask: (taskData) =>
    axios.post(`${API_BASE_URL}/tasks/create`, taskData, getAuthHeader()),
  getAllTasks: () =>
    axios.get(`${API_BASE_URL}/tasks/all`, getAuthHeader()),
  getTasksBySector: (sector) =>
    axios.get(`${API_BASE_URL}/tasks/sector/${sector}`, getAuthHeader()),
  getStats: () =>
    axios.get(`${API_BASE_URL}/tasks/stats`, getAuthHeader()),
  updateTask: (taskId, taskData) =>
    axios.put(`${API_BASE_URL}/tasks/update/${taskId}`, taskData, getAuthHeader()),
  updateTaskStatus: (taskId, statusData) =>
    axios.put(`${API_BASE_URL}/tasks/update/${taskId}`, statusData, getAuthHeader()),
  assignTask: (taskId, assignmentData) =>
    axios.put(`${API_BASE_URL}/tasks/assign/${taskId}`, assignmentData, getAuthHeader()),
  deleteTask: (taskId) =>
    axios.delete(`${API_BASE_URL}/tasks/delete/${taskId}`, getAuthHeader()),
  getTask: (taskId) =>
    axios.get(`${API_BASE_URL}/tasks/${taskId}`, getAuthHeader()),
};

export const whatsappAPI = {
  sendAssignment: (taskId, recipientPhone) =>
    axios.post(
      `${API_BASE_URL}/whatsapp/send-assignment`,
      { taskId, recipientPhone },
      getAuthHeader()
    ),
  getStatus: () =>
    axios.get(`${API_BASE_URL}/whatsapp/status`, getAuthHeader()),
};

export const contactsAPI = {
  getAllContacts: () =>
    axios.get(`${API_BASE_URL}/contacts/all`, getAuthHeader()),
  getContact: (contactId) =>
    axios.get(`${API_BASE_URL}/contacts/${contactId}`, getAuthHeader()),
  createContact: (contactData) =>
    axios.post(`${API_BASE_URL}/contacts/create`, contactData, getAuthHeader()),
  updateContact: (contactId, contactData) =>
    axios.put(`${API_BASE_URL}/contacts/update/${contactId}`, contactData, getAuthHeader()),
  deleteContact: (contactId) =>
    axios.delete(`${API_BASE_URL}/contacts/delete/${contactId}`, getAuthHeader()),
  searchContacts: (query) =>
    axios.get(`${API_BASE_URL}/contacts/search/${query}`, getAuthHeader()),
};

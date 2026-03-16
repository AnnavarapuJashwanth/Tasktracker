import axios from 'axios';

// Determine API URL based on environment
let API_BASE_URL;

// Check if we're in production (Netlify deployment)
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

if (isProduction) {
  // Production - use Render backend
  API_BASE_URL = 'https://tasktracker-4xm2.onrender.com/api';
} else {
  // Local development - use localhost
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
}

console.log('Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
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

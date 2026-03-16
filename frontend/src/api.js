import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

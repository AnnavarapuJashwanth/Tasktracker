import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTimes, FaImage, FaUser, FaPhone } from 'react-icons/fa';
import { contactsAPI, settingsAPI } from '../api';

function TaskForm({ onSubmit, onCancel, editingTask }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Request',
    sector: '',
    dueDate: '',
    referenceNumber: '',
    assignedToContactId: '',
    assignedToContact: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    loadSectors();
    if (editingTask) {
      // Format the date properly for the input field (yyyy-MM-dd format)
      let formattedDate = editingTask.dueDate;
      if (editingTask.dueDate) {
        if (editingTask.dueDate.includes('T')) {
          // Convert ISO format to yyyy-MM-dd
          formattedDate = editingTask.dueDate.split('T')[0];
        }
      }
      setFormData({
        ...editingTask,
        dueDate: formattedDate,
        photo: null,
      });
      setPhotoPreview(editingTask.photo || null);
    }
    loadContacts();
  }, [editingTask]);

  const loadSectors = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.data && response.data.sectors) {
        setSectors(response.data.sectors);
        if (!editingTask && response.data.sectors.length > 0) {
          setFormData(prev => ({ ...prev, sector: response.data.sectors[0] }));
        }
      }
    } catch (err) {
      console.error('Failed to load sectors', err);
    }
  };

  const loadContacts = async () => {
    setLoadingContacts(true);
    try {
      const response = await contactsAPI.getAllContacts();
      setContacts(response.data.filter((c) => c.status === 'active'));
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleContactChange = (e) => {
    const contactId = e.target.value;
    const selectedContact = contacts.find((c) => c._id === contactId);
    
    setFormData((prev) => ({
      ...prev,
      assignedToContactId: contactId,
      assignedToContact: selectedContact ? selectedContact.name : '',
      referencePhone: selectedContact ? selectedContact.phone : '', // Capture phone from contact
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store file
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.referenceNumber.trim()) newErrors.referenceNumber = 'Citizen WhatsApp phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Request',
        sector: sectors.length > 0 ? sectors[0] : '',
        dueDate: '',
        referencePhone: '',
        referenceNumber: '',
        assignedToContactId: '',
        assignedToContact: '',
        photo: null,
      });
      setPhotoPreview(null);
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-600">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            {editingTask ? <FaEdit className="text-2xl" /> : <FaPlus className="text-2xl" />}
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">
              {editingTask ? 'Update Task' : 'Create New Task'}
            </h3>
            <p className="text-gray-600 text-sm">
              {editingTask ? 'Modify task details' : 'Define a new task for your team'}
            </p>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-700 uppercase mb-2">
            Task Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Fix website bug, Organize meeting"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800"
          />
          {errors.title && <span className="text-red-600 text-sm font-semibold mt-1 block">⚠️ {errors.title}</span>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-700 uppercase mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about the task..."
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800 resize-vertical"
          />
          {errors.description && <span className="text-red-600 text-sm font-semibold mt-1 block">⚠️ {errors.description}</span>}
        </div>

        {/* Photo Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="photo" className="block text-sm font-bold text-gray-700 uppercase mb-2">
              <FaImage className="inline mr-2" />
              Task Photo (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <FaImage className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Click to upload photo</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </label>
            </div>
            {photoPreview && (
              <div className="mt-3 relative">
                <img src={photoPreview} alt="Preview" className="max-h-32 rounded-lg border border-gray-300" />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Assign to Contact */}
          <div>
            <label htmlFor="assignedToContactId" className="block text-sm font-bold text-gray-700 uppercase mb-2">
              <FaUser className="inline mr-2" />
              Assign To Contact
            </label>
            <select
              id="assignedToContactId"
              name="assignedToContactId"
              value={formData.assignedToContactId}
              onChange={handleContactChange}
              disabled={loadingContacts}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800 cursor-pointer disabled:bg-gray-100"
            >
              <option value="">
                {loadingContacts ? 'Loading contacts...' : 'Select a contact'}
              </option>
              {contacts.map((contact) => (
                <option key={contact._id} value={contact._id}>
                  {contact.name} ({contact.phone})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priority" className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Priority <span className="text-red-600">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800 cursor-pointer"
            >
              <option value="Low">🟢 Low - Non-urgent</option>
              <option value="Medium">🟡 Medium - Standard</option>
              <option value="High">🔴 High - Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800 cursor-pointer"
            >
              <option value="Request">📋 Request</option>
              <option value="Meeting">📞 Meeting</option>
              <option value="Appointment">📅 Appointment</option>
              <option value="Other">📝 Other</option>
            </select>
          </div>
        </div>

        {/* Sector & Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="sector" className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Sector <span className="text-red-600">*</span>
            </label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800 cursor-pointer"
            >
              <option value="">Select Sector</option>
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-bold text-gray-700 uppercase mb-2">
              Due Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800"
            />
            {errors.dueDate && <span className="text-red-600 text-sm font-semibold mt-1 block">⚠️ {errors.dueDate}</span>}
          </div>
        </div>

        {/* Citizen WhatsApp Phone - For Notifications */}
        <div>
          <label htmlFor="referenceNumber" className="block text-sm font-bold text-gray-700 uppercase mb-2">
            <FaPhone className="inline mr-2" />
            Citizen WhatsApp Phone <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="referenceNumber"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            placeholder="e.g., +919876543210"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-800"
          />
          {errors.referenceNumber && <span className="text-red-600 text-sm font-semibold mt-1 block">⚠️ {errors.referenceNumber}</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {editingTask ? <FaEdit /> : <FaPlus />}
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;

import React, { useState, useEffect } from 'react';
import { FaPhone, FaPlus, FaTrash, FaEdit, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { contactsAPI } from '../api';

// Sector/Department options
const SECTORS = [
  { id: 'vignan-university', label: 'Vignan University' },
  { id: 'narasaraopet', label: 'Narasaraopet Region' },
  { id: 'other', label: 'Other' },
];

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('all'); // 'all' or sector id
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '', // This will hold the sector
    email: '',
    status: 'active',
    notes: '',
  });
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsAPI.getAllContacts();
      setContacts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone is required');
      return false;
    }
    return true;
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingContact) {
        await contactsAPI.updateContact(editingContact._id, formData);
        setSuccessMessage('Contact updated successfully');
      } else {
        await contactsAPI.createContact(formData);
        setSuccessMessage('Contact created successfully');
      }
      setFormData({ name: '', phone: '', department: '', email: '', status: 'active', notes: '' });
      setEditingContact(null);
      setShowForm(false);
      setError('');
      loadContacts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      department: contact.department || '',
      email: contact.email || '',
      status: contact.status,
      notes: contact.notes || '',
    });
    setShowForm(true);
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Delete this contact?')) {
      try {
        await contactsAPI.deleteContact(id);
        setSuccessMessage('Contact deleted successfully');
        loadContacts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete contact');
      }
    }
  };

  const handleWhatsAppClick = (contact) => {
    setSelectedContact(contact);
    setWhatsappMessage('Hello');
    setShowWhatsAppModal(true);
  };

  const handleSendWhatsApp = () => {
    if (selectedContact && whatsappMessage) {
      const url = `https://wa.me/${selectedContact.phone}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(url, '_blank');
      setShowWhatsAppModal(false);
      setSelectedContact(null);
      setSuccessMessage('✓ WhatsApp opened!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();
  const getAvatarColor = (name) => {
    const colors = ['bg-red-500', 'bg-blue-600', 'bg-purple-500', 'bg-pink-600', 'bg-green-600', 'bg-orange-500'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  // Get sector label from id
  const getSectorLabel = (sectorId) => {
    return SECTORS.find(s => s.id === sectorId)?.label || sectorId || '-';
  };

  // Filter contacts by selected sector
  const filteredContacts = selectedSectorFilter === 'all' 
    ? contacts 
    : contacts.filter(c => c.department === selectedSectorFilter);

  const closeForm = () => {
    setShowForm(false);
    setEditingContact(null);
    setFormData({ name: '', phone: '', department: '', email: '', status: 'active', notes: '' });
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">Employee Directory</h1>
          <p className="text-gray-600 text-sm md:text-lg">Manage contacts for WhatsApp assignments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
          <FaPlus /> Add Contact
        </button>
      </div>

      {error && <div className="bg-red-100 border-l-4 border-red-600 p-3 md:p-4 mb-4 md:mb-6 rounded"><p className="text-red-900 font-semibold text-sm md:text-base">{error}</p></div>}
      {successMessage && <div className="bg-green-100 border-l-4 border-green-600 p-3 md:p-4 mb-4 md:mb-6 rounded"><p className="text-green-900 font-semibold text-sm md:text-base">{successMessage}</p></div>}

      {/* Sector Filter */}
      <div className="mb-6 md:mb-8 bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-purple-600">
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 md:mb-3">Filter by Sector</label>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <button
            onClick={() => setSelectedSectorFilter('all')}
            className={`flex-1 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors ${
              selectedSectorFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sectors
          </button>
          {SECTORS.map(sector => (
            <button
              key={sector.id}
              onClick={() => setSelectedSectorFilter(sector.id)}
              className={`flex-1 px-3 md:px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-colors ${
                selectedSectorFilter === sector.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sector.label} ({contacts.filter(c => c.department === sector.id).length})
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="mb-6 md:mb-8 bg-white rounded-lg shadow-lg p-4 md:p-8 border-t-4 border-blue-600 overflow-x-hidden">
          <form onSubmit={handleSaveContact} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none text-sm md:text-base" placeholder="Name" required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none text-sm md:text-base" placeholder="+919876543210" required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Sector *</label>
                <select name="department" value={formData.department} onChange={handleFormChange} className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none text-sm md:text-base" required>
                  <option value="">Select Sector</option>
                  {SECTORS.map(sector => (
                    <option key={sector.id} value={sector.id}>{sector.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none text-sm md:text-base" placeholder="Email" />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none text-sm md:text-base">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Notes</label>
                <input type="text" name="notes" value={formData.notes} onChange={handleFormChange} className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none text-sm md:text-base" placeholder="Notes" />
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button type="submit" className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm md:text-base">{editingContact ? 'Update' : 'Add'}</button>
              <button type="button" onClick={closeForm} className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors text-sm md:text-base">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-blue-600">
          <p className="text-gray-600 text-xs md:text-sm font-bold uppercase mb-2">Total Staff</p>
          <p className="text-3xl md:text-4xl font-bold text-blue-600">{filteredContacts.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-green-600">
          <p className="text-gray-600 text-xs md:text-sm font-bold uppercase mb-2">Active</p>
          <p className="text-3xl md:text-4xl font-bold text-green-600">{filteredContacts.filter((c) => c.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-md border-l-4 border-amber-600">
          <p className="text-gray-600 text-xs md:text-sm font-bold uppercase mb-2">Inactive</p>
          <p className="text-3xl md:text-4xl font-bold text-amber-600">{filteredContacts.filter((c) => c.status === 'inactive').length}</p>
        </div>
      </div>

      {loading ? <p className="text-center text-gray-500 py-8">Loading...</p> : filteredContacts.length === 0 ? <div className="bg-white rounded-lg p-8 md:p-12 text-center shadow-md"><p className="text-gray-500">No contacts found</p></div> : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredContacts.map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${getAvatarColor(c.name)} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm`}>{getInitials(c.name)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{getSectorLabel(c.department)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>● {c.status}</span>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{c.phone}</span>
                  </div>
                  {c.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold break-all">{c.email}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <a href={`tel:${c.phone}`} className="p-2 hover:bg-teal-100 rounded text-teal-600 text-lg" title="Call contact"><FaPhone /></a>
                  <button onClick={() => handleWhatsAppClick(c)} className="p-2 hover:bg-green-100 rounded text-green-600 text-lg" title="WhatsApp"><FaWhatsapp /></button>
                  <button onClick={() => handleEditContact(c)} className="p-2 hover:bg-blue-100 rounded text-blue-600 text-lg" title="Edit"><FaEdit /></button>
                  <button onClick={() => handleDeleteContact(c._id)} className="p-2 hover:bg-red-100 rounded text-red-600 text-lg" title="Delete"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Sector</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((c, i) => (
                  <tr key={c._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`${getAvatarColor(c.name)} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold`}>{getInitials(c.name)}</div><span className="font-semibold">{c.name}</span></div></td>
                    <td className="px-6 py-4">{c.phone}</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{getSectorLabel(c.department)}</span></td>
                    <td className="px-6 py-4">{c.email || '-'}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm font-bold ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>● {c.status}</span></td>
                    <td className="px-6 py-4"><div className="flex justify-center gap-3"><a href={`tel:${c.phone}`} className="p-2 hover:bg-teal-100 rounded text-teal-600" title="Call contact"><FaPhone /></a><button onClick={() => handleWhatsAppClick(c)} className="p-2 hover:bg-green-100 rounded text-green-600"><FaWhatsapp /></button><button onClick={() => handleEditContact(c)} className="p-2 hover:bg-blue-100 rounded text-blue-600"><FaEdit /></button><button onClick={() => handleDeleteContact(c._id)} className="p-2 hover:bg-red-100 rounded text-red-600"><FaTrash /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showWhatsAppModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 md:p-6 border-b-2 bg-green-50 sticky top-0">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2"><FaWhatsapp className="text-green-600" /> Message</h3>
              <button onClick={() => { setShowWhatsAppModal(false); setSelectedContact(null); }} className="p-2 hover:bg-gray-100 rounded"><FaTimes /></button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded"><p className="text-xs md:text-sm font-semibold break-words">{selectedContact.name} • {selectedContact.phone}</p></div>
              <textarea value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} className="w-full h-28 md:h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none resize-none text-sm md:text-base" />
              <div className="bg-gray-50 p-3 rounded"><p className="text-xs font-bold mb-2">Preview:</p><p className="text-xs md:text-sm break-words">{whatsappMessage}</p></div>
            </div>
            <div className="flex gap-2 md:gap-3 p-4 md:p-6 border-t bg-gray-50 sticky bottom-0">
              <button onClick={() => { setShowWhatsAppModal(false); setSelectedContact(null); }} className="flex-1 px-3 md:px-4 py-2 md:py-2 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded text-sm md:text-base">Cancel</button>
              <button onClick={handleSendWhatsApp} className="flex-1 px-3 md:px-4 py-2 md:py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded flex items-center justify-center gap-2 text-sm md:text-base"><FaWhatsapp /> Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;

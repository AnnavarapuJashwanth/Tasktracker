import express from 'express';
import Contact from '../models/Contact.js';
import adminAuth from '../middleware/auth.js';

const router = express.Router();

// Get all contacts
router.get('/all', adminAuth, async (req, res) => {
  try {
    console.log('Fetching all contacts...');
    console.log('Database:', Contact.collection.name);
    const contacts = await Contact.find({});
    console.log('Total documents in collection:', contacts.length);
    console.log('Contacts:', JSON.stringify(contacts, null, 2));
    const sorted = contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log('Contacts found:', sorted.length);
    res.json(sorted);
  } catch (error) {
    console.log('Error fetching contacts:', error.message);
    console.log('Error stack:', error.stack);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// Get single contact
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
});

// Create contact
router.post('/create', adminAuth, async (req, res) => {
  try {
    const { name, phone, department, email, status, notes } = req.body;

    const existingContact = await Contact.findOne({ phone });
    if (existingContact) {
      return res.status(400).json({ message: 'Contact with this phone already exists' });
    }

    const contact = new Contact({
      name,
      phone,
      department,
      email,
      status,
      notes,
    });

    await contact.save();
    res.status(201).json({ message: 'Contact created successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
});

// Update contact
router.put('/update/:id', adminAuth, async (req, res) => {
  try {
    const { name, phone, department, email, status, notes } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Check if new phone is unique (excluding current contact)
    if (phone !== contact.phone) {
      const existingContact = await Contact.findOne({ phone });
      if (existingContact) {
        return res.status(400).json({ message: 'Contact with this phone already exists' });
      }
    }

    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.department = department || contact.department;
    contact.email = email || contact.email;
    contact.status = status || contact.status;
    contact.notes = notes || contact.notes;

    await contact.save();
    res.json({ message: 'Contact updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
});

// Delete contact
router.delete('/delete/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
});

// Search contacts
router.get('/search/:query', adminAuth, async (req, res) => {
  try {
    const query = req.params.query;
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching contacts', error: error.message });
  }
});

export default router;

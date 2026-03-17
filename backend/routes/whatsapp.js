import express from 'express';
// import twilio from 'twilio';  // Uncomment when Twilio credentials are available
import Task from '../models/Task.js';
import adminAuth from '../middleware/auth.js';

const router = express.Router();

// Initialize Twilio only if credentials are available
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  // Twilio configuration for automated WhatsApp (optional)
  // const twilio = await import('twilio');
  // client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send WhatsApp message with task assignment
router.post('/send-assignment', adminAuth, async (req, res) => {
  try {
    const { taskId, recipientPhone } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // For now, we're using manual WhatsApp (wa.me links)
    // When Twilio is set up, this will send automated messages
    return res.status(200).json({
      success: true,
      message: 'Manual WhatsApp mode active. Use wa.me links to send messages.',
      method: 'manual',
      taskId: taskId,
      recipientPhone: recipientPhone,
    });

    // Future Twilio implementation:
    // if (!client) {
    //   return res.status(400).json({ message: 'WhatsApp automation not configured' });
    // }
    // const whatsappMessage = await client.messages.create({ ... });
  } catch (error) {
    console.error('WhatsApp error:', error.message);
    res.status(500).json({ message: 'Failed to send WhatsApp message', error: error.message });
  }
});

// Webhook to receive incoming messages (for future interactive features)
router.post('/webhook', (req, res) => {
  try {
    const message = req.body.Body;
    const senderPhone = req.body.From;

    console.log(`Received message from ${senderPhone}: ${message}`);

    res.status(200).send();
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send();
  }
});

// Get WhatsApp integration status
router.get('/status', adminAuth, (req, res) => {
  res.json({
    status: 'active',
    method: client ? 'twilio' : 'manual',
    provider: client ? 'Twilio' : 'wa.me links',
    webhookUrl: '/api/whatsapp/webhook',
  });
});

export default router;

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  category: {
    type: String,
    enum: ['Request', 'Meeting', 'Appointment', 'Other'],
    default: 'Other',
  },
  sector: {
    type: String,
    enum: ['Vignan University', 'Narasarapet Region'],
    required: true,
  },
  assignedTo: {
    type: String,
    default: null,
  },
  assignedToPhone: {
    type: String,
    default: null,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  referencePhone: {
    type: String,
    default: null,
  },
  referenceNumber: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  duration: {
    type: String,
    default: null,
  },
  photo: {
    type: String,
    default: null,
  },
  assignedToContact: {
    type: String,
    default: null,
  },
  assignedToContactId: {
    type: String,
    default: null,
  },
  acknowledgementToken: {
    type: String,
    default: null,
  },
  acknowledgementTokenExpiry: {
    type: Date,
    default: null,
  },
  acknowledgedAt: {
    type: Date,
    default: null,
  },
  extensionRequests: [
    {
      message: String,
      requestedBy: String, // assigned person name
      requestedPhone: String, // assigned person phone
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      requestedDeadlineExtension: Date, // proposed new due date (if any)
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      rejectionReason: {
        type: String,
        default: null, // reason why extension was rejected
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      approvalNote: {
        type: String,
        default: null, // admin notes when approving
      },
      approvedDeadline: {
        type: Date,
        default: null, // the new deadline after approval
      },
    },
  ],
  progressUpdates: [
    {
      status: {
        type: String,
        enum: ['in-progress', '50-percent', 'completed'],
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Task', taskSchema);

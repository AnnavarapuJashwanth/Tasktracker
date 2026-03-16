# Task Tracker System

A comprehensive task management system with WhatsApp integration for Vignan University and Narasarapet Region.

## Features

✅ **Admin Dashboard** - PIN-based login (1234)
✅ **Task Management** - Create, Edit, Delete tasks
✅ **Multi-Sector Support** - Vignan University & Narasarapet Region
✅ **Task Tracking** - Pending, In Progress, Completed status with duration
✅ **WhatsApp Integration** - Automated task assignment via WhatsApp
✅ **Employee Management** - Contact management and assignment
✅ **Real-time Statistics** - Dashboard with task overview
✅ **Responsive Design** - Works on desktop and mobile

## Project Structure

```
TASK-TRACKER/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── tasks.js              # Task endpoints
│   │   └── whatsapp.js           # WhatsApp integration
│   ├── package.json
│   ├── .env                       # Environment variables
│   └── server.js                  # Main server file
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskList.jsx
    │   │   ├── Contacts.jsx
    │   │   ├── Settings.jsx
    │   │   ├── *.css               # Component styles
    │   ├── App.jsx
    │   ├── api.js                  # API service
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .gitignore
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Cloud account with connection string
- Twilio account for WhatsApp integration (optional, can be added later)

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://jashwanthannavarapu99_db_user:42974297@cluster2.fytx2uj.mongodb.net/?appName=Cluster2
ADMIN_PIN=1234
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_PHONE_NUMBER=+919908939746
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with PIN

### Tasks
- `GET /api/tasks/all` - Get all tasks
- `GET /api/tasks/sector/:sector` - Get tasks by sector
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks/create` - Create new task
- `PUT /api/tasks/update/:id` - Update task status
- `PUT /api/tasks/assign/:id` - Assign task to employee
- `DELETE /api/tasks/delete/:id` - Delete task

### WhatsApp
- `POST /api/whatsapp/send-assignment` - Send task assignment via WhatsApp
- `GET /api/whatsapp/status` - Check WhatsApp integration status

## Database Schema

### Task Model
```javascript
{
  title: String,
  description: String,
  priority: 'Low' | 'Medium' | 'High',
  category: 'Request' | 'Meeting' | 'Appointment' | 'Other',
  sector: 'Vignan University' | 'Narasarapet Region',
  assignedTo: String,
  assignedToPhone: String,
  dueDate: Date,
  referencePhone: String,
  status: 'Pending' | 'In Progress' | 'Completed',
  startTime: Date,
  endTime: Date,
  duration: String,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Login
1. Open the application at `http://localhost:3000`
2. Enter PIN: **1234**
3. Click Login

### Create Task
1. Go to **Tasks** section
2. Click **Create New Task**
3. Fill in task details:
   - Title
   - Description
   - Priority (Low/Medium/High)
   - Category (Request/Meeting/Appointment/Other)
   - Sector (Vignan University/Narasarapet Region)
   - Due Date
   - Reference Phone (Optional)
4. Click **Create Task**

### Manage Tasks
- **Start Task**: Changes status from Pending to In Progress
- **Complete Task**: Changes status to Completed and shows duration
- **Assign & WhatsApp**: Assigns task and sends details via WhatsApp
- **Citizen**: Opens WhatsApp with pre-filled message
- **Delete**: Removes the task

### View Dashboard
- **Total Tasks**: All created tasks
- **Pending**: Tasks not yet started
- **In Progress**: Currently active tasks
- **Completed**: Finished tasks with duration

### Manage Contacts
1. Go to **Contacts** section
2. Click **Add Contact**
3. Fill in employee details
4. Use contacts when assigning tasks

### Settings
1. Access **Settings** section
2. Change Admin PIN (must be 4 digits)
3. Update WhatsApp configuration
4. View application information

## WhatsApp Integration

### Setup Instructions

1. **Create Twilio Account**:
   - Go to https://www.twilio.com
   - Sign up and verify your account
   - Get Account SID and Auth Token

2. **Set up WhatsApp Sandbox**:
   - Go to Twilio Console
   - Navigate to Messaging > Try it out > Send a WhatsApp message
   - Copy the Sandbox number (e.g., whatsapp:+14155238886)

3. **Update .env file**:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ADMIN_PHONE_NUMBER=+919908939746
   ```

4. **Test Integration**:
   - Send a message from your phone to the Sandbox number to join
   - Try assigning a task to verify messages are sent

## Security Notes

⚠️ **Important Security Considerations**:
- Keep your MongoDB URI and credentials secure
- Change the default PIN (1234) to a secure 4-digit code
- Do not share your Twilio credentials
- Use environment variables for all sensitive data
- Never commit `.env` file to version control
- Implement proper authentication for production

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: Latest

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
# Kill the process or use a different port
# Verify MongoDB connection string
```

### Frontend Won't Connect to Backend
```bash
# Ensure backend is running on port 5000
# Check CORS configuration
# Verify API base URL in frontend/src/api.js
```

### WhatsApp Messages Not Sending
- Verify Twilio credentials in `.env`
- Check phone numbers include country code
- Ensure Twilio account is active and has credits

### Database Connection Issues
- Verify MongoDB URI is correct
- Check credentials
- Ensure your IP is whitelisted in MongoDB Atlas
- Check network connection

## Performance Tips

1. **Database**: Create indexes on frequently queried fields
2. **Frontend**: Use React.memo for task cards in large lists
3. **API**: Implement pagination for task list
4. **Caching**: Add caching layer for statistics

## Future Enhancements

- [ ] Email notifications
- [ ] Calendar view for tasks
- [ ] Task attachments
- [ ] Task templates
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Real-time notifications using WebSocket
- [ ] Bulk task operations

## Support

For issues or questions, please contact the development team.

## License

MIT License - Feel free to use this project for your needs.

---

**Built with** ❤️ using React, Node.js, and MongoDB

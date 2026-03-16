# Quick Start Guide

## 🚀 Fast Setup Instructions

### Step 1: Backend Setup (Terminal 1)

```bash
cd e:/TASK-TRACKER/backend
npm install
npm run dev
```

You should see: `Server running on port 5000`

### Step 2: Frontend Setup (Terminal 2)

```bash
cd e:/TASK-TRACKER/frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000`

### Step 3: Access Application

Open your browser and go to: **http://localhost:3000**

### Step 4: Login

**PIN**: `1234`

---

## 📋 What Each Section Does

### Dashboard
- View total tasks at a glance
- See pending, in-progress, and completed tasks
- Visual progress bar showing task distribution

### Tasks
- **Create**: Add new tasks with all details
- **Filter**: Filter by sector and status
- **Start**: Begin a task (timer starts)
- **Complete**: Finish a task (shows duration in h:m:s)
- **Assign & WhatsApp**: Send task via WhatsApp to employee
- **Citizen**: Open WhatsApp chat directly
- **Delete**: Remove tasks

### Contacts
- Manage employee contacts
- Add/remove employees
- Assign tasks to contacts

### Settings
- Change admin PIN
- Configure WhatsApp number
- View system information

---

## 📱 WhatsApp Integration Demo

### Without Twilio (Manual Mode)
Currently, the app supports:
- Click **"Citizen"** button to open WhatsApp manually
- Task details auto-fill in the message
- Send message directly to the employee

### With Twilio (Automated Mode - Optional Setup)
1. Get Twilio credentials
2. Update `.env` file in backend
3. Click **"Assign & WhatsApp"** 
4. Task message automatically sends

---

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://jashwanthannavarapu99_db_user:42974297@cluster2.fytx2uj.mongodb.net/?appName=Cluster2
ADMIN_PIN=1234
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_PHONE_NUMBER=+919908939746
```

---

## ✅ Complete Feature Checklist

- ✅ PIN-based admin login (1234)
- ✅ Dashboard with statistics
- ✅ Task creation with all fields
- ✅ Task status management (Pending → In Progress → Completed)
- ✅ Duration tracking (hours:minutes:seconds)
- ✅ Two sectors (Vignan University & Narasarapet Region)
- ✅ Task assignment to employees
- ✅ WhatsApp integration (manual + Twilio ready)
- ✅ Contact management
- ✅ Settings for PIN and phone changes
- ✅ Responsive design
- ✅ Error handling and success messages

---

## 🎨 Task Fields

When creating a task, you'll specify:
- **Title**: Task name
- **Description**: Detailed description
- **Priority**: Low, Medium, High
- **Category**: Request, Meeting, Appointment, Other
- **Sector**: Vignan University, Narasarapet Region
- **Due Date**: When task should be completed
- **Reference Phone**: Optional contact number

---

## 💾 Data Storage

All data is stored in **MongoDB Cloud**:
- Connection: `cluster2.fytx2uj.mongodb.net`
- Database: `jashwanthannavarapu99_db`
- Collection: `tasks`

---

## 🆘 Common Issues & Solutions

### Issue: Backend not connecting to MongoDB
**Solution**: Verify MongoDB connection string and ensure your IP is whitelisted in MongoDB Atlas

### Issue: WhatsApp messages not sending
**Solution**: Make sure Twilio credentials are correct in `.env`

### Issue: Frontend can't reach backend API
**Solution**: Ensure backend is running on port 5000 and CORS is enabled

### Issue: Port already in use
**Solution**: Change port in `.env` or stop other processes using the port

---

## 🔐 Security Tips

1. **Change default PIN**: Go to Settings → Change Admin PIN
2. **Keep credentials safe**: Don't share `.env` file
3. **Add IP whitelisting**: Configure MongoDB Atlas security
4. **Use HTTPS**: Deploy with SSL certificate
5. **Rate limiting**: Add rate limits to API endpoints

---

## 📞 Need Help?

- Check README.md for detailed documentation
- Review error messages in browser console
- Check server logs in terminal
- Verify all environment variables are set correctly

---

**Happy Task Tracking!** 🎉

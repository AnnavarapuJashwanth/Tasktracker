# Environment Configuration Guide

## Backend .env File

Copy this template to `backend/.env` and fill in your actual values:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://jashwanthannavarapu99_db_user:42974297@cluster2.fytx2uj.mongodb.net/?appName=Cluster2

# Admin Authentication
ADMIN_PIN=1234

# Twilio WhatsApp Integration (Optional)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_PHONE_NUMBER=+919908939746
```

## Getting Twilio Credentials

### 1. Create Twilio Account
- Go to https://www.twilio.com/try-twilio
- Sign up with your email
- Verify your phone number
- Choose "Build with Conversations"

### 2. Get Account SID & Auth Token
- Go to Twilio Console
- Copy **Account SID**
- Copy **Auth Token**
- Add both to your `.env` file

### 3. Set Up WhatsApp Sandbox
- In Twilio Console, go to **Messaging** > **Try it out** > **Send a WhatsApp message**
- Select WhatsApp Sandbox option
- Copy the given phone number (e.g., whatsapp:+14155238886)
- Update `TWILIO_WHATSAPP_NUMBER` in `.env`

### 4. Join Sandbox
- Send message "join" from your phone to the Sandbox number shown
- Wait for confirmation

### 5. Test
- In your app, assign a task to test WhatsApp integration
- Check if message arrives

---

## MongoDB Connection Details

### Current Configuration
- **Host**: cluster2.fytx2uj.mongodb.net
- **Username**: jashwanthannavarapu99_db_user
- **Password**: 42974297
- **Database**: jashwanthannavarapu99_db

### Connection String
```
mongodb+srv://jashwanthannavarapu99_db_user:42974297@cluster2.fytx2uj.mongodb.net/?appName=Cluster2
```

### IP Whitelisting
If you get connection errors:
1. Go to MongoDB Atlas
2. Navigate to "Network Access"
3. Add your current IP address
4. Or add "0.0.0.0/0" to allow all IPs (not recommended for production)

---

## Frontend Configuration

The frontend is configured to connect to:
- **Backend URL**: http://localhost:5000
- **Admin PIN storage**: localStorage

To change backend URL, edit `frontend/src/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

---

## Production Deployment

### For Backend
1. Set `NODE_ENV=production`
2. Use secure MongoDB connection with IP whitelist
3. Enable CORS for your frontend domain
4. Use environment secrets management (AWS Secrets, Azure Key Vault, etc.)

### For Frontend
1. Run `npm run build` to create production build
2. Deploy to Vercel, Netlify, or your hosting
3. Update API_BASE_URL to production backend

---

## Available Commands

### Backend
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
npm run build   # Build (if applicable)
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

---

## Environment Checklist

- [ ] MongoDB connection string is correct
- [ ] Admin PIN is set to a secure value
- [ ] Twilio credentials are added (if using WhatsApp)
- [ ] Backend runs on correct port
- [ ] Frontend can reach backend
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in version control

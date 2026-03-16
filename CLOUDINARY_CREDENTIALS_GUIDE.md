# Cloudinary Setup - Step by Step Guide

## Step 1: Create Free Cloudinary Account

1. **Open this link in your browser:**
   ```
   https://cloudinary.com/users/register/free
   ```

2. **Fill in the form:**
   - Email: Your email address
   - Password: Create a strong password
   - Company/Project: Task Tracker (or your name)

3. **Click "Sign Up"**

4. **Verify Your Email:**
   - Check your email inbox
   - Click the verification link
   - Complete email verification

---

## Step 2: Get Your Dashboard

After verification, you'll see the **Cloudinary Dashboard**. 

**This is where all your images will be stored!**

---

## Step 3: Find Your Credentials

### Option 1: From Dashboard Home (Easiest)

1. In the **Cloudinary Dashboard**, look for the **Settings** gear icon (⚙️) in top right
2. OR scroll down and you'll see a box with:
   ```
   Account Details
   Cloud Name: xxxxxxxx
   ```

### Option 2: From Settings Page

1. Click **Settings** (gear icon ⚙️)
2. Click **API Keys** tab
3. You'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Generate new" if not visible)

---

## Step 4: Copy Your Three Credentials

You need exactly 3 pieces of information:

### 🔹 Cloud Name
- Looks like: `democloud` or `tasktracker-xyz`
- This is your public Cloudinary account identifier

### 🔹 API Key
- Looks like: `123456789012345` (numbers only)
- This is your account key

### 🔹 API Secret
- Looks like: `abcdefghijklmnop_secret_key_xyz` (long string)
- **KEEP THIS SECRET!** Don't share it publicly

---

## Step 5: Add to Your Backend .env File

1. **Open file:** `backend/.env`

2. **Find these lines:**
   ```env
   CLOUDINARY_CLOUD_NAME=democloud
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Replace with your actual credentials:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnop_secret_key
   ```

### ✅ Example:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
ADMIN_PIN=1234
CLOUDINARY_CLOUD_NAME=my-task-app
CLOUDINARY_API_KEY=987654321098765
CLOUDINARY_API_SECRET=xYzAbCdEfGhIjKlMnOpQrStUvWxYz_secret
```

---

## Step 6: Save and Restart Servers

1. **Save the .env file** (Ctrl+S)

2. **Stop backend server** (press Ctrl+C in terminal)

3. **Restart backend:**
   ```powershell
   cd e:\TASK-TRACKER\backend
   node server.js
   ```

4. **You should see:**
   ```
   ✅ CORS enabled for origins: [...]
   Connecting to MongoDB Atlas...
   MongoDB connected!
   Server running on port 5000
   ```

---

## Step 7: Test the Upload

1. **Login to Task Tracker:**
   - Go to `http://localhost:3000`
   - Enter PIN: `1234`

2. **Create a new task:**
   - Click "Create New Task"
   - Fill in all fields
   - **IMPORTANT:** Upload a photo

3. **Check if upload works:**
   - Look in browser console (F12 → Console tab)
   - Should see: `Task created successfully`
   - No red errors

4. **Verify in Cloudinary:**
   - Go to your Cloudinary Dashboard
   - Click **Media Library**
   - You should see your image in `task-tracker` folder

---

## Step 8: Send Via WhatsApp

1. **In Task Tracker:**
   - Click on any task with a photo
   - Click **Citizen** button
   - Enter phone number (include country code: +91)
   - Edit the message
   - Click **Send via WhatsApp**

2. **You'll see the message with:**
   - Task details
   - Reference number
   - **Cloud image link** (starts with `https://res.cloudinary.com/`)

3. **In WhatsApp:**
   - The link is clickable and works!
   - No manual attachment needed
   - Recipient can view the image directly

---

## ✅ Verification Checklist

- [ ] Cloudinary account created and verified
- [ ] Found Cloud Name, API Key, API Secret
- [ ] Updated `backend/.env` with credentials
- [ ] Saved `.env` file
- [ ] Restarted backend server
- [ ] Backend shows "MongoDB connected"
- [ ] Created a test task with photo
- [ ] Photo appears in Cloudinary Media Library
- [ ] WhatsApp message shows cloud image link

---

## 🔒 Security Notes

### ✅ SAFE to share:
- Cloud Name (public, everyone needs it)

### ⚠️ KEEP SECRET:
- API Secret (like a password, never commit to GitHub)
- API Key (personal account key)

### 💡 For Production:
Use environment variables on your hosting service (Render, Heroku, etc.)
Never commit `.env` file to GitHub (already in `.gitignore`)

---

## 📁 Where Images Go

### In Cloudinary Dashboard:
1. Click **Media Library**
2. Look for folder named: `task-tracker`
3. All your uploaded images are there!

### Image URL Format:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/task-tracker/image-name.jpg
```

---

## 🆘 Troubleshooting

### "Failed to upload image to cloud"
- [ ] Check `.env` credentials are correct (no typos)
- [ ] Verify API Key has numbers only
- [ ] Check API Secret is the full secret
- [ ] Restart backend server
- [ ] Clear browser cache (Ctrl+Shift+Delete)

### "Image not showing in WhatsApp"
- [ ] Check image uploaded to Cloudinary (Media Library)
- [ ] Copy the link from WhatsApp message
- [ ] Try opening link in new browser tab
- [ ] Should show your image directly

### "Site can't be reached" (old problem)
- [ ] Now fixed! Images are in the cloud
- [ ] Old localhost links won't work
- [ ] Delete old tasks and create new ones

---

## 💰 Free Plan Includes

✅ **25GB storage** (plenty for task tracker)
✅ **1GB transformations** per month
✅ **Unlimited API calls**
✅ **Unlimited users**
✅ Automatic CDN delivery (fast everywhere)

---

## Quick Reference

| Item | Value |
|------|-------|
| Cloud Name | `your_cloud_name` |
| API Key | From Settings → API Keys |
| API Secret | From Settings → API Keys |
| Storage Limit | 25GB (free plan) |
| Folder | `task-tracker` |
| Link Format | `https://res.cloudinary.com/...` |

---

## Next Steps

1. ✅ Create Cloudinary account
2. ✅ Copy credentials
3. ✅ Update `.env` file
4. ✅ Restart backend
5. ✅ Test with a task upload
6. ✅ Send via WhatsApp

Then you're all set! 🎉

---

**Questions?** Check the main [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) file for more details.

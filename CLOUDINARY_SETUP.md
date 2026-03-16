# Cloud Image Storage Setup Guide - Cloudinary

Your Task Tracker is now configured to upload images to **Cloudinary** for cloud storage. This means:
- ✅ Images are stored in the cloud (not on local server)
- ✅ Cloud image links work everywhere (localhost, production, WhatsApp, etc.)
- ✅ No manual attachment steps needed in WhatsApp
- ✅ Images persist even if server is offline

## Step 1: Sign Up for Cloudinary (Free)

1. Go to **https://cloudinary.com/users/register/free**
2. Sign up with your email
3. Verify your email
4. Go to your **Dashboard** >> **Settings** >> **API Keys**

## Step 2: Get Your Credentials

In your Cloudinary Dashboard, you'll find:
- **Cloud Name** (looks like: `democloud` or `your-cloud-xyz`)
- **API Key** (long number)
- **API Secret** (long string)

## Step 3: Update Your Backend .env File

Open `backend/.env` and update:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=tasktracker-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz1234
```

## Step 4: Restart Servers

1. Stop your backend server (Ctrl+C)
2. Restart it: `node server.js`
3. Check the logs to confirm no errors

## Step 5: Test Upload

1. Open your Task Tracker at `http://localhost:3000`
2. Login with PIN: **1234**
3. Create a new task with a photo
4. The image will upload to Cloudinary
5. When sending via WhatsApp, the image link will be a cloud URL (looks like: `https://res.cloudinary.com/...`)

## What's Changed?

### Before (Local Storage)
❌ Images stored locally
❌ Links only work on localhost
❌ "site can't be reached" errors when shared

### After (Cloud Storage - Cloudinary)
✅ Images stored in cloud
✅ Links work from anywhere
✅ Direct WhatsApp image links
✅ No manual attachment steps

## WhatsApp Message Format

Now when you send a task via WhatsApp:

```
📌 *TASK UPDATE*

*Task:* Take IT up with RO
*Description:* Extending side drains...
*Reference #:* 12345
*Assigned To:* John Doe
*Status:* Pending
*Priority:* High

📸 *TASK PHOTO:*
https://res.cloudinary.com/your-cloud/image/upload/v123456/task-tracker/image.jpg
```

The photo link works directly - no need for manual attachment instructions!

## Citizen Button

When clicking the **Citizen** button:
- Phone number used: `referencePhone` from task
- Message includes all task details
- Photo link included automatically
- Works with the reference number you set

## Troubleshooting

### "Failed to upload image to cloud"
- Check Cloudinary credentials in `.env`
- Verify API Key and API Secret are correct
- Restart backend server

### Image not showing in WhatsApp message
- Make sure image uploaded successfully (check Cloudinary dashboard)
- Verify the cloud link in the message
- Try refreshing the page

### Where are my images stored?
- Go to **https://cloudinary.com/** → Dashboard → **Media Library**
- All images are stored in the `task-tracker` folder

## Production Deployment

Make sure to set these environment variables in your production environment (Render, Heroku, etc.):

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## References

- Cloudinary Docs: https://cloudinary.com/documentation
- Free Plan Limits: 25,000 total transformations/month (plenty for task tracker!)
- Storage: Up to 10GB free storage

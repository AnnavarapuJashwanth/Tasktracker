# Troubleshooting Guide

## 🔧 Common Issues & Solutions

---

## Backend Issues

### Issue: Backend won't start

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. **Kill process on port 5000:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. **Use different port:**
   - Edit `backend/.env`
   - Change `PORT=5001` (or any free port)
   - Update frontend API URL

3. **Check Node.js installation:**
   ```bash
   node --version
   npm --version
   ```

---

### Issue: MongoDB connection failed

**Error Message:**
```
MongoNetworkError: failed to connect to server
MongooseError: Failed to connect to mongodb
```

**Solutions:**
1. **Verify connection string in `.env`:**
   ```
   MONGODB_URI=mongodb+srv://jashwanthannavarapu99_db_user:42974297@cluster2.fytx2uj.mongodb.net/?appName=Cluster2
   ```

2. **Check credentials:**
   - Username: `jashwanthannavarapu99_db_user`
   - Password: `42974297`
   - Cluster: `cluster2.fytx2uj.mongodb.net`

3. **Whitelist IP in MongoDB Atlas:**
   - Go to MongoDB Atlas
   - Network Access → IP Whitelist
   - Add your IP or `0.0.0.0/0` (for testing)
   - Wait 1-2 minutes for changes

4. **Test connection:**
   ```bash
   # Install MongoDB tools
   npm install mongodb -g
   
   # Test connection from command line
   mongosh "mongodb+srv://user:password@cluster2.fytx2uj.mongodb.net/test"
   ```

---

### Issue: Dependencies installation failed

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency
```

**Solutions:**
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use older npm version:**
   ```bash
   npm install -g npm@8
   ```

4. **Force install:**
   ```bash
   npm install --force
   ```

---

### Issue: Backend starts but shows permission error

**Error Message:**
```
Error: EACCES: permission denied
```

**Solutions:**
1. **Run with sudo (not recommended):**
   ```bash
   sudo npm run dev
   ```

2. **Fix npm permissions:**
   ```bash
   # Mac/Linux
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   ```

---

## Frontend Issues

### Issue: Frontend won't start

**Error Message:**
```
ENOENT: no such file or directory
```

**Solutions:**
1. **Check directory:**
   ```bash
   cd frontend
   ls -la
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Clear Vite cache:**
   ```bash
   rm -rf .vite node_modules
   npm install
   npm run dev
   ```

---

### Issue: Frontend can't connect to backend

**Error Message:**
```
Failed to fetch
Network error
CORS error
```

**Solutions:**
1. **Verify backend is running:**
   ```bash
   # Should see: "Server running on port 5000"
   ```

2. **Check API base URL in `api.js`:**
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

3. **Verify CORS in backend:**
   - Check `server.js` has `cors()` enabled
   - Backend should allow requests from `localhost:3000`

4. **Check browser console:**
   - Press F12 → Console
   - Look for error messages
   - Check Network tab

5. **Test backend directly:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"message":"Server is running"}
   ```

---

### Issue: Login PIN not working

**Error Message:**
```
Invalid PIN
```

**Solutions:**
1. **Verify default PIN:**
   - PIN: `1234`
   - Number only (no letters)
   - Exactly 4 digits

2. **Check localStorage:**
   - Open Browser DevTools (F12)
   - Application → LocalStorage
   - Delete `adminPin` entry

3. **Clear browser cache:**
   ```
   Ctrl+Shift+Delete (all time)
   ```

4. **Verify backend has correct PIN:**
   ```
   backend/.env → ADMIN_PIN=1234
   ```

---

### Issue: Blank page or reload loop

**Error Message:**
```
Unexpected token
Uncaught SyntaxError
```

**Solutions:**
1. **Clear build cache:**
   ```bash
   rm -rf dist node_modules
   npm install
   npm run dev
   ```

2. **Check browser console for errors:**
   - F12 → Console → Check errors
   - Note down error message

3. **Verify components exist:**
   - Check all component files in `src/components/`
   - Verify imports in `App.jsx`

---

### Issue: Styles not loading

**Error Message:**
```
CSS not working
Colors wrong
Layout broken
```

**Solutions:**
1. **Verify CSS files exist:**
   ```bash
   ls src/components/*.css
   ```

2. **Check CSS imports:**
   ```javascript
   import './Dashboard.css'  // Correct
   import './dashboard.css'  // Wrong (case-sensitive on Linux/Mac)
   ```

3. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

4. **Check for CSS errors:**
   - F12 → Elements → Check computed styles

---

## Data Issues

### Issue: Tasks not saving

**Error Message:**
```
Failed to create task
Task creation failed
```

**Solutions:**
1. **Check MongoDB connection:**
   ```bash
   # In backend terminal
   # Should see: "MongoDB Connected: cluster2.fytx2uj.mongodb.net"
   ```

2. **Verify required fields:**
   - Title: required
   - Description: required
   - Due Date: required
   - All others: should have values

3. **Check browser console:**
   - F12 → Console → Look for errors
   - Network tab → XHR → Post request response

4. **Check backend logs:**
   - Look for error messages in terminal
   - May indicate database issue

---

### Issue: Admin PIN not changing

**Error Message:**
```
Settings saved
But PIN still old
```

**Solutions:**
1. **Restart browser:**
   - Close and reopen app
   - Login with new PIN

2. **Clear localStorage:**
   - F12 → Application → LocalStorage
   - Delete all entries
   - Refresh page

3. **Manually set PIN:**
   - Edit `backend/.env`
   - Change `ADMIN_PIN=1234`
   - Restart backend

---

### Issue: WhatsApp link not working

**Error Message:**
```
Link not opening
Blank page
```

**Solutions:**
1. **Verify phone number format:**
   - Must include country code
   - Example: `+919876543210`
   - Not: `9876543210`
   - Not: `+91-9876543210`

2. **Check WhatsApp installation:**
   - If using desktop, needs WhatsApp Web
   - If mobile, needs WhatsApp app

3. **Try manual Citizen button:**
   - Should open https://wa.me/phonenumber
   - If doesn't work, WhatsApp not installed

---

### Issue: Message format looks wrong

**Error Message:**
```
WhatsApp message shows raw text
No formatting
```

**Solutions:**
1. **Note:**
   - Desktop Message: Shows as plain text
   - WhatsApp Web: May not format same as app
   - Mobile: Should show properly formatted

2. **Check phone number:**
   - Ensure recipient has WhatsApp
   - Try message manually first

---

## Network Issues

### Issue: Slow response times

**Error Message:**
```
Page takes long to load
API responses slow
```

**Solutions:**
1. **Check MongoDB performance:**
   - May need database optimization
   - Consider adding indexes

2. **Check network connection:**
   - Test internet speed
   - Check for DNS issues

3. **Monitor backend:**
   - Add logging to API endpoints
   - Check database query times

4. **Optimize frontend:**
   - Check browser console for warnings
   - Clear unused CSS/code

---

### Issue: Connection timeout

**Error Message:**
```
Failed to connect
Request timeout
```

**Solutions:**
1. **Check firewall:**
   - May be blocking port 5000
   - Add exception for Node.js

2. **Check backend health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check MongoDB timeout:**
   - Adjust connection timeout in `.env`
   - Add `?serverSelectionTimeoutMS=5000`

---

## Performance Issues

### Issue: App is slow

**Solutions:**
1. **Check DevTools:**
   - F12 → Performance tab
   - Record and analyze
   - Look for slow operations

2. **Reduce data:**
   - Add pagination to task lists
   - Limit initial data load

3. **Optimize images (future):**
   - Compress images
   - Use modern formats

4. **Check database:**
   - Ensure indexes exist
   - Run explain() on queries

---

## Browser Compatibility

### Issue: Works in Chrome but not Firefox

**Solutions:**
1. **Check browser compatibility:**
   - Update browser
   - Try different browser
   - Check for JS errors in console

2. **Clear cache:**
   - Ctrl+Shift+Delete
   - Select "All time"
   - Clear everything

---

## General Troubleshooting

### Enable Debug Logging

**Backend:**
```javascript
// Add to server.js
console.log('Request received:', req.method, req.path);
```

**Frontend:**
```javascript
// Add to api.js
console.log('API Call:', endpoint, data);
```

### Check File Permissions

```bash
# Check if files are readable
ls -la backend/
ls -la frontend/

# Fix permissions if needed
chmod -R 755 backend/
chmod -R 755 frontend/
```

### Reinstall Everything

```bash
# Complete fresh install
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

npm install --prefix backend
npm install --prefix frontend
```

---

## Emergency Fixes

### Nuclear Option (Last Resort)

1. **Kill all Node processes:**
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Mac/Linux
   killall node
   ```

2. **Complete clean restart:**
   ```bash
   rm -rf backend/node_modules frontend/node_modules
   rm -rf backend/package-lock.json frontend/package-lock.json
   
   npm install --prefix backend
   npm install --prefix frontend
   
   npm run dev --prefix backend &
   npm run dev --prefix frontend
   ```

3. **Reset MongoDB:**
   - Go to MongoDB Atlas
   - Drop database
   - Restart backend to recreate collections

---

## Getting Help

### Where to Check

1. **Browser Console**: F12 → Console
2. **Backend Terminal**: Error messages
3. **Network Tab**: F12 → Network → Check XHR
4. **MongoDB Logs**: Atlas Dashboard
5. **This Guide**: Search by error keyword

### Information to Collect

- **Error message**: Exact text
- **When it happens**: Specific action
- **OS & Browser**: Windows 10, Chrome etc.
- **Steps to reproduce**: How to trigger

---

## Preventive Maintenance

### Regular Checks

- [ ] Verify API connectivity monthly
- [ ] Check MongoDB status
- [ ] Update dependencies quarterly
- [ ] Backup data regularly
- [ ] Monitor logs for errors

---

**Last Updated**: March 16, 2026

**Still having issues?** Check:
1. API_DOCUMENTATION.md
2. CONFIG_GUIDE.md
3. QUICK_START.md
4. README.md

**Contact**: System Administrator

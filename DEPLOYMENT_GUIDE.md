# Deployment Guide

## Deployment Architecture

```
Frontend (React + Vite)          Backend (Node.js)           Database (MongoDB Cloud)
  Vercel/Netlify        ←→         Heroku/Railway      ←→    cluster2.fytx2uj.mongodb.net
   Port 3000                       Port 5000
```

---

## Local Deployment (Development)

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB URI credentials
- (Optional) Twilio credentials

### Steps

1. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

3. **Access**
```
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

---

## Production Deployment

### Option 1: Deploy Backend to Heroku

#### Prerequisites
- Heroku account: https://www.heroku.com

#### Steps

1. **Install Heroku CLI**
```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create your-app-name
```

4. **Set Environment Variables**
```bash
heroku config:set PORT=5000
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set ADMIN_PIN=1234
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
heroku config:set ADMIN_PHONE_NUMBER=+919908939746
```

5. **Deploy**
```bash
git push heroku main
# or
heroku deploy --source-dir ./backend
```

6. **View Logs**
```bash
heroku logs --tail
```

---

### Option 2: Deploy Backend to Railway

#### Steps

1. **Go to Railway**: https://railway.app

2. **Create New Project**
   - Connect GitHub repo
   - Select backend folder
   - Railway auto-detects Node.js

3. **Add Variables**
   - Go to Variables tab
   - Add all `.env` variables

4. **Deploy**
   - Railway auto-deploys on push
   - Get production URL from Dashboard

---

### Option 3: Deploy Backend to Render

#### Steps

1. **Go to Render**: https://render.com

2. **Create New Service**
   - Select "Web Service"
   - Connect GitHub
   - Select Node.js environment

3. **Build Command**
```bash
npm install
```

4. **Start Command**
```bash
npm start
```

5. **Environment Variables**
   - Add all variables from `.env`

6. **Deploy**
   - Render will build and deploy automatically

---

## Frontend Deployment Options

### Option 1: Deploy to Vercel

#### Steps

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Go to Vercel**: https://vercel.com

3. **Import Project**
   - Click "Import Project"
   - Select GitHub repository
   - Select `frontend` folder

4. **Environment Variables**
```
VITE_API_URL=https://your-backend-url.herokuapp.com/api
```

5. **Deploy**
   - Vercel auto-deploys on push

6. **Update `frontend/src/api.js`**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

### Option 2: Deploy to Netlify

#### Steps

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Go to Netlify**: https://www.netlify.com

3. **Drag and Drop Deploy**
   - Drag `frontend/dist` folder to Netlify
   
   OR
   
   **Connect GitHub**
   - Click "New site from Git"
   - Select repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

4. **Environment Variables**
   - Go to Site settings
   - Build & Deploy → Environment
   - Add `VITE_API_URL`

5. **Deploy**
   - Netlify auto-deploys on push

---

### Option 3: Deploy to GitHub Pages

#### Steps

1. **Update `vite.config.js`**
```javascript
export default defineConfig({
  base: '/task-tracker/',
  plugins: [react()],
})
```

2. **Add Deploy Script** to `package.json`
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

4. **Deploy**
```bash
npm run deploy
```

---

## Full Stack Deployment (Using Docker)

### Create `backend/Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Create `frontend/Dockerfile`
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - ADMIN_PIN=${ADMIN_PIN}
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Deploy
```bash
docker-compose up
```

---

## Production Checklist

- [ ] Change default PIN to secure value
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for frontend domain
- [ ] Enable MongoDB IP whitelisting
- [ ] Set up SSL/HTTPS certificate
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backups for MongoDB
- [ ] Test all WhatsApp integrations
- [ ] Set up CI/CD pipeline
- [ ] Document all environment variables
- [ ] Test error handling
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing

---

## Domain Configuration

### Set Custom Domain

**For Heroku:**
```bash
heroku domains:add example.com
```

**For Vercel:**
- Project Settings → Domains
- Add custom domain
- Update DNS records

**For Netlify:**
- Site settings → Domain management
- Add custom domain

---

## Monitoring & Logging

### Backend Monitoring
- Use **PM2** for process management
- Set up **DataDog** or **New Relic** for APM
- Use **Papertrail** for log aggregation

### Frontend Monitoring
- Use **Sentry** for error tracking
- Use **Google Analytics** for user analytics

---

## SSL Certificate Setup

### For Production URL
- Use **Let's Encrypt** (free)
- Or use **CloudFlare** (free tier)

### Update API URL
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

---

## Scaling

### Vertical Scaling
- Increase server resources (RAM, CPU)

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple backend instances
- Use MongoDB sharding

---

## Troubleshooting Production Issues

### Backend Won't Start
```bash
# Check logs
heroku logs --tail
# or
railway logs

# Check environment variables
heroku config
# or
railway variables
```

### Frontend Can't Connect to Backend
1. Check CORS configuration
2. Verify API URL is correct
3. Check network in browser console

### Database Connection Issues
1. Verify MongoDB URI
2. Check IP whitelisting
3. Test connection locally

---

## Rollback Procedure

### Heroku
```bash
heroku releases
heroku releases:rollback v123
```

### Vercel
```bash
Go to Deployments tab
Click "..." on previous build
Select "Rollback"
```

---

## Performance Optimization

1. **Backend**
   - Enable gzip compression
   - Use MongoDB indexes
   - Implement caching
   - Use CI/CD for automated testing

2. **Frontend**
   - Code splitting
   - Lazy loading components
   - Image optimization
   - Minification

---

## Support & Monitoring

- Set up uptime monitoring (UptimeRobot)
- Configure error alerts (Sentry)
- Monitor API response times
- Track user engagement

---

**Deployment Guide Last Updated**: March 16, 2026

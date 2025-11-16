# Deployment Guide for Vercel

## 🚀 Deploying to Vercel

### Option 1: Deploy Client Only (Recommended for Quick Start)

If you want to deploy just the frontend to Vercel:

1. **Install Vercel CLI** (optional, or use Vercel dashboard):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to client folder**:
   ```bash
   cd client
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Or connect your GitHub repo to Vercel dashboard and deploy automatically.

4. **Important**: You'll need to update the API URL in your frontend to point to your backend server URL (or use a separate backend deployment).

### Option 2: Deploy Full-Stack (Client + Server)

For a complete deployment, you have two options:

#### A. Separate Deployments (Recommended)

1. **Deploy Backend to Railway/Render/Fly.io**:
   - These platforms work better for Node.js servers with MongoDB
   - Update `.env` with production MongoDB URI
   - Set environment variables for API keys

2. **Deploy Frontend to Vercel**:
   - Point API URL to your backend URL
   - Create `.env.production` or set env vars in Vercel dashboard:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     ```

#### B. Monorepo Deployment (Advanced)

1. Use the root `vercel.json` configuration
2. Deploy from root directory
3. Configure build settings in Vercel dashboard

## 📋 Pre-Deployment Checklist

### Frontend (Vercel)

- [ ] Update API base URL in `client/src/utils/api.js`
- [ ] Set environment variables in Vercel dashboard if needed
- [ ] Test build locally: `cd client && npm run build`
- [ ] Ensure `client/vercel.json` exists for SPA routing

### Backend (Separate Platform)

- [ ] Set MongoDB connection string (production)
- [ ] Set all API keys in environment variables
- [ ] Configure CORS to allow Vercel domain
- [ ] Test server endpoints

## 🔧 Environment Variables Setup

### In Vercel Dashboard (Frontend):

1. Go to your project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-backend-api.com/api
   ```

### For Backend (Railway/Render/etc):

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
NEWS_API_KEY=...
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
YOUTUBE_API_KEY=...
CLIENT_URL=https://your-vercel-app.vercel.app
```

## 🌐 Updating API Base URL

If your backend is deployed separately, update `client/src/utils/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-backend-url.com/api'  // Production
    : 'http://localhost:5000/api'          // Development
  );
```

## 🐛 Troubleshooting 404 Errors

**Problem**: Getting 404 errors on routes like `/dashboard`, `/brands`, etc.

**Solution**: The `client/vercel.json` file should handle this, but if it doesn't work:

1. Make sure `client/vercel.json` exists with the rewrite rule
2. In Vercel dashboard: Settings → Functions → Check "Clean URLs"
3. Or manually add redirects in Vercel dashboard

## 📝 Quick Deploy Commands

### Client Only:
```bash
cd client
vercel
```

### Full Stack (from root):
```bash
vercel
```

## 🔗 Recommended Architecture

```
┌─────────────┐      ┌─────────────┐
│   Vercel    │      │   Railway/  │
│  (Frontend) │─────▶│   Render    │
│  React App  │      │  (Backend)  │
└─────────────┘      └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  MongoDB    │
                    │    Atlas    │
                    └─────────────┘
```

## ✅ Post-Deployment

1. Test all routes (/, /dashboard, /brands, etc.)
2. Check API connectivity
3. Test real-time features (Socket.io)
4. Verify environment variables are set correctly
5. Monitor Vercel logs for errors

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- React Router Deployment: https://reactrouter.com/en/main/start/overview#deployments


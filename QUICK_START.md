# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Make sure it's running on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Use it in the `.env` file

### Step 3: Configure Environment

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brandtracker
JWT_SECRET=your_secret_key_here

# Optional API Keys (app works without them using dummy data)
NEWS_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
YOUTUBE_API_KEY=
```

**Note:** The app works perfectly fine without API keys! It automatically uses:
- ✅ Google News RSS (free, no key needed)
- ✅ Reddit Public API (free, no key needed)
- ✅ HackerNews API (free, no key needed)

API keys are optional for additional sources. See [API_SOURCES.md](./API_SOURCES.md) for details.

### Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
You should see: `🚀 Server running on port 5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
You should see: `Local: http://localhost:5173`

### Step 5: Open Browser

Navigate to: **http://localhost:5173**

## ✅ You're Ready!

1. **Add Your First Brand:**
   - Click "Brands" in the navbar
   - Click "Add Brand"
   - Enter a brand name (e.g., "Zomato", "Tesla", "Apple")
   - The app will automatically fetch mentions (or use dummy data)

2. **View Dashboard:**
   - Select your brand from the dropdown
   - See real-time analytics, charts, and sentiment analysis

3. **Explore Features:**
   - Dark/Light mode toggle (top right)
   - Real-time updates via Socket.io
   - Spike alerts for mention increases
   - AI-powered summaries

## 🔧 Troubleshooting

**MongoDB Connection Error?**
- Check if MongoDB is running: `mongod --version`
- Verify your connection string in `.env`
- For Atlas: Check network access settings

**Port Already in Use?**
- Change PORT in `server/.env`
- Or kill the process: `lsof -ti:5000 | xargs kill`

**Frontend Won't Start?**
- Make sure you're in the `client` directory
- Try: `rm -rf node_modules && npm install`

## 📚 Next Steps

- Configure API keys for live data (see README.md)
- Customize themes and colors
- Set up authentication (optional)
- Deploy to production

## 🎉 Enjoy Your Brand Tracker!

For detailed documentation, see [README.md](./README.md)


# Free API Sources for Real-Time Brand Tracking

This document lists all the **FREE** and **paid** API sources integrated into the Brand Tracker.

## ✅ FREE APIs (No API Key Required)

These APIs work out of the box without any configuration:

### 1. **Google News RSS** ⭐ RECOMMENDED
- **Source**: Google News RSS Feeds
- **Cost**: FREE
- **Rate Limit**: None (reasonable use)
- **Data**: Recent news articles mentioning your brand
- **Setup**: None required - works automatically!

### 2. **Reddit Public API** ⭐ RECOMMENDED
- **Source**: Reddit JSON API (public endpoints)
- **Cost**: FREE
- **Rate Limit**: ~60 requests/minute
- **Data**: Reddit posts and comments mentioning your brand
- **Setup**: None required for basic use
- **Optional**: Add credentials for better rate limits (see below)

### 3. **HackerNews API** ⭐ RECOMMENDED
- **Source**: Firebase-based HackerNews API
- **Cost**: FREE
- **Rate Limit**: None (reasonable use)
- **Data**: Tech discussions mentioning your brand
- **Setup**: None required - works automatically!

## 🔑 OPTIONAL APIs (Free Tier Available)

These APIs require free API keys but offer better data quality:

### 4. **NewsAPI** 
- **Website**: https://newsapi.org/
- **Free Tier**: 100 requests/day
- **Setup**: 
  1. Sign up at https://newsapi.org/register
  2. Get your free API key
  3. Add to `.env`: `NEWS_API_KEY=your_key_here`

### 5. **Reddit OAuth** (Enhanced Reddit Access)
- **Website**: https://www.reddit.com/prefs/apps
- **Free Tier**: Unlimited (with auth)
- **Setup**:
  1. Go to https://www.reddit.com/prefs/apps
  2. Click "Create App" → "script"
  3. Add to `.env`:
     ```
     REDDIT_CLIENT_ID=your_client_id
     REDDIT_CLIENT_SECRET=your_client_secret
     ```

### 6. **YouTube Data API**
- **Website**: https://console.cloud.google.com/
- **Free Tier**: 10,000 units/day
- **Setup**:
  1. Go to Google Cloud Console
  2. Create project → Enable YouTube Data API v3
  3. Create credentials → API Key
  4. Add to `.env`: `YOUTUBE_API_KEY=your_key_here`

## 📊 Data Sources Summary

| Source | Status | Real-Time | Rate Limit | Setup Required |
|--------|--------|-----------|------------|----------------|
| Google News RSS | ✅ FREE | Yes | None | No |
| Reddit Public | ✅ FREE | Yes | 60/min | No |
| HackerNews | ✅ FREE | Yes | None | No |
| NewsAPI | 🔑 Free Tier | Yes | 100/day | Yes |
| Reddit OAuth | 🔑 Free | Yes | Unlimited | Yes |
| YouTube | 🔑 Free Tier | Yes | 10k/day | Yes |

## 🚀 Getting Started with Real-Time Data

### Option 1: Use FREE APIs Only (Recommended for Start)

No setup needed! The app automatically uses:
- ✅ Google News RSS
- ✅ Reddit Public API
- ✅ HackerNews API

Just start the app and add brands - it works immediately!

### Option 2: Add Free API Keys (For Better Coverage)

1. **Get NewsAPI Key** (2 minutes):
   ```
   1. Visit: https://newsapi.org/register
   2. Sign up (free)
   3. Copy API key
   4. Add to server/.env: NEWS_API_KEY=your_key
   ```

2. **Get Reddit Credentials** (5 minutes):
   ```
   1. Visit: https://www.reddit.com/prefs/apps
   2. Click "Create App"
   3. Name: "BrandTracker"
   4. Type: "script"
   5. Copy Client ID and Secret
   6. Add to server/.env:
      REDDIT_CLIENT_ID=your_id
      REDDIT_CLIENT_SECRET=your_secret
   ```

3. **Get YouTube API Key** (Optional, 10 minutes):
   ```
   1. Visit: https://console.cloud.google.com/
   2. Create new project
   3. Enable YouTube Data API v3
   4. Create API Key
   5. Add to server/.env: YOUTUBE_API_KEY=your_key
   ```

## 📈 Real-Time Update Frequency

- **Automatic Scraping**: Every 30 minutes
- **Manual Refresh**: Anytime via Dashboard "Refresh" button
- **Real-Time Notifications**: Via Socket.io when new mentions detected

## 🔧 Fallback Behavior

If all APIs fail or rate limits are hit:
- ✅ App continues working
- ✅ Uses dummy data for demo
- ✅ Logs warnings but doesn't crash
- ✅ Automatically retries on next scrape

## 💡 Tips for Best Results

1. **Start with FREE APIs**: Google News + Reddit + HackerNews work immediately
2. **Add NewsAPI**: Easy setup, 100 articles/day free
3. **Monitor Rate Limits**: Check console for warnings
4. **Use Manual Refresh**: Test APIs with "Refresh" button in dashboard
5. **Check API Status**: Some APIs may be temporarily unavailable

## 🐛 Troubleshooting

**No mentions appearing?**
- Check browser console for API errors
- Verify brand name spelling
- Try adding NewsAPI key for more sources
- Check server logs: `cd server && npm run dev`

**Rate limit errors?**
- Add API keys for better limits
- Wait for next automatic scrape (30 min)
- Free tier limits reset daily

**Slow loading?**
- Some APIs (HackerNews) can be slow
- Results appear as they're fetched
- Check network tab for stuck requests

---

**Note**: The app works perfectly with just the FREE APIs (Google News, Reddit, HackerNews). API keys are optional but recommended for production use.


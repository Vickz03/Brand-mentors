# Brand Mention & Reputation Tracker

A full-stack production-ready web application for tracking brand mentions across multiple platforms with real-time sentiment analysis, spike detection, and comprehensive analytics.

## 🚀 Features

- **Real-Time Brand Tracking**: Monitor brand mentions from NewsAPI, Reddit, and YouTube
- **Sentiment Analysis**: Automatically categorize mentions as positive, negative, or neutral
- **Spike Detection**: Get alerts when mentions increase by 30% or more
- **Category Classification**: Automatically categorize mentions (complaint, review, product, support, general)
- **Interactive Dashboard**: Beautiful charts and visualizations with Recharts
- **Real-Time Updates**: Socket.io powered live updates
- **Dark/Light Mode**: Fully responsive UI with theme toggle
- **AI Summary**: Rule-based summaries with key insights
- **Scheduled Scraping**: Automatic hourly scraping with cron jobs

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion (animations)
- React Router
- Recharts (charts)
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io (real-time)
- Sentiment analysis (sentiment npm package)
- Node-cron (scheduled jobs)
- JWT Authentication (optional)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Tracker
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brandtracker
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brandtracker?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Optional API Keys (app will use dummy data if not provided)
NEWS_API_KEY=your_newsapi_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
```

**Getting API Keys (Optional):**
- **NewsAPI**: Sign up at https://newsapi.org/ (FREE: 100 requests/day)
- **Reddit**: Create app at https://www.reddit.com/prefs/apps (FREE: Unlimited with auth)
- **YouTube**: Get API key from Google Cloud Console (FREE: 10,000 units/day)

**Note**: The app works with FREE APIs out of the box:
- ✅ Google News RSS (no key needed)
- ✅ Reddit Public API (no key needed)  
- ✅ HackerNews API (no key needed)

See [API_SOURCES.md](./API_SOURCES.md) for detailed setup instructions.

5. **Start the development servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

6. **Open your browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts (Theme, Socket)
│   │   ├── utils/          # Utilities (API, helpers)
│   │   └── App.jsx
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # Express routes
│   ├── services/           # API services
│   ├── utils/              # Utilities (sentiment, dummy data)
│   ├── cron/               # Scheduled jobs
│   ├── index.js            # Server entry point
│   └── package.json
│
└── README.md
```

## 🎯 Usage

1. **Add a Brand**: Navigate to the Brands page and click "Add Brand"
2. **View Dashboard**: Select a brand to view its dashboard with analytics
3. **Monitor Mentions**: Real-time updates appear automatically
4. **Get Alerts**: Spike alerts appear when mentions increase significantly
5. **Analyze Sentiment**: View sentiment distribution in charts
6. **Track Trends**: See mentions over time with trend charts

## 🔧 Configuration

### Authentication
Authentication is optional. To enable:
1. Navigate to `/login` to register/login
2. JWT tokens are stored in localStorage
3. The app works without authentication for demo purposes

### Cron Jobs
Scheduled scraping runs every hour by default. To modify:
- Edit `server/cron/scraper.js`
- Change the cron expression: `'0 * * * *'` (hourly)
- See [node-cron documentation](https://www.npmjs.com/package/node-cron) for syntax

### Dummy Data
If API keys are not configured, the app automatically uses dummy data from `server/utils/dummyData.json`. This allows the app to work offline for demo purposes.

## 📊 Dashboard Features

- **Total Mentions**: Real-time count of all mentions
- **Sentiment Pie Chart**: Visual breakdown of positive/negative/neutral
- **Trend Line Chart**: Mentions over time (last 30 days)
- **Category Bar Chart**: Breakdown by category
- **Latest Mentions List**: Most recent mentions with sentiment tags
- **AI Summary Box**: Key insights including:
  - Positive percentage
  - Top keywords
  - Trend direction
  - Spike alerts

## 🔔 Real-Time Notifications

Socket.io powers real-time features:
- New mention notifications
- Spike alerts (30%+ increase)
- Trending keywords
- Automatic dashboard updates

## 🎨 Customization

### Themes
- Toggle dark/light mode in Settings or Navbar
- Theme preference is saved in localStorage

### Colors
- Primary color: Blue (#0ea5e9)
- Customize in `client/tailwind.config.js`

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally, or
- Verify MongoDB Atlas connection string
- Check network/firewall settings

**API Not Working:**
- Verify API keys in `.env` file
- Check API rate limits
- App will fallback to dummy data automatically

**Socket.io Connection Issues:**
- Ensure backend is running on port 5000
- Check CORS settings in `server/index.js`

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using MERN Stack + NLP + Real-Time Technologies**


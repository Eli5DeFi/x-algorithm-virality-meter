# X Algorithm Virality Meter 🔮

A web application that analyzes your content's viral potential using X's (Twitter's) actual recommendation algorithm signals. Features 10 humorous virality tiers and AI-powered assessments.

![Virality Meter](https://img.shields.io/badge/Powered%20by-X%20Algorithm-blue)
![Live Demo](https://img.shields.io/badge/Live-Railway-purple)

## 🌐 Live Demo

- **Frontend:** [https://frontend-sigma-six-50.vercel.app](https://frontend-sigma-six-50.vercel.app)
- **Backend API:** [https://x-algorithm-virality-meter-production.up.railway.app](https://x-algorithm-virality-meter-production.up.railway.app)
- **API Docs:** [https://x-algorithm-virality-meter-production.up.railway.app/docs](https://x-algorithm-virality-meter-production.up.railway.app/docs)

## Features

- **10 Virality Tiers** - From "Digital Tombstone" 🪦 to "Elon's Fav (God Mode)" 🚀
- **Algorithm-Based Scoring** - Uses actual X recommendation signals (19 engagement types)
- **Improvement Tips** - Actionable suggestions to boost your viral potential
- **Grok AI Assessment** - AI-powered content analysis
- **Account Simulator** - Analyze your account's overall virality tier
- **Live Deployment** - Production backend on Railway, frontend on Vercel

## Virality Tiers

| Tier | Score | Name |
|------|-------|------|
| 1 | 0-10% | 🪦 Digital Tombstone |
| 2 | 11-20% | 👻 Screaming into the Void |
| 3 | 21-30% | 👩‍👧 Mom's Biggest Fan |
| 4 | 31-40% | 🏘️ Neighborhood Watch |
| 5 | 41-50% | 💘 Algorithm's Situationship |
| 6 | 51-60% | 🫦 Timeline Tickler |
| 7 | 61-70% | 🌾 Engagement Farmer |
| 8 | 71-80% | 👑 Ratio Royalty |
| 9 | 81-90% | ⭐ Main Character Energy |
| 10 | 91-100% | 🚀 Elon's Fav (God Mode) |

## 🚀 Deployment

The app is live and deployed:

- **Backend:** Railway (automatic deployments from main branch)
- **Frontend:** Vercel (automatic deployments from main branch)

### Deploy Your Own

#### Backend (Railway)

1. Fork this repository
2. Sign up at [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your fork and set root directory to `virality-meter/backend`
5. Railway will auto-detect the configuration from `railway.json`

#### Frontend (Vercel)

1. Sign up at [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `virality-meter/frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL` = `your-railway-backend-url`
5. Deploy!

## Quick Start (Local Development)

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

**Frontend:**
- Next.js 14 with TypeScript
- Tailwind CSS
- Framer Motion for animations
- Deployed on Vercel

**Backend:**
- Python FastAPI
- Algorithm-based scoring engine
- Based on [@AbdelStark's x-algorithm](https://github.com/AbdelStark/x-algorithm)
- Deployed on Railway

## Algorithm Signals

The scoring engine analyzes 19 engagement signals from X's actual algorithm:

**Positive Signals:**
- ❤️ Likes
- 💬 Replies
- 🔁 Retweets
- 💭 Quote Tweets
- ➕ New Follows
- 👆 Clicks
- 👤 Profile Visits
- 🖼️ Image Views
- 🎬 Video Views
- ⏱️ Dwell Time
- 📤 Shares

**Negative Signals (reduce virality):**
- 🙈 "Not Interested" clicks
- 🚫 Blocks
- 🔇 Mutes
- ⚠️ Reports

## API Endpoints

- `POST /api/analyze` - Analyze content for virality
- `POST /api/account/simulate` - Simulate account virality
- `GET /api/tiers` - Get all tier definitions
- `GET /docs` - Interactive API documentation

## AI-Powered Analysis

The app includes AI-powered content assessment to provide additional insights on viral potential, engagement drivers, and improvement opportunities.

## Screenshots

### Content Analyzer
Paste your post and get instant virality predictions with improvement tips.

### Account Simulator
Enter your account metrics to see your overall virality tier and growth recommendations.

## Credits

This project is based on [@AbdelStark's x-algorithm](https://github.com/AbdelStark/x-algorithm), an open-source implementation of X's (Twitter's) recommendation algorithm.

## License

MIT License

---

Made with 🔮 and a bit of chaos

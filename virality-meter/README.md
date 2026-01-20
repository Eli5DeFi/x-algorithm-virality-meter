# X Algorithm Virality Meter 🔮

A web application that analyzes your content's viral potential using X's (Twitter's) actual recommendation algorithm signals. Features 10 humorous virality tiers and Grok AI-powered assessments.

![Virality Meter](https://img.shields.io/badge/Powered%20by-X%20Algorithm-blue)
![Grok AI](https://img.shields.io/badge/AI-Grok%20via%20Puter.js-purple)

## Features

- **10 Virality Tiers** - From "Digital Tombstone" 🪦 to "Elon's Fav (God Mode)" 🚀
- **Algorithm-Based Scoring** - Uses actual X recommendation signals (19 engagement types)
- **Improvement Tips** - Actionable suggestions to boost your viral potential
- **Grok AI Assessment** - Free AI analysis powered by Puter.js
- **Account Simulator** - Analyze your account's overall virality tier

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

## Quick Start

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
- Puter.js for free Grok API

**Backend:**
- Python FastAPI
- Algorithm-based scoring engine
- Based on [X's open-source algorithm](https://github.com/xai-org/x-algorithm)

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

## Grok AI Integration

This app uses [Puter.js](https://puter.com) for free, unlimited Grok API access. No API keys required - users authenticate through Puter directly.

```javascript
// Free Grok API via Puter.js
puter.ai.chat(prompt, { model: 'grok-beta' })
```

## Screenshots

### Content Analyzer
Paste your post and get instant virality predictions with improvement tips.

### Account Simulator
Enter your account metrics to see your overall virality tier and growth recommendations.

## License

MIT License - Built using the [open-source X Algorithm](https://github.com/xai-org/x-algorithm)

---

Made with 🔮 and a bit of chaos

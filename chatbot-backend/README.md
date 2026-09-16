# Nitin Portfolio Chatbot – Backend

Secure Node.js + Express backend that powers the AI chatbot on [Nitin Choudri's Portfolio](https://nitinchoudri09.github.io/).

## Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express
- **AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Security:** Helmet, express-rate-limit, CORS

---

## Local Setup

### 1. Install dependencies
```bash
cd chatbot-backend
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```
Then open `.env` and paste your Gemini API key.

Get a **free** key at: https://aistudio.google.com/

### 3. Run the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3001`

### 4. Test the endpoint
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Who is Nitin Choudri?\"}"
```

Expected response:
```json
{ "reply": "Nitin Choudri is a Computer Science Engineering student..." }
```

---

## Deploying to Render (Free)

1. Go to https://render.com and sign up (free)
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `chatbot-backend`
5. Set **Build Command:** `npm install`
6. Set **Start Command:** `npm start`
7. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your key from Google AI Studio
8. Click **Deploy**

After deployment, copy your Render URL (e.g. `https://nitin-chatbot.onrender.com`).

### 9. Update frontend
Open `js/chatbot.js` and update line 6:
```js
const BACKEND_URL = 'https://nitin-chatbot.onrender.com';
```

---

## API Reference

### `GET /`
Health check.

**Response:**
```json
{ "status": "ok", "message": "Nitin Choudri's Portfolio Chatbot API is running." }
```

### `POST /api/chat`
Send a message to the AI assistant.

**Request body:**
```json
{
  "message": "What projects has Nitin built?",
  "conversation": []
}
```

**Response:**
```json
{
  "reply": "Nitin has built several projects including..."
}
```

**Rate limit:** 20 requests per 15 minutes per IP.

---

## Security Notes
- API key is stored in `.env` only — never in frontend code
- `.env` is in `.gitignore` — never committed
- CORS restricted to `https://nitinchoudri09.github.io`
- Input sanitized and limited to 500 characters
- Conversation history capped at last 10 messages

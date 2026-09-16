# Nitin Portfolio Chatbot – Backend

Secure Node.js + Express backend powering the AI chatbot on
[Nitin Choudri's Portfolio](https://nitinchoudri09.github.io/).

## Tech Stack
| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| AI | Google Gemini (`@google/generative-ai`) |
| Security | Helmet, express-rate-limit, CORS |

---

## Local Development

### 1. Install dependencies
```bash
cd chatbot-backend
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```
Open `.env` and paste your Gemini API key (free at https://aistudio.google.com/app/apikey).

### 3. Run the server
```bash
npm run dev    # development (auto-reload)
npm start      # production-like
```
Server starts at `http://localhost:3001`.

### 4. Test the endpoint
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Who is Nitin Choudri?\"}"
```

---

## Deploying to Render

### Step-by-step

1. Push the project to a GitHub repository.
2. Go to https://render.com ? **New ? Web Service**.
3. Connect your GitHub repo.
4. Set **Root Directory** to `chatbot-backend`.
5. Set **Build Command:** `npm install`
6. Set **Start Command:** `npm start`
7. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your key from Google AI Studio
8. Click **Deploy**.

> Render sets the `PORT` variable automatically — do not add it manually.

### After deployment

Your service URL will be: `https://nitin-chatbot.onrender.com`

The frontend at `js/chatbot.js` is already configured to point there:
```js
const BACKEND_URL = 'https://nitin-chatbot.onrender.com';
```

---

## API Reference

### `GET /` or `GET /health`
Health check.

**Response:**
```json
{ "status": "online", "service": "Nitin Chatbot Backend", "version": "1.0.0" }
```

### `POST /api/chat`
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "What projects has Nitin built?",
  "conversation": []
}
```

**Response:**
```json
{ "reply": "Nitin has built several projects including..." }
```

**Rate limit:** 20 requests per IP per 15 minutes.

---

## Security Notes
- API key is in `.env` only — never in frontend code.
- `.env` is in `.gitignore` — never committed.
- CORS restricted to `https://nitinchoudri09.github.io` in production.
- Input sanitised and capped at 500 characters.
- Conversation history capped at last 10 messages.
- No Ollama dependency — uses Google Gemini cloud API.

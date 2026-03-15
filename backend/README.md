# Derivity Backend API

A lightweight Express.js REST API that powers the Derivity chatbot and exposes the financial knowledge base.

---

## Folder structure

```
backend/
  server.js           ← Express entry point (port 5000)
  package.json        ← Backend-only dependencies
  routes/
    chat.js           ← POST /api/chat
    faq.js            ← GET  /api/faq
  data/
    knowledge.json    ← All questions & answers
  utils/
    matcher.js        ← Smart question-matching logic
```

---

## Prerequisites

- **Node.js ≥ 18** — download from <https://nodejs.org>

---

## Run locally

```bash
# 1. Move into the backend folder
cd backend

# 2. Install dependencies (first time only)
npm install

# 3. Start the server
node server.js
```

The server starts at **http://localhost:5000**

For auto-restart during development:
```bash
npm run dev   # uses nodemon
```

Create a local env file before running:

```bash
cp .env.example .env
```

---

## API endpoints

### Health check

```
GET /api/health
```

Response:
```json
{ "status": "ok" }
```

---

### Chat

```
POST /api/chat
Content-Type: application/json

{ "message": "what is derivity" }
```

Response:
```json
{
  "reply": "Derivity is a financial intelligence platform that unifies finance tools...",
  "assistantMessage": {
    "role": "assistant",
    "content": "Derivity is a financial intelligence platform that unifies finance tools...",
    "reasoning_details": []
  },
  "model": "openrouter/hunter-alpha"
}
```

You can also send full message history (including `reasoning_details`) to continue reasoning:

```json
{
  "messages": [
    { "role": "user", "content": "How many r's are in strawberry?" },
    {
      "role": "assistant",
      "content": "There are 3 r's.",
      "reasoning_details": []
    },
    { "role": "user", "content": "Are you sure? Think carefully." }
  ]
}
```

Validation errors return HTTP 400.
OpenRouter errors return HTTP 502.

If `OPENROUTER_API_KEY` is not set and you send a single `message`, the server uses the old local matcher fallback.

**Example with curl:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "what is a SIP"}'
```

---

### FAQ — list all knowledge base entries

```
GET /api/faq
```

Response:
```json
{
  "count": 65,
  "faqs": [
    { "question": "what is derivity", "answer": "Derivity is a financial intelligence platform..." },
    { "question": "what is a stock", "answer": "A stock is a small piece of ownership in a company..." }
  ]
}
```

---

## Smart matching

`utils/matcher.js` applies a four-layer strategy:

1. **Exact match** — normalised query matches a key exactly.
2. **Substring match** — one string contains the other.
3. **Bigram similarity** — character bigrams are compared; threshold 0.35.
4. **Token overlap** — at least 50 % of query words must match a key.

All comparisons are case-insensitive with punctuation stripped.

---

## Adding knowledge

Edit `data/knowledge.json`:

```json
{
  "your new question": "Your answer here.",
  "another question": "Another answer."
}
```

Keys are the normalised questions (lowercase, no punctuation).  
Restart the server after saving.

---

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Port the server listens on |
| `ALLOWED_ORIGIN` | `*` | CORS allowed origin (set to your frontend URL in production) |
| `OPENROUTER_API_KEY` | _(none)_ | OpenRouter API key used by `POST /api/chat` |
| `OPENROUTER_MODEL` | `openrouter/hunter-alpha` | Model for chat completions |
| `OPENROUTER_TIMEOUT_MS` | `20000` | OpenRouter request timeout in milliseconds |
| `OPENROUTER_REFERER` | _(none)_ | Optional `HTTP-Referer` header for OpenRouter |
| `OPENROUTER_TITLE` | _(none)_ | Optional `X-Title` header for OpenRouter |

---

## Deploying

### Railway / Render / Fly.io

1. Point the deployment root to the `backend/` folder.
2. Set the start command to `node server.js`.
3. Set `ALLOWED_ORIGIN` to your Vercel frontend URL, e.g. `https://derivity.vercel.app`.

### Vercel (serverless)

Add a `vercel.json` inside `backend/` if deploying as a separate project:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

### Docker (optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## Security notes

- JSON body size is limited to **10 kb** to prevent payload attacks.
- Message length is validated at **500 characters** max.
- CORS is open (`*`) by default for development. **Always set `ALLOWED_ORIGIN` in production.**
- No database — all data is read-only from a local JSON file.

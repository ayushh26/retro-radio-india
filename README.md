# 📻 Retro Radio India

> *Chai pi, gaana sun.* A nostalgia-driven internet radio that plays curated Hindi/Bhojpuri songs organised by the moods and characters of everyday Indian life.

**Live Demo:** *(link once deployed)*

---

## What is this?

Retro Radio India is a themeable radio web app built for that very specific feeling — when a bus driver blasts Kishore Kumar at full volume, or when you're washing dishes and an old song comes on and suddenly you're somewhere else entirely.

You pick a **theme** (a character, a vibe, a moment), and the radio plays a hand-picked playlist for it. No accounts, no ads, no algorithm. Just good old songs.

---

## Themes

| Theme | Vibe |
|---|---|
| ✂️ लक्की Salon | Roadside barbershop gossip & music |
| 🚌 Bus ड्राइवर | Highway horns and highway bangers |
| 🐘 भोजपुरी Bangers | Earth-shattering bass from the heartland |
| 🍽️ Bartan टाइम | Therapeutic kitchen clinks and pressure cooker whistles |
| 🏠 Raju मिस्त्री | Local garage and construction site energy |
| 👨‍👩‍👧 Papa Ke गाने | Rafi, Kishore, and a warm cup of tea |
| 💼 ऑफिस टाइम | Deadlines, chai breaks, and water cooler gossip |
| 🌧️ मूड Off | Dil dukhi hai. Baarish ho rahi hai. |

---

## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) — modular Node.js framework (TypeScript)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — document store for songs & themes
- [Redis](https://redis.io/) — response caching (themes: 1 hr TTL, playlists: 30 min TTL)
- [Swagger](https://swagger.io/) — auto-generated API docs at `/api/docs`

**Frontend**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) — fast SPA build
- [Zustand](https://zustand-demo.pmnd.rs/) — global player state
- [TanStack Query](https://tanstack.com/query) — data fetching with client-side cache
- [React Router v7](https://reactrouter.com/) — routing

**Infrastructure**
- Docker + Docker Compose — one-command local environment

---

## Architecture

```
┌─────────────────────────────────────────┐
│               Browser                    │
│  React + Zustand + TanStack Query        │
│  YouTube iframe API (playback)           │
└──────────────┬──────────────────────────┘
               │ /api  (HTTP)
┌──────────────▼──────────────────────────┐
│            NestJS API (port 3000)        │
│  GET /themes   GET /radio/:slug          │
│  GET /songs    POST /analytics/events    │
└──────┬───────────────────┬──────────────┘
       │                   │
┌──────▼──────┐    ┌───────▼──────┐
│   MongoDB   │    │    Redis     │
│  songs      │    │  cache layer │
│  themes     │    │              │
│  analytics  │    └──────────────┘
└─────────────┘
```

The app is **fully public** — no login, no accounts. Songs and themes are managed directly in MongoDB (content is curated, not crowdsourced).

---

## Project Structure

```
retro-radio-india/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── themes/          # GET /themes
│   │   │   ├── songs/           # GET /songs, GET /songs/theme/:slug
│   │   │   ├── radio/           # GET /radio/:slug  (playlist assembler)
│   │   │   └── analytics/       # POST /analytics/events
│   │   ├── common/
│   │   │   └── redis/           # Caching service
│   │   └── database/
│   │       └── seeds/           # Theme seeder (npm run seed)
│   └── docker-compose.yml
└── frontend/
    └── src/
        ├── components/          # MusicPlayer, ThemeSelector, YouTubePlayer
        ├── config/
        │   └── themeVisuals.ts  # Per-theme colors, backgrounds, quotes
        ├── hooks/               # useRadio, useThemes (TanStack Query)
        └── store/
            └── player.store.ts  # Zustand: playlist, play/pause, shuffle, repeat
```

---

## Running Locally

**Prerequisites:** Node 20+, Docker

### 1. Start infrastructure (MongoDB + Redis)

```bash
docker compose up -d mongodb redis
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # set MONGODB_URI, REDIS_URL
npm install
npm run seed                # seed themes into MongoDB
npm run start:dev           # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Or run everything with Docker:

```bash
docker compose up           # starts mongo, redis, backend, frontend
```

---

## API Overview

All endpoints are public read-only. Full docs at `/api/docs` (Swagger UI).

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/themes` | All active themes |
| GET | `/api/themes/:slug` | Single theme by slug |
| GET | `/api/songs` | Songs with pagination + filters |
| GET | `/api/songs/theme/:slug` | Songs for a specific theme |
| GET | `/api/radio/:slug` | Full playlist for a theme |
| POST | `/api/analytics/events` | Track play/skip/complete events |

---

## Content Management

Songs and themes are managed **directly in MongoDB** — no admin UI. To add a song, insert a document into the `songs` collection:

```js
db.songs.insertOne({
  title: "Ek Ladki Ko Dekha",
  artist: "Kumar Sanu",
  movie: "1942: A Love Story",
  year: 1994,
  youtubeVideoId: "ABC123xyz",
  themes: ["mood-off", "papa-ke-gaane"],
  isActive: true,
  playCount: 0
})
```

To add a new theme, add an entry to `seed.service.ts` and run `npm run seed` (upsert-safe — existing songs are never touched).

---

## Key Design Decisions

- **YouTube for playback** — no audio hosting costs; YouTube's CDN handles delivery globally.
- **Redis caching** — theme and playlist responses are cached to avoid repeated DB reads on every track change.
- **Soft deletes via `isActive`** — songs and themes can be hidden without data loss.
- **No auth, no write API** — the site is intentionally read-only for visitors. Content is curated and added via DB access, keeping the surface area small and the site abuse-proof.

---

## License

MIT

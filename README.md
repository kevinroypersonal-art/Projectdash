# Projectdash

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in your Convex keys
```

## Convex

This project uses [Convex](https://convex.dev) as the backend.

- **Cloud URL**: `https://hardy-gazelle-568.convex.cloud`
- **HTTP Actions URL**: `https://hardy-gazelle-568.convex.site`

`CONVEX_DEPLOY_KEY` and `CONVEX_URL` live in `.env.local` (gitignored).

### Run the Convex dev server

```bash
npm run dev:convex
```

### Deploy

```bash
npm run deploy:convex
```

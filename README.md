# TrustVault

TrustVault is a full-stack banking demo with:

- a React + Vite frontend in [Frontend](/e:/All-Projects/trustvault/Frontend)
- a local Express API in [Backend](/e:/All-Projects/trustvault/Backend)

The backend now runs in local demo mode and stores data on disk in `Backend/data/store.json`, so you do not need MongoDB to use the project.

## Quick Start

1. Start the backend:

```bash
npm run backend:start
```

2. Start the frontend in a second terminal:

```bash
npm run frontend:dev
```

3. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Root Scripts

- `npm run backend:start`
- `npm run backend:dev`
- `npm run frontend:dev`
- `npm run frontend:lint`
- `npm run frontend:build`
- `npm run check`

## What Works

- User registration and login
- Session restore on refresh
- Starter checking and savings accounts for new users
- Account listing and account creation
- Transaction history
- Transfers between your own accounts

## Notes

- The frontend expects the API at `http://localhost:5000/api` by default.
- You can override that with `VITE_API_URL`.
- The backend listens on `PORT`, or `5000` if `PORT` is not set.
- Local demo data is ignored by git through [`.gitignore`](/e:/All-Projects/trustvault/.gitignore).

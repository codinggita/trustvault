# TrustVault

TrustVault is a premium full-stack banking application built with the MERN stack. It combines secure cookie-based authentication, MongoDB-backed ledger transactions, and a luxury dark frontend experience for account management, transfers, analytics, and profile controls.

## Screenshots

Add screenshots here after running the app:

- `docs/screenshots/landing.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/transfer.png`
- `docs/screenshots/transactions.png`

## Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-111111?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![JWT](https://img.shields.io/badge/JWT-111111?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-3E2E25?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-1C1B2E?style=for-the-badge&logo=vite&logoColor=FFD62E)

## Features

- Secure authentication with JWT stored in HTTP-only cookies
- Registration flow that creates a user, account, and welcome funding transfer
- MongoDB transaction-backed transfers with idempotency support
- Treasury seed flow for system user and system account creation
- Account balance calculation from immutable ledger entries
- Admin-only account funding and status controls
- Premium React dashboard with charts, filters, wizard-based transfers, and profile/security UI
- Responsive dark luxury design using Tailwind CSS and Framer Motion

## Prerequisites

- Node.js 20+ recommended
- npm 10+
- MongoDB replica set or MongoDB Atlas
- SMTP credentials for real email delivery

Important:

- MongoDB multi-document transactions require a replica set. For local development, use a replica-set-enabled MongoDB instance before testing transfers and registration funding.

## Installation

1. Clone the repository and enter it:

```bash
git clone <your-repo-url>
cd Trust_Vault
```

2. Install all dependencies:

```bash
npm install
npm run install:all
```

3. Create environment files:

```bash
copy backend\\.env.example backend\\.env
copy frontend\\.env.example frontend\\.env
```

4. Update `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustvault
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=3d
COOKIE_EXPIRY=259200000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
SYSTEM_USER_EMAIL=admin@trustvault.com
SYSTEM_USER_PASSWORD=change_this_before_seeding
SYSTEM_ACCOUNT_ID=
NODE_ENV=development
```

5. Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

6. Seed the treasury account:

```bash
cd backend
npm run seed
```

After seeding, copy the printed `SYSTEM_ACCOUNT_ID` into `backend/.env`.
The seeded system user's email comes from `SYSTEM_USER_EMAIL`, and its password is read from your local `SYSTEM_USER_PASSWORD`.

7. Start both apps:

```bash
cd ..
npm run dev
```

Frontend runs at `http://localhost:5173`

Backend runs at `http://localhost:5000`

## Development Notes

- Auth restoration happens on app load through `GET /api/auth/me`
- Cookies use `sameSite: lax` in development and `strict` in production
- Backend API routes are all prefixed with `/api`
- Registration automatically credits new users with `₹10,000` from the system account

## Scripts

### Root

- `npm run dev` - runs backend and frontend together
- `npm run install:all` - installs backend and frontend dependencies

### Backend

- `npm run dev` - starts the Express server with nodemon
- `npm run seed` - creates the system user and treasury account
- `npm start` - starts the backend in normal mode

### Frontend

- `npm run dev` - starts Vite
- `npm run build` - creates a production build
- `npm run preview` - previews the production build

## API Documentation

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register user, create account, set auth cookie, send welcome email |
| POST | `/api/auth/login` | Public | Authenticate user and set auth cookie |
| POST | `/api/auth/logout` | Public | Blacklist current token and clear auth cookie |
| GET | `/api/auth/me` | Cookie | Restore authenticated user and accounts |
| GET | `/api/accounts` | Cookie | Fetch all authenticated user accounts with balances |
| GET | `/api/accounts/:accountId` | Cookie | Fetch one account with balance and recent transactions |
| PATCH | `/api/accounts/:accountId/status` | Cookie + System User | Update account status |
| POST | `/api/transactions/transfer` | Cookie | Execute idempotent transfer between accounts |
| GET | `/api/transactions` | Cookie | Paginated transaction history with filters |
| GET | `/api/transactions/:transactionId` | Cookie | Fetch one transaction with ledger entries |
| POST | `/api/admin/fund-account` | Cookie + System User | Fund a user account from the system treasury |
| GET | `/api/health` | Public | Basic health check |

## Folder Structure

```text
Trust_Vault/
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |   `-- email.js
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- validators/
|   |-- .env.example
|   |-- package.json
|   |-- seed.js
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- stores/
|   |   |-- styles/
|   |   `-- utils/
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- package.json
`-- README.md
```

## Verification

Completed locally in this workspace:

- Backend source syntax check with `node --check`
- Frontend production build with `npm run build`
- Backend dependency audit after upgrading `bcrypt` and `nodemailer`

## Deployment

### Backend

- Set `NODE_ENV=production`
- Use a production MongoDB replica set or Atlas cluster
- Set a strong `JWT_SECRET`
- Configure a real SMTP provider
- Run `npm start` inside `backend`

### Frontend

- Run `npm run build` inside `frontend`
- Deploy the `frontend/dist` directory to your static host
- Set `VITE_API_URL` to the deployed backend `/api` URL before building

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes with tests or verification notes
4. Open a pull request with screenshots for UI changes

## License

MIT

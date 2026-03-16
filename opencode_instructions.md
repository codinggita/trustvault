# TrustVault Frontend - OpenCode Master Instructions

You are OpenCode, an expert AI developer. Your task is to build the complete frontend for **TrustVault**, a comprehensive banking and financial management system. The backend (built on Node.js/Express/MongoDB) is already complete with core endpoints for Auth, Accounts, and Transactions.

## 🌟 Primary Directives & Workflow Rules
1. **Premium Aesthetic Requirement:** The frontend MUST feature a world-class, modern, and premium design. Implement glassmorphism, smooth micro-animations, vibrant gradients, and a sleek dark/light mode option. It should feel like a high-end fintech application.
2. **Batch Implementation Strategy:** Do not attempt to write the entire app at once. Implement features step-by-step.
3. **Continuous Version Control:** ⚠️ **CRITICAL RULE**: Every time you modify or add 8 to 10 files, you MUST commit the changes and push everything to GitHub. Use meaningful commit messages reflecting the batch of work completed.
4. **Use Output Maximization:** Use all your advanced capabilities to auto-resolve dependencies, fix linter errors proactively, and configure the project without asking the user for trivial decisions.

## 🛠️ Technology Stack
- **Framework:** React with TypeScript (Build with Vite).
- **Styling:** TailwindCSS with a premium UI library like Shadcn UI or Aceternity UI.
- **Animations:** Framer Motion for page transitions and interactive elements.
- **State Management:** Zustand for lightweight global state (auth, user session).
- **Routing:** React Router DOM (v6+).
- **API Communication:** Axios with interceptors to handle the JWT session cookies and authorization tokens.

## 🚀 Step-by-Step Execution Plan

### Step 1: Initialization & Base Setup
- Create a new project folder named `Frontend` in the root (if it doesn't exist) using `npm create vite@latest Frontend -- --template react-ts`.
- Install core dependencies: TailwindCSS, React Router, Zustand, Axios, Framer Motion, Lucide-React.
- Set up `tailwind.config.js` with a premium color palette (e.g., deep slate backgrounds, electric blue or emerald primary accents).
- **Action:** Push to GitHub (Commit: "chore: init frontend project and core dependencies").

### Step 2: Component Library & Design System
- Create a reusable `components` folder.
- Implement base components: Button, Input, Card, Modal, Sidebar, Navbar.
- Ensure all components have hover effects, focus rings, and smooth transitions.
- **Action:** Push to GitHub if file count threshold is reached.

### Step 3: Auth System (Login & Registration)
- Build the `Login` and `Register` pages.
- Integrate with backend endpoints (`POST /api/auth/login`, `POST /api/auth/register`).
- Design beautiful auth forms with validation and error handling.
- Implement the Zustand store `useAuthStore` to manage user sessions based on the backend JWT response.
- **Action:** Push to GitHub (Commit: "feat: implemented auth flows and state management").

### Step 4: Core Dashboard Layout
- Build a responsive layout shell: a Sidebar navigation (mobile-friendly hamburger menu) and Topbar with user profile/logout.
- Create the Main Dashboard view showing: Total Balance (aggregated from accounts), Recent Transactions list, and quick action buttons.
- Implement Protected Route wrappers so only authenticated users can view the dashboard.

### Step 5: Account & Transaction Management Interfaces
- Build the **Accounts Page**: View all accounts, their statuses (ACTIVE/FROZEN/CLOSED), and respective balances (`GET /api/accounts` and `GET /api/accounts/:accountId/balance`).
- Build a "Create Account" modal (`POST /api/accounts`).
- Build the **Transfers Page**: A sleek form to transfer funds between accounts (`POST /api/transactions`). Use idempotency keys under the hood. Include confirmation dialogs.
- **Action:** Push to GitHub (Commit: "feat: dashboard, account management, and transactions UI").

### Step 6: Polish & Finish
- Add toasts/notifications for successful transfers, logins, and errors.
- Ensure all API calls have loading states (spinners or skeletons).
- Review all responsive breakpoints to ensure mobile perfection.
- Final commit and push to GitHub.

---
**Dear OpenCode:** Begin execution from **Step 1** immediately. Read the backend's `README.md` if you need to double-check exact endpoint paths. Do not wait for user input unless absolutely blocked. Remember your GitHub push rule (every 8-10 files)!

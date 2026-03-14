# trustvault

# Banking-Manager: Complete Financial Management System

A comprehensive banking and financial management system consisting of a secure backend ledger service and an intuitive frontend interface. This project aims to provide a complete solution for managing personal and business finances with robust security, real-time transaction processing, and user-friendly interfaces.

## Project Vision

The Banking-Manager system is designed to be a full-stack financial management platform that includes:

- **Secure Backend Service** (Currently Implemented): A robust Node.js/Express/MongoDB API handling authentication, account management, and transaction processing
- **Intuitive Frontend Interface** (Planned): A responsive React/Vue.js application for users to manage accounts, view transactions, and perform financial operations
- **Complete Financial Ecosystem**: From user onboarding to complex transaction handling with proper audit trails

## Current Implementation: TrustVault Backend

The backend service (TrustVault) provides the foundation for the banking system with these core features:

### 1. User Authentication
- Secure user registration with email validation and password hashing
- JWT-based login system with 3-day token expiry
- Cookie-based session management with proper logout functionality
- Protected routes with authentication middleware
- System user middleware for privileged operations

### 2. Account Management
- Account creation associated with users
- Account status management (ACTIVE, FROZEN, CLOSED)
- Multi-currency support (default: INR)
- Balance calculation from ledger entries
- Account retrieval for authenticated users

### 3. Transaction Processing
- Secure fund transfers between accounts
- Idempotency key support to prevent duplicate transactions
- 10-step transaction flow ensuring data consistency:
  1. Request validation
  2. Idempotency validation
  3. Account status check
  4. Sender balance verification
  5. Transaction creation (PENDING)
  6. DEBIT ledger entry creation
  7. CREDIT ledger entry creation
  8. Transaction completion (COMPLETED)
  9. MongoDB session commit
  10. Email notification
- Initial funds transfer from system account
- Email notifications for transactions

### 4. Data Models
- **User**: Email, name, password (hashed), system user flag
- **Account**: User reference, status, currency, timestamps
- **Transaction**: From/to accounts, amount, idempotency key, status
- **Ledger**: Account reference, amount, transaction reference, type (DEBIT/CREDIT)
- **BlackList**: Token blacklisting for logout functionality

### 5. Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Token blacklisting on logout
- Input validation and sanitization
- Protected routes with middleware
- MongoDB transactions for atomic operations
- Environment variable configuration

### 6. Email Service Integration
- Registration email notifications
- Transaction confirmation emails
- Nodemailer integration

## Future Frontend Implementation

The planned frontend will complement the backend with:

### User Interface Features
- Responsive design for mobile and desktop access
- Secure login/authentication flows
- Dashboard with account overview and recent transactions
- Account management interface (create, view, update accounts)
- Transaction initiation and history viewing
- Transfer funds between accounts
- Profile management and settings
- Notification center for transaction alerts

### Technology Stack (Planned)
- **Framework**: React.js or Vue.js with modern hooks/composition API
- **State Management**: Redux/Zustand or Vuex/Pinia
- **UI Components**: Material-UI/Ant Design or custom component library
- **HTTP Client**: Axios for API communication
- **Routing**: React Router or Vue Router
- **Form Handling**: Formik/Yup or VeeValidate
- **Real-time Updates**: WebSocket integration for live transaction updates
- **Build Tool**: Vite or Create React App/Vue CLI
- **Testing**: Jest/Vitest with React Testing Library or Vue Test Utils

### Security Considerations
- HTTP-only cookies for JWT storage
- CSRF protection
- Input sanitization and validation
- Secure API communication (HTTPS)
- Rate limiting implementation
- Security headers implementation

## API Endpoints (Backend)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Accounts
- `POST /api/accounts` - Create new account (auth required)
- `GET /api/accounts` - Get user's accounts (auth required)
- `GET /api/accounts/:accountId/balance` - Get account balance (auth required)

### Transactions
- `POST /api/transactions` - Create transaction (auth required)
- `POST /api/transactions/initial-funds` - Create initial funds transaction (auth required)

## Project Structure

```
banking-manager/
├── backend-ledger-main/          # Current backend implementation
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── controllers/        # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── account.controller.js
│   │   │   └── transaction.controller.js
│   │   ├── middleware/         # Custom middleware
│   │   │   └── auth.middleware.js
│   │   ├── models/             # Database schemas
│   │   │   ├── user.model.js
│   │   │   ├── account.model.js
│   │   │   ├── ledger.model.js
│   │   │   ├── transaction.model.js
│   │   │   └── blackList.model.js
│   │   ├── routes/             # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── account.routes.js
│   │   │   └── transaction.routes.js
│   │   └── services/           # External services
│   │       └── email.service.js
│   ├── server.js               # Server entry point
│   ├── package.json            # Dependencies and scripts
│   └── package-lock.json
├── frontend/                     # Future frontend implementation
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── docker/                       # Deployment configurations
├── docs/                         # Documentation
└── README.md                     # This file
```

## Setup Instructions (Backend Only - Current Implementation)

1. Navigate to the backend directory:
   ```bash
   cd backend-ledger-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev    # Development mode with nodemon
   npm start      # Production mode
   ```

## Environment Variables

Required environment variables for the backend:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `EMAIL_USER`: Email service username (for notifications)
- `EMAIL_PASS`: Email service password (for notifications)
- `EMAIL_SERVICE`: Email service provider (e.g., Gmail, Outlook)
- `PORT`: Server port (default: 5000)

## API Documentation

Once the frontend is implemented, API documentation will be available via:
- Swagger UI at `/api-docs`
- OpenAPI specification at `/api-spec.json`

## Development Roadmap

### Phase 1: Backend Core (Current)
- ✅ User authentication system
- ✅ Account management
- ✅ Transaction processing with ledger
- ✅ Security implementations
- ✅ Email notifications

### Phase 2: Backend Enhancements
- 🔄 Comprehensive testing suite
- 🔄 API documentation (Swagger/OpenAPI)
- 🔄 Rate limiting and security enhancements
- 🔄 Logging and monitoring
- 🔄 Docker containerization
- 🔄 Deployment scripts

### Phase 3: Frontend Development
- 📝 UI/UX design and prototyping
- 📝 Authentication flows (login/register)
- 📝 Dashboard and account overview
- 📝 Transaction initiation and history
- 📝 Profile management
- 📝 Responsive design implementation

### Phase 4: Testing & Deployment
- 📝 Integration testing (frontend-backend)
- 📝 Performance optimization
- 📝 Security auditing
- 📝 Production deployment
- 📝 Documentation and user guides

## Contributing

Contributions to the Banking-Manager project are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact

For questions or support regarding the Banking-Manager project, please open an issue in the repository.

---

*Note: This README describes both the current backend implementation and the planned full system. The frontend components are planned for future development phases.*
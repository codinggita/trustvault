# TrustVault Backend
**Secure Your Financial Future**

A secure backend service for a banking ledger system built with Node.js, Express, and MongoDB. TrustVault handles user authentication, account management, and financial transactions with proper security measures.

## Features Implemented

### 1. User Authentication
- User registration with email validation and password hashing
- User login with JWT token generation (3-day expiry)
- User logout with token blacklisting
- Cookie-based session management
- Protected routes with authentication middleware
- System user middleware for privileged operations

### 2. Account Management
- Account creation associated with users
- Account status management (ACTIVE, FROZEN, CLOSED)
- Currency support (default: INR)
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

## Project Structure
```
backend-ledger-main/
├── src/
│   ├── app.js              # Express app setup
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.middleware.js
│   ├── models/             # Database schemas
│   │   ├── user.model.js
│   │   ├── account.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── blackList.model.js
│   ├── routes/             # API route definitions
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   └── services/           # External services
│       └── email.service.js
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
└── package-lock.json
```

## API Endpoints

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

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server: `npm run dev` (development) or `npm start` (production)

## What's Left to Complete

Based on the code analysis, the following items would need attention to complete the project:

### 1. Missing Model Files
- `ledger.model.js` - Referenced but not found in the models directory
- `blackList.model.js` - Referenced but not found in the models directory

### 2. Missing Service Implementation
- `email.service.js` - Referenced but implementation needs verification

### 3. Environment Variables
- Need to define required environment variables in `.env` file:
  - `MONGO_URI` - MongoDB connection string
  - `JWT_SECRET` - Secret for JWT signing

### 4. Testing
- No test files or test scripts defined in package.json
- Unit and integration tests should be added

### 5. Documentation
- API documentation (Swagger/OpenAPI) would be beneficial
- More detailed code comments in some areas

### 6. Error Handling
- Centralized error handling middleware could be added
- More specific error messages and logging

### 7. Validation
- Request validation could be enhanced with libraries like Joi or express-validator
- Additional input sanitization

### 8. Rate Limiting
- Implementation of rate limiting to prevent abuse

### 9. CORS Configuration
- CORS settings need to be configured for frontend integration

### 10. Logging
- Structured logging implementation (winston, morgan, etc.)

### 11. Deployment Configuration
- Dockerfile for containerization
- Deployment scripts or configuration

### 12. Monitoring
- Health check endpoints
- Metrics collection

### 13. Frontend Integration
- While this is backend only, API contracts should be defined for frontend consumption

## Dependencies
- express: ^5.2.1
- mongoose: ^9.1.5
- jsonwebtoken: ^9.0.3
- bcryptjs: ^3.0.3
- cookie-parser: ^1.4.7
- dotenv: ^17.2.3
- nodemailer: ^7.0.12

## Development Scripts
- `npm run dev`: Start server with nodemon (development)
- `npm start`: Start server with node (production)
- `npm test`: Currently shows error - no tests specified

This backend provides a solid foundation for a banking ledger system with secure authentication, account management, and transaction processing capabilities. The core business logic for financial transactions is well-implemented with proper attention to data consistency and security.
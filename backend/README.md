# Dasta Backend API

A secure Express.js backend API for the Dasta Stellar AI Agent with JWT authentication, rate limiting, and wallet integration.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Multiple rate limiting strategies for different endpoints
- **Wallet Integration** - Stellar wallet address validation and operations
- **Security** - Helmet, CORS, input validation, and sanitization
- **Error Handling** - Comprehensive error handling and logging
- **API Documentation** - RESTful API with clear endpoints

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔐 Authentication Flow

1. **Connect Wallet** - User connects wallet → Backend generates JWT tokens
2. **Token Storage** - Tokens stored in browser localStorage
3. **API Requests** - All requests include access token + wallet address
4. **Token Refresh** - Automatic token refresh when expired

## 📡 API Endpoints

### Authentication

#### `POST /api/auth/connect`
Connect wallet and generate tokens.

**Request:**
```json
{
  "walletAddress": "GCUE26...F4JN",
  "signature": "optional_signature"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet connected successfully",
  "data": {
    "walletAddress": "GCUE26...F4JN",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": "24h",
    "refreshExpiresIn": "7d"
  }
}
```

#### `POST /api/auth/refresh`
Refresh access token using refresh token.

**Request:**
```json
{
  "token": "refresh_token"
}
```

#### `POST /api/auth/verify`
Verify token validity.

**Request:**
```json
{
  "token": "access_token"
}
```

#### `POST /api/auth/disconnect`
Disconnect wallet and invalidate tokens.

### API Endpoints

#### `GET /api/profile`
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

#### `GET /api/wallet/balance`
Get wallet balance (requires authentication).

#### `GET /api/wallet/transactions`
Get transaction history (requires authentication).

**Query Parameters:**
- `limit` (default: 10)
- `offset` (default: 0)

#### `POST /api/wallet/send`
Send payment (requires authentication).

**Request:**
```json
{
  "walletAddress": "GCUE26...F4JN",
  "toAddress": "GB7XY...K9LM",
  "amount": "100.0000000",
  "asset": "XLM",
  "memo": "Payment memo"
}
```

#### `GET /api/leaderboard`
Get leaderboard data (requires authentication).

**Query Parameters:**
- `type` (default: "weekly", options: "weekly", "monthly")

## 🛡️ Security Features

### Rate Limiting
- **General**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Wallet Operations**: 30 requests per minute
- **API Endpoints**: 60 requests per minute

### JWT Security
- **Access Token**: 24 hours expiration
- **Refresh Token**: 7 days expiration
- **Token Rotation**: Automatic refresh on expiration
- **Token Validation**: Issuer and audience validation

### Input Validation
- **Wallet Address**: Stellar address format validation
- **Request Sanitization**: XSS protection
- **CORS**: Configured for frontend origin

## 🔧 Development

### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js          # Main application
├── package.json
├── env.example
└── README.md
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Access token expiration | 24h |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🚀 Deployment

1. **Set environment variables** for production
2. **Install dependencies**: `npm install --production`
3. **Start server**: `npm start`

## 📝 TODO

- [ ] Integrate with Stellar SDK for real blockchain operations
- [ ] Add database integration for user data
- [ ] Implement wallet signature verification
- [ ] Add WebSocket support for real-time updates
- [ ] Add comprehensive logging and monitoring
- [ ] Implement token blacklisting for logout
- [ ] Add API documentation with Swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 
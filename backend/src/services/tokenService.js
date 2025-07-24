const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class TokenService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // Generate access token
  generateAccessToken(walletAddress) {
    const payload = {
      walletAddress,
      type: 'access',
      jti: uuidv4(), // JWT ID for token tracking
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'dasta-api',
      audience: 'dasta-client'
    });
  }

  // Generate refresh token
  generateRefreshToken(walletAddress) {
    const payload = {
      walletAddress,
      type: 'refresh',
      jti: uuidv4(),
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.refreshExpiresIn,
      issuer: 'dasta-api',
      audience: 'dasta-client'
    });
  }

  // Verify token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: 'dasta-api',
        audience: 'dasta-client'
      });
      return { valid: true, payload: decoded };
    } catch (error) {
      return { 
        valid: false, 
        error: error.message,
        expired: error.name === 'TokenExpiredError'
      };
    }
  }

  // Refresh access token
  refreshAccessToken(refreshToken) {
    const verification = this.verifyToken(refreshToken);
    
    if (!verification.valid) {
      throw new Error('Invalid refresh token');
    }

    if (verification.payload.type !== 'refresh') {
      throw new Error('Token is not a refresh token');
    }

    return this.generateAccessToken(verification.payload.walletAddress);
  }

  // Generate token pair (access + refresh)
  generateTokenPair(walletAddress) {
    return {
      accessToken: this.generateAccessToken(walletAddress),
      refreshToken: this.generateRefreshToken(walletAddress),
      expiresIn: this.expiresIn,
      refreshExpiresIn: this.refreshExpiresIn
    };
  }

  // Extract wallet address from token
  getWalletAddressFromToken(token) {
    const verification = this.verifyToken(token);
    if (!verification.valid) {
      throw new Error('Invalid token');
    }
    return verification.payload.walletAddress;
  }

  // Check if token is expired
  isTokenExpired(token) {
    const verification = this.verifyToken(token);
    return !verification.valid && verification.expired;
  }
}

module.exports = new TokenService(); 
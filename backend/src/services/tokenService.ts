import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload {
  walletAddress: string;
  type: 'access' | 'refresh';
  jti: string;
  iat: number;
}

interface TokenVerification {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
  expired?: boolean;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

class TokenService {
  private secret: string;
  private expiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // Generate access token
  generateAccessToken(walletAddress: string): string {
    const payload: TokenPayload = {
      walletAddress,
      type: 'access',
      jti: uuidv4(), // JWT ID for token tracking
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'dasta-api',
      audience: 'dasta-client'
    } as jwt.SignOptions);
  }

  // Generate refresh token
  generateRefreshToken(walletAddress: string): string {
    const payload: TokenPayload = {
      walletAddress,
      type: 'refresh',
      jti: uuidv4(),
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.refreshExpiresIn,
      issuer: 'dasta-api',
      audience: 'dasta-client'
    } as jwt.SignOptions);
  }

  // Verify token
  verifyToken(token: string): TokenVerification {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: 'dasta-api',
        audience: 'dasta-client'
      }) as TokenPayload;
      return { valid: true, payload: decoded };
    } catch (error: any) {
      return { 
        valid: false, 
        error: error.message,
        expired: error.name === 'TokenExpiredError'
      };
    }
  }

  // Refresh access token
  refreshAccessToken(refreshToken: string): string {
    const verification = this.verifyToken(refreshToken);
    
    if (!verification.valid) {
      throw new Error('Invalid refresh token');
    }

    if (verification.payload?.type !== 'refresh') {
      throw new Error('Token is not a refresh token');
    }

    return this.generateAccessToken(verification.payload.walletAddress);
  }

  // Generate token pair (access + refresh)
  generateTokenPair(walletAddress: string): TokenPair {
    return {
      accessToken: this.generateAccessToken(walletAddress),
      refreshToken: this.generateRefreshToken(walletAddress),
      expiresIn: this.expiresIn,
      refreshExpiresIn: this.refreshExpiresIn
    };
  }

  // Extract wallet address from token
  getWalletAddressFromToken(token: string): string {
    const verification = this.verifyToken(token);
    if (!verification.valid || !verification.payload) {
      throw new Error('Invalid token');
    }
    return verification.payload.walletAddress;
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const verification = this.verifyToken(token);
    return !verification.valid && verification.expired === true;
  }
}

export default new TokenService(); 
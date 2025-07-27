import { Request, Response, NextFunction } from 'express';
import tokenService from '../services/tokenService';
import { isValidStellarAddress } from '../utils/validation';

// Extend Express Request interface to include custom properties
declare global {
  namespace Express {
    interface Request {
      walletAddress?: string;
      token?: string;
      isAuthenticated?: boolean;
    }
  }
}

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid access token in the Authorization header'
    });
    return;
  }

  try {
    const verification = tokenService.verifyToken(token);
    
    if (!verification.valid) {
      res.status(401).json({
        error: 'Invalid token',
        message: verification.error
      });
      return;
    }

    if (!verification.payload || verification.payload.type !== 'access') {
      res.status(401).json({
        error: 'Invalid token type',
        message: 'Access token required'
      });
      return;
    }

    // Add wallet address to request
    req.walletAddress = verification.payload.walletAddress;
    req.token = token;
    next();
  } catch (error: any) {
    res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    });
    return;
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const verification = tokenService.verifyToken(token);
      
      if (verification.valid && verification.payload && verification.payload.type === 'access') {
        req.walletAddress = verification.payload.walletAddress;
        req.token = token;
        req.isAuthenticated = true;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.isAuthenticated = false;
    }
  } else {
    req.isAuthenticated = false;
  }

  next();
};

// Validate wallet address in request body
const validateWalletInBody = (req: Request, res: Response, next: NextFunction): void => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    res.status(400).json({
      error: 'Wallet address required',
      message: 'Please provide a wallet address in the request body'
    });
    return;
  }

  if (!isValidStellarAddress(walletAddress)) {
    res.status(400).json({
      error: 'Invalid wallet address',
      message: 'Please provide a valid Stellar wallet address'
    });
    return;
  }

  // Check if wallet address matches the authenticated user
  if (req.walletAddress && req.walletAddress !== walletAddress) {
    res.status(403).json({
      error: 'Wallet address mismatch',
      message: 'Wallet address in request body must match authenticated wallet'
    });
    return;
  }

  next();
};

// Validate wallet address in URL parameters
const validateWalletInParams = (req: Request, res: Response, next: NextFunction): void => {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    res.status(400).json({
      error: 'Wallet address required',
      message: 'Please provide a wallet address in the URL parameters'
    });
    return;
  }

  if (!isValidStellarAddress(walletAddress)) {
    res.status(400).json({
      error: 'Invalid wallet address',
      message: 'Please provide a valid Stellar wallet address'
    });
    return;
  }

  // Check if wallet address matches the authenticated user
  if (req.walletAddress && req.walletAddress !== walletAddress) {
    res.status(403).json({
      error: 'Wallet address mismatch',
      message: 'Wallet address in URL must match authenticated wallet'
    });
    return;
  }

  next();
};

// Require authentication for specific routes
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.isAuthenticated) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'This endpoint requires authentication'
    });
    return;
  }
  next();
};

export {
  authenticateToken,
  optionalAuth,
  validateWalletInBody,
  validateWalletInParams,
  requireAuth
}; 
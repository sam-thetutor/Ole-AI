const tokenService = require('../services/tokenService');
const { isValidStellarAddress } = require('../utils/validation');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid access token in the Authorization header'
    });
  }

  try {
    const verification = tokenService.verifyToken(token);
    
    if (!verification.valid) {
      return res.status(401).json({
        error: 'Invalid token',
        message: verification.error
      });
    }

    if (verification.payload.type !== 'access') {
      return res.status(401).json({
        error: 'Invalid token type',
        message: 'Access token required'
      });
    }

    // Add wallet address to request
    req.walletAddress = verification.payload.walletAddress;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const verification = tokenService.verifyToken(token);
      
      if (verification.valid && verification.payload.type === 'access') {
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
const validateWalletInBody = (req, res, next) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      error: 'Wallet address required',
      message: 'Please provide a wallet address in the request body'
    });
  }

  if (!isValidStellarAddress(walletAddress)) {
    return res.status(400).json({
      error: 'Invalid wallet address',
      message: 'Please provide a valid Stellar wallet address'
    });
  }

  // Check if wallet address matches the authenticated user
  if (req.walletAddress && req.walletAddress !== walletAddress) {
    return res.status(403).json({
      error: 'Wallet address mismatch',
      message: 'Wallet address in request body must match authenticated wallet'
    });
  }

  next();
};

// Validate wallet address in URL parameters
const validateWalletInParams = (req, res, next) => {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return res.status(400).json({
      error: 'Wallet address required',
      message: 'Please provide a wallet address in the URL parameters'
    });
  }

  if (!isValidStellarAddress(walletAddress)) {
    return res.status(400).json({
      error: 'Invalid wallet address',
      message: 'Please provide a valid Stellar wallet address'
    });
  }

  // Check if wallet address matches the authenticated user
  if (req.walletAddress && req.walletAddress !== walletAddress) {
    return res.status(403).json({
      error: 'Wallet address mismatch',
      message: 'Wallet address in URL must match authenticated wallet'
    });
  }

  next();
};

// Require authentication for specific routes
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'This endpoint requires authentication'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  validateWalletInBody,
  validateWalletInParams,
  requireAuth
}; 
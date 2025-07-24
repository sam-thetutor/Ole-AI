const express = require('express');
const router = express.Router();
const tokenService = require('../services/tokenService');
const { validateAuthRequest, validateTokenRequest } = require('../utils/validation');
const { authLimiter } = require('../config/rateLimit');

// Connect wallet and generate tokens
router.post('/connect', authLimiter, validateAuthRequest, async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    // TODO: Verify wallet signature if provided
    // For now, we'll trust the wallet address
    // In production, you should verify the signature to ensure the user owns the wallet

    // Generate token pair
    const tokens = tokenService.generateTokenPair(walletAddress);

    res.status(200).json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        walletAddress,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        refreshExpiresIn: tokens.refreshExpiresIn
      }
    });
  } catch (error) {
    console.error('Auth connect error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Failed to connect wallet'
    });
  }
});

// Refresh access token
router.post('/refresh', authLimiter, validateTokenRequest, async (req, res) => {
  try {
    const { token } = req.body;

    // Verify it's a refresh token
    const verification = tokenService.verifyToken(token);
    
    if (!verification.valid) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: verification.error
      });
    }

    if (verification.payload.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type',
        message: 'Refresh token required'
      });
    }

    // Generate new access token
    const newAccessToken = tokenService.generateAccessToken(verification.payload.walletAddress);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        expiresIn: tokenService.expiresIn
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Failed to refresh access token'
    });
  }
});

// Verify token
router.post('/verify', authLimiter, validateTokenRequest, async (req, res) => {
  try {
    const { token } = req.body;

    const verification = tokenService.verifyToken(token);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: verification.error
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        walletAddress: verification.payload.walletAddress,
        type: verification.payload.type,
        expiresAt: verification.payload.exp
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Token verification failed',
      message: 'Failed to verify token'
    });
  }
});

// Disconnect wallet (invalidate tokens)
router.post('/disconnect', authLimiter, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success since JWT tokens are stateless
    
    res.status(200).json({
      success: true,
      message: 'Wallet disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      error: 'Disconnect failed',
      message: 'Failed to disconnect wallet'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication service is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 
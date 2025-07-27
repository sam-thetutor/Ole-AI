import express, { Request, Response } from 'express';
import tokenService from '../services/tokenService';
// import userService from '../services/userService';
// import walletService from '../services/walletService';
import { validateAuthRequest, validateTokenRequest } from '../utils/validation';
import { authLimiter } from '../config/rateLimit';

const router = express.Router();

// Connect wallet and generate tokens
router.post('/connect', authLimiter, validateAuthRequest, async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature } = req.body;

    // TODO: Verify wallet signature if provided
    // For now, we'll trust the wallet address
    // In production, you should verify the signature to ensure the user owns the wallet

    // Create or get user
    // const user = await userService.createUser(walletAddress);
    
    // Update user's last login
    // if (user && user._id) {
    //   await userService.updateUserLastLogin(user._id.toString());
    // }

    // Generate token pair
    const tokens = tokenService.generateTokenPair(walletAddress);

    const responseData = {
      walletAddress,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      refreshExpiresIn: tokens.refreshExpiresIn
    };

    const statusCode = 200;
    const message = 'Wallet connected successfully';

    res.status(statusCode).json({
      success: true,
      message,
      data: responseData
    });
  } catch (error: any) {
    console.error('Auth connect error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Failed to connect wallet'
    });
  }
});

// Refresh access token
router.post('/refresh', authLimiter, validateTokenRequest, async (req: Request, res: Response) => {
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

    if (verification.payload?.type !== 'refresh') {
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
        expiresIn: '24h' // Default expiry time
      }
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Failed to refresh access token'
    });
  }
});

// Verify token
router.post('/verify', authLimiter, validateTokenRequest, async (req: Request, res: Response) => {
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
        walletAddress: verification.payload?.walletAddress,
        type: verification.payload?.type,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Token verification failed',
      message: 'Failed to verify token'
    });
  }
});

// Disconnect wallet (invalidate tokens)
router.post('/disconnect', authLimiter, async (req: Request, res: Response) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success since JWT tokens are stateless
    
    res.status(200).json({
      success: true,
      message: 'Wallet disconnected successfully'
    });
  } catch (error: any) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      error: 'Disconnect failed',
      message: 'Failed to disconnect wallet'
    });
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Authentication service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router; 
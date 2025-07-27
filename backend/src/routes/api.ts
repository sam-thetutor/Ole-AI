import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter } from '../config/rateLimit';
import userService from '../services/userService';

const router = express.Router();

// Protected route example - Get user profile
router.get('/profile', authenticateToken, apiLimiter, (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        walletAddress: req.walletAddress,
        connectedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: 'Internal server error'
    });
  }
});

// Get user's generated wallet info (simplified for now)
router.get('/wallet', authenticateToken, apiLimiter, async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req;
    
    if (!walletAddress) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Wallet address not found'
      });
    }

    // Get user
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // For now, return a placeholder wallet response
    res.status(200).json({
      success: true,
      data: {
        publicKey: walletAddress,
        network: 'testnet',
        balances: [],
        createdAt: user.createdAt,
        lastBalanceCheck: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      error: 'Failed to get wallet',
      message: 'Error retrieving wallet information'
    });
  }
});

// Refresh wallet balances (simplified for now)
router.post('/wallet/refresh-balances', authenticateToken, apiLimiter, async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req;
    
    if (!walletAddress) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Wallet address not found'
      });
    }

    // Get user
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
    }

    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        publicKey: walletAddress,
        network: 'testnet',
        balances: [],
        createdAt: user.createdAt,
        lastBalanceCheck: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Refresh balances error:', error);
    res.status(500).json({
      error: 'Failed to refresh balances',
      message: 'Error refreshing wallet balances'
    });
  }
});

export default router; 
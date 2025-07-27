import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter } from '../config/rateLimit';
import userService from '../services/userService';
import walletService from '../services/walletService';

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

// Get user's generated wallet info
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

    // Get user's primary generated wallet
    const generatedWallet = await walletService.getPrimaryWalletByUserId(user._id?.toString() || '');
    
    if (!generatedWallet) {
      return res.status(404).json({
        error: 'Generated wallet not found',
        message: 'No generated wallet found for this user'
      });
    }

    // Get current balances from Stellar network
    const allBalances = await walletService.getWalletBalanceFromStellar(generatedWallet.publicKey);
    
    // Filter to only show XLM and USDC balances
    const filteredBalances = allBalances.filter(balance => {
      // Include XLM (native asset)
      if (balance.asset_type === 'native') {
        return true;
      }
      // Include USDC
      if (balance.asset_code === 'USDC') {
        return true;
      }
      return false;
    });

    res.status(200).json({
      success: true,
      data: {
        publicKey: generatedWallet.publicKey,
        network: generatedWallet.network,
        balances: filteredBalances,
        createdAt: generatedWallet.createdAt,
        lastBalanceCheck: generatedWallet.lastBalanceCheck
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

// Refresh wallet balances
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

    // Get user's primary generated wallet
    const generatedWallet = await walletService.getPrimaryWalletByUserId(user._id?.toString() || '');
    
    if (!generatedWallet) {
      return res.status(404).json({
        error: 'Generated wallet not found',
        message: 'No generated wallet found for this user'
      });
    }

    // Get fresh balances from Stellar network
    const allBalances = await walletService.getWalletBalanceFromStellar(generatedWallet.publicKey);
    
    // Filter to only show XLM and USDC balances
    const filteredBalances = allBalances.filter(balance => {
      // Include XLM (native asset)
      if (balance.asset_type === 'native') {
        return true;
      }
      // Include USDC
      if (balance.asset_code === 'USDC') {
        return true;
      }
      return false;
    });
    
    // Update the wallet's last balance check time (store all balances in DB, but return filtered)
    await walletService.updateWalletBalances(generatedWallet._id, allBalances);

    res.status(200).json({
      success: true,
      data: {
        publicKey: generatedWallet.publicKey,
        network: generatedWallet.network,
        balances: filteredBalances,
        createdAt: generatedWallet.createdAt,
        lastBalanceCheck: new Date()
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

// Get transaction history for user's generated wallet
router.get('/wallet/transactions', authenticateToken, apiLimiter, async (req: Request, res: Response) => {
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

    // Get user's primary generated wallet
    const generatedWallet = await walletService.getPrimaryWalletByUserId(user._id?.toString() || '');
    
    if (!generatedWallet) {
      return res.status(404).json({
        error: 'Generated wallet not found',
        message: 'No generated wallet found for this user'
      });
    }

    // Get transaction history from Stellar network
    const transactions = await walletService.getTransactionHistory(generatedWallet.publicKey);

    res.status(200).json({
      success: true,
      data: {
        transactions: transactions,
        walletAddress: generatedWallet.publicKey
      }
    });
  } catch (error: any) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      error: 'Failed to get transaction history',
      message: 'Error retrieving transaction history'
    });
  }
});

export default router; 
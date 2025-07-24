const express = require('express');
const router = express.Router();
const { authenticateToken, validateWalletInBody } = require('../middleware/auth');
const { apiLimiter } = require('../config/rateLimit');

// Protected route example - Get user profile
router.get('/profile', authenticateToken, apiLimiter, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        walletAddress: req.walletAddress,
        connectedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: 'Internal server error'
    });
  }
});

// Protected route example - Get wallet balance
router.get('/wallet/balance', authenticateToken, apiLimiter, (req, res) => {
  try {
    // TODO: Integrate with Stellar SDK to get actual balance
    // For now, return mock data
    res.status(200).json({
      success: true,
      message: 'Balance retrieved successfully',
      data: {
        walletAddress: req.walletAddress,
        balance: {
          XLM: '1000.0000000',
          USDC: '500.0000000'
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({
      error: 'Failed to retrieve balance',
      message: 'Internal server error'
    });
  }
});

// Protected route example - Get transaction history
router.get('/wallet/transactions', authenticateToken, apiLimiter, (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    // TODO: Integrate with Stellar SDK to get actual transactions
    // For now, return mock data
    const mockTransactions = [
      {
        id: 'txn_001',
        type: 'payment',
        amount: '100.0000000',
        asset: 'XLM',
        from: req.walletAddress,
        to: 'GCUE26...F4JN',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'success'
      },
      {
        id: 'txn_002',
        type: 'swap',
        amount: '50.0000000',
        fromAsset: 'XLM',
        toAsset: 'USDC',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'success'
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        walletAddress: req.walletAddress,
        transactions: mockTransactions.slice(offset, offset + parseInt(limit)),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: mockTransactions.length
        }
      }
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({
      error: 'Failed to retrieve transactions',
      message: 'Internal server error'
    });
  }
});

// Protected route example - Send payment
router.post('/wallet/send', authenticateToken, apiLimiter, validateWalletInBody, (req, res) => {
  try {
    const { walletAddress, toAddress, amount, asset = 'XLM', memo } = req.body;

    // TODO: Integrate with Stellar SDK to send actual payment
    // For now, return mock success response
    res.status(200).json({
      success: true,
      message: 'Payment sent successfully',
      data: {
        transactionId: `txn_${Date.now()}`,
        fromAddress: walletAddress,
        toAddress,
        amount,
        asset,
        memo,
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    });
  } catch (error) {
    console.error('Send payment error:', error);
    res.status(500).json({
      error: 'Failed to send payment',
      message: 'Internal server error'
    });
  }
});

// Protected route example - Get leaderboard data
router.get('/leaderboard', authenticateToken, apiLimiter, (req, res) => {
  try {
    const { type = 'weekly' } = req.query;

    // TODO: Get actual leaderboard data from database
    // For now, return mock data
    const mockLeaderboard = [
      {
        rank: 1,
        username: 'CryptoKing',
        address: 'GCUE26...F4JN',
        score: 9850,
        change: 12.5
      },
      {
        rank: 2,
        username: 'StellarPro',
        address: 'GB7XY...K9LM',
        score: 8740,
        change: 8.3
      },
      {
        rank: 3,
        username: 'BlockchainQueen',
        address: 'GD3KJ...P2QR',
        score: 7620,
        change: -2.1
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Leaderboard retrieved successfully',
      data: {
        type,
        leaderboard: mockLeaderboard,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to retrieve leaderboard',
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API service is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router; 
import express, { Request, Response } from 'express';
import { HumanMessage } from '@langchain/core/messages';
import langGraphService from '../services/langGraphService';
import { chatAuth, chatRateLimit } from '../middleware/chatAuth';
import userService from '../services/userService';

const router = express.Router();

// Send a message to the AI agent (with authentication)
router.post('/send', chatAuth, chatRateLimit, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const walletAddress = req.walletAddress; // Use authenticated wallet address

    if (!walletAddress) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Wallet address not found in request'
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid message',
        message: 'Please provide a valid message'
      });
    }

    // Get user ID from database using wallet address
    const user = await userService.getUserByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found for this wallet address'
      });
    }

    // Use wallet address as userId for consistency with payment links
    const userId = walletAddress;
    if (!userId) {
      return res.status(500).json({
        error: 'Invalid user ID',
        message: 'Could not retrieve user ID'
      });
    }

    // Create human message for LangGraph
    const humanMessage = new HumanMessage(message.trim());

    // Process message through LangGraph
    const result = await langGraphService.processMessage(humanMessage, userId);

    if (!result.success) {
      return res.status(500).json({
        error: 'Processing failed',
        message: result.response
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message processed successfully',
      data: {
        response: result.response,
        timestamp: new Date().toISOString(),
        userId: userId
      }
    });

  } catch (error: any) {
    console.error('Chat send error:', error);
    res.status(500).json({
      error: 'Chat processing failed',
      message: 'Failed to process your message. Please try again.'
    });
  }
});

// Get available tools (with authentication)
router.get('/tools', chatAuth, async (req: Request, res: Response) => {
  try {
    const tools = langGraphService.getAvailableTools();
    
    res.status(200).json({
      success: true,
      data: {
        tools,
        count: tools.length
      }
    });
  } catch (error: any) {
    console.error('Get tools error:', error);
    res.status(500).json({
      error: 'Failed to get tools',
      message: 'Failed to retrieve available tools'
    });
  }
});

// Health check for chat service (no auth required)
router.get('/health', async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Chat service is healthy',
      timestamp: new Date().toISOString(),
      availableTools: langGraphService.getAvailableTools().length
    });
  } catch (error: any) {
    console.error('Chat health check error:', error);
    res.status(500).json({
      error: 'Chat service unhealthy',
      message: 'Chat service is experiencing issues'
    });
  }
});

export default router; 
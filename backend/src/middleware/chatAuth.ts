import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from './auth';

// Chat-specific authentication middleware
const chatAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Use the existing auth middleware
    authenticateToken(req, res, (err) => {
      if (err) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please connect your wallet to use the chat feature'
        });
        return;
      }
      next();
    });
  } catch (error: any) {
    console.error('Chat auth error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Failed to authenticate for chat'
    });
    return;
  }
};

// Rate limiting for chat requests
const chatRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  // Simple rate limiting - can be enhanced with Redis
  const userKey = req.walletAddress;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  if (!req.app.locals.chatRateLimit) {
    req.app.locals.chatRateLimit = new Map();
  }

  const userRequests = req.app.locals.chatRateLimit.get(userKey) || [];
  const validRequests = userRequests.filter((time: number) => now - time < windowMs);

  if (validRequests.length >= maxRequests) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many chat requests. Please wait a moment before trying again.'
    });
    return;
  }

  validRequests.push(now);
  req.app.locals.chatRateLimit.set(userKey, validRequests);
  next();
};

export {
  chatAuth,
  chatRateLimit
}; 
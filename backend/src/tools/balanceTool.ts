import userService from '../services/userService';
import walletService from '../services/walletService';

// Tool to get user's Stellar wallet balances
export const getBalanceTool = {
  name: 'get_stellar_balance',
  description: 'Get the current balance of tokens in the user\'s Stellar wallet. Use this when the user asks about their balance, tokens, or holdings.',
  func: async (userId: string) => {
    try {
      console.log(`Getting balance for user: ${userId}`);
      
      // Get user from database
      const user = await userService.getUserByWalletAddress(userId);
      if (!user) {
        return `User not found for wallet address: ${userId}`;
      }

      // Get user's primary wallet
      const wallet = await walletService.getPrimaryWalletByUserId(user._id?.toString() || '');
      if (!wallet) {
        return `No wallet found for user: ${userId}. Please connect your wallet first.`;
      }

      // Get wallet balances from Stellar network
      const balances = await walletService.getWalletBalanceFromStellar(wallet.publicKey);
      
      if (!balances || balances.length === 0) {
        return `No balances found for wallet: ${wallet.publicKey}. The wallet might be empty or not activated.`;
      }

      // Format the response
      let response = `📊 **Wallet Balances for ${wallet.publicKey}**\n\n`;
      
      balances.forEach((balance: any) => {
        if (balance.asset_type === 'native') {
          response += `🪙 **XLM (Lumens)**: ${balance.balance} XLM\n`;
        } else {
          const assetCode = balance.asset_code || 'Unknown';
          const assetIssuer = balance.asset_issuer || 'Unknown';
          response += `🪙 **${assetCode}**: ${balance.balance} ${assetCode}\n`;
          response += `   Issuer: ${assetIssuer}\n`;
        }
        
        if (balance.limit) {
          response += `   Trust Limit: ${balance.limit}\n`;
        }
        response += '\n';
      });

      response += `\n💰 **Total Assets**: ${balances.length} different token(s)`;
      response += `\n📅 Last Updated: ${new Date().toLocaleString()}`;

      return response;
    } catch (error: any) {
      console.error('Balance tool error:', error);
      return `❌ Error fetching balance: ${error.message}. Please try again later.`;
    }
  }
}; 
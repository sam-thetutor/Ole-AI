import { HumanMessage } from "@langchain/core/messages";
import { getBalanceTool } from "../tools/balanceTool";
import { getWalletInfoTool } from "../tools/walletInfoTool";
import { sendTokensTool } from "../tools/sendTokensTool";
import { getWalletSummaryTool } from "../tools/walletSummaryTool";

interface ProcessMessageResult {
  success: boolean;
  response: string;
  error?: string;
}

interface ToolInfo {
  name: string;
  description: string;
}

class LangGraphService {
  private tools: ToolInfo[] = [
    {
      name: "get_current_datetime",
      description: "Gets the current date and time information"
    },
    {
      name: "get_stellar_balance",
      description: "Get the current balance of tokens in the user's Stellar wallet"
    },
    {
      name: "get_wallet_info",
      description: "Get the user's wallet public key and basic wallet information"
    },
    {
      name: "send_tokens",
      description: "Send XLM tokens to another Stellar wallet address"
    },
    {
      name: "get_wallet_summary",
      description: "Get a comprehensive summary of the user's wallet including balances, transaction history, volume, and totals"
    }
  ];

  async processMessage(userMessage: HumanMessage, userId: string): Promise<ProcessMessageResult> {
    try {
      const messageContent = userMessage.content as string;
      
      // Handle wallet summary requests
      if (messageContent.toLowerCase().includes('summary') ||
          messageContent.toLowerCase().includes('overview') ||
          messageContent.toLowerCase().includes('wallet summary') ||
          messageContent.toLowerCase().includes('show summary') ||
          messageContent.toLowerCase().includes('transaction history') ||
          messageContent.toLowerCase().includes('wallet overview')) {
        
        try {
          const summaryResult = await getWalletSummaryTool.func(userId);
          return {
            success: true,
            response: summaryResult
          };
        } catch (error: any) {
          console.error('Wallet summary tool error:', error);
          return {
            success: true,
            response: `I couldn't fetch your wallet summary at the moment. Please make sure your wallet is connected and try again. Error: ${error.message}`
          };
        }
      }
      
      // Handle send token requests
      if (messageContent.toLowerCase().includes('send') && 
          (messageContent.toLowerCase().includes('xlm') || messageContent.toLowerCase().includes('stellar'))) {
        
        try {
          // Parse the message to extract amount and destination
          const sendMatch = messageContent.match(/send\s+(\d+(?:\.\d+)?)\s*xlm\s+to\s+([A-Z0-9]{56})/i);
          
          if (!sendMatch) {
            return {
              success: true,
              response: `❌ **Invalid Format:** Please use the format "send [amount] XLM to [address]".\n\nExample: "send 10 XLM to GABC123..."`
            };
          }
          
          const amount = sendMatch[1];
          const destination = sendMatch[2];
          
          const sendParams = {
            amount: amount,
            destination: destination,
            asset: 'XLM'
          };
          
          const sendResult = await sendTokensTool.func(userId, sendParams);
          return {
            success: true,
            response: sendResult
          };
        } catch (error: any) {
          console.error('Send tokens tool error:', error);
          return {
            success: true,
            response: `I couldn't process your send request at the moment. Please try again later. Error: ${error.message}`
          };
        }
      }
      
      // Handle wallet info requests
      if (messageContent.toLowerCase().includes('public key') || 
          messageContent.toLowerCase().includes('wallet address') ||
          messageContent.toLowerCase().includes('wallet info') ||
          messageContent.toLowerCase().includes('my wallet') ||
          messageContent.toLowerCase().includes('show my wallet')) {
        
        try {
          const walletInfoResult = await getWalletInfoTool.func(userId);
          return {
            success: true,
            response: walletInfoResult
          };
        } catch (error: any) {
          console.error('Wallet info tool error:', error);
          return {
            success: true,
            response: `I couldn't fetch your wallet information at the moment. Please make sure your wallet is connected and try again. Error: ${error.message}`
          };
        }
      }
      
      // Handle balance requests
      if (messageContent.toLowerCase().includes('balance') || 
          messageContent.toLowerCase().includes('tokens') ||
          messageContent.toLowerCase().includes('holdings') ||
          messageContent.toLowerCase().includes('xlm') ||
          messageContent.toLowerCase().includes('stellar')) {
        
        try {
          const balanceResult = await getBalanceTool.func(userId);
          return {
            success: true,
            response: balanceResult
          };
        } catch (error: any) {
          console.error('Balance tool error:', error);
          return {
            success: true,
            response: `I couldn't fetch your wallet balance at the moment. Please make sure your wallet is connected and try again. Error: ${error.message}`
          };
        }
      }
      
      // Simple logic to handle date/time requests
      if (messageContent.toLowerCase().includes('time') || 
          messageContent.toLowerCase().includes('date') ||
          messageContent.toLowerCase().includes('datetime')) {
        
        const now = new Date();
        const dateTimeInfo = {
          date: now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          time: now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
          }),
          timestamp: now.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        return {
          success: true,
          response: `Here's the current date and time:\n\n**Date:** ${dateTimeInfo.date}\n**Time:** ${dateTimeInfo.time}\n**Timezone:** ${dateTimeInfo.timezone}\n**ISO Timestamp:** ${dateTimeInfo.timestamp}`
        };
      }

      // Default response for other messages
      return {
        success: true,
        response: `Hello! I'm OLE AI Agent. I can help you with:\n\n• Getting the current date and time\n• Checking your Stellar wallet balance\n• Showing your wallet public key and information\n• Sending XLM tokens to other addresses\n• Getting a comprehensive wallet summary with transaction history\n\nTry asking me:\n• "What's the current time?"\n• "What's my wallet balance?"\n• "Show my wallet info"\n• "Send 10 XLM to GABC123..."\n• "Show my wallet summary" or "Give me a wallet overview"`
      };

    } catch (error: any) {
      console.error("LangGraph processing error:", error);
      return {
        success: false,
        error: error.message,
        response: "I'm sorry, I encountered an error processing your request. Please try again.",
      };
    }
  }

  getAvailableTools(): ToolInfo[] {
    return this.tools;
  }
}

// Create singleton instance
const langGraphService = new LangGraphService();

export default langGraphService; 
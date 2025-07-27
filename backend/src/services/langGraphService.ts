import { HumanMessage } from "@langchain/core/messages";
import { getBalanceTool } from "../tools/balanceTool";

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
    }
  ];

  async processMessage(userMessage: HumanMessage, userId: string): Promise<ProcessMessageResult> {
    try {
      const messageContent = userMessage.content as string;
      
      // Handle balance requests
      if (messageContent.toLowerCase().includes('balance') || 
          messageContent.toLowerCase().includes('tokens') ||
          messageContent.toLowerCase().includes('holdings') ||
          messageContent.toLowerCase().includes('wallet') ||
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
        response: `Hello! I'm OLE AI Agent. I can help you with:\n\n• Getting the current date and time\n• Checking your Stellar wallet balance\n\nTry asking me "What's the current time?" or "What's my wallet balance?"`
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
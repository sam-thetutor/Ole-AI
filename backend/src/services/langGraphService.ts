import { HumanMessage } from "@langchain/core/messages";

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
    }
  ];

  async processMessage(userMessage: HumanMessage, userId: string): Promise<ProcessMessageResult> {
    try {
      const messageContent = userMessage.content as string;
      
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
        response: `Hello! I'm OLE AI Agent. I can help you with getting the current date and time. Try asking me "What's the current time?" or "What's today's date?"`
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
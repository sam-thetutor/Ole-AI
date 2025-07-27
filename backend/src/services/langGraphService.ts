import { HumanMessage } from "@langchain/core/messages";
import { getBalanceTool } from "../tools/balanceTool";
import { getWalletInfoTool } from "../tools/walletInfoTool";
import { sendTokensTool } from "../tools/sendTokensTool";
import { getWalletSummaryTool } from "../tools/walletSummaryTool";
import { createPaymentLinkTool, getPaymentLinkTool, getUserPaymentLinksTool, getPaymentLinkStatsTool } from "../tools/paymentLinkTool";
import groqToolSelectionService from "./groqToolSelectionService";

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

  async processMessage(userMessage: HumanMessage, userId: string): Promise<ProcessMessageResult> {
    try {
      const messageContent = userMessage.content as string;
      
      // Use Groq to select the appropriate tool
      const toolSelection = await groqToolSelectionService.selectTool(messageContent);
      
      console.log('Tool selection result:', {
        selectedTool: toolSelection.selectedTool,
        confidence: toolSelection.confidence,
        reasoning: toolSelection.reasoning,
        parameters: toolSelection.parameters
      });

      // If confidence is too low, provide a helpful response
      if (toolSelection.confidence < 0.3) {
        return {
          success: true,
          response: `I'm not sure what you'd like me to do. I can help you with:\n\n• Getting the current date and time\n• Checking your Stellar wallet balance\n• Showing your wallet public key and information\n• Sending XLM tokens to other addresses\n• Getting a comprehensive wallet summary with transaction history\n• Creating payment links for receiving payments\n• Managing and tracking your payment links\n\nTry asking me:\n• "What's the current time?"\n• "What's my wallet balance?"\n• "Show my wallet info"\n• "Send 10 XLM to GABC123..."\n• "Show my wallet summary" or "Give me a wallet overview"\n• "Create a payment link for 50 XLM"\n• "Create a global payment link for donations"\n• "Show my payment links"\n• "Payment link statistics"`
        };
      }

      // Execute the selected tool
      try {
        let result: string;

        switch (toolSelection.selectedTool) {
          case 'get_current_datetime':
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
            result = `Here's the current date and time:\n\n**Date:** ${dateTimeInfo.date}\n**Time:** ${dateTimeInfo.time}\n**Timezone:** ${dateTimeInfo.timezone}\n**ISO Timestamp:** ${dateTimeInfo.timestamp}`;
            break;

          case 'get_stellar_balance':
            result = await getBalanceTool.func(userId);
            break;

          case 'get_wallet_info':
            result = await getWalletInfoTool.func(userId);
            break;

          case 'send_tokens':
            const { amount, destination, asset = 'XLM' } = toolSelection.parameters;
            if (!amount || !destination) {
              result = `❌ **Missing Parameters:** Please provide both amount and destination address.\n\nExample: "send 10 XLM to GABC123..."`;
            } else {
              const sendParams = { amount: amount.toString(), destination, asset };
              result = await sendTokensTool.func(userId, sendParams);
            }
            break;

          case 'get_wallet_summary':
            result = await getWalletSummaryTool.func(userId);
            break;

          case 'create_payment_link':
            const { type, amount: linkAmount, title, description } = toolSelection.parameters;
            if (!type) {
              result = `❌ **Missing Type:** Please specify if you want a 'fixed' or 'global' payment link.\n\nExample: "Create a fixed payment link for 50 XLM" or "Create a global payment link for donations"`;
            } else {
              const createParams = {
                userId,
                type: type as 'fixed' | 'global',
                amount: linkAmount,
                title: title || '',
                description: description || ''
              };
              result = await createPaymentLinkTool.func(createParams);
            }
            break;

          case 'get_payment_link':
            const { linkId } = toolSelection.parameters;
            if (linkId) {
              result = await getPaymentLinkTool.func({ linkId });
            } else {
              result = await getUserPaymentLinksTool.func({ userId });
            }
            break;

          case 'get_user_payment_links':
            result = await getUserPaymentLinksTool.func({ userId });
            break;

          case 'get_payment_link_stats':
            result = await getPaymentLinkStatsTool.func({ userId });
            break;

          default:
            result = `I'm not sure how to handle that request. Please try asking me something else.`;
        }

        return {
          success: true,
          response: result
        };

      } catch (error: any) {
        console.error(`Error executing tool ${toolSelection.selectedTool}:`, error);
        return {
          success: true,
          response: `I encountered an error while processing your request. Please try again later. Error: ${error.message}`
        };
      }

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
    return groqToolSelectionService.getAllTools().map((tool: any) => ({
      name: tool.name,
      description: tool.description
    }));
  }
}

// Create singleton instance
const langGraphService = new LangGraphService();

export default langGraphService; 
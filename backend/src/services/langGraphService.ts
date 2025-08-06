import {
  HumanMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, END } from "@langchain/langgraph";
import { tools } from "../tools";
import { getDefaultLLM, LLM_CONFIGS } from "../config/llm";

interface ProcessMessageResult {
  success: boolean;
  response: string;
  error?: string;
}

interface ToolInfo {
  name: string;
  description: string;
}

// Define the conversation state
interface ConversationState {
  messages: BaseMessage[];
  current_step: string;
  tool_results: any[];
  user_id: string;
  intent: string;
  selected_tool: string | null;
  tool_params: any;
  context: Record<string, any>;
}

class LangGraphService {
  private llm: any;
  private workflow: any;

  constructor() {
    const llmConfig = getDefaultLLM();
    this.llm = this.createLLM(llmConfig);
    this.initializeWorkflow();
  }

  private initializeWorkflow() {
    // Create the state graph
    this.workflow = new StateGraph<ConversationState>({
      channels: {
        messages: {
          reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
          default: () => [],
        },
        tool_results: {
          reducer: (x: any[], y: any[]) => x.concat(y),
          default: () => [],
        },
        current_step: {
          reducer: (x: string, y: string) => y,
          default: () => "analyze_intent",
        },
        user_id: {
          reducer: (x: string, y: string) => y,
          default: () => "",
        },
        intent: {
          reducer: (x: string, y: string) => y,
          default: () => "",
        },
        selected_tool: {
          reducer: (x: string | null, y: string | null) => y,
          default: () => null,
        },
        tool_params: {
          reducer: (x: any, y: any) => y,
          default: () => ({}),
        },
        context: {
          reducer: (x: Record<string, any>, y: Record<string, any>) => ({
            ...x,
            ...y,
          }),
          default: () => ({}),
        },
      },
    });

    // Add nodes to the graph
    this.workflow.addNode("analyze_intent", this.analyzeIntentNode.bind(this));
    this.workflow.addNode("select_tool", this.selectToolNode.bind(this));
    this.workflow.addNode("extract_params", this.extractParamsNode.bind(this));
    this.workflow.addNode("execute_tool", this.executeToolNode.bind(this));
    this.workflow.addNode(
      "format_response",
      this.formatResponseNode.bind(this)
    );

    // Set the entry point
    this.workflow.setEntryPoint("analyze_intent");

    // Add conditional edges
    this.workflow.addConditionalEdges("analyze_intent", this.shouldSelectTool, {
      true: "select_tool",
      false: "format_response",
    });

    this.workflow.addConditionalEdges("select_tool", this.shouldExtractParams, {
      true: "extract_params",
      false: "format_response",
    });

    this.workflow.addConditionalEdges(
      "extract_params",
      this.shouldExecuteTool,
      {
        true: "execute_tool",
        false: "format_response",
      }
    );

    this.workflow.addEdge("execute_tool", "format_response");
    this.workflow.addEdge("format_response", END);

    // Compile the workflow
    this.workflow = this.workflow.compile();
  }

  async processMessage(
    userMessage: HumanMessage,
    userId: string
  ): Promise<ProcessMessageResult> {
    try {
      console.log("Processing message with LangGraph:", userMessage.content);
      console.log("User ID:", userId);

      // Initialize the conversation state
      const initialState: ConversationState = {
        messages: [userMessage],
        current_step: "analyze_intent",
        tool_results: [],
        user_id: userId,
        intent: "",
        selected_tool: null,
        tool_params: {},
        context: {},
      };

      // Execute the workflow
      const result = await this.workflow.invoke(initialState);

      // Extract the final response
      const finalMessage = result.messages[result.messages.length - 1];
      const response = finalMessage.content as string;

      return {
        success: true,
        response: response,
      };
    } catch (error: any) {
      console.error("LangGraph processing error:", error);
      return {
        success: false,
        error: error.message,
        response:
          "I'm sorry, I encountered an error processing your request. Please try again.",
      };
    }
  }

  // Node: Analyze user intent using LLM
  private async analyzeIntentNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    try {
      const systemPrompt = `You are an AI assistant for Stellar blockchain operations. Analyze the user's intent and determine what they want to do.

Available intents:
- get_balance: User wants to check their wallet balance
- get_wallet_info: User wants to see their wallet address and info
- send_tokens: User wants to send XLM tokens to someone
- create_payment_link: User wants to create a payment link
- get_payment_links: User wants to see their payment links
- get_payment_stats: User wants payment link statistics
- get_wallet_summary: User wants a comprehensive wallet overview
- get_time: User wants current date/time
- get_username: User wants to check their username
- set_username: User wants to set or change their username
- check_username: User wants to check if a username is available
- greeting: User is saying hello or asking what you can do
- unknown: Intent is unclear or not supported

Respond with ONLY the intent name.`;

      console.log("LLM provider:", this.llm.constructor.name);
      console.log("LLM model:", this.llm.modelName || this.llm.model);

      const result = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        ...state.messages,
      ]);

      const intent = result.content.toString().toLowerCase().trim();

      return {
        intent,
        messages: [result],
      };
    } catch (error) {
      console.error("Error in analyzeIntentNode:", error);
      return {
        intent: "unknown",
        messages: [new SystemMessage("Error analyzing intent")],
      };
    }
  }

  // Node: Select appropriate tool based on intent
  private async selectToolNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    const intentToTool: Record<string, string> = {
      get_balance: "get_stellar_balance",
      get_wallet_info: "get_wallet_info",
      send_tokens: "send_tokens",
      create_payment_link: "create_payment_link",
      get_payment_links: "get_payment_link",
      get_payment_stats: "get_payment_link_stats",
      get_wallet_summary: "get_wallet_summary",
      get_time: "get_current_datetime",
      get_username: "get_username",
      set_username: "set_username",
      check_username: "check_username_availability",
      greeting: "greeting",
      unknown: "unknown",
    };

    const selectedTool = intentToTool[state.intent] || "unknown";

    return {
      selected_tool: selectedTool,
      messages: [new SystemMessage(`Selected tool: ${selectedTool}`)],
    };
  }

  // Node: Extract parameters for the selected tool
  private async extractParamsNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    try {
      if (
        !state.selected_tool ||
        state.selected_tool === "greeting" ||
        state.selected_tool === "unknown"
      ) {
        return {
          tool_params: {},
          messages: [new SystemMessage("No parameters needed")],
        };
      }

      const systemPrompt = `Extract parameters for the tool "${state.selected_tool}" from the user's message.

Available tools and their parameters:
- get_stellar_balance: { "userId": "string" }
- get_wallet_info: { "userId": "string" }
- send_tokens: { "userId": "string", "amount": "string", "destination": "string", "asset": "string" }
- create_payment_link: { "userId": "string", "type": "fixed|global", "amount": "number?", "title": "string?", "description": "string?" }
- get_payment_link: { "userId": "string", "linkId": "string?" }
- get_payment_link_stats: { "userId": "string" }
- get_wallet_summary: { "userId": "string" }
- get_current_datetime: {}
- get_username: { "userId": "string" }
- set_username: { "userId": "string", "username": "string" }
- check_username_availability: { "username": "string" }

Respond with ONLY a valid JSON object. Do not include markdown formatting, code blocks, or any other text. For missing parameters, use null or empty string.`;

      const result = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        ...state.messages,
      ]);

      let toolParams = {};
      try {
        let content = result.content.toString().trim();
        
        // Remove markdown code blocks if present
        if (content.startsWith('```json')) {
          content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (content.startsWith('```')) {
          content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        toolParams = JSON.parse(content);
      } catch (error) {
        console.error("Failed to parse tool parameters:", error);
        console.error("Raw content:", result.content.toString());
        toolParams = {};
      }

      // Include userId for tools that need it (but not for check_username_availability)
      if (state.selected_tool !== "check_username_availability") {
        toolParams = { ...toolParams, userId: state.user_id };
      }

      return {
        tool_params: toolParams,
        messages: [result],
      };
    } catch (error) {
      console.error("Error in extractParamsNode:", error);
      return {
        tool_params: { userId: state.user_id },
        messages: [new SystemMessage("Error extracting parameters")],
      };
    }
  }

  // Node: Execute the selected tool
  private async executeToolNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    if (!state.selected_tool) {
      return {
        tool_results: [],
        messages: [new SystemMessage("No tool selected")],
      };
    }

    try {
      const tool = tools.find((t) => t.name === state.selected_tool);
      if (!tool) {
        return {
          tool_results: [],
          messages: [
            new SystemMessage(`Tool ${state.selected_tool} not found`),
          ],
        };
      }

      const result = await tool.call(state.tool_params);

      return {
        tool_results: [result],
        messages: [new SystemMessage(`Tool executed successfully: ${result}`)],
      };
    } catch (error: any) {
      console.error("Tool execution error:", error);
      return {
        tool_results: [],
        messages: [
          new SystemMessage(`Tool execution failed: ${error.message}`),
        ],
      };
    }
  }

  // Node: Format the final response
  private async formatResponseNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    let response = "";

    if (state.selected_tool === "greeting") {
      response =
        `👋 **Hello!** I'm your Stellar AI assistant. I can help you with:\n\n` +
        `• Checking your wallet balance and information\n` +
        `• Sending XLM tokens to other addresses\n` +
        `• Creating payment links for receiving payments\n` +
        `• Getting transaction history and wallet summaries\n` +
        `• Managing your payment links\n` +
        `• Managing your username\n\n` +
        `Try asking me:\n` +
        `• "What's my wallet balance?"\n` +
        `• "Show my wallet info"\n` +
        `• "Create a payment link for 50 XLM"\n` +
        `• "What's my username?"\n` +
        `• "Set my username to crypto_king"\n` +
        `• "What can you do?"`;
    } else if (state.selected_tool === "unknown") {
      response =
        `I'm not sure what you'd like me to do. I can help you with:\n\n` +
        `• Getting the current date and time\n` +
        `• Checking your Stellar wallet balance\n` +
        `• Showing your wallet public key and information\n` +
        `• Sending XLM tokens to other addresses\n` +
        `• Getting a comprehensive wallet summary with transaction history\n` +
        `• Creating payment links for receiving payments\n` +
        `• Managing and tracking your payment links\n` +
        `• Managing your username\n\n` +
        `Try asking me:\n` +
        `• "What's the current time?"\n` +
        `• "What's my wallet balance?"\n` +
        `• "Show my wallet info"\n` +
        `• "Send 10 XLM to GABC123..."\n` +
        `• "Show my wallet summary" or "Give me a wallet overview"\n` +
        `• "Create a payment link for 50 XLM"\n` +
        `• "Create a global payment link for donations"\n` +
        `• "Show my payment links"\n` +
        `• "Payment link statistics"\n` +
        `• "What's my username?"\n` +
        `• "Set my username to crypto_king"`;
    } else if (state.tool_results.length > 0) {
      response = state.tool_results[0];
    } else {
      response =
        "I'm sorry, I couldn't process your request. Please try again.";
    }

    return {
      messages: [new SystemMessage(response)],
    };
  }

  // Conditional functions for routing
  private shouldSelectTool(state: ConversationState): string {
    return state.intent && state.intent !== "unknown" ? "true" : "false";
  }

  private shouldExtractParams(state: ConversationState): string {
    return state.selected_tool &&
      state.selected_tool !== "greeting" &&
      state.selected_tool !== "unknown"
      ? "true"
      : "false";
  }

  private shouldExecuteTool(state: ConversationState): string {
    return state.selected_tool &&
      state.selected_tool !== "greeting" &&
      state.selected_tool !== "unknown"
      ? "true"
      : "false";
  }

  getAvailableTools(): ToolInfo[] {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
    }));
  }

  // Method to change LLM provider
  setLLMProvider(provider: string): void {
    try {
      const config = LLM_CONFIGS[provider];
      if (!config) {
        throw new Error(`LLM provider '${provider}' not found`);
      }

      this.llm = this.createLLM(config);
      console.log(`LLM provider changed to: ${provider}`);
    } catch (error) {
      console.error(`Failed to change LLM provider to ${provider}:`, error);
    }
  }

  private createLLM(config: any) {
    switch (config.provider) {
      case "groq":
        return new ChatGroq({
          apiKey: config.apiKey,
          model: config.model,
          temperature: 0.7,
          maxTokens: 1000,
        });

      case "openai":
        return new ChatOpenAI({
          apiKey: config.apiKey,
          model: config.model,
          temperature: 0.7,
          maxTokens: 1000,
        });

      case "anthropic":
        return new ChatAnthropic({
          apiKey: config.apiKey,
          model: config.model,
          temperature: 0.7,
          maxTokens: 1000,
        });

      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }
}

// Create singleton instance
const langGraphService = new LangGraphService();

export default langGraphService;

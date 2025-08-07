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

// Define parameter requirements for each tool
const TOOL_PARAM_REQUIREMENTS: Record<string, {
  required: string[];
  optional: string[];
  descriptions: Record<string, string>;
}> = {
  send_tokens: {
    required: ["amount", "destination"],
    optional: ["asset"],
    descriptions: {
      amount: "the amount of tokens to send",
      destination: "the recipient's Stellar address",
      asset: "the asset type (defaults to XLM)"
    }
  },
  create_payment_link: {
    required: ["type"],
    optional: ["amount", "title", "description"],
    descriptions: {
      type: "payment link type (fixed or global)",
      amount: "the payment amount",
      title: "a title for the payment link",
      description: "a description for the payment link"
    }
  },
  set_username: {
    required: ["username"],
    optional: [],
    descriptions: {
      username: "the username you want to set"
    }
  },
  check_username_availability: {
    required: ["username"],
    optional: [],
    descriptions: {
      username: "the username to check for availability"
    }
  },
  get_payment_link: {
    required: [],
    optional: ["linkId"],
    descriptions: {
      linkId: "specific payment link ID to retrieve"
    }
  }
};

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
  missing_params: string[];
  validation_message: string;
  pending_action: {
    tool: string;
    params: any;
    confirmation_message: string;
  } | null;
  awaiting_confirmation: boolean;
}

class LangGraphService {
  private llm: any;
  private workflow: any;
  private conversationStates: Map<string, ConversationState> = new Map();

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
        missing_params: {
          reducer: (x: string[], y: string[]) => y,
          default: () => [],
        },
        validation_message: {
          reducer: (x: string, y: string) => y,
          default: () => "",
        },
        pending_action: {
          reducer: (x: any, y: any) => y,
          default: () => null,
        },
        awaiting_confirmation: {
          reducer: (x: boolean, y: boolean) => y,
          default: () => false,
        },
      },
    });

    // Add nodes to the graph
    this.workflow.addNode("analyze_intent", this.analyzeIntentNode.bind(this));
    this.workflow.addNode("select_tool", this.selectToolNode.bind(this));
    this.workflow.addNode("extract_params", this.extractParamsNode.bind(this));
    this.workflow.addNode("validate_params", this.validateParamsNode.bind(this));
    this.workflow.addNode("generate_confirmation", this.generateConfirmationNode.bind(this));
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

    this.workflow.addConditionalEdges("select_tool", this.shouldRouteFromSelectTool, {
      "execute_tool": "execute_tool",
      "extract_params": "extract_params",
      "format_response": "format_response",
    });

    this.workflow.addConditionalEdges(
      "extract_params",
      this.shouldValidateParams,
      {
        true: "validate_params",
        false: "format_response",
      }
    );

    this.workflow.addConditionalEdges(
      "validate_params",
      this.shouldGenerateConfirmation,
      {
        true: "generate_confirmation",
        false: "execute_tool",
      }
    );

    this.workflow.addEdge("generate_confirmation", "format_response");

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

      // Get existing conversation state or create new one
      const existingState = this.conversationStates.get(userId);
      const initialState: ConversationState = existingState ? {
        ...existingState,
        messages: [...existingState.messages, userMessage],
        current_step: "analyze_intent",
      } : {
        messages: [userMessage],
        current_step: "analyze_intent",
        tool_results: [],
        user_id: userId,
        intent: "",
        selected_tool: null,
        tool_params: {},
        context: {},
        missing_params: [],
        validation_message: "",
        pending_action: null,
        awaiting_confirmation: false,
      };

      console.log("Initial state for user:", userId, {
        awaiting_confirmation: initialState.awaiting_confirmation,
        pending_action: initialState.pending_action,
        messages_count: initialState.messages.length
      });

      // Execute the workflow
      const result = await this.workflow.invoke(initialState);

      // Debug logging
      console.log("Workflow result:", {
        intent: result.intent,
        selected_tool: result.selected_tool,
        missing_params: result.missing_params,
        awaiting_confirmation: result.awaiting_confirmation,
        pending_action: result.pending_action
      });

      // Store the updated conversation state
      this.conversationStates.set(userId, result);

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
      console.log("analyzeIntentNode - State check:", {
        awaiting_confirmation: state.awaiting_confirmation,
        pending_action: state.pending_action,
        messages_count: state.messages.length,
        last_message: state.messages[state.messages.length - 1]?.content
      });

      // Check if this is a response to a pending confirmation
      if (state.awaiting_confirmation && state.pending_action) {
        const userMessage = state.messages[state.messages.length - 1];
        const userInput = userMessage.content.toString().toLowerCase().trim();
        
        console.log("analyzeIntentNode - Checking confirmation response:", {
          userInput,
          awaiting_confirmation: state.awaiting_confirmation,
          pending_action_tool: state.pending_action.tool
        });
        
        const confirmationKeywords = ["yes", "confirm", "proceed", "ok", "okay", "sure", "go ahead"];
        const cancellationKeywords = ["no", "cancel", "stop", "abort", "nevermind"];
        
        const isConfirmed = confirmationKeywords.some(keyword => userInput.includes(keyword));
        const isCancelled = cancellationKeywords.some(keyword => userInput.includes(keyword));
        
        console.log("analyzeIntentNode - Confirmation check:", {
          isConfirmed,
          isCancelled,
          userInput
        });
        
        if (isConfirmed) {
          console.log("User confirmed the action, proceeding to execute");
          return {
            intent: "confirmed_action",
            awaiting_confirmation: false,
            messages: [new SystemMessage("User confirmed the action")],
          };
        } else if (isCancelled) {
          console.log("User cancelled the action");
          return {
            intent: "cancelled_action",
            awaiting_confirmation: false,
            pending_action: null,
            messages: [new SystemMessage("User cancelled the action")],
          };
        } else {
          console.log("User response unclear, asking for clarification");
          return {
            intent: "unclear_confirmation",
            messages: [new SystemMessage("Please type 'yes' to confirm or 'no' to cancel")],
          };
        }
      }

      const systemPrompt = `You are an AI assistant for Stellar blockchain operations. Analyze the user's intent and determine what they want to do.

IMPORTANT: Be very careful to distinguish between checking balance and sending tokens.

Available intents:
- get_balance: User wants to check their wallet balance (e.g., "What's my balance?", "Check my balance", "Show me my XLM", "How much do I have?")
- get_wallet_info: User wants to see their wallet address and info (e.g., "What's my wallet address?", "Show my wallet info")
- send_tokens: User wants to send XLM tokens to someone (e.g., "Send 10 XLM to...", "Transfer tokens to...", "Send money to...")
- create_payment_link: User wants to create a payment link (e.g., "Create a payment link", "Make a payment link")
- get_payment_links: User wants to see their payment links (e.g., "Show my payment links", "List my payment links")
- get_payment_stats: User wants payment link statistics (e.g., "Payment link stats", "Payment analytics")
- get_wallet_summary: User wants a comprehensive wallet overview (e.g., "Wallet summary", "Wallet overview", "Show me everything")
- get_time: User wants current date/time (e.g., "What time is it?", "Current time", "What's the date?")
- get_username: User wants to check their username (e.g., "What's my username?", "Show my username")
- set_username: User wants to set or change their username (e.g., "Set my username to...", "Change my username to...")
- check_username: User wants to check if a username is available (e.g., "Is username available?", "Check if username is taken")
- greeting: User is saying hello or asking what you can do (e.g., "Hello", "Hi", "What can you do?")
- unknown: Intent is unclear or not supported

KEY DIFFERENCE:
- get_balance: User is asking to SEE their current balance (no transfer involved)
- send_tokens: User is asking to SEND tokens to someone else (transfer involved)

Respond with ONLY the intent name.`;

      console.log("LLM provider:", this.llm.constructor.name);
      console.log("LLM model:", this.llm.modelName || this.llm.model);

      const result = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        ...state.messages,
      ]);

      const intent = result.content.toString().toLowerCase().trim();
      
      console.log("analyzeIntentNode - LLM Response:", {
        rawResponse: result.content,
        parsedIntent: intent,
        userMessage: state.messages[state.messages.length - 1]?.content
      });

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

    // Handle confirmation intents
    if (state.intent === "confirmed_action" && state.pending_action) {
      console.log("SelectToolNode - Confirmed action, using pending tool:", state.pending_action.tool);
      return {
        selected_tool: state.pending_action.tool,
        tool_params: state.pending_action.params,
        messages: [new SystemMessage(`Executing confirmed action: ${state.pending_action.tool}`)],
      };
    } else if (state.intent === "cancelled_action") {
      console.log("SelectToolNode - Action cancelled");
      return {
        selected_tool: "cancelled",
        messages: [new SystemMessage("Action cancelled by user")],
      };
    } else if (state.intent === "unclear_confirmation") {
      console.log("SelectToolNode - Unclear confirmation response");
      return {
        selected_tool: "unclear_confirmation",
        messages: [new SystemMessage("Please clarify your response")],
      };
    }

    const selectedTool = intentToTool[state.intent] || "unknown";
    console.log("SelectToolNode - Intent:", state.intent, "Selected tool:", selectedTool);

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

      console.log("extractParamsNode - Final tool params:", {
        selectedTool: state.selected_tool,
        toolParams: toolParams,
        userId: state.user_id
      });

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

  // Node: Validate parameters for the selected tool
  private async validateParamsNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    if (!state.selected_tool) {
      return {
        missing_params: [],
        validation_message: "No tool selected for validation",
        messages: [new SystemMessage("No tool selected")],
      };
    }

    const requirements = TOOL_PARAM_REQUIREMENTS[state.selected_tool];
    if (!requirements) {
      // Tool doesn't have specific requirements, proceed
      return {
        missing_params: [],
        validation_message: "",
        messages: [new SystemMessage("No validation required")],
      };
    }

    const missingParams: string[] = [];
    const toolParams = state.tool_params || {};

    // Check required parameters
    for (const param of requirements.required) {
      if (!toolParams[param] || toolParams[param] === "" || toolParams[param] === null) {
        missingParams.push(param);
      }
    }

    if (missingParams.length === 0) {
      return {
        missing_params: [],
        validation_message: "",
        messages: [new SystemMessage("All required parameters are present")],
      };
    }

    // Generate user-friendly message for missing parameters
    const validationMessage = this.generateMissingParamsMessage(
      state.selected_tool,
      missingParams,
      requirements.descriptions
    );

    return {
      missing_params: missingParams,
      validation_message: validationMessage,
      messages: [new SystemMessage(validationMessage)],
    };
  }

  // Node: Generate confirmation message with transaction details
  private async generateConfirmationNode(
    state: ConversationState
  ): Promise<Partial<ConversationState>> {
    console.log("generateConfirmationNode called with:", {
      selected_tool: state.selected_tool,
      tool_params: state.tool_params
    });

    if (!state.selected_tool || !state.tool_params) {
      console.log("No action to confirm - missing tool or params");
      return {
        messages: [new SystemMessage("No action to confirm")],
      };
    }

    const confirmationMessage = this.generateTransactionConfirmation(
      state.selected_tool,
      state.tool_params
    );

    console.log("Generated confirmation message:", confirmationMessage);

    return {
      pending_action: {
        tool: state.selected_tool,
        params: state.tool_params,
        confirmation_message: confirmationMessage,
      },
      awaiting_confirmation: true,
      messages: [new SystemMessage(confirmationMessage)],
    };
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
      console.log("executeToolNode - Executing tool:", {
        selectedTool: state.selected_tool,
        toolParams: state.tool_params
      });
      
      const tool = tools.find((t) => t.name === state.selected_tool);
      if (!tool) {
        console.log("executeToolNode - Tool not found:", state.selected_tool);
        return {
          tool_results: [],
          messages: [
            new SystemMessage(`Tool ${state.selected_tool} not found`),
          ],
        };
      }

      console.log("executeToolNode - Found tool:", tool.name);
      const result = await tool.call(state.tool_params);
      console.log("executeToolNode - Tool result:", result);

      const toolResults = [result];
      console.log("executeToolNode - Returning tool results:", toolResults);

      return {
        tool_results: toolResults,
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

    console.log("formatResponseNode - State analysis:", {
      selectedTool: state.selected_tool,
      toolResultsLength: state.tool_results.length,
      missingParams: state.missing_params,
      awaitingConfirmation: state.awaiting_confirmation,
      pendingAction: state.pending_action
    });

    // Check if we have missing parameters and show validation message
    if (state.missing_params.length > 0 && state.validation_message) {
      response = state.validation_message;
    } else if (state.awaiting_confirmation && state.pending_action) {
      // Show confirmation message for pending action
      response = state.pending_action.confirmation_message;
    } else if (state.selected_tool === "cancelled") {
      response = "❌ Action cancelled. You can try again with a new request.";
    } else if (state.selected_tool === "unclear_confirmation") {
      response = "I didn't understand your response. Please type **yes** to confirm or **no** to cancel.";
    } else if (state.selected_tool === "greeting") {
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
      console.log("formatResponseNode - Tool results array:", state.tool_results);
      response = state.tool_results[0];
      console.log("formatResponseNode - Using tool result:", response);
    } else {
      response = "I'm sorry, I couldn't process your request. Please try again.";
      console.log("formatResponseNode - No tool results, using generic error");
    }

    return {
      messages: [new SystemMessage(response)],
    };
  }

  // Conditional functions for routing
  private shouldSelectTool(state: ConversationState): string {
    return state.intent && state.intent !== "unknown" ? "true" : "false";
  }

  private shouldRouteFromSelectTool(state: ConversationState): string {
    // Check if this is a confirmed action that should be executed immediately
    if (state.intent === "confirmed_action" && state.pending_action !== null) {
      console.log("shouldRouteFromSelectTool: routing to execute_tool (confirmed action)");
      return "execute_tool";
    }
    
    // Check if we have a valid tool that needs parameter extraction
    if (state.selected_tool &&
        state.selected_tool !== "greeting" &&
        state.selected_tool !== "unknown" &&
        state.selected_tool !== "cancelled" &&
        state.selected_tool !== "unclear_confirmation") {
      console.log("shouldRouteFromSelectTool: routing to extract_params");
      return "extract_params";
    }
    
    // Default to format_response for greetings, unknown, cancelled, etc.
    console.log("shouldRouteFromSelectTool: routing to format_response");
    return "format_response";
  }

  private shouldValidateParams(state: ConversationState): string {
    return state.selected_tool &&
      state.selected_tool !== "greeting" &&
      state.selected_tool !== "unknown"
      ? "true"
      : "false";
  }

  private shouldGenerateConfirmation(state: ConversationState): string {
    // Only generate confirmation for tools that require it
    const toolsRequiringConfirmation = [
      "send_tokens",
      "create_payment_link", 
      "set_username",
      "check_username_availability"
    ];
    
    const shouldConfirm = state.selected_tool &&
      state.selected_tool !== "greeting" &&
      state.selected_tool !== "unknown" &&
      state.selected_tool !== "cancelled" &&
      state.selected_tool !== "unclear_confirmation" &&
      state.missing_params.length === 0 &&
      toolsRequiringConfirmation.includes(state.selected_tool);
    
    console.log("shouldGenerateConfirmation:", {
      selected_tool: state.selected_tool,
      missing_params: state.missing_params,
      requires_confirmation: toolsRequiringConfirmation.includes(state.selected_tool || ""),
      result: shouldConfirm
    });
    
    return shouldConfirm ? "true" : "false";
  }



  // Helper method to generate user-friendly missing parameter messages
  private generateMissingParamsMessage(
    toolName: string,
    missingParams: string[],
    descriptions: Record<string, string>
  ): string {
    const toolMessages: Record<string, string> = {
      send_tokens: "I need some more information to send tokens:",
      create_payment_link: "I need some more information to create a payment link:",
      set_username: "I need some more information to set your username:",
      check_username_availability: "I need some more information to check username availability:",
    };

    const baseMessage = toolMessages[toolName] || "I need some more information:";
    
    const paramMessages = missingParams.map(param => {
      const description = descriptions[param] || param;
      return `• **${param}**: ${description}`;
    }).join('\n');

    const examples = this.getParameterExamples(toolName, missingParams);

    return `${baseMessage}\n\n${paramMessages}\n\n${examples}`;
  }

  // Helper method to provide examples for missing parameters
  private getParameterExamples(toolName: string, missingParams: string[]): string {
    const examples: Record<string, Record<string, string>> = {
      send_tokens: {
        amount: "Try: \"Send 50 XLM\" or \"Transfer 100 USDC\"",
        destination: "Try: \"Send 50 XLM to GABC123...\" or provide the recipient's address",
        asset: "Try: \"Send 50 XLM\" (defaults to XLM) or \"Send 100 USDC\""
      },
      create_payment_link: {
        type: "Try: \"Create a fixed payment link\" or \"Create a global payment link\"",
        amount: "Try: \"Create a payment link for 50 XLM\"",
        title: "Try: \"Create a payment link titled 'Coffee Fund'\"",
        description: "Try: \"Create a payment link for donations to my project\""
      },
      set_username: {
        username: "Try: \"Set my username to crypto_king\" or \"Change my username to stellar_user\""
      },
      check_username_availability: {
        username: "Try: \"Check if crypto_king is available\" or \"Is stellar_user taken?\""
      }
    };

    const toolExamples = examples[toolName];
    if (!toolExamples) return "";

    const relevantExamples = missingParams
      .map(param => toolExamples[param])
      .filter(example => example)
      .join('\n');

    return relevantExamples ? `**Examples:**\n${relevantExamples}` : "";
  }

  // Helper method to generate transaction confirmation messages
  private generateTransactionConfirmation(toolName: string, params: any): string {
    const confirmations: Record<string, (params: any) => string> = {
      send_tokens: (params) => {
        const amount = params.amount || "unknown amount";
        const destination = params.destination || "unknown address";
        const asset = params.asset || "XLM";
        
        return `🔍 **Transaction Summary**\n\n` +
               `**Action:** Send tokens\n` +
               `**Amount:** ${amount} ${asset}\n` +
               `**Recipient:** ${destination}\n\n` +
               `⚠️ **Please confirm this transaction**\n\n` +
               `Type **yes** to proceed with the transfer, or **no** to cancel.`;
      },
      
      create_payment_link: (params) => {
        const type = params.type || "unknown type";
        const amount = params.amount ? `${params.amount} XLM` : "variable amount";
        const title = params.title || "No title";
        const description = params.description || "No description";
        
        return `🔍 **Payment Link Summary**\n\n` +
               `**Action:** Create payment link\n` +
               `**Type:** ${type}\n` +
               `**Amount:** ${amount}\n` +
               `**Title:** ${title}\n` +
               `**Description:** ${description}\n\n` +
               `⚠️ **Please confirm this action**\n\n` +
               `Type **yes** to create the payment link, or **no** to cancel.`;
      },
      
      set_username: (params) => {
        const username = params.username || "unknown";
        
        return `🔍 **Username Change Summary**\n\n` +
               `**Action:** Set username\n` +
               `**New Username:** ${username}\n\n` +
               `⚠️ **Please confirm this action**\n\n` +
               `Type **yes** to set your username to "${username}", or **no** to cancel.`;
      },
      
      check_username_availability: (params) => {
        const username = params.username || "unknown";
        
        return `🔍 **Username Check Summary**\n\n` +
               `**Action:** Check username availability\n` +
               `**Username:** ${username}\n\n` +
               `⚠️ **Please confirm this action**\n\n` +
               `Type **yes** to check if "${username}" is available, or **no** to cancel.`;
      }
    };

    const confirmationGenerator = confirmations[toolName];
    if (confirmationGenerator) {
      return confirmationGenerator(params);
    }

    // Default confirmation for unknown tools
    return `🔍 **Action Summary**\n\n` +
           `**Action:** ${toolName}\n` +
           `**Parameters:** ${JSON.stringify(params)}\n\n` +
           `⚠️ **Please confirm this action**\n\n` +
           `Type **yes** to proceed, or **no** to cancel.`;
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

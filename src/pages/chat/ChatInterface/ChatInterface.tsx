import React, { useState, useRef, useEffect } from 'react'
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext'
import apiService from '../../../services/api'
import MarkdownRenderer from '../../../components/common/MarkdownRenderer/MarkdownRenderer'
import './ChatInterface.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  data?: any
}

const ChatInterface: React.FC = () => {
  const { isConnected } = useStellarWallet()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '**Hello! I\'m your Stellar AI Agent.** 🤖\n\nConnect your wallet to start managing your blockchain assets with natural language prompts.\n\nI can help you with:\n• **Getting the current date and time**\n• **Checking your Stellar wallet balance**\n• **Showing your wallet public key and information**\n• **Sending XLM tokens to other addresses**\n\nTry asking me:\n• "What\'s the current time?"\n• "What\'s my wallet balance?"\n• "Show my wallet info"\n• "Send 10 XLM to GABC123..."',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check authentication status when wallet connects
  useEffect(() => {
    if (isConnected) {
      const checkAuth = async () => {
        try {
          const authStatus = await apiService.verifyToken()
          setIsAuthenticated(authStatus.valid)
        } catch (error) {
          setIsAuthenticated(false)
        }
      }
      
      checkAuth()
    } else {
      setIsAuthenticated(false)
    }
  }, [isConnected])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected || !isAuthenticated) {
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Send message to backend AI service
      const response = await apiService.sendChatMessage(inputValue.trim())
      
      if (response.success && response.data) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.response,
          sender: 'ai',
          timestamp: new Date(response.data.timestamp),
          data: response.data
        }
        setMessages(prev => [...prev, aiResponse])
      } else {
        throw new Error(response.message || 'Failed to get response from AI')
      }
    } catch (error) {
      let errorText = 'Sorry, I encountered an error processing your request. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorText = 'Authentication failed. Please reconnect your wallet and try again.'
          setIsAuthenticated(false)
        } else if (error.message.includes('429')) {
          errorText = 'Too many requests. Please wait a moment before trying again.'
        } else if (error.message.includes('Network error')) {
          errorText = 'Network error. Please check your connection and try again.'
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isConnected) {
    return (
      <div className="chat-container">
        <div className="wallet-prompt">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your Stellar wallet to start using the AI agent.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              <MarkdownRenderer content={message.text} />
              {message.data && (
                <div className="message-data">
                  {message.data.transactionHash && (
                    <div className="transaction-info">
                      <span>Transaction Hash: {message.data.transactionHash}</span>
                    </div>
                  )}
                  {message.data.balance && (
                    <div className="balance-info">
                      <span>Balance: {message.data.balance}</span>
                    </div>
                  )}
                </div>
              )}
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about the current date/time, send tokens, check balances, or manage your Stellar assets..."
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface 
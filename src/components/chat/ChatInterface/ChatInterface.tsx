import React, { useState, useRef, useEffect } from 'react'
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext'

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
      text: 'Hello! I\'m your Stellar AI Agent. Connect your wallet to start managing your blockchain assets with natural language prompts.',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected) return

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
      // For now, just echo back the message
      // In the future, this will connect to your AI backend
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `I understand you want to: "${inputValue}". This is a placeholder response. Connect to your AI backend to process real requests.`,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
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
          <div className="wallet-features">
            <h3>What you can do:</h3>
            <ul>
              <li>Send tokens using natural language</li>
              <li>Check wallet balances</li>
              <li>Create payment links</li>
              <li>Swap tokens on Stellar DEX</li>
              <li>Set up DCA positions</li>
              <li>Invest based on risk tolerance</li>
            </ul>
          </div>
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
              <p>{message.text}</p>
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
            placeholder="Ask me to send tokens, check balances, create payment links, or invest on your behalf..."
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
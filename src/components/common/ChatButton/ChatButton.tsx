import React from 'react';
import './ChatButton.css';

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'floating' | 'inline';
}

const ChatButton: React.FC<ChatButtonProps> = ({ 
  onClick, 
  className = '', 
  size = 'medium',
  variant = 'floating'
}) => {
  return (
    <button
      className={`chat-button chat-button-${size} chat-button-${variant} ${className}`}
      onClick={onClick}
      aria-label="Open AI Chat Assistant"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="chat-icon"
      >
        <path 
          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span className="chat-button-text">AI Assistant</span>
    </button>
  );
};

export default ChatButton; 
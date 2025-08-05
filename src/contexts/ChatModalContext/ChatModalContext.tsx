import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ChatModalContextType {
  isChatModalOpen: boolean;
  openChatModal: () => void;
  closeChatModal: () => void;
  toggleChatModal: () => void;
}

const ChatModalContext = createContext<ChatModalContextType | undefined>(undefined);

interface ChatModalProviderProps {
  children: ReactNode;
}

export const ChatModalProvider: React.FC<ChatModalProviderProps> = ({ children }) => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  const toggleChatModal = () => {
    setIsChatModalOpen(!isChatModalOpen);
  };

  const value: ChatModalContextType = {
    isChatModalOpen,
    openChatModal,
    closeChatModal,
    toggleChatModal,
  };

  return (
    <ChatModalContext.Provider value={value}>
      {children}
    </ChatModalContext.Provider>
  );
};

export const useChatModal = (): ChatModalContextType => {
  const context = useContext(ChatModalContext);
  if (context === undefined) {
    throw new Error('useChatModal must be used within a ChatModalProvider');
  }
  return context;
}; 
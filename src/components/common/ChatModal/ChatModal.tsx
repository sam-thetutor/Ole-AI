import React from 'react';
import Modal from '../Modal/Modal';
import ChatInterface from '../../../pages/chat/ChatInterface/ChatInterface';
import './ChatModal.css';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🤖 Stellar AI Agent"
      size="full"
      showCloseButton={true}
    >
      <div className="chat-modal-content">
        <ChatInterface />
      </div>
    </Modal>
  );
};

export default ChatModal; 
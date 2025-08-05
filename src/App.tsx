import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StellarWalletProvider } from './contexts/StellarWalletContext/StellarWalletContext'
import { ChatModalProvider, useChatModal } from './contexts/ChatModalContext/ChatModalContext'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import Homepage from './pages/homepage/Homepage/Homepage'
import Dashboard from './pages/dashboard/Dashboard/Dashboard'
import ChatInterface from './pages/chat/ChatInterface/ChatInterface'
import PaymentPage from './pages/payment/PaymentPage/PaymentPage'
// import PaymentPageTest from '../tests/frontend/PaymentPageTest'
import ProtectedRoute from './components/layout/ProtectedRoute/ProtectedRoute'
import ChatModal from './components/common/ChatModal/ChatModal'
import ChatButton from './components/common/ChatButton/ChatButton'
import './styles/globals.css'
import './styles/App.css'

function App() {
  return (
    <StellarWalletProvider>
      <ChatModalProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ChatInterface />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/pay/:linkId" element={<PaymentPage />} />
                {/* <Route path="/test-payment" element={<PaymentPageTest />} /> */}
              </Routes>
            </main>
            <Footer />
            {/* <ChatButtonWrapper /> */}
            <ChatModalWrapper />
          </div>
        </Router>
      </ChatModalProvider>
    </StellarWalletProvider>
  )
}

// Wrapper components to use hooks
const ChatButtonWrapper = () => {
  const { openChatModal } = useChatModal();
  return <ChatButton onClick={openChatModal} />;
};

const ChatModalWrapper = () => {
  const { isChatModalOpen, closeChatModal } = useChatModal();
  return <ChatModal isOpen={isChatModalOpen} onClose={closeChatModal} />;
};

export default App

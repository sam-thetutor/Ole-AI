import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StellarWalletProvider } from './contexts/StellarWalletContext/StellarWalletContext'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import Homepage from './pages/homepage/Homepage/Homepage'
import Dashboard from './pages/dashboard/Dashboard/Dashboard'
import ChatInterface from './pages/chat/ChatInterface/ChatInterface'
import PaymentPage from './pages/payment/PaymentPage/PaymentPage'
import PaymentPageTest from './pages/payment/PaymentPage/PaymentPageTest'
import ProtectedRoute from './components/layout/ProtectedRoute/ProtectedRoute'
import './styles/globals.css'
import './styles/App.css'

function App() {
  return (
    <StellarWalletProvider>
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
              <Route path="/test-payment" element={<PaymentPageTest />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </StellarWalletProvider>
  )
}

export default App

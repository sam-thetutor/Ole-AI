import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StellarWalletProvider } from './contexts/StellarWalletContext/StellarWalletContext'
import Navbar from './components/layout/Navbar/Navbar'
import Homepage from './pages/homepage/Homepage/Homepage'
import Dashboard from './pages/dashboard/Dashboard/Dashboard'
import ChatInterface from './pages/chat/ChatInterface/ChatInterface'
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
            </Routes>
          </main>
        </div>
      </Router>
    </StellarWalletProvider>
  )
}

export default App

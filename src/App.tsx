import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StellarWalletProvider } from './contexts/StellarWalletContext'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Dashboard from './components/Dashboard'
import ChatInterface from './components/ChatInterface'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

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

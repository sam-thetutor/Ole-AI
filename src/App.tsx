import { StellarWalletProvider } from './contexts/StellarWalletContext'
import Navbar from './components/Navbar'
import ChatInterface from './components/ChatInterface'
import './App.css'

function App() {
  return (
    <StellarWalletProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <ChatInterface />
        </main>
      </div>
    </StellarWalletProvider>
  )
}

export default App

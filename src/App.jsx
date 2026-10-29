// Main App Component
// This is the root component that manages the overall application state and routing
import { useState } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import SpotifyCallback from './pages/SpotifyCallback'
import './styles/main.css'

function App() {
  // State to track the current active page
  // This replaces traditional routing for simplicity
  const [currentPage, setCurrentPage] = useState('home')

  // Function to render the appropriate page component based on current state
  const renderPage = () => {
    // Simple path-based routing for callback support
    const path = window.location.pathname
    if (path === '/callback') {
      return <SpotifyCallback />
    }
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return <Home setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App

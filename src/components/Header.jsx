// Header Component
// Contains the site navigation and logo
// Features responsive design with mobile hamburger menu
import { useState } from 'react'

const Header = ({ currentPage, setCurrentPage }) => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Function to toggle mobile menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Function to handle navigation clicks
  // Updates current page and closes mobile menu
  const handleNavClick = (page) => {
    setCurrentPage(page)
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Site Logo */}
          <div className="logo">
            <a href="#" onClick={() => handleNavClick('home')}>Spotify Stats</a>
          </div>
          
          {/* Navigation Menu */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li>
                <a 
                  href="#" 
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home')}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                  onClick={() => handleNavClick('about')}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                  onClick={() => handleNavClick('contact')}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

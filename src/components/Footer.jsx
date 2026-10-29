// Footer Component
// Contains site information, quick links, and social media links
// Consistent across all pages
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Main footer content organized in grid layout */}
        <div className="footer-content">
          {/* Company Information Section */}
          <div className="footer-section">
            <h3>My Website</h3>
            <p>Building something amazing with React!</p>
          </div>
          
          {/* Quick Links Section */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          {/* Social Media Links Section */}
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="GitHub">GitHub</a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom - Copyright Information */}
        <div className="footer-bottom">
          <p>&copy; 2025 My Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

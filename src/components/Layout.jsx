// Layout Component
// This component provides the overall structure for all pages
// It includes the header, main content area, and footer
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, currentPage, setCurrentPage }) => {
  return (
    <div className="layout">
      {/* Header with navigation - receives current page state for active link highlighting */}
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Main content area - this is where page-specific content is rendered */}
      <main className="main-content">
        {children}
      </main>
      
      {/* Footer - consistent across all pages */}
      <Footer />
    </div>
  )
}

export default Layout

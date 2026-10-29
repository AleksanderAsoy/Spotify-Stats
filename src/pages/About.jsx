// About Page Component
// Displays company information, story, and key statistics
const About = () => {
  return (
    <div className="page about-page">
      {/* Page Header Section */}
      <section className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Learn more about our mission and values</p>
        </div>
      </section>

      {/* Main About Content */}
      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            {/* Company Story Section */}
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                We're passionate about creating amazing web experiences using modern technologies. 
                Our team combines creativity with technical expertise to build solutions that make a difference.
              </p>
              <p>
                Founded on the principles of innovation and user-centered design, we strive to 
                deliver products that not only meet but exceed expectations.
              </p>
            </div>
            
            {/* Statistics Section */}
            <div className="about-stats">
              <div className="stat">
                <h3>100+</h3>
                <p>Projects Completed</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="stat">
                <h3>5+</h3>
                <p>Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

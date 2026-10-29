// Contact Page Component
// Features a contact form and company contact information
// Includes form validation and submission handling
import { useState } from 'react'

const Contact = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="page contact-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with us today</p>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information Section */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have a question or want to work together? We'd love to hear from you. 
                Send us a message and we'll respond as soon as possible.
              </p>
              
              {/* Contact Details */}
              <div className="contact-details">
                <div className="contact-item">
                  <h3>Email</h3>
                  <p>hello@mywebsite.com</p>
                </div>
                <div className="contact-item">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="contact-item">
                  <h3>Address</h3>
                  <p>123 Web Street<br />Digital City, DC 12345</p>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                {/* Name Input Field */}
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Email Input Field */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Message Textarea */}
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

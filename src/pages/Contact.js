import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Get in touch with Techaddaa Computer Institute</p>
        </div>

        {/* Public Contact Details */}
        <div className="contact-details">
          <h2>Public Contact Details</h2>

          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon">
                📍
              </div>
              <div className="contact-content">
                <h3>Address</h3>
                <p>
                  <a
                    href="https://maps.app.goo.gl/ckrhTfMGfFxdNeNx8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2 Giraj Enclave, Andrews Crossing<br />
                    Balkeshwar Road Agra 282005<br />
                    India
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                📞
              </div>
              <div className="contact-content">
                <h3>Phone Numbers</h3>
                <p>
                  Call: <a href="tel:+917579944452">+91 7579944452</a><br />
                  WhatsApp: <a href="https://wa.me/917579944452">+91 7579944452</a>
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                📧
              </div>
              <div className="contact-content">
                <h3>Email Address</h3>
                <p>
                  <a href="mailto:techaddaainstitute@gmail.com">techaddaainstitute@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="contact-content">
                <h3>Office Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                🌐
              </div>
              <div className="contact-content">
                <h3>Website</h3>
                <p>
                  <a href="https://techaddaa.in" target="_blank" rel="noopener noreferrer">
                    www.techaddaa.in
                  </a>
                </p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                🌐
              </div>
              <div className="contact-content">
                <h3>Social Media</h3>
                <div className="social-links">
                  <a href="https://www.youtube.com/@techaddaainstitute" target="_blank" rel="noopener noreferrer">
                    📺 YouTube
                  </a>
                  <a href="https://www.instagram.com/techaddaa_institute/" target="_blank" rel="noopener noreferrer">
                    📸 Instagram
                  </a>
                  <a href="https://wa.me/917579944452" target="_blank" rel="noopener noreferrer">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Links Section */}
        <div className="policy-links-section">
          <h2>Please provide links to the following policies</h2>
          <div className="policy-links-grid">


            <div className="policy-card">
              <div className="policy-icon">
                <i className="fas fa-file-contract"></i>
              </div>
              <div className="policy-content">
                <h3>Terms and Conditions</h3>
                <p>Read our terms and conditions for using our services.</p>
                <a href="/terms-and-conditions" className="policy-link">
                  View Terms and Conditions <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>



            <div className="policy-card">
              <div className="policy-icon">
                <i className="fas fa-undo-alt"></i>
              </div>
              <div className="policy-content">
                <h3>Refund Policy</h3>
                <p>Learn about our refund and cancellation policies.</p>
                <a href="/refund-policy" className="policy-link">
                  View Refund Policy <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>


          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select id="subject" name="subject" required>
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="courses">Course Information</option>
                <option value="enrollment">Enrollment</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
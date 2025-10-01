import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row className="fade-in-up">
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-gradient mb-3">
              <span className="floating">🎓</span> Techaddaa Computer Institute
            </h5>
            <p className="mb-3">
              Empowering students with cutting-edge technology education and practical skills
              for a successful career in the digital world.
            </p>
            <div className="d-flex gap-3 social-links">
              <a href="#" className="text-white hover-scale">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-white hover-scale">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-white hover-scale">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white hover-scale">
                <FaLinkedin size={24} />
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-white-50 text-decoration-none hover-glow">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/courses" className="text-white-50 text-decoration-none hover-glow">
                  Courses
                </a>
              </li>
              <li className="mb-2">
                <a href="/events" className="text-white-50 text-decoration-none hover-glow">
                  Events
                </a>
              </li>
              <li className="mb-2">
                <a href="/certificate" className="text-white-50 text-decoration-none hover-glow">
                  Certificate
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h6 className="mb-3">Popular Courses</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-glow">
                  Web Development
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-glow">
                  Digital Marketing
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-glow">
                  Data Science
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-glow">
                  Mobile App Development
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h6 className="mb-3">Contact Info</h6>
            <div className="d-flex align-items-center mb-2">
              <FaMapMarkerAlt className="me-2" />
              <a 
                href="https://maps.app.goo.gl/ckrhTfMGfFxdNeNx8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white-50 text-decoration-none hover-glow"
              >
                2 Giraj Enclave, Andrews Crossing Balkeshwar Road Agra 282005
              </a>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="me-2" />
              <a 
                href="tel:+917579944452" 
                className="text-white-50 text-decoration-none hover-glow"
              >
                +91 75799 44452
              </a>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              <a 
                href="mailto:techaddaainstitute@gmail.com" 
                className="text-white-50 text-decoration-none hover-glow"
              >
                techaddaainstitute@gmail.com
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-white-50">
              &copy; 2024 Techaddaa Computer Institute. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="#" className="text-white-50 text-decoration-none me-3 hover-glow">
              Privacy Policy
            </a>
            <a href="#" className="text-white-50 text-decoration-none me-3 hover-glow">
              Terms of Service
            </a>
            <a href="#" className="text-white-50 text-decoration-none hover-glow">
              Support
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
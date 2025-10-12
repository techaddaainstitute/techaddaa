import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaChartLine, FaComments, FaCog } from 'react-icons/fa';
import { BlocConsumer } from '../tool';
import { useStudentAuth } from '../context/StudentAuthContext';

const Navbar = () => {
  const { state, logout } = useStudentAuth();
  // const user = state.user;
  // const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setExpanded(false);
    } catch (error) {
      console.error('Logout error:', error);
      setExpanded(false);
    }
  };


  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar
      expand="lg"
      className="navbar-custom fixed-top slide-in-top bg-white"
      expanded={expanded}
      onToggle={setExpanded}
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        minHeight: '70px'
      }}
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center"
          onClick={handleNavClick}
          style={{
            color: '#1f2937',
            fontSize: '1.5rem',
            textDecoration: 'none'
          }}
        >
          <img
            src="/images/Tech_Addaapng.png"
            alt="TechAddaa Logo"
            height={windowWidth < 768 ? "50" : "70"}
            className="me-2"
            style={{
              filter: 'none',
              transition: 'height 0.3s ease'
            }}
          />
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0"
          style={{ color: '#1f2937' }}
        />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="mx-3 fw-medium"
              onClick={handleNavClick}
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f97316'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/courses"
              className="mx-3 fw-medium"
              onClick={handleNavClick}
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f97316'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              Courses
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/events"
              className="mx-3 fw-medium"
              onClick={handleNavClick}
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f97316'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              Events
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/certificate"
              className="mx-3 fw-medium"
              onClick={handleNavClick}
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f97316'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              Certificate
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              className="mx-3 fw-medium"
              onClick={handleNavClick}
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f97316'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}
            >
              Contact Us
            </Nav.Link>
          </Nav>
          <BlocConsumer
            state={state}
            listener={(s) => {

            }}
            builder={(s) => (
              <Nav className="ms-auto align-items-center">
                {s.user ? (
                  <>
                    {/* {s.user.role === 'admin' && (
                      <>
                        <Nav.Link
                          as={Link}
                          to="/admin"
                          className="mx-2 fw-medium"
                          onClick={handleNavClick}
                          style={{
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#f97316'}
                          onMouseLeave={(e) => e.target.style.color = '#374151'}
                        >
                          <FaCog className="me-1" /> Admin
                        </Nav.Link>
                        <Nav.Link
                          as={Link}
                          to="/fees"
                          className="mx-2 fw-medium"
                          onClick={handleNavClick}
                          style={{
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#f97316'}
                          onMouseLeave={(e) => e.target.style.color = '#374151'}
                        >
                          <FaChartLine className="me-1" /> Fees
                        </Nav.Link>
                      </>
                    )} */}

                    <Dropdown align="end">
                      <Dropdown.Toggle
                        className="border-0 d-flex align-items-center"
                        style={{
                          background: '#f97316',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        <FaUser className="me-2" />
                        {s.user['full_name']}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="glass-effect border-0 mt-2">
                        <Dropdown.Item
                          as={Link}
                          to="/dashboard"
                          className="d-flex align-items-center"
                          onClick={handleNavClick}
                        >
                          <FaChartLine className="me-2" />
                          Dashboard
                        </Dropdown.Item>

                        {s.user.purchasedCourses && s.user.purchasedCourses.length > 0 && (
                          <Dropdown.Item
                            as={Link}
                            to="/chat"
                            className="d-flex align-items-center"
                            onClick={handleNavClick}
                          >
                            <FaComments className="me-2" />
                            Chat Support
                          </Dropdown.Item>
                        )}

                        <Dropdown.Divider />

                        <Dropdown.Item
                          onClick={handleLogout}
                          className="d-flex align-items-center text-danger"
                        >
                          <FaSignOutAlt className="me-2" />
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <Button
                    as={Link}
                    to="/login"
                    className="mx-2"
                    onClick={handleNavClick}
                    style={{
                      background: '#f97316',
                      border: 'none',
                      color: 'white',
                      borderRadius: '6px',
                      padding: '8px 20px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ea580c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f97316'}
                  >
                    <FaUser className="me-2" />
                    Login/Register
                  </Button>
                )}
              </Nav>
            )}
          />

        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
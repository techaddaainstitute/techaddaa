import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaGraduationCap } from 'react-icons/fa';
import { useStudentAuth } from '../context/StudentAuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { state, registerProfile } = useStudentAuth();
  const { loading } = state;
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        full_name: formData.fullName,
        phone: formData.phone || null
      };

      // Note: StudentAuth uses OTP-based registration through Login component
      // For now, redirect to login page for OTP-based registration
      toast.info('Please use the Login page for OTP-based registration.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                <Row className="g-0">
                  {/* Left side - Form */}
                  <Col lg={6} md={6}>
                    <Card.Body className="p-4 p-lg-5">
                      <div className="text-center mb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                          <div className="mb-3">
                            <span style={{ fontSize: '4rem' }}>🎓</span>
                          </div>
                          <h2 className="fw-bold" style={{ color: '#f97316' }}>Join Techaddaa!</h2>
                          <p className="text-muted">
                            Create your account to start your learning journey
                          </p>
                        </motion.div>
                      </div>

                      {/* General Error Alert */}
                      {errors.general && (
                        <Alert variant="danger" className="mb-3">
                          {errors.general}
                        </Alert>
                      )}

                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Full Name</Form.Label>
                          <InputGroup className="border border-dark rounded-1">
                            <InputGroup.Text className="bg-light border-end-0">
                              <FaUser className="text-dark" />
                            </InputGroup.Text>
                            <Form.Control
                              type="text"
                              placeholder="Enter your full name"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              isInvalid={!!errors.fullName}
                              className="border-start-0 ps-0"
                              style={{ boxShadow: 'none' }}
                            />
                          </InputGroup>
                          {errors.fullName && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.fullName}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Email Address</Form.Label>
                          <InputGroup className="border border-dark rounded-1">
                            <InputGroup.Text className="bg-light border-end-0">
                              <FaEnvelope className="text-dark" />
                            </InputGroup.Text>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email address"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              isInvalid={!!errors.email}
                              className="border-start-0 ps-0"
                              style={{ boxShadow: 'none' }}
                            />
                          </InputGroup>
                          {errors.email && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.email}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Phone Number (Optional)</Form.Label>
                          <InputGroup className="border border-dark rounded-1">
                            <InputGroup.Text className="bg-light border-end-0">
                              <FaPhone className="text-dark" />
                            </InputGroup.Text>
                            <Form.Control
                              type="tel"
                              placeholder="Enter your phone number"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                              isInvalid={!!errors.phone}
                              className="border-start-0 ps-0"
                              style={{ boxShadow: 'none' }}
                            />
                          </InputGroup>
                          {errors.phone && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.phone}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Password</Form.Label>
                          <InputGroup className="border border-dark rounded-1">
                            <InputGroup.Text className="bg-light border-end-0">
                              <FaLock className="text-dark" />
                            </InputGroup.Text>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              isInvalid={!!errors.password}
                              className="border-start-0 border-end-0 ps-0"
                              style={{ boxShadow: 'none' }}
                            />
                            <InputGroup.Text
                              className="bg-light border-start-0 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.password && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.password}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                          <InputGroup className="border border-dark rounded-1">
                            <InputGroup.Text className="bg-light border-end-0">
                              <FaLock className="text-dark" />
                            </InputGroup.Text>
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              isInvalid={!!errors.confirmPassword}
                              className="border-start-0 border-end-0 ps-0"
                              style={{ boxShadow: 'none' }}
                            />
                            <InputGroup.Text
                              className="bg-light border-start-0 cursor-pointer"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                            </InputGroup.Text>
                          </InputGroup>
                          {errors.confirmPassword && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Check
                            type="checkbox"
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            isInvalid={!!errors.terms}
                            label={
                              <span className="small">
                                I agree to the{' '}
                                <a href="#" className="text-decoration-none" style={{ color: '#f97316' }}>
                                  Terms of Service
                                </a>
                                {' '}and{' '}
                                <a href="#" className="text-decoration-none" style={{ color: '#f97316' }}>
                                  Privacy Policy
                                </a>
                              </span>
                            }
                          />
                          {errors.terms && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.terms}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Button
                          type="submit"
                          className="btn-animated w-100 py-3 border-0"
                          style={{ backgroundColor: '#f97316', color: 'white' }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>

                        <div className="text-center mt-3">
                          <small className="text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="text-decoration-none" style={{ color: '#f97316' }}>
                              Sign in here
                            </Link>
                          </small>
                        </div>
                      </Form>
                    </Card.Body>
                  </Col>

                  {/* Right side - Image */}
                  <Col lg={6} md={6} className="d-none d-md-block position-relative">
                    <div
                      className="h-100 d-flex align-items-center justify-content-center"
                      style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                        position: 'relative'
                      }}
                    >
                      <div className="text-center text-white p-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        >
                          <FaGraduationCap size={80} className="mb-4" />
                          <h3 className="fw-bold mb-3">Start Your Journey</h3>
                          <p className="lead mb-4">
                            Join thousands of students who have transformed their careers with our expert-led courses
                          </p>
                          <div className="d-flex justify-content-center gap-4">
                            <div className="text-center">
                              <h4 className="fw-bold">1000+</h4>
                              <small>Students</small>
                            </div>
                            <div className="text-center">
                              <h4 className="fw-bold">50+</h4>
                              <small>Courses</small>
                            </div>
                            <div className="text-center">
                              <h4 className="fw-bold">95%</h4>
                              <small>Success Rate</small>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Decorative elements */}
                      <div
                        className="position-absolute"
                        style={{
                          top: '20px',
                          right: '20px',
                          width: '100px',
                          height: '100px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%'
                        }}
                      ></div>
                      <div
                        className="position-absolute"
                        style={{
                          bottom: '30px',
                          left: '30px',
                          width: '60px',
                          height: '60px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '50%'
                        }}
                      ></div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
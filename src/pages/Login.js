import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPhone, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUserPlus, FaShieldAlt, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});

  // New user registration fields
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const { sendOTP, verifyOTP, completeUserRegistration, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect to dashboard if user is already logged in
  React.useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validatePhone(phone)) {
      setErrors({ phone: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    const result = await sendOTP(phone);
    if (result.success) {
      setStep(2);
      setCountdown(60);
      toast.success('OTP sent successfully!');
    } else {
      setErrors({ phone: result.message });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    const result = await verifyOTP(phone, otp);
    if (result.success) {
      if (result.isNewUser) {
        setStep(3);
        toast.success('OTP verified! Please complete your registration.');
      } else {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      }
    } else {
      setErrors({ otp: result.message });
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    const result = await sendOTP(phone);
    if (result.success) {
      setCountdown(60);
      toast.success('OTP resent successfully!');
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setErrors({});
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate required fields
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await completeUserRegistration({
      full_name: fullName.trim(),
      date_of_birth: dateOfBirth,
      email: userEmail.trim()
    });

    if (result.success) {
      toast.success('Registration completed successfully!');
      navigate(from, { replace: true });
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center" style={{ backgroundColor: 'white' }}>
      <Container fluid>
        <Row className="min-vh-100 g-0">
          {/* Left side - Login Form */}
          <Col lg={6} md={6} className="d-flex align-items-center justify-content-center">
            <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <div className="mb-3">
                          <span style={{ fontSize: '4rem' }}>🎓</span>
                        </div>
                        <h2 className="fw-bold" style={{ color: '#f97316' }}>Welcome Back!</h2>
                        <p className="text-muted">
                          {
                            step === 1 ? 'Enter your phone number to continue' : 'Enter the OTP sent to your phone'}
                        </p>
                      </motion.div>
                    </div>

                    {/* General Error Alert */}
                    {errors.general && (
                      <Alert variant="danger" className="mb-3">
                        {errors.general}
                      </Alert>
                    )}

                    {
                      step === 1 ? (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Form onSubmit={handleSendOTP}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">Phone Number</Form.Label>
                              <InputGroup className="border border-dark rounded-1">
                                <InputGroup.Text className="bg-light border-end-0">
                                  <FaPhone className="text-dark" />
                                </InputGroup.Text>
                                <Form.Control
                                  type="tel"
                                  placeholder="Enter 10-digit mobile number"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
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

                            <Button
                              type="submit"
                              className="btn-animated w-100 py-3 border-0"
                              style={{ backgroundColor: '#f97316', color: 'white' }}
                              disabled={loading || !phone}
                            >
                              {loading ? (
                                <>
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Sending OTP...
                                </>
                              ) : (
                                'Send OTP'
                              )}
                            </Button>
                          </Form>
                        </motion.div>
                      ) : step === 2 ? (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Alert variant="info" className="mb-4">
                            <small>
                              OTP sent to <strong>+91 {phone}</strong>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 ms-2 text-decoration-none"
                                onClick={handleBack}
                              >
                                Change
                              </Button>
                            </small>
                          </Alert>

                          <Form onSubmit={handleVerifyOTP}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">Enter OTP</Form.Label>
                              <InputGroup className="border border-dark rounded-1">
                                <InputGroup.Text className="bg-light border-end-0">
                                  <FaLock className="text-dark" />
                                </InputGroup.Text>
                                <Form.Control
                                  type={showOtp ? "text" : "password"}
                                  placeholder="Enter 6-digit OTP"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  isInvalid={!!errors.otp}
                                  className="border-start-0 border-end-0 ps-0"
                                  style={{ boxShadow: 'none' }}
                                />
                                <InputGroup.Text
                                  className="bg-light border-start-0 cursor-pointer"
                                  onClick={() => setShowOtp(!showOtp)}
                                >
                                  {showOtp ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                                </InputGroup.Text>
                              </InputGroup>
                              {errors.otp && (
                                <Form.Control.Feedback type="invalid" className="d-block">
                                  {errors.otp}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <Button
                                variant="link"
                                className="p-0 text-decoration-none"
                                onClick={handleResendOTP}
                                disabled={countdown > 0 || loading}
                              >
                                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                              </Button>

                              <small className="text-muted">
                                OTP expires in 5 minutes
                              </small>
                            </div>

                            <Button
                              type="submit"
                              className="btn-animated w-100 py-3 border-0"
                              style={{ backgroundColor: '#f97316', color: 'white' }}
                              disabled={loading || !otp}
                            >
                              {loading ? (
                                <>
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Verifying...
                                </>
                              ) : (
                                'Verify & Login'
                              )}
                            </Button>
                          </Form>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Alert variant="info" className="mb-4">
                            <FaUserPlus className="me-2" />
                            Welcome! Please complete your registration to continue.
                          </Alert>

                          <Form onSubmit={handleCompleteRegistration}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Full Name</Form.Label>
                              <InputGroup className="border border-dark rounded-1">
                                <InputGroup.Text className="bg-light border-end-0">
                                  <FaUser className="text-dark" />
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter your full name"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
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
                              <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                              <InputGroup className="border border-dark rounded-1">
                                <InputGroup.Text className="bg-light border-end-0">
                                  <FaCalendarAlt className="text-dark" />
                                </InputGroup.Text>
                                <Form.Control
                                  type="date"
                                  value={dateOfBirth}
                                  onChange={(e) => setDateOfBirth(e.target.value)}
                                  isInvalid={!!errors.dateOfBirth}
                                  className="border-start-0 ps-0"
                                  style={{ boxShadow: 'none' }}
                                />
                              </InputGroup>
                              {errors.dateOfBirth && (
                                <Form.Control.Feedback type="invalid" className="d-block">
                                  {errors.dateOfBirth}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>

                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">Email Address</Form.Label>
                              <InputGroup className="border border-dark rounded-1">
                                <InputGroup.Text className="bg-light border-end-0">
                                  <FaEnvelope className="text-dark" />
                                </InputGroup.Text>
                                <Form.Control
                                  type="email"
                                  placeholder="Enter your email address"
                                  value={userEmail}
                                  onChange={(e) => setUserEmail(e.target.value)}
                                  isInvalid={!!errors.userEmail}
                                  className="border-start-0 ps-0"
                                  style={{ boxShadow: 'none' }}
                                />
                              </InputGroup>
                              {errors.userEmail && (
                                <Form.Control.Feedback type="invalid" className="d-block">
                                  {errors.userEmail}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>

                            <Button
                              type="submit"
                              className="btn-animated w-100 py-3 border-0"
                              style={{ backgroundColor: '#f97316', color: 'white' }}
                              disabled={loading || !fullName || !dateOfBirth || !userEmail}
                            >
                              {loading ? (
                                <>
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Completing Registration...
                                </>
                              ) : (
                                'Complete Registration'
                              )}
                            </Button>
                          </Form>
                        </motion.div>
                      )
                    }



                    {/* Admin Login Button */}
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate('/admin/login')}
                        className="d-flex align-items-center justify-content-center mx-auto"
                        style={{ maxWidth: '200px' }}
                      >
                        <FaShieldAlt className="me-2" />
                        Admin Login
                      </Button>
                    </div>

                    <div className="text-center mt-4">
                      <small className="text-muted">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-decoration-none" style={{ color: '#f97316' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-decoration-none" style={{ color: '#f97316' }}>Privacy Policy</a>
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </div>
          </Col>

          {/* Right side - Image */}
          <Col lg={6} md={6} className="d-none d-md-block position-relative">
            <div
              className="h-100 d-flex align-items-center justify-content-center position-relative"
              style={{
                backgroundImage: 'url(/images/login_page.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Overlay */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
              ></div>

              {/* Text Content */}
              <div className="text-center text-white position-relative z-index-1 p-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <h1 className="display-4 fw-bold mb-4">Join TechAdda</h1>
                  <p className="lead mb-4">
                    Unlock your potential with our comprehensive learning platform
                  </p>
                  <div className="d-flex justify-content-center gap-4 text-center">
                    <div>
                      <h3 className="fw-bold">10K+</h3>
                      <small>Students</small>
                    </div>
                    <div>
                      <h3 className="fw-bold">50+</h3>
                      <small>Courses</small>
                    </div>
                    <div>
                      <h3 className="fw-bold">95%</h3>
                      <small>Success Rate</small>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
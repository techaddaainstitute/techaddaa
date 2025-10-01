import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCertificate, FaDownload, FaPhone, FaCalendarAlt, FaUserShield, FaCheckCircle, FaTimesCircle, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CertificateDownload = () => {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Certificate
  const [formData, setFormData] = useState({
    phoneNumber: '',
    dateOfBirth: ''
  });
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Mock certificate data
  const mockCertificates = [
    {
      id: 1,
      courseName: 'Full Stack Web Development',
      studentName: 'John Doe',
      completionDate: '2023-12-15',
      grade: 'A+',
      certificateNumber: 'TECH2023001',
      instructor: 'Mr. Sharma',
      duration: '6 months',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      courseName: 'Digital Marketing Mastery',
      studentName: 'John Doe',
      completionDate: '2023-10-20',
      grade: 'A',
      certificateNumber: 'TECH2023002',
      instructor: 'Ms. Gupta',
      duration: '4 months',
      skills: ['SEO', 'Social Media Marketing', 'Google Ads', 'Analytics', 'Content Marketing']
    }
  ];

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phoneNumber || !formData.dateOfBirth) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setStep(2);
      setCountdown(60);
      setLoading(false);
      toast.success(`OTP sent to +91-${formData.phoneNumber}`);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      if (otp === generatedOtp) {
        // Mock: Check if certificates exist for this phone/DOB combination
        const foundCertificates = mockCertificates.filter(cert => 
          // In real app, this would be based on actual database lookup
          formData.phoneNumber === '9876543210' && formData.dateOfBirth === '1995-06-15'
        );
        
        if (foundCertificates.length > 0) {
          setCertificates(foundCertificates);
          setStep(3);
          toast.success('Verification successful! Your certificates are ready for download.');
        } else {
          toast.error('No certificates found for the provided details. Please check your information or contact support.');
        }
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  const resendOtp = () => {
    if (countdown > 0) return;
    
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setCountdown(60);
    setOtp('');
    toast.success('OTP resent successfully!');
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const downloadCertificate = (certificate) => {
    // In a real app, this would generate and download the actual certificate
    toast.success(`Certificate for ${certificate.courseName} downloaded successfully!`);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${certificate.courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
    link.click();
  };

  const viewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ phoneNumber: '', dateOfBirth: '' });
    setOtp('');
    setGeneratedOtp('');
    setCountdown(0);
    setCertificates([]);
  };

  return (
    <div className="certificate-download-page" style={{ backgroundColor: 'white' }}>
      {/* Hero Section */}
      <section className="bg-light py-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <FaCertificate size={50} className="mb-2 text-primary" />
            <h2 className="fw-bold mb-2 text-dark">Download Your Certificate</h2>
            <p className="mb-0 text-muted">
              Enter your details to securely access and download your course certificates
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-4 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              {/* Progress Steps */}
              <div className="d-flex justify-content-center mb-4">
                <div className="d-flex align-items-center">
                  <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>
                    <span>1</span>
                  </div>
                  <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                  <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>
                    <span>2</span>
                  </div>
                  <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                  <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>
                    <span>3</span>
                  </div>
                </div>
              </div>

              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-lg bg-white">
                  <Card.Body className="p-4">
                    {step === 1 && (
                      <>
                        <div className="text-center mb-3">
                          <FaPhone className="text-primary mb-2" size={35} />
                          <h4>Enter Your Details</h4>
                          <p className="text-muted mb-0">
                            Please provide your registered phone number and date of birth
                          </p>
                        </div>

                        <Form onSubmit={handleDetailsSubmit}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Phone Number</Form.Label>
                            <InputGroup className="border border-dark rounded-1">
                              <InputGroup.Text className="bg-light border-end-0">
                                <FaPhone className="text-dark" />
                              </InputGroup.Text>
                              <Form.Control
                                type="tel"
                                placeholder="Enter your 10-digit phone number"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                                required
                                className="border-start-0 ps-0"
                                style={{ boxShadow: 'none' }}
                              />
                            </InputGroup>
                            <Form.Text className="text-muted">
                              Enter the phone number you used during course registration
                            </Form.Text>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                            <InputGroup className="border border-dark rounded-1">
                              <InputGroup.Text className="bg-light border-end-0">
                                <FaCalendarAlt className="text-dark" />
                              </InputGroup.Text>
                              <Form.Control
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                required
                                className="border-start-0 ps-0"
                                style={{ boxShadow: 'none' }}
                              />
                            </InputGroup>
                          </Form.Group>

                          <Alert variant="info" className="mb-3">
                            <FaUserShield className="me-2" />
                            <strong>Secure Process:</strong> We use OTP verification to ensure only authorized access to certificates.
                          </Alert>

                          <div className="d-grid">
                            <Button 
                              type="submit" 
                              size="lg" 
                              className="btn-animated py-2 border-0"
                              style={{ backgroundColor: '#f97316', color: 'white' }}
                              disabled={loading}
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
                          </div>
                        </Form>

                        <div className="text-center mt-4">
                          <small className="text-muted">
                            Demo credentials: Phone: 9876543210, DOB: 1995-06-15
                          </small>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="text-center mb-3">
                          <FaUserShield className="text-success mb-2" size={35} />
                          <h4>Verify OTP</h4>
                          <p className="text-muted mb-0">
                            Enter the 6-digit OTP sent to +91-{formData.phoneNumber}
                          </p>
                        </div>

                        <Form onSubmit={handleOtpSubmit}>
                          <Form.Group className="mb-3">
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
                                required
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
                          </Form.Group>

                          <div className="d-grid mb-3">
                            <Button 
                              type="submit" 
                              size="lg" 
                              className="btn-animated py-2 border-0"
                              style={{ backgroundColor: '#f97316', color: 'white' }}
                              disabled={loading || otp.length !== 6}
                            >
                              {loading ? (
                                <>
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Verifying...
                                </>
                              ) : (
                                'Verify OTP'
                              )}
                            </Button>
                          </div>

                          <div className="text-center">
                            {countdown > 0 ? (
                              <span className="text-muted">
                                Resend OTP in {countdown} seconds
                              </span>
                            ) : (
                              <Button 
                                variant="link" 
                                onClick={resendOtp}
                                className="text-decoration-none"
                              >
                                Resend OTP
                              </Button>
                            )}
                          </div>
                        </Form>

                        <div className="text-center mt-4">
                          <small className="text-muted">
                            Demo OTP: {generatedOtp}
                          </small>
                        </div>

                        <div className="text-center mt-3">
                          <Button variant="outline-secondary" onClick={resetForm}>
                            Change Details
                          </Button>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div className="text-center mb-3">
                          <FaCheckCircle className="text-success mb-2" size={35} />
                          <h4>Your Certificates</h4>
                          <p className="text-muted mb-0">
                            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} found
                          </p>
                        </div>

                        {certificates.map((certificate, index) => (
                          <motion.div
                            key={certificate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="mb-2 border certificate-card bg-white">
                              <Card.Body className="py-3">
                                <Row className="align-items-center">
                                  <Col md={8}>
                                    <div className="d-flex align-items-center mb-1">
                                      <FaCertificate className="text-primary me-2" size={18} />
                                      <h6 className="mb-0">{certificate.courseName}</h6>
                                    </div>
                                    <div className="mb-1">
                                      <Badge bg="success" className="me-2">
                                        Grade: {certificate.grade}
                                      </Badge>
                                      <Badge bg="info">
                                        {certificate.duration}
                                      </Badge>
                                    </div>
                                    <div className="text-muted small lh-sm">
                                      <div>Completed: {new Date(certificate.completionDate).toLocaleDateString()}</div>
                                      <div>Certificate No: {certificate.certificateNumber}</div>
                                      <div>Instructor: {certificate.instructor}</div>
                                    </div>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <div className="d-grid gap-2">
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => viewCertificate(certificate)}
                                      >
                                        Preview
                                      </Button>
                                      <Button 
                                        variant="primary" 
                                        size="sm"
                                        className="btn-animated"
                                        onClick={() => downloadCertificate(certificate)}
                                      >
                                        <FaDownload className="me-1" />
                                        Download
                                      </Button>
                                    </div>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        ))}

                        <div className="text-center mt-4">
                          <Button variant="outline-secondary" onClick={resetForm}>
                            Download More Certificates
                          </Button>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Certificate Preview Modal */}
      <Modal show={showCertificateModal} onHide={() => setShowCertificateModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Certificate Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCertificate && (
            <div className="certificate-preview text-center p-4" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', border: '3px solid #007bff', borderRadius: '10px' }}>
              <div className="mb-4">
                <h2 className="text-primary fw-bold">CERTIFICATE OF COMPLETION</h2>
                <hr className="border-primary" />
              </div>
              
              <div className="mb-4">
                <h4>This is to certify that</h4>
                <h2 className="text-primary fw-bold my-3">{selectedCertificate.studentName}</h2>
                <h4>has successfully completed the course</h4>
                <h3 className="text-dark fw-bold my-3">{selectedCertificate.courseName}</h3>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <strong>Completion Date:</strong><br />
                  {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                </div>
                <div className="col-md-6">
                  <strong>Grade Achieved:</strong><br />
                  {selectedCertificate.grade}
                </div>
              </div>
              
              <div className="mb-4">
                <strong>Skills Acquired:</strong><br />
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                  {selectedCertificate.skills.map((skill, index) => (
                    <Badge key={index} bg="primary" className="px-3 py-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="border-top border-dark pt-2">
                    <strong>{selectedCertificate.instructor}</strong><br />
                    <small>Course Instructor</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border-top border-dark pt-2">
                    <strong>Techaddaa Computer Institute</strong><br />
                    <small>Authorized Signature</small>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <small className="text-muted">
                  Certificate No: {selectedCertificate.certificateNumber}
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCertificateModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => downloadCertificate(selectedCertificate)}
            className="btn-animated"
          >
            <FaDownload className="me-1" />
            Download Certificate
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CertificateDownload;
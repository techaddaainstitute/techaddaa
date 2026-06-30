import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCertificate, FaDownload, FaPhone, FaCalendarAlt, FaUserShield, FaCheckCircle, FaLock, FaEye, FaEyeSlash, FaPrint } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useCertificate } from '../context/CertificateContext';

const ADMIN_CERTIFICATE_PREVIEW_KEY = 'adminCertificatePreview';

const CertificateDownload = () => {
  const location = useLocation();
  const { loading, certificates, sendCertificateOtp, verifyCertificateOtp, resetCertificateState } = useCertificate();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Certificate
  const [formData, setFormData] = useState({
    phoneNumber: '',
    dateOfBirth: ''
  });
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const buildPreviewCertificate = (certificate) => {
    if (!certificate) return null;

    return {
      id: certificate.id,
      studentName: certificate.studentName || certificate.student_name || 'Student',
      courseName: certificate.courseName || certificate.course_name || 'Course',
      completionDate: certificate.completionDate || certificate.completion_date || certificate.issue_date,
      grade: certificate.grade || 'N/A',
      certificateNumber: certificate.certificateNumber || certificate.certificate_number || 'N/A',
      instructor: certificate.instructor || certificate.instructor_name || 'Shubham Ganwani',
      duration: certificate.duration || certificate.course_duration || 'N/A',
      certificateUrl: certificate.certificateUrl || certificate.certificate_url || '',
      issueDate: certificate.issueDate || certificate.issue_date || certificate.completion_date,
      isValid: typeof certificate.isValid === 'boolean' ? certificate.isValid : certificate.is_valid !== false
    };
  };

  const adminPreviewCertificate = useMemo(() => {
    const params = new URLSearchParams(location.search);
    if (!params.get('preview')) {
      return null;
    }

    try {
      const raw = localStorage.getItem(ADMIN_CERTIFICATE_PREVIEW_KEY);
      if (!raw) return null;

      const certificate = JSON.parse(raw);
      if (!certificate) return null;

      return buildPreviewCertificate(certificate);
    } catch (error) {
      console.error('Failed to load admin certificate preview:', error);
      return null;
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!adminPreviewCertificate || params.get('autoprint') !== '1') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      window.print();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [adminPreviewCertificate, location.search]);

  useEffect(() => {
    if (step !== 2 || countdown <= 0) return undefined;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown]);

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

    const result = await sendCertificateOtp(formData.phoneNumber, formData.dateOfBirth);
    if (result.success) {
      setStep(2);
      setCountdown(60);
      toast.success(`OTP sent to +91-${formData.phoneNumber}`);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    const result = await verifyCertificateOtp(otp);
    if (result.success) {
      setStep(3);
      toast.success('Verification successful! Your certificates are ready for download.');
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;

    const result = await sendCertificateOtp(formData.phoneNumber, formData.dateOfBirth);
    if (result.success) {
      setCountdown(60);
      setOtp('');
      toast.success('OTP resent successfully!');
    }
  };

  const downloadCertificate = (certificate) => {
    const previewCertificate = buildPreviewCertificate(certificate);
    if (!previewCertificate) {
      toast.error('Certificate preview is not available.');
      return;
    }

    localStorage.setItem(ADMIN_CERTIFICATE_PREVIEW_KEY, JSON.stringify(previewCertificate));
    window.open('/certificate?preview=download&autoprint=1', '_blank', 'noopener,noreferrer');
  };

  const viewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ phoneNumber: '', dateOfBirth: '' });
    setOtp('');
    setCountdown(0);
    resetCertificateState();
    setSelectedCertificate(null);
    setShowCertificateModal(false);
  };

  const printCertificate = () => {
    const certificateElement =
      document.querySelector('.modal.show .certificate-print-wrapper') ||
      document.querySelector('.print-screen-only .certificate-print-wrapper') ||
      document.querySelector('.certificate-print-wrapper');

    if (!certificateElement) {
      toast.error('Certificate preview is not available for printing.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1000,height=1400');
    if (!printWindow) {
      toast.error('Please allow popups to print the certificate.');
      return;
    }

    const documentStyles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style')
    )
      .map((node) => node.outerHTML)
      .join('\n');

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <base href="${window.location.origin}/" />
          <title>Certificate Print</title>
          ${documentStyles}
          <style>
            html, body {
              width: 210mm;
              min-height: 297mm;
              margin: 0;
              padding: 0;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            body {
              display: block;
              overflow: hidden;
            }

            .print-only-certificate {
              display: block !important;
              visibility: visible !important;
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .print-only-certificate,
            .print-only-certificate * {
              visibility: visible !important;
            }

            .certificate-print-wrapper {
              display: block !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .certificate-shell {
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-width: 210mm !important;
              margin: 0 !important;
              box-shadow: none !important;
              background: #f8f5ee !important;
              overflow: hidden !important;
              box-sizing: border-box !important;
              padding: 70px 20px 8px !important;
            }

            @page {
              size: A4 portrait;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="print-only-certificate">
            ${certificateElement.outerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.focus();
                window.print();
              }, 300);
            };
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const certificatePrintStyles = `
    .print-only-certificate {
      display: none;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      html,
      body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body * {
        visibility: hidden !important;
      }

      .print-hide {
        display: none !important;
      }

      .print-screen-only {
        display: none !important;
      }

      .print-only-certificate {
        display: block !important;
        visibility: visible !important;
      }

      .print-only-certificate,
      .print-only-certificate * {
        visibility: visible !important;
      }

      .certificate-print-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }

      .certificate-shell {
        width: 210mm !important;
        min-height: 297mm !important;
        max-width: 210mm !important;
        box-shadow: none !important;
        margin: 0 !important;
      }
    }
  `;

  const renderCertificateContent = (certificate) => (
    <div
      className="certificate-print-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        className="certificate-shell"
        style={{
          width: '100%',
          maxWidth: '794px',
          minHeight: '1123px',
          backgroundColor: '#f8f5ee',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          color: '#111',
          padding: '84px 34px 18px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src="/images/certificate_background.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div
            className="d-flex justify-content-between align-items-start mb-4"
            style={{ padding: '4px 44px 0 42px', gap: '18px' }}
          >
            <div
              style={{
                fontSize: '0.74rem',
                color: '#9f8f73',
                fontWeight: 600,
                flex: '1 1 0',
                minWidth: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <span
                style={{
                  color: '#9f8f73',
                  padding: '2px 5px',
                  borderRadius: '2px',
                  marginRight: '5px',
                  fontSize: '0.68rem'
                }}
              >
                Date
              </span>
              {new Date(certificate.completionDate || certificate.issueDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div
              style={{
                fontSize: '0.74rem',
                color: '#9f8f73',
                fontWeight: 600,
                flex: '1 1 0',
                minWidth: 0,
                textAlign: 'right',
                whiteSpace: 'nowrap'
              }}
            >
              Certificate No- {certificate.certificateNumber}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-start" style={{ padding: '10px 58px 0' }}>
            <div>
              <img
                src="/images/Tech_Addaapng.png"
                alt="Tech Addaa"
                style={{ width: '150px', height: 'auto', display: 'block' }}
              />
              <div style={{ fontSize: '0.62rem', color: '#4f4f4f', marginTop: '6px', fontWeight: 700 }}>
                GST : 09BWXPG7575N1Z7
              </div>
            </div>

            <div style={{ position: 'relative', width: '115px', height: '138px' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '86px',
                  left: '22px',
                  width: '30px',
                  height: '42px',
                  background: 'linear-gradient(180deg, #d7b25b, #c79d41)',
                  clipPath: 'polygon(0 0, 100% 0, 52% 100%)',
                  transform: 'rotate(8deg)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '86px',
                  right: '22px',
                  width: '30px',
                  height: '42px',
                  background: 'linear-gradient(180deg, #d7b25b, #c79d41)',
                  clipPath: 'polygon(0 0, 100% 0, 48% 100%)',
                  transform: 'rotate(-8deg)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #f9e6a8 0%, #d8b25c 45%, #b88427 100%)',
                  border: '7px solid #f3dfaa',
                  boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.55), 0 4px 8px rgba(0,0,0,0.16)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '10px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #a56d18, #f7d889, #a56d18, #f7d889, #a56d18)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '26px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #d6ad58 0%, #f0d58a 60%, #b98625 100%)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="text-center" style={{ padding: '28px 55px 0' }}>
            <h1
              style={{
                fontFamily: 'Times New Roman, serif',
                letterSpacing: '1px',
                fontSize: '3.55rem',
                marginBottom: '6px',
                fontWeight: 400
              }}
            >
              CERTIFICATE
            </h1>
            <div
              style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: '1.6rem',
                marginBottom: '10px',
                color: '#464646'
              }}
            >
              OF COURSE COMPLETION
            </div>
            <div className="fw-bold" style={{ fontSize: '1.75rem', marginBottom: '10px', color: '#3b3b3b' }}>
              ISO : ISO : 2024110505
            </div>
            <div
              className="fw-semibold"
              style={{
                letterSpacing: '4px',
                marginBottom: '10px',
                fontSize: '0.82rem',
                color: '#3c3c3c'
              }}
            >
              PRESENTED TO :
            </div>
            <div
              style={{
                fontFamily: 'Brush Script MT, Lucida Handwriting, cursive',
                fontSize: '3.35rem',
                lineHeight: 1.05,
                marginBottom: '16px',
                color: '#111'
              }}
            >
              {certificate.studentName}
            </div>
          </div>

          <div className="text-center" style={{ padding: '0 85px', marginBottom: '34px' }}>
            <p className="mb-0" style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.45, color: '#202020' }}>
              Congratulations you have successfully completed the {certificate.courseName} at
              <br />
              Tech Addaa Computer Institute. May this knowledge empower their
              <br />
              journey ahead.
            </p>
          </div>

          <div className="d-flex justify-content-center align-items-end" style={{ gap: '110px', marginBottom: '46px' }}>
            <div className="text-center">
              <img
                src="/images/digital_india.png"
                alt="Digital India"
                style={{ width: '88px', height: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div className="text-center">
              <img
                src="/images/iso.jpg"
                alt="ISO 9001"
                style={{ width: '92px', height: '92px', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div className="row" style={{ padding: '0 70px 24px' }}>
            <div className="col-6 text-center">
              <img
                src="/images/shubham_signature.png"
                alt="Shubham Ganwani Signature"
                style={{
                  width: '135px',
                  height: '48px',
                  objectFit: 'contain',
                  marginBottom: '2px'
                }}
              />
              <div style={{ borderTop: '1px solid #777', width: '130px', margin: '2px auto 6px' }} />
              <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.65rem', color: '#555' }}>
                Shubham Ganwani
              </div>
              <div className="fw-semibold" style={{ color: '#2d2d2d' }}>Manager</div>
            </div>
            <div className="col-6 text-center">
              <img
                src="/images/sumukh_signature.png"
                alt="Sumukh Agarwal Signature"
                style={{
                  width: '150px',
                  height: '48px',
                  objectFit: 'contain',
                  marginBottom: '2px'
                }}
              />
              <div style={{ borderTop: '1px solid #777', width: '130px', margin: '2px auto 6px' }} />
              <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.65rem', color: '#555' }}>
                Sumukh Agarwal
              </div>
              <div className="fw-semibold" style={{ color: '#2d2d2d' }}>Founder</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );

  if (adminPreviewCertificate) {
    return (
      <>
        <style>{certificatePrintStyles}</style>
        <div className="certificate-download-page print-screen-only" style={{ backgroundColor: 'white' }}>
          <section className="bg-light py-4 print-hide">
            <Container>
              <div className="text-center">
                <FaCertificate size={50} className="mb-2 text-primary" />
                <h2 className="fw-bold mb-2 text-dark">Certificate Preview</h2>
                <p className="mb-0 text-muted">
                  Admin preview of the selected certificate
                </p>
              </div>
            </Container>
          </section>

          <section className="py-4 bg-light">
            <Container>
              <Row className="justify-content-center">
                <Col lg={10}>
                  <Card className="border-0 shadow-lg bg-white">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-end gap-2 mb-3 print-hide">
                        <Button variant="outline-secondary" onClick={() => window.close()}>
                          Close Tab
                        </Button>
                        <Button variant="primary" onClick={printCertificate}>
                          <FaPrint className="me-1" />
                          Print Certificate
                        </Button>
                      </div>
                      {renderCertificateContent(adminPreviewCertificate)}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
        <div className="print-only-certificate">
          {renderCertificateContent(adminPreviewCertificate)}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{certificatePrintStyles}</style>
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
                                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
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
                                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
                              Use your registered phone number and date of birth
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
            {selectedCertificate && renderCertificateContent(selectedCertificate)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCertificateModal(false)} className="print-hide">
              Close
            </Button>
            <Button variant="outline-secondary" onClick={printCertificate} className="print-hide">
              <FaPrint className="me-1" />
              Print
            </Button>
            <Button
              variant="primary"
              onClick={() => downloadCertificate(selectedCertificate)}
              className="btn-animated print-hide"
            >
              <FaDownload className="me-1" />
              Download Certificate
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CertificateDownload;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaLaptop,
  FaBuilding,
  FaCreditCard,
  FaCalendarAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaGraduationCap,
  FaClock,
  FaUsers,
  FaStar
} from 'react-icons/fa';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useStudentDashboard } from '../context/StudentDashboardContext';
import { usePayment } from '../context/PaymentContext';
import { useCourse } from '../context/CourseContext';
import CourseUsecase from '../lib/usecase/CourseUsecase';
import { toast } from 'react-toastify';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const { initiatePayment } = usePayment();
  const courseId = searchParams.get('courseId');
  const navigate = useNavigate();
  const { state } = useStudentAuth();
  const { user } = state;
  const { mockCourses, purchaseCourse } = useCourse();
  const { createMyCourse } = useStudentDashboard();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('online');
  const [paymentType, setPaymentType] = useState('full');
  const [emiMonths, setEmiMonths] = useState(6);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        navigate('/courses');
        return;
      }

      setLoading(true);
      try {
        const result = await CourseUsecase.getCourseByIdUsecase(courseId);
        if (result.success && result.data) {
          const mockFormatCourse = result.data.toMockCourseFormat();
          setCourse(mockFormatCourse);
        } else {
          const mockCourse = mockCourses?.find(c => c.id === parseInt(courseId));
          setCourse(mockCourse || null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        const mockCourse = mockCourses?.find(c => c.id === parseInt(courseId));
        setCourse(mockCourse || null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, mockCourses, navigate]);

  const handlePurchase = async () => {
    if (!user) {
      toast.info('Please login to purchase the course');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      // Course price already includes GST
      const totalCourseAmount = selectedMode === 'online' ? course.onlinePrice : course.offlinePrice;

      // Prepare enrollment data
      const enrollmentData = {
        enrollment_mode: selectedMode,
        price_paid: totalCourseAmount,
        payment_type: paymentType,
        ...(paymentType === 'emi' && { emi_months: emiMonths })
      };

      // Store enrollment data for post-payment processing
      const enrollmentPayload = {
        type: 'newcourse',
        course_id: course.id,
        enrollmentData: enrollmentData
      };
      localStorage.removeItem('pendingPayment');
      localStorage.setItem('pendingEnrollment', JSON.stringify(enrollmentPayload));

      // Initiate payment
      const paymentResult = await initiatePayment({
        amount: enrollmentData.payment_type === 'full' ? totalCourseAmount : totalCourseAmount / emiMonths,
        currency: 'INR',
        purpose: `Course Enrollment: ${course.title} (ID${course.id})`,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        redirect_url: `${window.location.origin}/payment-check`
      });

      if (paymentResult.success) {
        // Payment initiated successfully, user will be redirected to payment gateway
        console.log('Payment initiated successfully');
      } else {
        // Remove enrollment data if payment initiation failed
        localStorage.removeItem('pendingEnrollment');
        toast.error('Payment initiation failed. Please try again.');
      }

    } catch (error) {
      console.error('Error during course enrollment:', error);
      toast.error('An unexpected error occurred during enrollment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading checkout...</h4>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2>Course not found</h2>
          <p className="text-muted mb-4">The course you're trying to purchase doesn't exist.</p>
          <Button onClick={() => navigate('/courses')} variant="primary">
            Back to Courses
          </Button>
        </motion.div>
      </div>
    );
  }

  // Price already includes 18% GST
  const totalPrice = selectedMode === 'online' ? course.onlinePrice : course.offlinePrice;
  const gstRate = 0.18; // 18% GST
  const basePrice = Math.round(totalPrice / (1 + gstRate)); // Calculate base price from GST-inclusive price
  const gstAmount = totalPrice - basePrice; // GST amount included in the price
  const emiAmount = Math.ceil(totalPrice / emiMonths);

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <div className="checkout-page min-vh-100 bg-light">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm py-3"
      >
        <Container>
          <Row className="align-items-center">
            <Col>
              <Button
                variant="link"
                className="text-decoration-none p-0 d-flex align-items-center"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="me-2" />
                Back to Course
              </Button>
            </Col>
            <Col className="text-center">
              <h4 className="mb-0 text-primary">Secure Checkout</h4>
            </Col>
            <Col className="text-end">
              <div className="d-flex align-items-center justify-content-end">
                <FaShieldAlt className="text-success me-2" />
                <small className="text-muted">SSL Secured</small>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <Row>
                    {/* Course Summary */}
                    <Col lg={8} className="mb-4">
                      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        <Card className="border-0 shadow-sm h-100">
                          <Card.Body className="p-4">
                            <h5 className="mb-4 d-flex align-items-center">
                              <FaGraduationCap className="text-primary me-2" />
                              Course Details
                            </h5>

                            <Row className="align-items-center mb-4">
                              <Col md={8}>
                                <h4 className="mb-2">{course.title}</h4>
                                <p className="text-muted mb-3">{course.description}</p>
                                <div className="d-flex gap-3 flex-wrap">
                                  <Badge bg="primary" className="px-3 py-2">
                                    <FaClock className="me-1" />
                                    {course.duration}
                                  </Badge>
                                  <Badge bg="success" className="px-3 py-2">
                                    <FaStar className="me-1" />
                                    {course.rating}
                                  </Badge>
                                  <Badge bg="info" className="px-3 py-2">
                                    <FaUsers className="me-1" />
                                    {course.students} students
                                  </Badge>
                                </div>
                              </Col>
                              <Col md={4} className="text-center">
                                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                                  style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                                  <FaGraduationCap />
                                </div>
                              </Col>
                            </Row>

                            <hr />

                            <h6 className="mb-3">Select Learning Mode</h6>
                            <Row>
                              <Col md={6} className="mb-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Card
                                    className={`border-2 cursor-pointer ${selectedMode === 'online' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                    onClick={() => setSelectedMode('online')}
                                  >
                                    <Card.Body className="text-center p-4">
                                      <FaLaptop className={`mb-3 ${selectedMode === 'online' ? 'text-primary' : 'text-muted'}`} size={32} />
                                      <h6>Online Mode</h6>
                                      <p className="text-muted mb-2">Learn from anywhere</p>
                                      <h5 className="text-primary mb-0">₹{(course.onlinePrice || 0).toLocaleString()}</h5>
                                      <small className="text-muted">(incl. 18% GST)</small>
                                    </Card.Body>
                                  </Card>
                                </motion.div>
                              </Col>
                              <Col md={6} className="mb-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Card
                                    className={`border-2 cursor-pointer ${selectedMode === 'offline' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
                                    onClick={() => setSelectedMode('offline')}
                                  >
                                    <Card.Body className="text-center p-4">
                                      <FaBuilding className={`mb-3 ${selectedMode === 'offline' ? 'text-success' : 'text-muted'}`} size={32} />
                                      <h6>Offline Mode</h6>
                                      <p className="text-muted mb-2">Classroom experience</p>
                                      <h5 className="text-success mb-0">₹{(course.offlinePrice || 0).toLocaleString()}</h5>
                                      <small className="text-muted">(incl. 18% GST)</small>
                                    </Card.Body>
                                  </Card>
                                </motion.div>
                              </Col>
                            </Row>

                            <hr />

                            <h6 className="mb-3">Payment Options</h6>
                            <Form>
                              <Row>
                                <Col md={6} className="mb-3">
                                  <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card
                                      className={`border-2 cursor-pointer ${paymentType === 'full' ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                      onClick={() => setPaymentType('full')}
                                    >
                                      <Card.Body className="p-3">
                                        <Form.Check
                                          type="radio"
                                          name="paymentType"
                                          checked={paymentType === 'full'}
                                          onChange={() => setPaymentType('full')}
                                          label={
                                            <div>
                                              <strong>Full Payment</strong>
                                              <div className="text-muted small">Pay complete amount</div>
                                              <div className="text-primary fw-bold">₹{(totalPrice || 0).toLocaleString()}</div>
                                            </div>
                                          }
                                        />
                                      </Card.Body>
                                    </Card>
                                  </motion.div>
                                </Col>
                                <Col md={6} className="mb-3">
                                  <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card
                                      className={`border-2 cursor-pointer ${paymentType === 'emi' ? 'border-warning bg-warning bg-opacity-10' : 'border-light'}`}
                                      onClick={() => setPaymentType('emi')}
                                    >
                                      <Card.Body className="p-3">
                                        <Form.Check
                                          type="radio"
                                          name="paymentType"
                                          checked={paymentType === 'emi'}
                                          onChange={() => setPaymentType('emi')}
                                          label={
                                            <div>
                                              <strong>EMI Payment</strong>
                                              <div className="text-muted small">Pay in installments</div>
                                              <div className="text-warning fw-bold">₹{(emiAmount || 0).toLocaleString()}/month</div>
                                            </div>
                                          }
                                        />
                                      </Card.Body>
                                    </Card>
                                  </motion.div>
                                </Col>
                              </Row>

                              {paymentType === 'emi' && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Form.Group className="mb-3">
                                    <Form.Label>EMI Duration</Form.Label>
                                    <Form.Select
                                      value={emiMonths}
                                      onChange={(e) => setEmiMonths(parseInt(e.target.value))}
                                    >
                                      <option value={3}>3 months - ₹{Math.ceil((totalPrice || 0) / 3).toLocaleString()}/month</option>
                                      <option value={6}>6 months - ₹{Math.ceil((totalPrice || 0) / 6).toLocaleString()}/month</option>
                                      <option value={12}>12 months - ₹{Math.ceil((totalPrice || 0) / 12).toLocaleString()}/month</option>
                                    </Form.Select>
                                  </Form.Group>
                                </motion.div>
                              )}
                            </Form>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>

                    {/* Order Summary */}
                    <Col lg={4}>
                      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
                          <Card.Body className="p-4">
                            <h5 className="mb-4 d-flex align-items-center">
                              <FaCreditCard className="text-primary me-2" />
                              Order Summary
                            </h5>

                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Course Fee (incl. GST):</span>
                                <span>₹{(totalPrice || 0).toLocaleString()}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2 text-muted small">
                                <span>  - Base Fee:</span>
                                <span>₹{(basePrice || 0).toLocaleString()}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2 text-muted small">
                                <span>  - GST (18%):</span>
                                <span>₹{(gstAmount || 0).toLocaleString()}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Mode:</span>
                                <span className="text-capitalize">{selectedMode}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Payment:</span>
                                <span className="text-capitalize">{paymentType}</span>
                              </div>
                              {paymentType === 'emi' && (
                                <div className="d-flex justify-content-between mb-2">
                                  <span>EMI Amount:</span>
                                  <span>₹{(emiAmount || 0).toLocaleString()}/month</span>
                                </div>
                              )}
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                              <strong>Total Amount:</strong>
                              <strong className="text-primary">₹{(totalPrice || 0).toLocaleString()}</strong>
                            </div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="primary"
                                size="lg"
                                className="w-100 py-3"
                                onClick={() => setCurrentStep(2)}
                              >{paymentType === 'full' ? 'Proceed to Payment' : `Pay ₹${Math.ceil((totalPrice || 0) / emiMonths).toLocaleString()}/month`}

                              </Button>
                            </motion.div>

                            <div className="text-center mt-3">
                              <small className="text-muted">
                                <FaShieldAlt className="me-1" />
                                100% Secure Payment
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  </Row>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <Row className="justify-content-center">
                    <Col lg={6}>
                      <Card className="border-0 shadow-sm">
                        <Card.Body className="p-5 text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-4"
                              style={{ width: '80px', height: '80px' }}>
                              <FaCreditCard size={32} />
                            </div>
                          </motion.div>

                          <h3 className="mb-3">Confirm Your Purchase</h3>
                          <p className="text-muted mb-4">
                            You are about to enroll in <strong>{course.title}</strong> for{' '}
                            <strong className="text-primary">₹{(totalPrice || 0).toLocaleString()}</strong> (including GST)
                          </p>

                          <div className="bg-light rounded p-3 mb-4">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Course:</span>
                              <span>{course.title}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Mode:</span>
                              <span className="text-capitalize">{selectedMode}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Payment Type:</span>
                              <span className="text-capitalize">{paymentType}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Course Fee (incl. GST):</span>
                              <span>₹{(totalPrice || 0).toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1 text-muted small">
                              <span>  - Base Fee:</span>
                              <span>₹{(basePrice || 0).toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-muted small">
                              <span>  - GST (18%):</span>
                              <span>₹{(gstAmount || 0).toLocaleString()}</span>
                            </div>
                            <hr className="my-2" />
                            {
                              paymentType === 'emi' ? (<>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>EMI Installments:</span>
                                  <span>{emiMonths} months</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <strong>EMI Amount:</strong>
                                  <strong className="text-primary">₹{(Math.ceil((totalPrice || 0) / emiMonths)).toLocaleString()}</strong>
                                </div>
                              </>
                              ) : <div className="d-flex justify-content-between">
                                <strong>Total Amount:</strong>
                                <strong className="text-primary">₹{(totalPrice || 0).toLocaleString()}</strong>
                              </div>
                            }

                          </div>

                          <div className="d-grid gap-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="primary"
                                size="lg"
                                onClick={handlePurchase}
                                disabled={isProcessing}
                                className="py-3"
                              >
                                {isProcessing ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Processing...
                                  </>
                                ) : (
                                  'Complete Purchase'
                                )}
                              </Button>
                            </motion.div>
                            <Button
                              variant="outline-secondary"
                              onClick={() => setCurrentStep(1)}
                              disabled={isProcessing}
                            >
                              Back to Details
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <Row className="justify-content-center">
                    <Col lg={6}>
                      <Card className="border-0 shadow-sm">
                        <Card.Body className="p-5 text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                          >
                            <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-4"
                              style={{ width: '100px', height: '100px' }}>
                              <FaCheckCircle size={48} />
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <h2 className="text-success mb-3">Enrollment Successful!</h2>
                            <p className="text-muted mb-4">
                              Congratulations! You have successfully enrolled in <strong>{course.title}</strong>.
                              You will be redirected to your dashboard shortly.
                            </p>

                            <Alert variant="success" className="text-start">
                              <h6>What's Next?</h6>
                              <ul className="mb-0">
                                <li>Access your course materials in the dashboard</li>
                                <li>Start learning at your own pace</li>
                                <li>Track your progress and earn certificates</li>
                              </ul>
                            </Alert>

                            <Button
                              variant="primary"
                              size="lg"
                              onClick={() => navigate('/dashboard')}
                              className="mt-3"
                            >
                              Go to Dashboard
                            </Button>
                          </motion.div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </motion.div>
              )}
            </AnimatePresence>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
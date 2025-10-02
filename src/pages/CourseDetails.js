import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaClock, FaPlay, FaDownload, FaCertificate, FaChalkboardTeacher, FaLaptop, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CourseUsecase from '../lib/usecase/CourseUsecase';
import FeesUsecase from '../lib/usecase/FeesUsecase';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const { user, mockCourses, purchaseCourse, loading } = useAuth();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState('online');
  const [paymentType, setPaymentType] = useState('full');
  const [emiMonths, setEmiMonths] = useState(6);

  // Fetch course data from database
  // Helper function to convert integer course IDs to UUIDs
  const courseIdToUUID = (courseId) => {


    // For unmapped IDs, convert to hexadecimal and pad to 4 characters
    return courseUUIDMap[courseId] || `550e8400-e29b-41d4-a716-446655440${courseId.toString(16).padStart(3, '0')}`;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setCourseLoading(true);
      try {
        // Convert integer ID to UUID for database lookup
        const courseUUID = id;

        // Try to fetch from database first
        const result = await CourseUsecase.getCourseByIdUsecase(courseUUID);
        if (result.success && result.data) {
          // Convert to mock course format for compatibility
          const mockFormatCourse = result.data.toMockCourseFormat();
          setCourse(mockFormatCourse);
        } else {
          // Fallback to mock courses
          const mockCourse = mockCourses?.find(c => c.id === parseInt(id));
          setCourse(mockCourse || null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        // Fallback to mock courses
        const mockCourse = mockCourses?.find(c => c.id === parseInt(id));
        setCourse(mockCourse || null);
      } finally {
        setCourseLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, mockCourses]);

  if (courseLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading course details...</h4>
        </div>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>Course not found</h2>
          <p className="text-muted mb-4">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/courses')} variant="primary">
            Back to Courses
          </Button>
        </div>
      </Container>
    );
  }

  const isAlreadyPurchased = user?.purchasedCourses?.includes(course.id);

  const curriculum = [
    {
      module: 'Module 1: Introduction',
      lessons: [
        'Course Overview',
        'Setting up Development Environment',
        'Basic Concepts',
        'First Project Setup'
      ]
    },
    {
      module: 'Module 2: Fundamentals',
      lessons: [
        'Core Concepts',
        'Best Practices',
        'Hands-on Exercises',
        'Project Building'
      ]
    },
    {
      module: 'Module 3: Advanced Topics',
      lessons: [
        'Advanced Techniques',
        'Real-world Applications',
        'Performance Optimization',
        'Industry Standards'
      ]
    },
    {
      module: 'Module 4: Final Project',
      lessons: [
        'Project Planning',
        'Implementation',
        'Testing & Debugging',
        'Deployment'
      ]
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rating: 5,
      comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical.',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Priya Patel',
      rating: 4,
      comment: 'Great content and well-structured. Would recommend to anyone starting in this field.',
      date: '2024-01-10'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      rating: 5,
      comment: 'The best course I have taken so far. Got a job within 3 months of completion!',
      date: '2024-01-05'
    }
  ];

  const handlePurchase = async () => {
    if (!user) {
      toast.info('Please login to purchase the course');
      navigate('/login');
      return;
    }

    try {
      // First, enroll in the course
      const enrollmentResult = await purchaseCourse(course.id, selectedMode);
      
      if (enrollmentResult.success) {
        // Create fees entries based on payment type
        const courseAmount = selectedMode === 'online' ? course.onlinePrice : course.offlinePrice;
        
        const feesResult = await FeesUsecase.createEnrollmentFeesUsecase(
          user.id,
          course.id,
          course,
          paymentType,
          courseAmount,
          selectedMode,
          emiMonths
        );

        if (feesResult.success) {
          setShowPurchaseModal(false);
          // Success message is handled in FeesUsecase
        } else {
          toast.error(feesResult.error || 'Failed to create fees entries');
        }
      } else {
        toast.error(enrollmentResult.error || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      toast.error('An unexpected error occurred during enrollment');
    }
  };

  const price = selectedMode === 'online' ? course.onlinePrice : course.offlinePrice;

  return (
    <div className="course-details-page">
      {/* Hero Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="d-flex align-items-center mb-3">
                  <Badge bg="success" className="me-3 px-3 py-2">
                    <FaStar className="me-1" />
                    {course.rating}
                  </Badge>
                  <Badge bg="primary" text="white" className="px-3 py-2">
                    {course.duration}
                  </Badge>
                </div>

                <h1 className="display-4 fw-bold mb-3 text-dark">{course.title}</h1>
                <p className="lead mb-4 text-muted">{course.description}</p>

                <div className="d-flex align-items-center gap-4 mb-4 text-dark">
                  <div className="d-flex align-items-center">
                    <FaChalkboardTeacher className="me-2 text-primary" />
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaUsers className="me-2 text-primary" />
                    <span>{course.students} students enrolled</span>
                  </div>
                </div>

                <div className="d-flex gap-3 flex-wrap">
                  {isAlreadyPurchased ? (
                    <Button
                      variant="success"
                      size="lg"
                      className="btn-animated px-4"
                      onClick={() => navigate('/dashboard')}
                    >
                      <FaPlay className="me-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="btn-animated px-4"
                      onClick={() => setShowPurchaseModal(true)}
                    >
                      Enroll Now - ₹{course.onlinePrice.toLocaleString()}
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="btn-animated px-4"
                  >
                    <FaDownload className="me-2" />
                    Download Brochure
                  </Button>
                </div>
              </motion.div>
            </Col>

            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="border-0 shadow-sm bg-white">
                  <Card.Body className="p-4">
                    <h5 className="mb-3 text-dark">Course Highlights</h5>
                    <ul className="list-unstyled">
                      {course.features.map((feature, index) => (
                        <li key={index} className="mb-2 text-dark">
                          <span className="me-2 text-success">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Course Content */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Tabs defaultActiveKey="overview" className="mb-4">
                  <Tab eventKey="overview" title="Overview">
                    <Card className="border-0 shadow-sm bg-white">
                      <Card.Body className="p-4">
                        <h4 className="mb-3">About This Course</h4>
                        <p className="text-muted mb-4">
                          This comprehensive course is designed to take you from beginner to advanced level
                          in {course.title.toLowerCase()}. You'll learn through hands-on projects, real-world
                          examples, and industry best practices.
                        </p>

                        <h5 className="mb-3">What You'll Learn</h5>
                        <Row>
                          {course.features.map((feature, index) => (
                            <Col md={6} key={index} className="mb-2">
                              <div className="d-flex align-items-center">
                                <span className="text-success me-2">✓</span>
                                <span>{feature}</span>
                              </div>
                            </Col>
                          ))}
                        </Row>

                        <h5 className="mt-4 mb-3">Prerequisites</h5>
                        <ul className="text-muted">
                          <li>Basic computer knowledge</li>
                          <li>Willingness to learn</li>
                          <li>No prior experience required</li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </Tab>

                  <Tab eventKey="curriculum" title="Curriculum">
                    <Card className="border-0 shadow-sm bg-white">
                      <Card.Body className="p-4">
                        <h4 className="mb-4">Course Curriculum</h4>
                        {curriculum.map((module, index) => (
                          <Card key={index} className="mb-3 border bg-white">
                            <Card.Header className="bg-light">
                              <h6 className="mb-0">{module.module}</h6>
                            </Card.Header>
                            <Card.Body>
                              <ul className="list-unstyled mb-0">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <li key={lessonIndex} className="mb-2 d-flex align-items-center">
                                    <FaPlay className="text-primary me-2" size={12} />
                                    {lesson}
                                  </li>
                                ))}
                              </ul>
                            </Card.Body>
                          </Card>
                        ))}
                      </Card.Body>
                    </Card>
                  </Tab>

                  <Tab eventKey="instructor" title="Instructor">
                    <Card className="border-0 shadow-sm bg-white">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-4">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: '80px', height: '80px' }}>
                            <span className="text-white fs-3">
                              {course.instructor.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="mb-1">{course.instructor}</h4>
                            <p className="text-muted mb-0">Senior Software Engineer & Educator</p>
                          </div>
                        </div>

                        <p className="text-muted mb-3">
                          {course.instructor} is a seasoned professional with over 8 years of experience
                          in the industry. They have worked with top companies and have trained over
                          1000+ students successfully.
                        </p>

                        <div className="row">
                          <div className="col-md-6">
                            <h6>Experience</h6>
                            <p className="text-muted">8+ Years</p>
                          </div>
                          <div className="col-md-6">
                            <h6>Students Taught</h6>
                            <p className="text-muted">1000+</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab>

                  <Tab eventKey="reviews" title="Reviews">
                    <Card className="border-0 shadow-sm bg-white">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-4">
                          <div className="me-4">
                            <h2 className="display-4 fw-bold text-primary">{course.rating}</h2>
                            <div className="text-warning">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.floor(course.rating) ? '' : 'text-muted'} />
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5>Course Rating</h5>
                            <p className="text-muted mb-0">Based on {reviews.length} reviews</p>
                          </div>
                        </div>

                        {reviews.map(review => (
                          <Card key={review.id} className="mb-3 border bg-white">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0">{review.name}</h6>
                                <div className="text-warning">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <FaStar key={i} size={14} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted mb-1">{review.comment}</p>
                              <small className="text-muted">
                                {new Date(review.date).toLocaleDateString()}
                              </small>
                            </Card.Body>
                          </Card>
                        ))}
                      </Card.Body>
                    </Card>
                  </Tab>
                </Tabs>
              </motion.div>
            </Col>

            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="sticky-top"
                style={{ top: '100px' }}
              >
                <Card className="border-0 shadow-sm mb-4 bg-white">
                  <Card.Body className="p-4">
                    <h5 className="mb-3">Course Information</h5>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Duration:</span>
                        <span className="fw-semibold">{course.duration}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Students:</span>
                        <span className="fw-semibold">{course.students}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Rating:</span>
                        <span className="fw-semibold">{course.rating}/5</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Certificate:</span>
                        <span className="fw-semibold">Yes</span>
                      </div>
                    </div>

                    <hr />

                    <h6 className="mb-3">Pricing</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="d-flex align-items-center">
                          <FaLaptop className="me-2 text-primary" />
                          Online Mode:
                        </span>
                        <span className="fw-bold text-primary">₹{course.onlinePrice.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="d-flex align-items-center">
                          <FaBuilding className="me-2 text-success" />
                          Offline Mode:
                        </span>
                        <span className="fw-bold text-success">₹{course.offlinePrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {!isAlreadyPurchased && (
                      <Button
                        variant="primary"
                        className="btn-animated w-100 py-3"
                        onClick={() => setShowPurchaseModal(true)}
                      >
                        Enroll Now
                      </Button>
                    )}
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm bg-white">
                  <Card.Body className="p-4">
                    <h6 className="mb-3">What's Included</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <FaPlay className="text-primary me-2" />
                        Lifetime access to course content
                      </li>
                      <li className="mb-2">
                        <FaCertificate className="text-primary me-2" />
                        Certificate of completion
                      </li>
                      <li className="mb-2">
                        <FaUsers className="text-primary me-2" />
                        Access to student community
                      </li>
                      <li className="mb-2">
                        <FaDownload className="text-primary me-2" />
                        Downloadable resources
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Purchase Modal */}
      <Modal show={showPurchaseModal} onHide={() => setShowPurchaseModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enroll in {course.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Select Learning Mode</Form.Label>
              <div className="d-grid gap-2">
                <Form.Check
                  type="radio"
                  id="online"
                  name="mode"
                  value="online"
                  checked={selectedMode === 'online'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <div className="fw-semibold">Online Mode</div>
                        <small className="text-muted">Learn from anywhere, anytime</small>
                      </div>
                      <span className="fw-bold text-primary">₹{course.onlinePrice.toLocaleString()}</span>
                    </div>
                  }
                  className="border rounded p-3"
                />
                <Form.Check
                  type="radio"
                  id="offline"
                  name="mode"
                  value="offline"
                  checked={selectedMode === 'offline'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <div className="fw-semibold">Offline Mode</div>
                        <small className="text-muted">Classroom learning with direct interaction</small>
                      </div>
                      <span className="fw-bold text-success">₹{course.offlinePrice.toLocaleString()}</span>
                    </div>
                  }
                  className="border rounded p-3"
                />
              </div>
            </Form.Group>

            {/* Payment Options */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Payment Options</Form.Label>
              <div className="d-grid gap-2">
                <Form.Check
                  type="radio"
                  id="fullpay"
                  name="payment"
                  value="full"
                  checked={paymentType === 'full'}
                  onChange={(e) => setPaymentType(e.target.value)}
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <div className="fw-semibold">Full Payment</div>
                        <small className="text-muted">Pay the complete amount now</small>
                      </div>
                      <span className="fw-bold text-success">
                        ₹{(selectedMode === 'online' ? course.onlinePrice : course.offlinePrice).toLocaleString()}
                      </span>
                    </div>
                  }
                  className="border rounded p-3"
                />
                <Form.Check
                  type="radio"
                  id="emi"
                  name="payment"
                  value="emi"
                  checked={paymentType === 'emi'}
                  onChange={(e) => setPaymentType(e.target.value)}
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <div className="fw-semibold">EMI Payment</div>
                        <small className="text-muted">Pay in monthly installments</small>
                      </div>
                      <span className="fw-bold text-primary">
                        ₹{Math.ceil((selectedMode === 'online' ? course.onlinePrice : course.offlinePrice) / emiMonths).toLocaleString()}/month
                      </span>
                    </div>
                  }
                  className="border rounded p-3"
                />
              </div>
            </Form.Group>

            {/* EMI Duration Selection */}
            {paymentType === 'emi' && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">EMI Duration</Form.Label>
                <Form.Select 
                  value={emiMonths} 
                  onChange={(e) => setEmiMonths(parseInt(e.target.value))}
                  className="form-select"
                >
                  <option value={3}>3 Months - ₹{Math.ceil((selectedMode === 'online' ? course.onlinePrice : course.offlinePrice) / 3).toLocaleString()}/month</option>
                  <option value={6}>6 Months - ₹{Math.ceil((selectedMode === 'online' ? course.onlinePrice : course.offlinePrice) / 6).toLocaleString()}/month</option>
                  <option value={12}>12 Months - ₹{Math.ceil((selectedMode === 'online' ? course.onlinePrice : course.offlinePrice) / 12).toLocaleString()}/month</option>
                </Form.Select>
              </Form.Group>
            )}

            <Alert variant="info">
              <small>
                <strong>Note:</strong> You can switch between online and offline modes during the course.
                Offline mode includes additional benefits like lab access and face-to-face mentoring.
                {paymentType === 'emi' && (
                  <><br /><strong>EMI:</strong> First installment will be charged immediately upon enrollment.</>
                )}
              </small>
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePurchase}
            disabled={loading}
            className="btn-animated"
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Processing...
              </>
            ) : (
              `Enroll for ₹${price.toLocaleString()}`
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseDetails;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Modal, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaUser, FaBook, FaClock, FaCheckCircle, FaPlayCircle, FaPause, 
  FaCertificate, FaCalendarAlt, FaChartLine, FaTrophy, FaQuestionCircle,
  FaMoneyBillWave, FaDownload, FaEye, FaLock, FaUnlock
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const { user, userCourses, updateCourseProgress } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock test questions for each course
  const mockQuestions = {
    1: [ // Full Stack Web Development
      {
        id: 1,
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
        correct: 0
      },
      {
        id: 2,
        question: "Which CSS property is used to change the text color?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        correct: 2
      },
      {
        id: 3,
        question: "What is React?",
        options: ["A database", "A JavaScript library", "A web server", "An operating system"],
        correct: 1
      },
      {
        id: 4,
        question: "Which method is used to add an element to the end of an array in JavaScript?",
        options: ["push()", "add()", "append()", "insert()"],
        correct: 0
      },
      {
        id: 5,
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface"],
        correct: 0
      }
    ],
    2: [ // Digital Marketing
      {
        id: 1,
        question: "What does SEO stand for?",
        options: ["Search Engine Optimization", "Social Engine Optimization", "Search Engine Operation", "Social Engine Operation"],
        correct: 0
      },
      {
        id: 2,
        question: "Which platform is best for B2B marketing?",
        options: ["Instagram", "TikTok", "LinkedIn", "Snapchat"],
        correct: 2
      },
      {
        id: 3,
        question: "What is CTR in digital marketing?",
        options: ["Click Through Rate", "Cost Through Rate", "Customer Through Rate", "Conversion Through Rate"],
        correct: 0
      },
      {
        id: 4,
        question: "Which Google tool is used for website analytics?",
        options: ["Google Ads", "Google Analytics", "Google Search Console", "Google My Business"],
        correct: 1
      },
      {
        id: 5,
        question: "What is the ideal length for a Facebook post?",
        options: ["100-150 characters", "40-80 characters", "200-300 characters", "500+ characters"],
        correct: 1
      }
    ]
  };

  // Mock fees data for offline students
  const mockFeesData = {
    totalFees: 25000,
    paidAmount: 15000,
    pendingAmount: 10000,
    installments: [
      { id: 1, amount: 5000, dueDate: '2024-01-15', status: 'paid', paidDate: '2024-01-10' },
      { id: 2, amount: 5000, dueDate: '2024-02-15', status: 'paid', paidDate: '2024-02-12' },
      { id: 3, amount: 5000, dueDate: '2024-03-15', status: 'paid', paidDate: '2024-03-14' },
      { id: 4, amount: 5000, dueDate: '2024-04-15', status: 'pending' },
      { id: 5, amount: 5000, dueDate: '2024-05-15', status: 'pending' }
    ]
  };

  const startTest = (course) => {
    setSelectedCourse(course);
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
    setTestScore(0);
    setShowTestModal(true);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    const questions = mockQuestions[selectedCourse.id];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = () => {
    const questions = mockQuestions[selectedCourse.id];
    let score = 0;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        score++;
      }
    });
    
    const percentage = (score / questions.length) * 100;
    setTestScore(percentage);
    setTestCompleted(true);
    
    if (percentage >= 70) {
      // Update course as completed
      updateCourseProgress(selectedCourse.id, 100);
      toast.success('Congratulations! You passed the test and completed the course!');
    } else {
      toast.error('You need at least 70% to pass. Please study more and try again.');
    }
  };

  const updateProgress = (courseId, newProgress) => {
    updateCourseProgress(courseId, newProgress);
    toast.success('Progress updated successfully!');
  };

  const downloadCertificate = (course) => {
    if (course.progress === 100) {
      toast.success(`Certificate for ${course.courseName} downloaded successfully!`);
      // Simulate download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${course.courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
      link.click();
    } else {
      toast.error('Complete the course and pass the test to download certificate');
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'danger';
    if (progress < 70) return 'warning';
    return 'success';
  };

  const getNextDueInstallment = () => {
    return mockFeesData.installments.find(inst => inst.status === 'pending');
  };

  return (
    <div className="student-dashboard">
      <Container fluid className="py-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm gradient-primary text-white">
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h2 className="mb-2">
                        <FaUser className="me-2" />
                        Welcome back, {user?.name}!
                      </h2>
                      <p className="mb-0 opacity-75">
                        Continue your learning journey and track your progress
                      </p>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="d-flex justify-content-end gap-3">
                        <div className="text-center">
                          <h4 className="mb-0">{userCourses?.length || 0}</h4>
                          <small>Enrolled Courses</small>
                        </div>
                        <div className="text-center">
                          <h4 className="mb-0">
                            {userCourses?.filter(c => c.progress === 100).length || 0}
                          </h4>
                          <small>Completed</small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>

        {/* Dashboard Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 custom-tabs"
        >
          {/* Overview Tab */}
          <Tab eventKey="overview" title={<><FaChartLine className="me-2" />Overview</>}>
            <Row>
              {/* Quick Stats */}
              <Col lg={3} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 shadow-sm h-100 stat-card">
                    <Card.Body className="text-center">
                      <FaBook className="text-primary mb-3" size={40} />
                      <h3 className="mb-1">{userCourses?.length || 0}</h3>
                      <p className="text-muted mb-0">Total Courses</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              <Col lg={3} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-0 shadow-sm h-100 stat-card">
                    <Card.Body className="text-center">
                      <FaCheckCircle className="text-success mb-3" size={40} />
                      <h3 className="mb-1">
                        {userCourses?.filter(c => c.progress === 100).length || 0}
                      </h3>
                      <p className="text-muted mb-0">Completed</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              <Col lg={3} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-0 shadow-sm h-100 stat-card">
                    <Card.Body className="text-center">
                      <FaClock className="text-warning mb-3" size={40} />
                      <h3 className="mb-1">
                        {userCourses?.filter(c => c.progress > 0 && c.progress < 100).length || 0}
                      </h3>
                      <p className="text-muted mb-0">In Progress</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>

              <Col lg={3} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-0 shadow-sm h-100 stat-card">
                    <Card.Body className="text-center">
                      <FaTrophy className="text-warning mb-3" size={40} />
                      <h3 className="mb-1">
                        {userCourses?.filter(c => c.progress === 100).length || 0}
                      </h3>
                      <p className="text-muted mb-0">Certificates</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            {/* Recent Activity */}
            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">
                      <FaChartLine className="me-2 text-primary" />
                      Recent Activity
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="activity-timeline">
                      <div className="activity-item">
                        <div className="activity-icon bg-success">
                          <FaCheckCircle />
                        </div>
                        <div className="activity-content">
                          <h6>Completed Module 3: React Hooks</h6>
                          <small className="text-muted">2 hours ago</small>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon bg-primary">
                          <FaPlayCircle />
                        </div>
                        <div className="activity-content">
                          <h6>Started Module 4: State Management</h6>
                          <small className="text-muted">1 day ago</small>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon bg-warning">
                          <FaBook />
                        </div>
                        <div className="activity-content">
                          <h6>Enrolled in Full Stack Web Development</h6>
                          <small className="text-muted">3 days ago</small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* My Courses Tab */}
          <Tab eventKey="courses" title={<><FaBook className="me-2" />My Courses</>}>
            <Row>
              {userCourses && userCourses.length > 0 ? (
                userCourses.map((course, index) => (
                  <Col lg={6} className="mb-4" key={course.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-sm h-100 course-card">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="mb-1">{course.courseName}</h5>
                              <Badge bg={course.mode === 'online' ? 'primary' : 'success'} className="mb-2">
                                {course.mode === 'online' ? 'Online' : 'Offline'} Mode
                              </Badge>
                            </div>
                            <div className="text-end">
                              <small className="text-muted">Progress</small>
                              <h6 className="mb-0">{course.progress}%</h6>
                            </div>
                          </div>

                          <ProgressBar 
                            variant={getProgressColor(course.progress)}
                            now={course.progress} 
                            className="mb-3"
                            style={{ height: '8px' }}
                          />

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <small className="text-muted d-block">Enrolled: {course.enrolledDate}</small>
                              <small className="text-muted">Duration: {course.duration}</small>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">Price Paid</small>
                              <strong>₹{course.pricePaid?.toLocaleString()}</strong>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => updateProgress(course.id, Math.min(course.progress + 10, 90))}
                              disabled={course.progress >= 90}
                            >
                              <FaPlayCircle className="me-1" />
                              Continue
                            </Button>
                            
                            {course.progress >= 90 && (
                              <Button 
                                variant="warning" 
                                size="sm"
                                onClick={() => startTest(course)}
                              >
                                <FaQuestionCircle className="me-1" />
                                Take Test
                              </Button>
                            )}
                            
                            {course.progress === 100 && (
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => downloadCertificate(course)}
                              >
                                <FaCertificate className="me-1" />
                                Certificate
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))
              ) : (
                <Col>
                  <Card className="border-0 shadow-sm text-center py-5">
                    <Card.Body>
                      <FaBook size={60} className="text-muted mb-3" />
                      <h4>No Courses Enrolled</h4>
                      <p className="text-muted">Start your learning journey by enrolling in a course</p>
                      <Button variant="primary" href="/courses">
                        Browse Courses
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          </Tab>

          {/* Fees Tab (for offline students) */}
          <Tab eventKey="fees" title={<><FaMoneyBillWave className="me-2" />Fees</>}>
            <Row>
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">
                      <FaMoneyBillWave className="me-2 text-primary" />
                      Fee Payment History
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Installment</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Paid Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockFeesData.installments.map((installment, index) => (
                            <tr key={installment.id}>
                              <td>#{index + 1}</td>
                              <td>₹{installment.amount.toLocaleString()}</td>
                              <td>{new Date(installment.dueDate).toLocaleDateString()}</td>
                              <td>
                                <Badge bg={installment.status === 'paid' ? 'success' : 'warning'}>
                                  {installment.status === 'paid' ? (
                                    <><FaCheckCircle className="me-1" />Paid</>
                                  ) : (
                                    <><FaClock className="me-1" />Pending</>
                                  )}
                                </Badge>
                              </td>
                              <td>
                                {installment.paidDate ? 
                                  new Date(installment.paidDate).toLocaleDateString() : 
                                  '-'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">Fee Summary</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total Fees:</span>
                      <strong>₹{mockFeesData.totalFees.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Paid Amount:</span>
                      <strong>₹{mockFeesData.paidAmount.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-danger">
                      <span>Pending Amount:</span>
                      <strong>₹{mockFeesData.pendingAmount.toLocaleString()}</strong>
                    </div>
                    <ProgressBar 
                      variant="success"
                      now={(mockFeesData.paidAmount / mockFeesData.totalFees) * 100}
                      label={`${Math.round((mockFeesData.paidAmount / mockFeesData.totalFees) * 100)}%`}
                    />
                  </Card.Body>
                </Card>

                {getNextDueInstallment() && (
                  <Card className="border-0 shadow-sm border-warning">
                    <Card.Header className="bg-warning text-dark">
                      <h6 className="mb-0">Next Due Payment</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="text-center">
                        <h4 className="text-warning">₹{getNextDueInstallment().amount.toLocaleString()}</h4>
                        <p className="mb-2">Due: {new Date(getNextDueInstallment().dueDate).toLocaleDateString()}</p>
                        <Button variant="warning" size="sm" className="w-100">
                          Pay Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>

      {/* Test Modal */}
      <Modal show={showTestModal} onHide={() => setShowTestModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaQuestionCircle className="me-2" />
            {selectedCourse?.courseName} - Final Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!testCompleted ? (
            selectedCourse && mockQuestions[selectedCourse.id] && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Badge bg="primary">
                    Question {currentQuestion + 1} of {mockQuestions[selectedCourse.id].length}
                  </Badge>
                  <ProgressBar 
                    now={((currentQuestion + 1) / mockQuestions[selectedCourse.id].length) * 100}
                    style={{ width: '200px', height: '8px' }}
                  />
                </div>

                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h5 className="mb-4">
                      {mockQuestions[selectedCourse.id][currentQuestion].question}
                    </h5>
                    
                    <div className="d-grid gap-2">
                      {mockQuestions[selectedCourse.id][currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={answers[mockQuestions[selectedCourse.id][currentQuestion].id] === index ? 'primary' : 'outline-secondary'}
                          className="text-start p-3"
                          onClick={() => handleAnswerSelect(mockQuestions[selectedCourse.id][currentQuestion].id, index)}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </>
            )
          ) : (
            <div className="text-center py-4">
              <div className={`mb-4 ${testScore >= 70 ? 'text-success' : 'text-danger'}`}>
                {testScore >= 70 ? (
                  <FaCheckCircle size={60} />
                ) : (
                  <FaTimesCircle size={60} />
                )}
              </div>
              <h3 className={testScore >= 70 ? 'text-success' : 'text-danger'}>
                {testScore >= 70 ? 'Congratulations!' : 'Test Failed'}
              </h3>
              <h4>Your Score: {testScore.toFixed(1)}%</h4>
              <p className="text-muted">
                {testScore >= 70 
                  ? 'You have successfully completed the course and can now download your certificate!'
                  : 'You need at least 70% to pass. Please study more and try again.'
                }
              </p>
              {testScore >= 70 && (
                <Button 
                  variant="success" 
                  onClick={() => downloadCertificate(selectedCourse)}
                  className="mt-3"
                >
                  <FaCertificate className="me-2" />
                  Download Certificate
                </Button>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!testCompleted && (
            <Button 
              variant="primary" 
              onClick={nextQuestion}
              disabled={!answers[mockQuestions[selectedCourse?.id]?.[currentQuestion]?.id]}
            >
              {currentQuestion < (mockQuestions[selectedCourse?.id]?.length - 1) ? 'Next Question' : 'Submit Test'}
            </Button>
          )}
          {testCompleted && (
            <Button variant="secondary" onClick={() => setShowTestModal(false)}>
              Close
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
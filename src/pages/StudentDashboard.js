import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Modal, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaUser, FaBook, FaClock, FaCheckCircle, FaPlayCircle, FaPause,
  FaCertificate, FaCalendarAlt, FaChartLine, FaTrophy, FaQuestionCircle,
  FaMoneyBillWave, FaDownload, FaEye, FaLock, FaUnlock, FaEdit, FaSave,
  FaTimes, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserEdit,
  FaKey, FaBell, FaCog, FaTimesCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import StudentUsecase from '../lib/usecase/StudentUsecase';
import FeesUsecase from '../lib/usecase/FeesUsecase';

const StudentDashboard = () => {
  const { user, loading } = useAuth();

  // Dynamic data state
  const [dashboardData, setDashboardData] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [feesData, setFeesData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load dashboard data when user is available
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!loading && user?.id) {
        try {
          setDataLoading(true);
          setDataError(null);

          // Load dashboard data
          const result = await StudentUsecase.getDashboardDataUsecase(user.id);

          // Load fees data separately using FeesUsecase
          const feesResult = await FeesUsecase.getUserFeesUsecase(user.id);

          if (result.success && result.data) {
            setDashboardData(result.data);
            setUserCourses(result.data.userCourses || []);
            setCertificates(result.data.certificates || []);
            setDashboardStats(result.data.stats || null);

            // Set fees data from FeesUsecase
            if (feesResult.success && feesResult.data) {
              setFeesData(feesResult.data);
            } else {
              setFeesData(null);
            }
          } else {
            setDataError(result.error || 'Failed to load dashboard data');
            toast.error(result.error || 'Failed to load dashboard data');
          }
        } catch (error) {
          setDataError(error.message || 'An unexpected error occurred');
          toast.error('Failed to load dashboard data');
        } finally {
          setDataLoading(false);
        }
      } else if (!loading && !user?.id) {
        setDataLoading(false);
      }
    };

    loadDashboardData();
  }, [user, loading]);

  // Helper function to handle empty strings and null values
  const getValidValue = (value, fallback = 'Not provided') => {
    // Handle null, undefined, empty string, or whitespace-only strings
    if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
      return fallback;
    }
    return value;
  };

  // Handle Pay Now button click
  const handlePayNow = (fee) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  // Handle payment confirmation
  const handlePaymentConfirm = async () => {
    if (!selectedFee || !user?.id) return;

    try {
      setPaymentLoading(true);
      
      // Call the markFeePaidUsecase
      const result = await FeesUsecase.markFeePaidUsecase(selectedFee.id);
      
      if (result.success) {
        toast.success('Payment successful! Fee has been marked as paid.');
        
        // Refresh fees data
        const feesResult = await FeesUsecase.getUserFeesUsecase(user.id);
        if (feesResult.success && feesResult.data) {
          setFeesData(feesResult.data);
        }
        
        // Close modal
        setShowPaymentModal(false);
        setSelectedFee(null);
      } else {
        toast.error(result.error || 'Failed to process payment');
      }
    } catch (error) {
      toast.error('An error occurred while processing payment');
      console.error('Payment error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...',
    dateOfBirth: 'Not provided'
  });

  // Update profile data when dashboard data is loaded
  useEffect(() => {
    if (dashboardData?.profile) {
      const profile = dashboardData.profile;
      const newProfileData = {
        name: getValidValue(profile.full_name || profile.name),
        email: getValidValue(profile.email),
        phone: getValidValue(profile.phone_number || profile.phone),
        dateOfBirth: getValidValue(profile.date_of_birth || profile.dateOfBirth)
      };

      setProfileData(newProfileData);
    } else if (!dataLoading && !dashboardData?.profile) {
      // Fallback to user data if available
      if (user) {
        const newProfileData = {
          name: getValidValue(user?.full_name || user?.name),
          email: getValidValue(user?.email),
          phone: getValidValue(user?.phone_number || user?.phone),
          dateOfBirth: getValidValue(user?.date_of_birth || user?.dateOfBirth)
        };
        setProfileData(newProfileData);
      }
    }
  }, [dashboardData, dataLoading, user]);

  // Test functionality - would be replaced with actual quiz system
  const [testQuestions, setTestQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Dynamic functions for course and certificate operations

  const startTest = async (course) => {
    setSelectedCourse(course);
    setLoadingQuestions(true);

    try {
      // In a real implementation, this would fetch questions from the backend
      // For now, we'll show a placeholder message
      setTestQuestions([]);
      setShowTestModal(true);
      setCurrentQuestion(0);
      setAnswers({});
      setTestCompleted(false);
      setTestScore(0);

      toast.info('Quiz system is under development. Progress can be updated manually.');
    } catch (error) {
      toast.error('Failed to load test questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (testQuestions.length === 0) {
      submitTest();
      return;
    }

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    if (!user?.id || !selectedCourse?.id) {
      toast.error('Please log in to submit test');
      return;
    }

    try {
      // For demo purposes, simulate a test score
      const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100

      setTestScore(score);
      setTestCompleted(true);

      if (score >= 70) {
        // Update course as completed
        await updateProgress(selectedCourse.id, 100);
        toast.success('Congratulations! You passed the test and completed the course!');
      } else {
        toast.error('You need at least 70% to pass. Please study more and try again.');
      }
    } catch (error) {
      toast.error('Failed to submit test. Please try again.');
    }
  };

  const updateProgress = async (courseId, newProgress) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const result = await StudentUsecase.updateCourseProgressUsecase(user.id, courseId, newProgress);

      if (result.success) {
        // Update local state
        setUserCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === courseId
              ? { ...course, progress: newProgress }
              : course
          )
        );

        // Reload dashboard data to get updated stats
        const dashboardResult = await StudentUsecase.getDashboardDataUsecase(user.id);
        if (dashboardResult.success) {
          setDashboardStats(dashboardResult.data.stats);
        }
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const downloadCertificate = async (course) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    if (course.progress < 100) {
      toast.error('Complete the course and pass the test to download certificate');
      return;
    }

    try {
      const result = await StudentUsecase.downloadCertificateUsecase(
        user.id,
        course.id,
        dashboardData?.profile
      );

      if (!result.success) {
        toast.error(result.error || 'Failed to download certificate');
      }
      // Success message is handled in the usecase
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const getProgressColor = (progress) => {
    return StudentUsecase.getProgressColor(progress);
  };

  const getNextDueInstallment = () => {
    if (!feesData?.fees) return null;

    // Find the next pending fee entry sorted by due date
    const pendingFees = feesData.fees
      .filter(fee => fee.status === 'pending' || fee.status === 'overdue')
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    return pendingFees.length > 0 ? pendingFees[0] : null;
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileSave = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // Only update fields that exist in the user_profiles table schema
      const updateData = {
        full_name: profileData.name !== 'Not provided' ? profileData.name : null,
        email: profileData.email !== 'Not provided' ? profileData.email : null,
        phone_number: profileData.phone !== 'Not provided' ? profileData.phone : null,
        date_of_birth: profileData.dateOfBirth !== 'Not provided' ? profileData.dateOfBirth : null
      };

      const result = await StudentUsecase.updateProfileUsecase(user.id, updateData);

      if (result.success) {
        setIsEditingProfile(false);
        // Reload dashboard data to get updated profile
        const dashboardResult = await StudentUsecase.getDashboardDataUsecase(user.id);
        if (dashboardResult.success) {
          setDashboardData(dashboardResult.data);
        }
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleProfileCancel = () => {
    // Reset to current dashboard data or user data
    const profile = dashboardData?.profile || user;
    if (profile) {
      setProfileData({
        name: getValidValue(profile.full_name || profile.name),
        email: getValidValue(profile.email),
        phone: getValidValue(profile.phone_number || profile.phone),
        dateOfBirth: getValidValue(profile.date_of_birth || profile.dateOfBirth)
      });
    }
    setIsEditingProfile(false);
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureUpload = () => {
    toast.info('Profile picture upload functionality will be implemented soon!');
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
                        Welcome back, {user?.full_name || user?.name || 'Student'}!
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
                      <h3 className="mb-1">
                        {dataLoading ? '...' : (dashboardStats?.totalCourses || userCourses?.length || 0)}
                      </h3>
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
                        {dataLoading ? '...' : (dashboardStats?.completedCourses || userCourses?.filter(c => c.progress === 100).length || 0)}
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
                        {dataLoading ? '...' : (dashboardStats?.inProgressCourses || userCourses?.filter(c => c.progress > 0 && c.progress < 100).length || 0)}
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
                        {dataLoading ? '...' : (dashboardStats?.totalCertificates || certificates?.length || 0)}
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
                      {dataLoading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="text-muted mt-2">Loading recent activity...</p>
                        </div>
                      ) : dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0 ? (
                        dashboardStats.recentActivity.map((activity, index) => (
                          <div key={index} className="activity-item">
                            <div className={`activity-icon ${activity.type === 'completed' ? 'bg-success' : activity.type === 'started' ? 'bg-primary' : 'bg-warning'}`}>
                              {activity.type === 'completed' ? <FaCheckCircle /> :
                                activity.type === 'started' ? <FaPlayCircle /> : <FaBook />}
                            </div>
                            <div className="activity-content">
                              <h6>{activity.title}</h6>
                              <small className="text-muted">{activity.timeAgo}</small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <FaChartLine className="text-muted mb-3" size={40} />
                          <p className="text-muted">No recent activity to display</p>
                          <small className="text-muted">Start learning to see your progress here!</small>
                        </div>
                      )}
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
                            <th>Course</th>
                            <th>Installment</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Paid Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataLoading ? (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mt-2">Loading fees data...</p>
                              </td>
                            </tr>
                          ) : feesData?.fees && feesData.fees.length > 0 ? (
                            feesData.fees.map((fee, index) => (
                              <tr key={fee.id}>
                                <td>
                                  <div>
                                    <strong>{fee.course_title}</strong>
                                    <br />
                                    <small className="text-muted">{fee.mode}</small>
                                  </div>
                                </td>
                                <td>#{fee.installment_number}</td>
                                <td>₹{fee.amount.toLocaleString()}</td>
                                <td>{new Date(fee.due_date).toLocaleDateString()}</td>
                                <td>
                                  <Badge bg={fee.status === 'paid' ? 'success' : fee.status === 'overdue' ? 'danger' : 'warning'}>
                                    {fee.status === 'paid' ? (
                                      <><FaCheckCircle className="me-1" />Paid</>
                                    ) : fee.status === 'overdue' ? (
                                      <><FaTimesCircle className="me-1" />Overdue</>
                                    ) : (
                                      <><FaClock className="me-1" />Pending</>
                                    )}
                                  </Badge>
                                </td>
                                <td>
                                  {fee.paid_date ?
                                    new Date(fee.paid_date).toLocaleDateString() :
                                    '-'
                                  }
                                </td>
                                <td>
                                  {fee.status !== 'paid' ? (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => handlePayNow(fee)}
                                      disabled={dataLoading}
                                    >
                                      <FaMoneyBillWave className="me-1" />
                                      Pay Now
                                    </Button>
                                  ) : (
                                    <Badge bg="success">
                                      <FaCheckCircle className="me-1" />
                                      Paid
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                <FaMoneyBillWave className="text-muted mb-3" size={40} />
                                <p className="text-muted">No fees data available</p>
                                <small className="text-muted">Enroll in a course to see fees information</small>
                              </td>
                            </tr>
                          )}
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
                    {dataLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2">Loading fee summary...</p>
                      </div>
                    ) : feesData?.summary ? (
                      <>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Fees:</span>
                          <strong>₹{feesData.summary.total_amount.toLocaleString()}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Paid Amount:</span>
                          <strong>₹{feesData.summary.paid_amount.toLocaleString()}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-3 text-danger">
                          <span>Pending Amount:</span>
                          <strong>₹{feesData.summary.pending_amount.toLocaleString()}</strong>
                        </div>
                        <ProgressBar
                          variant="success"
                          now={(feesData.summary.paid_amount / feesData.summary.total_amount) * 100}
                          label={`${Math.round((feesData.summary.paid_amount / feesData.summary.total_amount) * 100)}%`}
                        />
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <FaMoneyBillWave className="text-muted mb-3" size={40} />
                        <p className="text-muted">No fee summary available</p>
                        <small className="text-muted">Contact administration for fee information</small>
                      </div>
                    )}
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
                        <p className="mb-2">Due: {new Date(getNextDueInstallment().due_date).toLocaleDateString()}</p>
                        <small className="text-muted d-block mb-2">
                          {getNextDueInstallment().course_title} - Installment #{getNextDueInstallment().installment_number}
                        </small>
                        <Button 
                          variant="warning" 
                          size="sm" 
                          className="w-100"
                          onClick={() => handlePayNow(getNextDueInstallment())}
                          disabled={dataLoading || paymentLoading}
                        >
                          <FaMoneyBillWave className="me-1" />
                          Pay Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </Tab>

          {/* Profile Tab */}
          <Tab eventKey="profile" title={<><FaUserEdit className="me-2" />Profile</>}>
            <Row>
              <Col lg={4}>
                {/* Profile Picture and Basic Info */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body className="text-center">
                    <div className="position-relative d-inline-block mb-3">
                      <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: '120px', height: '120px', fontSize: '48px', color: 'white' }}
                      >
                        <FaUser />
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="position-absolute bottom-0 end-0 rounded-circle"
                        style={{ width: '35px', height: '35px' }}
                        onClick={handleProfilePictureUpload}
                      >
                        <FaCamera size={14} />
                      </Button>
                    </div>
                    <h4 className="mb-1">{profileData.name || 'Student Name'}</h4>
                    <p className="text-muted mb-3">{profileData.email || 'No email provided'}</p>
                    <Badge bg="primary" className="mb-3">Student</Badge>

                    <div className="d-grid gap-2">
                      {!isEditingProfile ? (
                        <Button variant="outline-primary" onClick={handleProfileEdit}>
                          <FaEdit className="me-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button variant="success" onClick={handleProfileSave}>
                            <FaSave className="me-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline-secondary" onClick={handleProfileCancel}>
                            <FaTimes className="me-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>


                {/* Quick Stats */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h6 className="mb-0">Learning Stats</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <FaBook className="text-primary me-2" />
                        <span>Courses Enrolled</span>
                      </div>
                      <Badge bg="primary">{dashboardStats?.totalCourses || 0}</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <FaCheckCircle className="text-success me-2" />
                        <span>Completed</span>
                      </div>
                      <Badge bg="success">{dashboardStats?.completedCourses || 0}</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <FaTrophy className="text-warning me-2" />
                        <span>Certificates</span>
                      </div>
                      <Badge bg="warning">{dashboardStats?.totalCertificates || 0}</Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={8}>
                {/* Personal Information */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">
                      <FaUser className="me-2 text-primary" />
                      Personal Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaUser className="me-2 text-muted" />
                            Full Name
                          </Form.Label>
                          {isEditingProfile ? (
                            <Form.Control
                              type="text"
                              value={profileData.name}
                              onChange={(e) => handleProfileChange('name', e.target.value)}
                            />
                          ) : (
                            <p className="mb-0">{profileData.name || 'Not provided'}</p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaEnvelope className="me-2 text-muted" />
                            Email Address
                          </Form.Label>
                          {isEditingProfile ? (
                            <Form.Control
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                            />
                          ) : (
                            <p className="mb-0">{profileData.email || 'Not provided'}</p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaPhone className="me-2 text-muted" />
                            Phone Number
                          </Form.Label>
                          {isEditingProfile ? (
                            <Form.Control
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => handleProfileChange('phone', e.target.value)}
                            />
                          ) : (
                            <p className="mb-0">{profileData.phone || 'Not provided'}</p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaCalendarAlt className="me-2 text-muted" />
                            Date of Birth
                          </Form.Label>
                          {isEditingProfile ? (
                            <Form.Control
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                            />
                          ) : (
                            <p className="mb-0">
                              {profileData.dateOfBirth
                                ? new Date(profileData.dateOfBirth).toLocaleDateString()
                                : 'Not provided'
                              }
                            </p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaMapMarkerAlt className="me-2 text-muted" />
                            Address
                          </Form.Label>
                          <p className="mb-0 text-muted">Not available for editing</p>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Educational Background */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">
                      <FaBook className="me-2 text-primary" />
                      Educational Background
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">Education</Form.Label>
                          <p className="mb-0 text-muted">Not available for editing</p>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">Experience</Form.Label>
                          <p className="mb-0 text-muted">Not available for editing</p>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">Interests</Form.Label>
                          <p className="mb-0 text-muted">Not available for editing</p>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>


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
            loadingQuestions ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted">Loading quiz questions...</p>
              </div>
            ) : testQuestions.length > 0 ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Badge bg="primary">
                    Question {currentQuestion + 1} of {testQuestions.length}
                  </Badge>
                  <ProgressBar
                    now={((currentQuestion + 1) / testQuestions.length) * 100}
                    style={{ width: '200px', height: '8px' }}
                  />
                </div>

                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h5 className="mb-4">
                      {testQuestions[currentQuestion].question}
                    </h5>

                    <div className="d-grid gap-2">
                      {testQuestions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant={answers[testQuestions[currentQuestion].id] === index ? 'primary' : 'outline-secondary'}
                          className="text-start p-3"
                          onClick={() => handleAnswerSelect(testQuestions[currentQuestion].id, index)}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <div className="text-center py-5">
                <FaQuestionCircle className="text-muted mb-3" size={60} />
                <h5 className="text-muted mb-3">Quiz System Under Development</h5>
                <p className="text-muted mb-4">
                  The quiz system is currently being developed. For now, you can simulate progress updates.
                </p>
                <Button variant="primary" onClick={submitTest}>
                  Simulate Progress Update
                </Button>
              </div>
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
          {!testCompleted && testQuestions.length > 0 && (
            <Button
              variant="primary"
              onClick={nextQuestion}
              disabled={!answers[testQuestions[currentQuestion]?.id]}
            >
              {currentQuestion < (testQuestions.length - 1) ? 'Next Question' : 'Submit Test'}
            </Button>
          )}
          {testCompleted && (
            <Button variant="secondary" onClick={() => setShowTestModal(false)}>
              Close
            </Button>
          )}
          {!testCompleted && (
            <Button variant="secondary" onClick={() => setShowTestModal(false)}>
              Cancel
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaMoneyBillWave className="me-2 text-primary" />
            Confirm Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFee && (
            <div>
              <Alert variant="info" className="mb-3">
                <FaMoneyBillWave className="me-2" />
                You are about to mark this fee as paid. This action cannot be undone.
              </Alert>
              
              <div className="mb-3">
                <strong>Course:</strong> {selectedFee.course_title}
                <br />
                <small className="text-muted">{selectedFee.mode}</small>
              </div>
              
              <div className="mb-3">
                <strong>Installment:</strong> #{selectedFee.installment_number}
              </div>
              
              <div className="mb-3">
                <strong>Amount:</strong> ₹{selectedFee.amount?.toLocaleString()}
              </div>
              
              <div className="mb-3">
                <strong>Due Date:</strong> {new Date(selectedFee.due_date).toLocaleDateString()}
              </div>
              
              <div className="mb-3">
                <strong>Status:</strong>{' '}
                <Badge bg={selectedFee.status === 'overdue' ? 'danger' : 'warning'}>
                  {selectedFee.status === 'overdue' ? 'Overdue' : 'Pending'}
                </Badge>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowPaymentModal(false)}
            disabled={paymentLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePaymentConfirm}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Processing...
              </>
            ) : (
              <>
                <FaCheckCircle className="me-2" />
                Confirm Payment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
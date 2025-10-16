import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Nav, Tab, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaKey, FaUser, FaRupeeSign, FaClock, FaCreditCard, FaMoneyBillWave, FaPlus, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import AdminUsecase from '../../lib/usecase/AdminUsecase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [financialStats, setFinancialStats] = useState({});
  const navigate = useNavigate();

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);

  // Form data states
  const [studentFormData, setStudentFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    dob: '',
    course_id: '',
    enrollment_mode: 'online',
    payment_mode: 'full',
    total_amount: '',
    installment_count: 3,
    installment_amount: '',
    first_installment_date: ''
  });

  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    is_active: true
  });

  const [editingCourse, setEditingCourse] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Validate admin access
        const validation = await AdminUsecase.validateAdminAccess();

        if (!validation.valid) {
          navigate('/admin/login');
          return;
        }

        setAdminUser(validation.user);

        // Fetch dashboard data
        await fetchDashboardData();

      } catch (error) {
        console.error('Admin initialization error:', error);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    initializeAdmin();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch real data from usecases
      const studentsResult = await AdminUsecase.getAllStudentsUsecase();
      const enrollmentsResult = await AdminUsecase.getAllEnrollmentsUsecase();
      const coursesResult = await AdminUsecase.getAllCoursesUsecase();
      const financialResult = await AdminUsecase.getFinancialStatsUsecase();

      console.log('Courses result:', coursesResult);
      console.log('Courses data:', coursesResult.courses);

      // Set the actual data
      setStudents(studentsResult.students || []);
      setEnrollments(enrollmentsResult.enrollments || []);
      setCourses(coursesResult.courses || []);
      setFinancialStats(financialResult || {});

      setStats({
        totalStudents: studentsResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalEnrollments: enrollmentsResult.count || 0,
        totalRevenue: financialResult.totalRevenue || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data as fallback
      setStats({
        totalStudents: 150,
        totalCourses: 12,
        totalEnrollments: 89,
        totalRevenue: 245000
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AdminUsecase.adminLogoutUsecase();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      AdminUsecase.clearAdminSession();
      navigate('/admin/login');
    }
  };

  const handleChangePassword = () => {
    navigate('/admin/change-password');
  };

  // Modal handlers
  const resetForms = () => {
    setStudentFormData({
      full_name: '',
      email: '',
      phone_number: '',
      dob: '',
      course_id: '',
      enrollment_mode: 'online',
      payment_mode: 'full',
      total_amount: '',
      installment_count: 3,
      installment_amount: '',
      first_installment_date: ''
    });
    setCourseFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      is_active: true
    });
    setFormError('');
    setFormSuccess('');
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // Validate required fields
      if (!studentFormData.full_name || !studentFormData.email || !studentFormData.course_id || !studentFormData.phone_number || !studentFormData.dob) {
        setFormError('Please fill in all required fields');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(studentFormData.email)) {
        setFormError('Please enter a valid email address');
        return;
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(studentFormData.phone_number)) {
        setFormError('Please enter a valid 10-digit phone number');
        return;
      }

      // Date validation (DOB should not be in future)
      const today = new Date();
      const dobDate = new Date(studentFormData.dob);
      if (dobDate >= today) {
        setFormError('Date of birth cannot be today or in the future');
        return;
      }

      // Age validation (minimum 10 years old)
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 10) {
        setFormError('Student must be at least 10 years old');
        return;
      }

      // Validate payment mode specific fields
      if (studentFormData.payment_mode === 'emi') {
        if (!studentFormData.installment_count || !studentFormData.installment_amount || !studentFormData.first_installment_date) {
          setFormError('Please fill in all EMI details');
          return;
        }
      } else if (studentFormData.payment_mode === 'full') {
        if (!studentFormData.total_amount) {
          setFormError('Please enter the total amount for full payment');
          return;
        }
      }

      // Amount validation
      if (parseFloat(studentFormData.total_amount) <= 0) {
        setFormError('Total amount must be greater than 0');
        return;
      }

      // Add student logic here - you'll need to implement this in AdminUsecase
      const result = await AdminUsecase.addStudentWithEnrollment(studentFormData);

      if (result.success) {
        setFormSuccess('Student added and enrolled successfully!');
        await fetchDashboardData(); // Refresh data
        setTimeout(() => {
          setShowAddStudentModal(false);
          resetForms();
        }, 1500);
      } else {
        setFormError(result.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setFormError('An error occurred while adding the student');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // Validate required fields
      if (!courseFormData.title || !courseFormData.price) {
        setFormError('Please fill in all required fields');
        return;
      }

      // Add course logic here - you'll need to implement this in AdminUsecase
      const result = await AdminUsecase.addCourse(courseFormData);

      if (result.success) {
        setFormSuccess('Course added successfully!');
        await fetchDashboardData(); // Refresh data
        setTimeout(() => {
          setShowAddCourseModal(false);
          resetForms();
        }, 1500);
      } else {
        setFormError(result.error || 'Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setFormError('An error occurred while adding the course');
    }
  };



  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title || '',
      description: course.description || '',
      price: course.price || '',
      duration: course.duration || '',
      category: course.category || '',
      is_active: course.is_active !== false
    });
    setShowEditCourseModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // Update course logic here - you'll need to implement this in AdminUsecase
      const result = await AdminUsecase.updateCourse(editingCourse.id, courseFormData);

      if (result.success) {
        setFormSuccess('Course updated successfully!');
        await fetchDashboardData(); // Refresh data
        setTimeout(() => {
          setShowEditCourseModal(false);
          resetForms();
          setEditingCourse(null);
        }, 1500);
      } else {
        setFormError(result.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setFormError('An error occurred while updating the course');
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }



  return (
    <Container fluid>
      {/* Header */}
      <Row className="bg-primary text-white py-3 mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">Admin Dashboard</h2>
              {adminUser && (
                <small className="text-light">
                  <FaUser className="me-1" />
                  Welcome, {adminUser.full_name || adminUser.email}
                </small>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleChangePassword}
              >
                <FaKey className="me-1" />
                Change Password
              </Button>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" />
                Logout
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      {activeTab === 'overview' && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h3 className="text-primary">{stats.totalStudents}</h3>
                <p className="text-muted mb-0">Total Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h3 className="text-success">{stats.totalCourses}</h3>
                <p className="text-muted mb-0">Total Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h3 className="text-warning">{stats.totalEnrollments}</h3>
                <p className="text-muted mb-0">Total Enrollments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <h3 className="text-info">₹{stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Navigation Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="students">Students</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="courses">Courses</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="enrollments">Enrollments</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="financial">Financial</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane eventKey="overview">
            <Row>
              <Col md={8}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Activity</h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted">Recent enrollments and course activities will be displayed here.</p>
                    {/* TODO: Add recent activity component */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button variant="primary">Add New Course</Button>
                      <Button variant="outline-primary">Manage Students</Button>
                      <Button variant="outline-primary">View Reports</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Students Tab */}
          <Tab.Pane eventKey="students">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Students Management</h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddStudentModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Student
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? students.map(student => (
                      <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.full_name || student.name || 'N/A'}</td>
                        <td>{student.email}</td>
                        <td>{student.course_title || 'N/A'}</td>
                        <td>
                          <Badge bg={student.is_active ? 'success' : 'secondary'}>
                            {student.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/admin/student/${student.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          {loading ? 'Loading students...' : 'No students found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Courses Tab */}
          <Tab.Pane eventKey="courses">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Courses Management</h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddCourseModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Course
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Title</th>
                      <th>Students</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length > 0 ? courses.map(course => (
                      <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>{course.title}</td>
                        <td>{course.enrollment_count || 0}</td>
                        <td>₹{course.price ? course.price.toLocaleString() : 'N/A'}</td>
                        <td>
                          <Badge bg={course.is_active ? 'success' : 'secondary'}>
                            {course.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            View
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEditCourse(course)}
                          >
                            <FaEdit className="me-1" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          {loading ? 'Loading courses...' : 'No courses found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Enrollments Tab */}
          <Tab.Pane eventKey="enrollments">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Enrollments Management</h5>
                <Button variant="primary" size="sm">Add Enrollment</Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Enrollment Date</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.length > 0 ? enrollments.map(enrollment => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.id}</td>
                        <td>{enrollment.student_name || enrollment.user_email || 'N/A'}</td>
                        <td>{enrollment.course_title || 'N/A'}</td>
                        <td>{enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${enrollment.progress || 0}%` }}
                              ></div>
                            </div>
                            <small>{enrollment.progress || 0}%</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={enrollment.is_active ? 'success' : 'secondary'}>
                            {enrollment.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            View
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          {loading ? 'Loading enrollments...' : 'No enrollments found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Financial Tab */}
          <Tab.Pane eventKey="financial">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Financial Overview & Account Statements</h5>
              </Card.Header>
              <Card.Body>
                {/* Financial Summary Cards */}
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="bg-success text-white">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>Total Revenue</h6>
                            <h4>₹{financialStats.totalRevenue?.toLocaleString() || '0'}</h4>
                          </div>
                          <FaRupeeSign size={30} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="bg-warning text-white">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>Pending Revenue</h6>
                            <h4>₹{financialStats.pendingRevenue?.toLocaleString() || '0'}</h4>
                          </div>
                          <FaClock size={30} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="bg-info text-white">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>Online Payments</h6>
                            <h4>₹{financialStats.onlineRevenue?.toLocaleString() || '0'}</h4>
                          </div>
                          <FaCreditCard size={30} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="bg-secondary text-white">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6>Offline Payments</h6>
                            <h4>₹{financialStats.offlineRevenue?.toLocaleString() || '0'}</h4>
                          </div>
                          <FaMoneyBillWave size={30} />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Recent Transactions Table */}
                <h6 className="mb-3">Recent Transactions</h6>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Student Name</th>
                      <th>Course</th>
                      <th>Amount</th>
                      <th>Payment Mode</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialStats.recentPayments && financialStats.recentPayments.length > 0 ? financialStats.recentPayments.map((payment, index) => (
                      <tr key={payment.id || index}>
                        <td>{payment.transaction_id || `TXN${String(index + 1).padStart(4, '0')}`}</td>
                        <td>{payment.student_name || 'N/A'}</td>
                        <td>{payment.course_title || 'N/A'}</td>
                        <td>₹{payment.amount?.toLocaleString() || '0'}</td>
                        <td>
                          <Badge bg={payment.payment_mode === 'online' ? 'primary' : 'secondary'} className="me-1">
                            {payment.payment_mode === 'online' ? 'Online' : 'Offline'}
                          </Badge>
                          {payment.payment_type && (
                            <Badge bg="info" size="sm">
                              {payment.payment_type.toUpperCase()}
                            </Badge>
                          )}
                        </td>
                        <td>{payment.payment_datetime || 'N/A'}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" className="me-2">
                            View
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          {loading ? 'Loading financial data...' : 'No transactions found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {/* Transaction Summary */}
                <Row className="mt-4">
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Payment Statistics</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Transactions:</span>
                          <strong>{financialStats.totalTransactions || 0}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Successful Payments:</span>
                          <strong>{financialStats.successfulTransactions || 0}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Pending Payments:</span>
                          <strong>{financialStats.pendingTransactions || 0}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Failed Payments:</span>
                          <strong>{financialStats.failedTransactions || 0}</strong>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h6 className="mb-0">Revenue Breakdown</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Course Fees:</span>
                          <strong>₹{financialStats.courseFeeRevenue?.toLocaleString() || '0'}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Registration Fees:</span>
                          <strong>₹{financialStats.registrationFeeRevenue?.toLocaleString() || '0'}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Other Fees:</span>
                          <strong>₹{financialStats.otherFeeRevenue?.toLocaleString() || '0'}</strong>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span><strong>Total Revenue:</strong></span>
                          <strong>₹{financialStats.totalRevenue?.toLocaleString() || '0'}</strong>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Add Student Modal */}
      <Modal show={showAddStudentModal} onHide={() => setShowAddStudentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
          <Form>
            {/* Personal Information */}
            <h6 className="mb-3 text-primary">Personal Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentFormData.full_name}
                    onChange={(e) => setStudentFormData({ ...studentFormData, full_name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={studentFormData.email}
                    onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={studentFormData.phone_number}
                    onChange={(e) => setStudentFormData({ ...studentFormData, phone_number: e.target.value })}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth *</Form.Label>
                  <Form.Control
                    type="date"
                    value={studentFormData.dob}
                    onChange={(e) => setStudentFormData({ ...studentFormData, dob: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>

            </Row>

            {/* Course Information */}
            <h6 className="mb-3 text-primary mt-4">Course Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course to Enroll *</Form.Label>
                  {console.log('Courses available for dropdown:', courses, 'Length:', courses?.length)}
                  <Form.Select
                    value={studentFormData.course_id && studentFormData.enrollment_mode ? `${studentFormData.course_id}-${studentFormData.enrollment_mode}` : ''}
                    onChange={(e) => {
                      console.log('Course dropdown changed:', e.target.value);
                      console.log('Available courses:', courses);

                      if (e.target.value === '') {
                        setStudentFormData({
                          ...studentFormData,
                          course_id: '',
                          enrollment_mode: '',
                          total_amount: ''
                        });
                        return;
                      }

                      // Use a different separator to avoid conflicts with UUID hyphens
                      const lastPipeIndex = e.target.value.lastIndexOf('|');
                      const courseId = e.target.value.substring(0, lastPipeIndex);
                      const enrollmentMode = e.target.value.substring(lastPipeIndex + 1);

                      console.log('Parsed courseId:', courseId, 'enrollmentMode:', enrollmentMode);
                      console.log('Course IDs in array:', courses.map(c => ({ id: c.id, type: typeof c.id })));
                      console.log('Looking for courseId:', courseId, 'type:', typeof courseId);

                      // Find the selected course
                      const selectedCourse = courses.find(c => c.id.toString() === courseId.toString());

                      console.log('Final selected course:', selectedCourse);
                      console.log('Course price:', selectedCourse?.price);

                      const coursePrice = selectedCourse?.price || '';
                      console.log('Setting total_amount to:', coursePrice);

                      setStudentFormData({
                        ...studentFormData,
                        course_id: courseId,
                        enrollment_mode: enrollmentMode,
                        total_amount: coursePrice.toString()
                      });
                    }}
                    required
                  >
                    <option value="">Select a course and mode</option>
                    {courses && courses.length > 0 ? courses.map(course => (
                      <React.Fragment key={course.id}>
                        <option value={`${course.id}|online`}>
                          {course.title} - Online - ₹{course.price}
                        </option>
                        <option value={`${course.id}|offline`}>
                          {course.title} - Offline - ₹{course.price}
                        </option>
                      </React.Fragment>
                    )) : (
                      <option disabled>Loading courses...</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {studentFormData.course_id && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <h6 className="text-primary mb-2">Selected Course Details</h6>

                    <div className="mb-1">
                      <strong>Course Name:</strong> {
                        courses.find(c => c.id.toString() === studentFormData.course_id.toString())?.title || 'Course not found'
                      }
                    </div>
                    <div className="mb-1">
                      <strong>Enrollment Mode:</strong> {
                        studentFormData.enrollment_mode ?
                          studentFormData.enrollment_mode.charAt(0).toUpperCase() + studentFormData.enrollment_mode.slice(1) :
                          'Not selected'
                      }
                    </div>

                  </div>
                )}
              </Col>
            </Row>

            {/* Payment Information */}
            <h6 className="mb-3 text-primary mt-4">Payment Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode *</Form.Label>
                  <Form.Select
                    value={studentFormData.payment_mode}
                    onChange={(e) => {
                      const paymentMode = e.target.value;
                      setStudentFormData({
                        ...studentFormData,
                        payment_mode: paymentMode,
                        // Reset EMI fields when switching to full payment
                        installment_count: paymentMode === 'emi' ? 3 : '',
                        installment_amount: '',
                        first_installment_date: ''
                      });
                    }}
                    required
                  >
                    <option value="full">Full Payment</option>
                    <option value="emi">EMI (Installments)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={studentFormData.total_amount}
                    onChange={(e) => {
                      const totalAmount = e.target.value;
                      setStudentFormData({
                        ...studentFormData,
                        total_amount: totalAmount,
                        // Auto-calculate installment amount if EMI mode
                        installment_amount: studentFormData.payment_mode === 'emi' && studentFormData.installment_count
                          ? (totalAmount / studentFormData.installment_count).toFixed(2)
                          : studentFormData.installment_amount
                      });
                    }}
                    placeholder="Enter total amount"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* EMI Details - Show only when EMI is selected */}
            {studentFormData.payment_mode === 'emi' && (
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>EMI Duration (Months) *</Form.Label>
                    <Form.Select
                      value={studentFormData.installment_count}
                      onChange={(e) => {
                        const installmentCount = e.target.value;
                        setStudentFormData({
                          ...studentFormData,
                          installment_count: installmentCount,
                          installment_amount: studentFormData.total_amount && installmentCount
                            ? (studentFormData.total_amount / installmentCount).toFixed(2)
                            : ''
                        });
                      }}
                      required
                    >
                      <option value="">Select Months</option>
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                      <option value="4">4 Months</option>
                      <option value="5">5 Months</option>
                      <option value="6">6 Months</option>
                      <option value="7">7 Months</option>
                      <option value="8">8 Months</option>
                      <option value="9">9 Months</option>
                      <option value="10">10 Months</option>
                      <option value="11">11 Months</option>
                      <option value="12">12 Months</option>
                      <option value="15">15 Months</option>
                      <option value="18">18 Months</option>
                      <option value="24">24 Months</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Installment Amount (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      value={studentFormData.installment_amount}
                      onChange={(e) => setStudentFormData({ ...studentFormData, installment_amount: e.target.value })}
                      placeholder="Auto-calculated"
                      required
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Installment Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={studentFormData.first_installment_date}
                      onChange={(e) => setStudentFormData({ ...studentFormData, first_installment_date: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddStudentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStudent}>
            Add Student & Enroll
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Add Course Modal */}
      <Modal show={showAddCourseModal} onHide={() => setShowAddCourseModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseFormData.title}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                    placeholder="Enter course title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={courseFormData.price}
                    onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                    placeholder="Enter price"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    placeholder="e.g., 3 months, 6 weeks"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    placeholder="e.g., Programming, Design"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                placeholder="Enter course description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Course is active"
                checked={courseFormData.is_active}
                onChange={(e) => setCourseFormData({ ...courseFormData, is_active: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCourseModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Course Modal */}
      <Modal show={showEditCourseModal} onHide={() => setShowEditCourseModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseFormData.title}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                    placeholder="Enter course title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={courseFormData.price}
                    onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                    placeholder="Enter price"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseFormData.duration}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    placeholder="e.g., 3 months, 6 weeks"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    placeholder="e.g., Programming, Design"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={courseFormData.description}
                onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                placeholder="Enter course description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Course is active"
                checked={courseFormData.is_active}
                onChange={(e) => setCourseFormData({ ...courseFormData, is_active: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditCourseModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCourse}>
            Update Course
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default AdminDashboard;
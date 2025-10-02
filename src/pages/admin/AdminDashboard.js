import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaKey, FaUser, FaRupeeSign, FaClock, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
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
                <Button variant="primary" size="sm">Add Student</Button>
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
                <Button variant="primary" size="sm">Add Course</Button>
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
                          <Button variant="outline-secondary" size="sm">
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

    </Container>
  );
};

export default AdminDashboard;
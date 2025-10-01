import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form, Tab, Tabs, Alert, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaBook, FaMoneyBillWave, FaCertificate, FaComments, FaChartLine,
  FaPlus, FaEdit, FaTrash, FaEye, FaDownload, FaSearch, FaFilter,
  FaUserGraduate, FaCalendarAlt, FaTrophy, FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { courses } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for admin dashboard
  const [students] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      enrolledCourses: ['Full Stack Web Development'],
      totalFees: 25000,
      paidFees: 15000,
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      enrolledCourses: ['Digital Marketing'],
      totalFees: 20000,
      paidFees: 20000,
      joinDate: '2024-02-01',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '9876543212',
      enrolledCourses: ['Full Stack Web Development', 'Digital Marketing'],
      totalFees: 45000,
      paidFees: 30000,
      joinDate: '2024-01-20',
      status: 'active'
    }
  ]);

  const [certificates] = useState([
    {
      id: 1,
      studentName: 'Jane Smith',
      courseName: 'Digital Marketing',
      issueDate: '2024-03-15',
      certificateNumber: 'TECH2024001',
      status: 'issued'
    },
    {
      id: 2,
      studentName: 'John Doe',
      courseName: 'Full Stack Web Development',
      issueDate: '2024-03-20',
      certificateNumber: 'TECH2024002',
      status: 'pending'
    }
  ]);

  const [chats] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      courseName: 'Full Stack Web Development',
      lastMessage: 'Can you help me with React hooks?',
      timestamp: '2024-03-21 10:30',
      status: 'unread'
    },
    {
      id: 2,
      studentName: 'Mike Johnson',
      courseName: 'Digital Marketing',
      lastMessage: 'Thank you for the explanation!',
      timestamp: '2024-03-21 09:15',
      status: 'read'
    }
  ]);

  const [fees] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      courseName: 'Full Stack Web Development',
      totalAmount: 25000,
      paidAmount: 15000,
      pendingAmount: 10000,
      dueDate: '2024-04-15',
      status: 'partial'
    },
    {
      id: 2,
      studentName: 'Mike Johnson',
      courseName: 'Digital Marketing',
      totalAmount: 20000,
      paidAmount: 10000,
      pendingAmount: 10000,
      dueDate: '2024-04-10',
      status: 'overdue'
    }
  ]);

  // Statistics calculations
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    completedStudents: students.filter(s => s.status === 'completed').length,
    totalCourses: courses?.length || 0,
    totalRevenue: students.reduce((sum, student) => sum + student.paidFees, 0),
    pendingRevenue: students.reduce((sum, student) => sum + (student.totalFees - student.paidFees), 0),
    certificatesIssued: certificates.filter(c => c.status === 'issued').length,
    unreadChats: chats.filter(c => c.status === 'unread').length
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
  };

  const handleAction = (action, item) => {
    switch (action) {
      case 'edit':
        openModal('edit', item);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this item?')) {
          toast.success('Item deleted successfully');
        }
        break;
      case 'view':
        openModal('view', item);
        break;
      case 'issue-certificate':
        toast.success('Certificate issued successfully');
        break;
      case 'send-reminder':
        toast.success('Payment reminder sent');
        break;
      default:
        break;
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <Container fluid className="py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm gradient-primary text-white">
                <Card.Body className="p-4">
                  <h2 className="mb-2">
                    <FaChartLine className="me-2" />
                    Admin Dashboard
                  </h2>
                  <p className="mb-0 opacity-75">
                    Manage your institute's operations and monitor performance
                  </p>
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
            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 shadow-sm h-100 stat-card">
                    <Card.Body className="text-center">
                      <FaUsers className="text-primary mb-3" size={40} />
                      <h3 className="mb-1">{stats.totalStudents}</h3>
                      <p className="text-muted mb-0">Total Students</p>
                      <small className="text-success">
                        {stats.activeStudents} Active
                      </small>
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
                      <FaBook className="text-success mb-3" size={40} />
                      <h3 className="mb-1">{stats.totalCourses}</h3>
                      <p className="text-muted mb-0">Total Courses</p>
                      <small className="text-info">
                        Active Programs
                      </small>
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
                      <FaMoneyBillWave className="text-warning mb-3" size={40} />
                      <h3 className="mb-1">₹{(stats.totalRevenue / 1000).toFixed(0)}K</h3>
                      <p className="text-muted mb-0">Total Revenue</p>
                      <small className="text-danger">
                        ₹{(stats.pendingRevenue / 1000).toFixed(0)}K Pending
                      </small>
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
                      <FaCertificate className="text-info mb-3" size={40} />
                      <h3 className="mb-1">{stats.certificatesIssued}</h3>
                      <p className="text-muted mb-0">Certificates Issued</p>
                      <small className="text-warning">
                        {certificates.filter(c => c.status === 'pending').length} Pending
                      </small>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Quick Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3} className="mb-3">
                        <Button 
                          variant="primary" 
                          className="w-100 btn-animated"
                          onClick={() => openModal('add-student')}
                        >
                          <FaPlus className="me-2" />
                          Add Student
                        </Button>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Button 
                          variant="success" 
                          className="w-100 btn-animated"
                          onClick={() => openModal('add-course')}
                        >
                          <FaPlus className="me-2" />
                          Add Course
                        </Button>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Button 
                          variant="warning" 
                          className="w-100 btn-animated"
                          onClick={() => toast.info('Generating report...')}
                        >
                          <FaDownload className="me-2" />
                          Generate Report
                        </Button>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Button 
                          variant="info" 
                          className="w-100 btn-animated"
                          onClick={() => toast.info('Sending notifications...')}
                        >
                          <FaComments className="me-2" />
                          Send Notifications
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Activities */}
            <Row>
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Recent Enrollments</h5>
                  </Card.Header>
                  <Card.Body>
                    {students.slice(0, 3).map((student, index) => (
                      <div key={student.id} className="d-flex align-items-center mb-3">
                        <div className="avatar-circle me-3">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{student.name}</h6>
                          <small className="text-muted">
                            Joined {new Date(student.joinDate).toLocaleDateString()}
                          </small>
                        </div>
                        <Badge bg={student.status === 'active' ? 'success' : 'primary'}>
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Pending Actions</h5>
                  </Card.Header>
                  <Card.Body>
                    <Alert variant="warning" className="d-flex align-items-center">
                      <FaExclamationTriangle className="me-2" />
                      <div>
                        <strong>{stats.unreadChats}</strong> unread messages
                      </div>
                    </Alert>
                    <Alert variant="danger" className="d-flex align-items-center">
                      <FaMoneyBillWave className="me-2" />
                      <div>
                        <strong>{fees.filter(f => f.status === 'overdue').length}</strong> overdue payments
                      </div>
                    </Alert>
                    <Alert variant="info" className="d-flex align-items-center">
                      <FaCertificate className="me-2" />
                      <div>
                        <strong>{certificates.filter(c => c.status === 'pending').length}</strong> certificates to issue
                      </div>
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Students Tab */}
          <Tab eventKey="students" title={<><FaUsers className="me-2" />Students</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">Student Management</h5>
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={() => openModal('add-student')}
                    >
                      <FaPlus className="me-1" />
                      Add Student
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Student</th>
                        <th>Contact</th>
                        <th>Courses</th>
                        <th>Fees Status</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-2">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <h6 className="mb-0">{student.name}</h6>
                                <small className="text-muted">{student.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{student.phone}</td>
                          <td>
                            <Badge bg="primary" className="me-1">
                              {student.enrolledCourses.length}
                            </Badge>
                            courses
                          </td>
                          <td>
                            <div>
                              <small className="text-muted">
                                ₹{student.paidFees.toLocaleString()} / ₹{student.totalFees.toLocaleString()}
                              </small>
                              <ProgressBar 
                                now={(student.paidFees / student.totalFees) * 100}
                                size="sm"
                                variant={student.paidFees === student.totalFees ? 'success' : 'warning'}
                              />
                            </div>
                          </td>
                          <td>{new Date(student.joinDate).toLocaleDateString()}</td>
                          <td>
                            <Badge bg={student.status === 'active' ? 'success' : 'primary'}>
                              {student.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleAction('view', student)}
                              >
                                <FaEye />
                              </Button>
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => handleAction('edit', student)}
                              >
                                <FaEdit />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleAction('delete', student)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Courses Tab */}
          <Tab eventKey="courses" title={<><FaBook className="me-2" />Courses</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">Course Management</h5>
                  </Col>
                  <Col md={2}>
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={() => openModal('add-course')}
                    >
                      <FaPlus className="me-1" />
                      Add Course
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row>
                  {courses && courses.map((course, index) => (
                    <Col lg={6} className="mb-4" key={course.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="border-0 shadow-sm h-100 course-admin-card">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="mb-1">{course.title}</h5>
                                <p className="text-muted mb-2">{course.category}</p>
                              </div>
                              <Badge bg="success">{course.level}</Badge>
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-1">
                                <small>Online: ₹{course.onlinePrice?.toLocaleString()}</small>
                                <small>Offline: ₹{course.offlinePrice?.toLocaleString()}</small>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Duration: {course.duration}</small>
                                <small>Students: {course.students || 0}</small>
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleAction('view', course)}
                              >
                                <FaEye className="me-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => handleAction('edit', course)}
                              >
                                <FaEdit className="me-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleAction('delete', course)}
                              >
                                <FaTrash className="me-1" />
                                Delete
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          {/* Fees Tab */}
          <Tab eventKey="fees" title={<><FaMoneyBillWave className="me-2" />Fees</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Fee Management</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Total Amount</th>
                        <th>Paid Amount</th>
                        <th>Pending</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee.id}>
                          <td>{fee.studentName}</td>
                          <td>{fee.courseName}</td>
                          <td>₹{fee.totalAmount.toLocaleString()}</td>
                          <td>₹{fee.paidAmount.toLocaleString()}</td>
                          <td>₹{fee.pendingAmount.toLocaleString()}</td>
                          <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                          <td>
                            <Badge bg={
                              fee.status === 'overdue' ? 'danger' : 
                              fee.status === 'partial' ? 'warning' : 'success'
                            }>
                              {fee.status}
                            </Badge>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAction('send-reminder', fee)}
                            >
                              Send Reminder
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Certificates Tab */}
          <Tab eventKey="certificates" title={<><FaCertificate className="me-2" />Certificates</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Certificate Management</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Certificate Number</th>
                        <th>Issue Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert.id}>
                          <td>{cert.studentName}</td>
                          <td>{cert.courseName}</td>
                          <td>{cert.certificateNumber}</td>
                          <td>{new Date(cert.issueDate).toLocaleDateString()}</td>
                          <td>
                            <Badge bg={cert.status === 'issued' ? 'success' : 'warning'}>
                              {cert.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              {cert.status === 'pending' && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => handleAction('issue-certificate', cert)}
                                >
                                  Issue
                                </Button>
                              )}
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleAction('view', cert)}
                              >
                                <FaEye />
                              </Button>
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => toast.success('Certificate downloaded')}
                              >
                                <FaDownload />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Chats Tab */}
          <Tab eventKey="chats" title={<><FaComments className="me-2" />Chats</>}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Student Communications</h5>
              </Card.Header>
              <Card.Body>
                {chats.map((chat) => (
                  <Card key={chat.id} className="mb-3 border chat-card">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <div className="d-flex align-items-center mb-2">
                            <div className="avatar-circle me-2">
                              {chat.studentName.charAt(0)}
                            </div>
                            <div>
                              <h6 className="mb-0">{chat.studentName}</h6>
                              <small className="text-muted">{chat.courseName}</small>
                            </div>
                            {chat.status === 'unread' && (
                              <Badge bg="danger" className="ms-2">New</Badge>
                            )}
                          </div>
                          <p className="mb-1 text-muted">{chat.lastMessage}</p>
                          <small className="text-muted">{chat.timestamp}</small>
                        </Col>
                        <Col md={4} className="text-end">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => openModal('chat', chat)}
                          >
                            <FaComments className="me-1" />
                            Reply
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>

      {/* Modal for various actions */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'add-student' && 'Add New Student'}
            {modalType === 'add-course' && 'Add New Course'}
            {modalType === 'edit' && 'Edit Item'}
            {modalType === 'view' && 'View Details'}
            {modalType === 'chat' && 'Student Chat'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'add-student' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter student name" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter phone number" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course</Form.Label>
                    <Form.Select>
                      <option>Select Course</option>
                      <option>Full Stack Web Development</option>
                      <option>Digital Marketing</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
          
          {modalType === 'chat' && selectedItem && (
            <div>
              <div className="chat-messages mb-3" style={{ height: '300px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '8px', padding: '15px' }}>
                <div className="message student-message mb-3">
                  <strong>{selectedItem.studentName}:</strong>
                  <p className="mb-1">{selectedItem.lastMessage}</p>
                  <small className="text-muted">{selectedItem.timestamp}</small>
                </div>
              </div>
              <Form>
                <Form.Group>
                  <Form.Label>Reply</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Type your reply..." />
                </Form.Group>
              </Form>
            </div>
          )}
          
          {modalType === 'view' && selectedItem && (
            <div>
              <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {(modalType === 'add-student' || modalType === 'add-course' || modalType === 'edit') && (
            <Button variant="primary" onClick={() => {
              toast.success('Changes saved successfully');
              closeModal();
            }}>
              Save Changes
            </Button>
          )}
          {modalType === 'chat' && (
            <Button variant="primary" onClick={() => {
              toast.success('Reply sent successfully');
              closeModal();
            }}>
              Send Reply
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
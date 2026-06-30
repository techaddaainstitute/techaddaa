import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Nav, Row, Tab, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaFileInvoiceDollar, FaPhoneAlt, FaPlus, FaSignOutAlt, FaUserGraduate, FaUserTie, FaUsers, FaWhatsapp } from 'react-icons/fa';
import AdminUsecase from '../../lib/usecase/AdminUsecase';
import StudentAttendacne from '../admin/StudentAttendacne';
import TeacherUsecase from '../../lib/usecase/TeacherUsecase';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '—';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchStudents, setSearchStudents] = useState('');
  const [searchFees, setSearchFees] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
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

  const buildContactLinks = (raw) => {
    if (!raw) return { telHref: null, waHref: null };
    const digits = String(raw).replace(/[^\d+]/g, '');
    const telHref = digits ? `tel:${digits}` : null;
    let waDigits = digits.replace(/\+/g, '');
    if (/^\d{10}$/.test(waDigits)) {
      waDigits = `91${waDigits}`;
    }
    const waHref = /^\d{11,15}$/.test(waDigits) ? `https://wa.me/${waDigits}` : null;
    return { telHref, waHref };
  };

  const resetStudentForm = () => {
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
    setFormError('');
    setFormSuccess('');
  };

  const getFilteredStudents = () => {
    const q = (searchStudents || '').trim().toLowerCase();
    if (!q) return students;
    return (students || []).filter((student) => {
      const name = String(student.full_name || student.name || '').toLowerCase();
      const email = String(student.email || '').toLowerCase();
      const course = String(student.course_title || student.latest_course || '').toLowerCase();
      const status = student.is_active ? 'active' : 'inactive';
      return name.includes(q) || email.includes(q) || course.includes(q) || status.includes(q);
    });
  };

  const getFilteredPendingFees = () => {
    const q = (searchFees || '').trim().toLowerCase();
    if (!q) return pendingFees;
    return (pendingFees || []).filter((fee) => {
      const student = String(fee.student_name || '').toLowerCase();
      const course = String(fee.course_title || '').toLowerCase();
      const installment = `${fee.installment_number}/${fee.total_installments}`.toLowerCase();
      const amount = String(fee.amount || '').toLowerCase();
      const dueDate = formatDateShort(fee.due_date).toLowerCase();
      const status = fee.status === 'overdue' || (fee.due_date && new Date(fee.due_date) < new Date()) ? 'overdue' : 'pending';
      return (
        student.includes(q) ||
        course.includes(q) ||
        installment.includes(q) ||
        amount.includes(q) ||
        dueDate.includes(q) ||
        status.includes(q)
      );
    });
  };

  const fetchTeacherDashboardData = async () => {
    const [studentsResult, coursesResult, pendingFeesResult] = await Promise.all([
      AdminUsecase.getAllStudentsUsecase(),
      AdminUsecase.getAllCoursesUsecase(),
      AdminUsecase.getPendingFeesUsecase(200, 0)
    ]);

    setStudents(studentsResult.students || []);
    setCourses(coursesResult.courses || []);
    setPendingFees(pendingFeesResult.fees || []);
  };

  useEffect(() => {
    const initializeTeacher = async () => {
      const validation = await TeacherUsecase.validateTeacherAccess();
      if (!validation.valid) {
        navigate('/teacher/login');
        return;
      }

      setTeacher(validation.user);
      await fetchTeacherDashboardData();
      setLoading(false);
    };

    initializeTeacher();
  }, [navigate]);

  const handleLogout = async () => {
    await TeacherUsecase.teacherLogoutUsecase();
    navigate('/teacher/login');
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      if (
        !studentFormData.full_name ||
        !studentFormData.email ||
        !studentFormData.course_id ||
        !studentFormData.phone_number ||
        !studentFormData.dob
      ) {
        setFormError('Please fill in all required fields');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(studentFormData.email)) {
        setFormError('Please enter a valid email address');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(studentFormData.phone_number)) {
        setFormError('Please enter a valid 10-digit phone number');
        return;
      }

      const today = new Date();
      const dobDate = new Date(studentFormData.dob);
      if (dobDate >= today) {
        setFormError('Date of birth cannot be today or in the future');
        return;
      }

      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 10) {
        setFormError('Student must be at least 10 years old');
        return;
      }

      if (studentFormData.payment_mode === 'emi') {
        if (!studentFormData.installment_count || !studentFormData.installment_amount || !studentFormData.first_installment_date) {
          setFormError('Please fill in all EMI details');
          return;
        }
      } else if (!studentFormData.total_amount) {
        setFormError('Please enter the total amount for full payment');
        return;
      }

      if (parseFloat(studentFormData.total_amount) <= 0) {
        setFormError('Total amount must be greater than 0');
        return;
      }

      const result = await AdminUsecase.addStudentWithEnrollment(studentFormData);
      if (result.success) {
        setFormSuccess('Student added and enrolled successfully!');
        await fetchTeacherDashboardData();
        setTimeout(() => {
          setShowAddStudentModal(false);
          resetStudentForm();
        }, 1200);
      } else {
        setFormError(result.error || 'Failed to add student');
      }
    } catch (error) {
      console.error('TeacherDashboard handleAddStudent error:', error);
      setFormError('An error occurred while adding the student');
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading teacher dashboard...</p>
        </div>
      </Container>
    );
  }

  const totalPendingAmount = (pendingFees || []).reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h2 className="mb-1">Teacher Dashboard</h2>
                <p className="mb-0">Welcome, {teacher?.full_name || 'Teacher'}</p>
              </div>
              <Button variant="outline-light" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="text-primary">{students.length}</h3>
              <p className="text-muted mb-0">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="text-success">{courses.length}</h3>
              <p className="text-muted mb-0">Available Courses</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="text-warning">{pendingFees.length}</h3>
              <p className="text-muted mb-0">Pending Fees</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h3 className="text-info">₹{totalPendingAmount.toLocaleString()}</h3>
              <p className="text-muted mb-0">Pending Amount</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="students">Students</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="attendance">Attendance</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="financial">Financial</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile">Profile</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="students">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaUsers className="me-2" />
                  Students Management
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Search students..."
                    size="sm"
                    value={searchStudents}
                    onChange={(e) => setSearchStudents(e.target.value)}
                    style={{ width: '220px' }}
                  />
                  <Button variant="primary" size="sm" onClick={() => setShowAddStudentModal(true)}>
                    <FaPlus className="me-1" />
                    Add Student
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Phone</th>
                      <th>Contact</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredStudents().length > 0 ? (
                      getFilteredStudents().map((student) => {
                        const { telHref, waHref } = buildContactLinks(student.phone_number);
                        return (
                          <tr key={student.id}>
                            <td>{student.full_name || student.name || 'N/A'}</td>
                            <td>{student.email || 'N/A'}</td>
                            <td>{student.course_title || student.latest_course || 'N/A'}</td>
                            <td>{student.phone_number || 'N/A'}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {telHref ? (
                                  <a href={telHref} className="btn btn-outline-primary btn-sm" title="Call">
                                    <FaPhoneAlt />
                                  </a>
                                ) : (
                                  <span className="text-muted" title="No phone">
                                    <FaPhoneAlt />
                                  </span>
                                )}
                                {waHref ? (
                                  <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-success btn-sm"
                                    title="WhatsApp"
                                  >
                                    <FaWhatsapp />
                                  </a>
                                ) : (
                                  <span className="text-muted" title="Invalid WhatsApp number">
                                    <FaWhatsapp />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge bg={student.is_active ? 'success' : 'secondary'}>
                                {student.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="attendance">
            <StudentAttendacne students={students} />
          </Tab.Pane>

          <Tab.Pane eventKey="financial">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaFileInvoiceDollar className="me-2" />
                  Pending Fees
                </h5>
                <Form.Control
                  type="text"
                  placeholder="Search pending fees..."
                  size="sm"
                  value={searchFees}
                  onChange={(e) => setSearchFees(e.target.value)}
                  style={{ width: '220px' }}
                />
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Installment</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredPendingFees().length > 0 ? (
                      getFilteredPendingFees().map((fee) => {
                        const overdue = fee.status === 'overdue' || (fee.due_date && new Date(fee.due_date) < new Date());
                        const { telHref, waHref } = buildContactLinks(fee.phone_number);
                        return (
                          <tr key={fee.id}>
                            <td>{fee.student_name}</td>
                            <td>{fee.course_title}</td>
                            <td>{fee.installment_number}/{fee.total_installments}</td>
                            <td>₹{Number(fee.amount || 0).toLocaleString()}</td>
                            <td>{formatDateShort(fee.due_date)}</td>
                            <td>
                              <Badge bg={overdue ? 'danger' : 'warning'}>
                                {overdue ? 'Overdue' : 'Pending'}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {telHref ? (
                                  <a href={telHref} className="btn btn-outline-primary btn-sm" title="Call">
                                    <FaPhoneAlt />
                                  </a>
                                ) : (
                                  <span className="text-muted" title="No phone">
                                    <FaPhoneAlt />
                                  </span>
                                )}
                                {waHref ? (
                                  <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-success btn-sm"
                                    title="WhatsApp"
                                  >
                                    <FaWhatsapp />
                                  </a>
                                ) : (
                                  <span className="text-muted" title="Invalid WhatsApp number">
                                    <FaWhatsapp />
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No pending fees
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="profile">
            <Row className="g-4">
              <Col md={6}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <h4 className="mb-3">
                      <FaUserTie className="me-2 text-primary" />
                      Profile
                    </h4>
                    <p className="mb-2"><strong>Name:</strong> {teacher?.full_name || 'N/A'}</p>
                    <p className="mb-2"><strong>Designation:</strong> {teacher?.designation || 'Teacher'}</p>
                    <p className="mb-2"><strong>Joining Date:</strong> {formatDate(teacher?.joining_date)}</p>
                    <p className="mb-0">
                      <strong>Status:</strong>{' '}
                      <Badge bg={teacher?.is_active ? 'success' : 'secondary'}>
                        {teacher?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <h4 className="mb-3">
                      <FaUserGraduate className="me-2 text-primary" />
                      Contact And Work Info
                    </h4>
                    <p className="mb-2">
                      <FaEnvelope className="me-2 text-primary" />
                      {teacher?.email || 'N/A'}
                    </p>
                    <p className="mb-2">
                      <FaPhoneAlt className="me-2 text-primary" />
                      {teacher?.phone_number || 'N/A'}
                    </p>
                    <p className="mb-2"><strong>Salary:</strong> ₹{Number(teacher?.salary || 0).toLocaleString()}</p>
                    <p className="mb-2"><strong>Address:</strong> {teacher?.address || 'N/A'}</p>
                    <p className="mb-0"><strong>Last Login:</strong> {formatDateTime(teacher?.last_login)}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <Modal
        show={showAddStudentModal}
        onHide={() => {
          setShowAddStudentModal(false);
          resetStudentForm();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
          <Form onSubmit={handleAddStudent}>
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

            <h6 className="mb-3 text-primary mt-4">Course Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course To Enroll *</Form.Label>
                  <Form.Select
                    value={studentFormData.course_id && studentFormData.enrollment_mode ? `${studentFormData.course_id}|${studentFormData.enrollment_mode}` : ''}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setStudentFormData({
                          ...studentFormData,
                          course_id: '',
                          enrollment_mode: '',
                          total_amount: ''
                        });
                        return;
                      }

                      const lastPipeIndex = e.target.value.lastIndexOf('|');
                      const courseId = e.target.value.substring(0, lastPipeIndex);
                      const enrollmentMode = e.target.value.substring(lastPipeIndex + 1);
                      const selectedCourse = courses.find((course) => String(course.id) === String(courseId));
                      const coursePrice = selectedCourse?.price || '';

                      setStudentFormData({
                        ...studentFormData,
                        course_id: courseId,
                        enrollment_mode: enrollmentMode,
                        total_amount: String(coursePrice)
                      });
                    }}
                    required
                  >
                    <option value="">Select a course and mode</option>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <React.Fragment key={course.id}>
                          <option value={`${course.id}|online`}>
                            {course.title} - Online - ₹{course.price}
                          </option>
                          <option value={`${course.id}|offline`}>
                            {course.title} - Offline - ₹{course.price}
                          </option>
                        </React.Fragment>
                      ))
                    ) : (
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
                      <strong>Course Name:</strong>{' '}
                      {courses.find((course) => String(course.id) === String(studentFormData.course_id))?.title || 'Course not found'}
                    </div>
                    <div className="mb-1">
                      <strong>Enrollment Mode:</strong>{' '}
                      {studentFormData.enrollment_mode
                        ? `${studentFormData.enrollment_mode.charAt(0).toUpperCase()}${studentFormData.enrollment_mode.slice(1)}`
                        : 'Not selected'}
                    </div>
                  </div>
                )}
              </Col>
            </Row>

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
                      readOnly
                      required
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
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddStudentModal(false);
              resetStudentForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddStudent}>
            Add Student & Enroll
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherDashboard;

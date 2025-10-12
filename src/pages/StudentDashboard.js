import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Modal, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaUser, FaBook, FaClock, FaCheckCircle, FaPlayCircle,
  FaCertificate, FaMoneyBillWave, FaEdit, FaSave,
  FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserEdit,
  FaTimesCircle, FaCalendarAlt
} from 'react-icons/fa';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useStudentDashboard } from '../context/StudentDashboardContext';
import { BlocConsumer, Status } from '../tool';

const StudentDashboard = () => {
  const { state: authState, updateLocalProfile } = useStudentAuth();
  const { user } = authState;
  const { state, loadInit, updateProfile, profile } = useStudentDashboard();
  const [activeTab, setActiveTab] = useState('courses');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    date_of_birth: ''
  });

  React.useEffect(() => {
    if (user?.id && profile == null) {
      loadInit(user.id);
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (state?.profile && !isEditingProfile) {
      setEditedProfile({
        full_name: state.profile.full_name || '',
        email: state.profile.email || '',
        phone_number: state.profile.phone_number || '',
        date_of_birth: state.profile.date_of_birth || ''
      });
    }
  }, [state?.profile, isEditingProfile]);

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
  };

  const handleProfileSave = async () => {
    if (user?.id) {
      await updateProfile(user.id, editedProfile);
      setIsEditingProfile(false);
    }
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    if (state.profile) {
      setEditedProfile({
        full_name: state.profile.full_name || '',
        email: state.profile.email || '',
        phone_number: state.profile.phone_number || '',
        date_of_birth: state.profile.date_of_birth || ''
      });
    }
  };

  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'success';
    if (progress >= 50) return 'warning';
    return 'primary';
  };

  // Safety check to ensure state is defined


  return (
    <BlocConsumer
      state={state}
      listener={(s) => {
        // Handle state changes if needed
        if (s?.updateProfileStatus === Status.SUCCESS) {
          updateLocalProfile(s.profile);
          setIsEditingProfile(false);
        }
      }}
      builder={(s) => (
        <div className="student-dashboard">
          <Container fluid className="py-4">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Row className="align-items-center m-2">
                <Col md={8}>
                  <h2 className="mb-2" style={{ color: 'var(--primary-color)' }}>
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
                      <h4 className="mb-0">{s?.myCourses?.length || 0}</h4>
                      <small>Enrolled Courses</small>
                    </div>
                    <div className="text-center">
                      <h4 className="mb-0">
                        {s?.myCourses?.filter(c => c.progress === 100).length || 0}
                      </h4>
                      <small>Completed</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </motion.div>

            {/* Dashboard Tabs */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4 custom-tabs"
            >
              {/* My Courses Tab */}
              <Tab eventKey="courses" title={<><FaBook className="me-2" />My Courses</>}>
                <Row>
                  {s?.initStatus === Status.LOADING ? (
                    <Col>
                      <Card className="border-0 shadow-sm text-center py-5">
                        <Card.Body>
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="text-muted mt-2">Loading your courses...</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ) : s?.myCourses && s?.myCourses.length > 0 ? (
                    s?.myCourses.map((course, index) => (
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
                                  <h6 className="mb-0">{course.progress || 0}%</h6>
                                </div>
                              </div>

                              <ProgressBar
                                variant={getProgressColor(course.progress || 0)}
                                now={course.progress || 0}
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
                                  disabled={course.progress >= 100}
                                >
                                  <FaPlayCircle className="me-1" />
                                  {course.progress >= 100 ? 'Completed' : 'Continue'}
                                </Button>
                                {course.progress === 100 && (
                                  <Button
                                    variant="success"
                                    size="sm"
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

              {/* Fees Tab */}
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
                              {s?.feesStatus === Status.LOADING ? (
                                <tr>
                                  <td colSpan="7" className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="text-muted mt-2">Loading fees data...</p>
                                  </td>
                                </tr>
                              ) : s?.myFees?.fees && s?.myFees.fees.length > 0 ? (
                                s?.myFees.fees.map((fee, index) => (
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
                                          disabled={s?.markPaidStatus === Status.LOADING}
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
                        {s?.feesStatus === Status.LOADING ? (
                          <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted mt-2">Loading fee summary...</p>
                          </div>
                        ) : s?.myFees?.summary ? (
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Total Fees:</span>
                              <strong>₹{s?.myFees?.summary?.total_amount?.toLocaleString() || '0'}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-success">
                              <span>Paid Amount:</span>
                              <strong>₹{s?.myFees?.summary?.paid_amount?.toLocaleString() || '0'}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-danger">
                              <span>Pending Amount:</span>
                              <strong>₹{s?.myFees?.summary?.pending_amount?.toLocaleString() || '0'}</strong>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                              <span>Payment Progress:</span>
                              <strong>{s?.myFees?.summary?.total_amount ? Math.round((s.myFees.summary.paid_amount / s.myFees.summary.total_amount) * 100) : 0}%</strong>
                            </div>
                            <ProgressBar
                              variant="success"
                              now={s?.myFees?.summary?.total_amount ? (s.myFees.summary.paid_amount / s.myFees.summary.total_amount) * 100 : 0}
                              className="mt-2"
                              style={{ height: '8px' }}
                            />
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <FaMoneyBillWave className="text-muted mb-3" size={40} />
                            <p className="text-muted">No fee summary available</p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              {/* Profile Tab */}
              <Tab eventKey="profile" title={<><FaUser className="me-2" />Profile</>}>
                <Row className="justify-content-center">
                  <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          <FaUserEdit className="me-2 text-primary" />
                          Profile Information
                        </h5>
                        {!isEditingProfile ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={handleProfileEdit}
                          >
                            <FaEdit className="me-1" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={handleProfileSave}
                              disabled={s?.updateProfileStatus === Status.LOADING}
                            >
                              <FaSave className="me-1" />
                              Save
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={handleProfileCancel}
                            >
                              <FaTimes className="me-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </Card.Header>
                      <Card.Body>
                        {s?.profileStatus === Status.LOADING ? (
                          <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted mt-2">Loading profile...</p>
                          </div>
                        ) : (
                          <Form>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Full Name</Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <FaUser />
                                    </span>
                                    <Form.Control
                                      type="text"
                                      value={isEditingProfile ? editedProfile.full_name : (s?.profile?.full_name || '')}
                                      onChange={(e) => handleProfileChange('full_name', e.target.value)}
                                      disabled={!isEditingProfile}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Email Address</Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <FaEnvelope />
                                    </span>
                                    <Form.Control
                                      type="email"
                                      value={isEditingProfile ? editedProfile.email : (s?.profile?.email || '')}
                                      onChange={(e) => handleProfileChange('email', e.target.value)}
                                      disabled={!isEditingProfile}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Phone Number</Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <FaPhone />
                                    </span>
                                    <Form.Control
                                      type="tel"
                                      value={isEditingProfile ? editedProfile.phone_number : (s?.profile?.phone_number || '')}
                                      onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                                      disabled={!isEditingProfile}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Date of Birth</Form.Label>
                                  <div className="input-group">
                                    <span className="input-group-text">
                                      <FaCalendarAlt />
                                    </span>
                                    <Form.Control
                                      type="date"
                                      value={isEditingProfile ? editedProfile.date_of_birth : (s?.profile?.date_of_birth || '')}
                                      onChange={(e) => handleProfileChange('date_of_birth', e.target.value)}
                                      disabled={!isEditingProfile}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>

                            {s?.updateProfileStatus === Status.LOADING && (
                              <Alert variant="info">
                                <div className="d-flex align-items-center">
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Updating profile...
                                </div>
                              </Alert>
                            )}

                            {s.updateProfileStatus === Status.SUCCESS && (
                              <Alert variant="success">
                                Profile updated successfully!
                              </Alert>
                            )}

                            {s.updateProfileStatus === Status.ERROR && (
                              <Alert variant="danger">
                                Failed to update profile. Please try again.
                              </Alert>
                            )}
                          </Form>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Container>
        </div>
      )}
    />
  );
};

export default StudentDashboard;
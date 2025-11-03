import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaUser, FaGraduationCap, FaRupeeSign, FaPhone, FaEnvelope, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import AdminUsecase from '../../lib/usecase/AdminUsecase';
import './StudentView.css';

const StudentView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  // State management
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});

  // Modal states
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  // Add Fee modal state
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [newFee, setNewFee] = useState({
    course_id: '',
    payment_type: 'full',
    installment_amount: '',
    total_installments: 1,
    installment_number: 1,
    due_date: '',
    notes: ''
  });
  const [addFeeError, setAddFeeError] = useState('');
  const [addFeeSubmitting, setAddFeeSubmitting] = useState(false);

  // Filter states
  const [feeFilter, setFeeFilter] = useState('all');

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch student details, enrollments, and fees
      const [studentResult, enrollmentsResult, feesResult] = await Promise.all([
        AdminUsecase.getStudentDetails(studentId),
        AdminUsecase.getStudentEnrollments(studentId),
        AdminUsecase.getStudentFees(studentId)
      ]);

      if (studentResult.success) {
        setStudent(studentResult.student);
        setEditedStudent(studentResult.student);
      } else {
        setError('Failed to fetch student details');
      }

      if (enrollmentsResult.success) {
        setEnrollments(enrollmentsResult.enrollments || []);
      }

      if (feesResult.success) {
        setFees(feesResult.fees || []);
      }

    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('An error occurred while fetching student details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit - reset to original data
      setEditedStudent(student);
    }
    setEditMode(!editMode);
  };

  const handleSaveStudent = async () => {
    try {
      setError('');
      setSuccess('');

      const result = await AdminUsecase.updateStudentDetails(studentId, editedStudent);

      if (result.success) {
        setStudent(editedStudent);
        setEditMode(false);
        setSuccess('Student details updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update student details');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setError('An error occurred while updating student details');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMarkFeeAsPaid = async (feeId) => {
    try {
      setError('');
      setSuccess('');

      const result = await AdminUsecase.markFeeAsPaid(feeId);

      if (result.success) {
        // Update the fee in the local state
        setFees(prev => prev.map(fee =>
          fee.id === feeId
            ? { ...fee, status: 'paid', paid_date: new Date().toISOString() }
            : fee
        ));
        setSuccess('Fee marked as paid successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to mark fee as paid');
      }
    } catch (err) {
      console.error('Error marking fee as paid:', err);
      setError('An error occurred while updating fee status');
    }
  };

  const handleUpdateFee = async (feeId, updatedData) => {
    try {
      setError('');
      setSuccess('');

      const result = await AdminUsecase.updateFee(feeId, updatedData);

      if (result.success) {
        // Update the fee in the local state
        setFees(prev => prev.map(fee =>
          fee.id === feeId ? { ...fee, ...updatedData } : fee
        ));
        setShowFeeModal(false);
        setSelectedFee(null);
        setSuccess('Fee updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update fee');
      }
    } catch (err) {
      console.error('Error updating fee:', err);
      setError('An error occurred while updating fee');
    }
  };

  const openAddFeeModal = () => {
    const firstEnrollmentCourseId = enrollments[0]?.course_id || '';
    const existingForCourse = fees.filter(f => f.course_id === firstEnrollmentCourseId);
    const nextInstallmentNumber = existingForCourse.length
      ? Math.max(...existingForCourse.map(f => Number(f.installment_number) || 0)) + 1
      : 1;
    setNewFee({
      course_id: firstEnrollmentCourseId,
      payment_type: 'full',
      installment_amount: '',
      total_installments: 1,
      installment_number: nextInstallmentNumber,
      due_date: '',
      notes: ''
    });
    setAddFeeError('');
    setAddFeeSubmitting(false);
    setSuccess('Opening Add Fee modal…');
    setTimeout(() => setSuccess(''), 1500);
    setShowAddFeeModal(true);
  };

  const handleNewFeeChange = (field, value) => {
    // When changing payment type to EMI, suggest the next available installment number
    if (field === 'payment_type') {
      const nextForCourse = (() => {
        const existing = fees.filter(f => f.course_id === newFee.course_id);
        return existing.length
          ? Math.max(...existing.map(f => Number(f.installment_number) || 0)) + 1
          : 1;
      })();
      if (value === 'emi') {
        setNewFee(prev => ({ ...prev, payment_type: value, total_installments: Math.max(prev.total_installments || 2, 2), installment_number: nextForCourse }));
        return;
      } else {
        // For full payment, normalize to single installment
        setNewFee(prev => ({ ...prev, payment_type: value, total_installments: 1, installment_number: 1 }));
        return;
      }
    }

    if (field === 'course_id') {
      // When course changes, recompute suggested installment number if EMI selected
      const existing = fees.filter(f => f.course_id === value);
      const nextForCourse = existing.length
        ? Math.max(...existing.map(f => Number(f.installment_number) || 0)) + 1
        : 1;
      setNewFee(prev => ({ ...prev, [field]: value, installment_number: prev.payment_type === 'emi' ? nextForCourse : 1 }));
      return;
    }

    setNewFee(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAddFee = async () => {
    try {
      setError('');
      setSuccess('');
      setAddFeeError('');
      setAddFeeSubmitting(true);

      if (!newFee.course_id || !newFee.installment_amount || !newFee.due_date) {
        setAddFeeError('Please fill course, amount and due date');
        setAddFeeSubmitting(false);
        return;
      }

      // Additional validation for EMI
      let totalInstallments = Number(newFee.total_installments) || 1;
      let installmentNumber = Number(newFee.installment_number) || 1;
      const paymentType = newFee.payment_type || 'full';

      if (paymentType === 'emi') {
        if (totalInstallments < 2) {
          setAddFeeError('For EMI, total installments must be at least 2');
          setAddFeeSubmitting(false);
          return;
        }
        if (installmentNumber < 1 || installmentNumber > totalInstallments) {
          setAddFeeError('Installment number must be between 1 and total installments');
          setAddFeeSubmitting(false);
          return;
        }
      } else {
        totalInstallments = 1;
        installmentNumber = 1;
      }

      // Check uniqueness for (user_id, course_id, installment_number)
      const duplicate = fees.find(f => f.course_id === newFee.course_id && Number(f.installment_number) === installmentNumber);
      if (duplicate) {
        setAddFeeError(`Installment number ${installmentNumber} already exists for this course. Choose a different number.`);
        setAddFeeSubmitting(false);
        return;
      }

      const selectedEnrollment = enrollments.find(e => e.course_id === newFee.course_id);
      const payload = {
        course_id: newFee.course_id,
        enrollment_id: selectedEnrollment?.id || null,
        installment_amount: Number(newFee.installment_amount),
        total_amount: Number(newFee.installment_amount),
        payment_type: paymentType,
        total_installments: totalInstallments,
        installment_number: installmentNumber,
        status: 'pending',
        due_date: newFee.due_date,
        course_name: selectedEnrollment?.course_title || 'Course Fee',
        course_mode: selectedEnrollment?.enrollment_mode || 'online',
        notes: newFee.notes || null
      };

      const result = await AdminUsecase.createFee(student.id, payload);

      if (result.success) {
        setFees(prev => [result.fee, ...prev]);
        setShowAddFeeModal(false);
        setSuccess('Fee created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setAddFeeError(result.error || 'Failed to create fee');
      }
    } catch (err) {
      console.error('Error creating fee:', err);
      setAddFeeError('An error occurred while creating fee');
    }
    finally {
      setAddFeeSubmitting(false);
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      setError('');
      setSuccess('');

      const confirmed = window.confirm('Are you sure you want to delete this fee?');
      if (!confirmed) return;

      const result = await AdminUsecase.deleteFee(feeId);
      if (result.success) {
        setFees(prev => prev.filter(fee => fee.id !== feeId));
        setSuccess('Fee deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete fee');
      }
    } catch (err) {
      console.error('Error deleting fee:', err);
      setError('An error occurred while deleting fee');
    }
  };

  // Filter fees based on selected status
  const getFilteredFees = () => {
    if (feeFilter === 'all') {
      return fees;
    }
    return fees.filter(fee => fee.status === feeFilter);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading student details...</p>
        </div>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Student not found or you don't have permission to view this student.
        </Alert>
        <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
          <FaArrowLeft className="me-2" />
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="student-view-container">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                className="me-3"
                onClick={() => navigate('/admin/dashboard')}
              >
                <FaArrowLeft className="me-1" />
                Back
              </Button>
              <div>
                <h2 className="mb-0">Details</h2>
                <small className="text-muted">ID: {student.id}</small>
              </div>
            </div>
            <div>
              {editMode ? (
                <div>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={handleSaveStudent}
                  >
                    <FaSave className="me-1" />
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleEditToggle}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleEditToggle}
                >
                  <FaEdit className="me-1" />
                  Edit Student
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {success && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" dismissible onClose={() => setSuccess('')}>
              {success}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        {/* Student Profile Section */}
        <Col lg={4} className="mb-4">
          <Card className="student-profile-card h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Student Profile
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="student-avatar">
                  <FaUser size={60} className="text-muted" />
                </div>
                <h4 className="mt-3 mb-1">
                  {editMode ? (
                    <Form.Control
                      type="text"
                      value={editedStudent.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="text-center"
                    />
                  ) : (
                    student.full_name || student.name || 'N/A'
                  )}
                </h4>
                <Badge bg={student.is_active ? 'success' : 'secondary'}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="student-details">
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div className="detail-content">
                    <label>Email</label>
                    {editMode ? (
                      <Form.Control
                        type="email"
                        value={editedStudent.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <span>{student.email || 'N/A'}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div className="detail-content">
                    <label>Phone</label>
                    {editMode ? (
                      <Form.Control
                        type="tel"
                        value={editedStudent.phone_number || ''}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      />
                    ) : (
                      <span>{student.phone_number || 'N/A'}</span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <FaCalendar className="detail-icon" />
                  <div className="detail-content">
                    <label>Registration Date</label>
                    <span>
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <div className="detail-content">
                    <label>Status</label>
                    {editMode ? (
                      <Form.Select
                        value={editedStudent.is_active ? 'active' : 'inactive'}
                        onChange={(e) => handleInputChange('is_active', e.target.value === 'active')}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Select>
                    ) : (
                      <Badge bg={student.is_active ? 'success' : 'secondary'}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Course Enrollments and Fees */}
        <Col lg={8}>
          {/* Course Enrollments Section */}
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <FaGraduationCap className="me-2" />
                Course Enrollments ({enrollments.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {enrollments.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Enrollment Date</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(enrollment => (
                      <tr key={enrollment.id}>
                        <td>
                          <strong>{enrollment.course_title || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">
                            {enrollment.course_description || 'No description'}
                          </small>
                        </td>
                        <td>
                          {enrollment.created_at
                            ? new Date(enrollment.created_at).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                        <td>
                          <div className="progress-container">
                            <div className="progress" style={{ height: '8px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${enrollment.progress || 0}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">{enrollment.progress || 0}%</small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={enrollment.is_active ? 'success' : 'secondary'}>
                            {enrollment.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info">
                            {enrollment.enrollment_mode || 'Online'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-4">
                  <FaGraduationCap size={40} className="mb-3" />
                  <p>No course enrollments found</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Fees Section */}
          <Card>
            <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaRupeeSign className="me-2" />
                Fee Management ({fees.length})
              </h5>
              <Button type="button" variant="primary" size="sm" onClick={() => openAddFeeModal()}>
                + Add Fee
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Secondary Add Fee trigger inside body to avoid header overlay issues */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-muted">
                  Showing {getFilteredFees().length} of {fees.length} fees
                </small>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={() => { console.log('Add Fee button (body) clicked'); openAddFeeModal(); }}
                >
                  + Add Fee
                </Button>
              </div>
              {fees.length > 0 ? (
                <>
                  {/* Filter Dropdown */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <label htmlFor="feeFilter" className="form-label me-2 mb-0">
                        Filter by Status:
                      </label>
                      <Form.Select
                        id="feeFilter"
                        value={feeFilter}
                        onChange={(e) => setFeeFilter(e.target.value)}
                        style={{ width: 'auto' }}
                      >
                        <option value="all">All ({fees.length})</option>
                        <option value="paid">Paid ({fees.filter(f => f.status === 'paid').length})</option>
                        <option value="pending">Pending ({fees.filter(f => f.status === 'pending').length})</option>
                        <option value="overdue">Overdue ({fees.filter(f => f.status === 'overdue').length})</option>
                      </Form.Select>
                    </div>
                    {/* Moved to top toolbar with secondary Add Fee button */}
                    <div></div>
                  </div>

                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Fee Type</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Paid Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredFees().map(fee => (
                        <tr key={fee.id}>
                          <td>
                            <strong>{fee.payment_type || 'Course Fee'}</strong>
                            <br />
                            <small className="text-muted">
                              {fee.notes || 'No notes'}
                            </small>
                          </td>
                          <td>
                            <strong>₹{fee.installment_amount ? fee.installment_amount.toLocaleString() : 'N/A'}</strong>
                          </td>
                          <td>
                            {fee.due_date
                              ? new Date(fee.due_date).toLocaleDateString()
                              : 'N/A'
                            }
                          </td>
                          <td>
                            <Badge bg={
                              fee.status === 'paid' ? 'success' :
                                fee.status === 'pending' ? 'warning' :
                                  fee.status === 'overdue' ? 'danger' : 'secondary'
                            }>
                              {fee.status || 'Pending'}
                            </Badge>
                          </td>
                          <td>
                            {fee.paid_date
                              ? new Date(fee.paid_date).toLocaleDateString()
                              : '-'
                            }
                          </td>
                          <td>
                            {fee.status !== 'paid' && (
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleMarkFeeAsPaid(fee.id)}
                              >
                                <FaCheckCircle className="me-1" />
                                Mark Paid
                              </Button>
                            )}
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedFee(fee);
                                setShowFeeModal(true);
                              }}
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleDeleteFee(fee.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <FaRupeeSign size={40} className="mb-3" />
                  <p>No fees found for this student</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Fee Edit Modal */}
      <Modal show={showFeeModal} onHide={() => setShowFeeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFee && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Type</Form.Label>
                    <Form.Select
                      value={selectedFee.payment_type || 'full'}
                      onChange={(e) => setSelectedFee({ ...selectedFee, payment_type: e.target.value })}
                    >
                      <option value="full">Full Payment</option>
                      <option value="emi">EMI</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Installment Amount (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={selectedFee.installment_amount || ''}
                      onChange={(e) => setSelectedFee({ ...selectedFee, installment_amount: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Amount (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={selectedFee.total_amount || ''}
                      onChange={(e) => setSelectedFee({ ...selectedFee, total_amount: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedFee.course_name || ''}
                      onChange={(e) => setSelectedFee({ ...selectedFee, course_name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedFee.due_date ? selectedFee.due_date.split('T')[0] : ''}
                      onChange={(e) => setSelectedFee({ ...selectedFee, due_date: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      value={selectedFee.status || 'pending'}
                      onChange={(e) => setSelectedFee({ ...selectedFee, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedFee.notes || ''}
                  onChange={(e) => setSelectedFee({ ...selectedFee, notes: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleUpdateFee(selectedFee.id, selectedFee)}
          >
            Update Fee
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Fee Modal */}
      <Modal show={showAddFeeModal} onHide={() => setShowAddFeeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {addFeeError && (
            <Alert variant="danger" className="mb-3">
              {addFeeError}
            </Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Select
                    value={newFee.course_id || ''}
                    onChange={(e) => handleNewFeeChange('course_id', e.target.value)}
                  >
                    <option value="">Select course</option>
                    {enrollments.map(en => (
                      <option key={en.id} value={en.course_id}>
                        {en.course_title || 'Course'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Type</Form.Label>
                  <Form.Select
                    value={newFee.payment_type}
                    onChange={(e) => handleNewFeeChange('payment_type', e.target.value)}
                  >
                    <option value="full">Full Payment</option>
                    <option value="emi">EMI</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={newFee.installment_amount}
                    onChange={(e) => handleNewFeeChange('installment_amount', e.target.value)}
                    placeholder="Enter amount"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newFee.due_date}
                    onChange={(e) => handleNewFeeChange('due_date', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {newFee.payment_type === 'emi' && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Installments</Form.Label>
                    <Form.Control
                      type="number"
                      min="2"
                      value={newFee.total_installments}
                      onChange={(e) => handleNewFeeChange('total_installments', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Installment Number</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={Number(newFee.total_installments) || undefined}
                      value={newFee.installment_number}
                      onChange={(e) => handleNewFeeChange('installment_number', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newFee.notes}
                    onChange={(e) => handleNewFeeChange('notes', e.target.value)}
                    placeholder="Optional notes"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddFeeModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSubmitAddFee} disabled={addFeeSubmitting}>
            {addFeeSubmitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Adding...
              </>
            ) : (
              'Add Fee'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentView;
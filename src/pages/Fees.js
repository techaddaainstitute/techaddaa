import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Alert, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaMoneyBillWave, 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaEdit, 
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUser,
  FaBook,
  FaRupeeSign,
  FaPrint,
  FaFileInvoiceDollar
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Fees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedFee, setSelectedFee] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock fees data
  const [feesData, setFeesData] = useState([
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      courseName: 'Full Stack Web Development',
      courseId: 'FSW001',
      totalAmount: 25000,
      paidAmount: 15000,
      pendingAmount: 10000,
      dueDate: '2024-04-15',
      status: 'partial',
      mode: 'offline',
      installments: [
        { id: 1, amount: 5000, dueDate: '2024-01-15', status: 'paid', paidDate: '2024-01-10', method: 'UPI' },
        { id: 2, amount: 5000, dueDate: '2024-02-15', status: 'paid', paidDate: '2024-02-12', method: 'Cash' },
        { id: 3, amount: 5000, dueDate: '2024-03-15', status: 'paid', paidDate: '2024-03-14', method: 'Card' },
        { id: 4, amount: 5000, dueDate: '2024-04-15', status: 'pending' },
        { id: 5, amount: 5000, dueDate: '2024-05-15', status: 'pending' }
      ],
      joinDate: '2024-01-01'
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543211',
      courseName: 'Digital Marketing',
      courseId: 'DM001',
      totalAmount: 20000,
      paidAmount: 10000,
      pendingAmount: 10000,
      dueDate: '2024-04-10',
      status: 'overdue',
      mode: 'offline',
      installments: [
        { id: 1, amount: 5000, dueDate: '2024-01-10', status: 'paid', paidDate: '2024-01-08', method: 'UPI' },
        { id: 2, amount: 5000, dueDate: '2024-02-10', status: 'paid', paidDate: '2024-02-09', method: 'Cash' },
        { id: 3, amount: 5000, dueDate: '2024-03-10', status: 'overdue' },
        { id: 4, amount: 5000, dueDate: '2024-04-10', status: 'pending' }
      ],
      joinDate: '2024-01-01'
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+91 9876543212',
      courseName: 'Data Science',
      courseId: 'DS001',
      totalAmount: 30000,
      paidAmount: 30000,
      pendingAmount: 0,
      dueDate: '2024-03-01',
      status: 'paid',
      mode: 'online',
      installments: [
        { id: 1, amount: 30000, dueDate: '2024-01-01', status: 'paid', paidDate: '2023-12-28', method: 'Online' }
      ],
      joinDate: '2024-01-01'
    },
    {
      id: 4,
      studentId: 'STU004',
      studentName: 'David Brown',
      email: 'david@example.com',
      phone: '+91 9876543213',
      courseName: 'UI/UX Design',
      courseId: 'UX001',
      totalAmount: 22000,
      paidAmount: 0,
      pendingAmount: 22000,
      dueDate: '2024-04-01',
      status: 'overdue',
      mode: 'offline',
      installments: [
        { id: 1, amount: 11000, dueDate: '2024-02-01', status: 'overdue' },
        { id: 2, amount: 11000, dueDate: '2024-04-01', status: 'pending' }
      ],
      joinDate: '2024-01-15'
    }
  ]);

  // Filter fees data
  const filteredFees = feesData.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalStudents: feesData.length,
    totalRevenue: feesData.reduce((sum, fee) => sum + fee.paidAmount, 0),
    pendingRevenue: feesData.reduce((sum, fee) => sum + fee.pendingAmount, 0),
    overdueCount: feesData.filter(fee => fee.status === 'overdue').length,
    paidCount: feesData.filter(fee => fee.status === 'paid').length,
    partialCount: feesData.filter(fee => fee.status === 'partial').length
  };

  const openModal = (type, fee = null) => {
    setModalType(type);
    setSelectedFee(fee);
    setShowModal(true);
  };

  const handlePayment = (feeId, installmentId, amount) => {
    setFeesData(prev => prev.map(fee => {
      if (fee.id === feeId) {
        const updatedInstallments = fee.installments.map(inst => {
          if (inst.id === installmentId) {
            return {
              ...inst,
              status: 'paid',
              paidDate: new Date().toISOString().split('T')[0],
              method: 'Cash' // Default method
            };
          }
          return inst;
        });

        const newPaidAmount = fee.paidAmount + amount;
        const newPendingAmount = fee.totalAmount - newPaidAmount;
        const newStatus = newPendingAmount === 0 ? 'paid' : 'partial';

        return {
          ...fee,
          installments: updatedInstallments,
          paidAmount: newPaidAmount,
          pendingAmount: newPendingAmount,
          status: newStatus
        };
      }
      return fee;
    }));

    toast.success('Payment recorded successfully!');
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: 'success',
      partial: 'warning',
      overdue: 'danger',
      pending: 'secondary'
    };
    return <Badge bg={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getNextDueInstallment = (fee) => {
    return fee.installments.find(inst => inst.status === 'pending' || inst.status === 'overdue');
  };

  return (
    <div className="fees-page">
      <Container fluid className="py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="mb-4">
            <Col>
              <h2 className="mb-0">
                <FaMoneyBillWave className="me-3 text-primary" />
                Fees Management
              </h2>
              <p className="text-muted">Track and manage student fee payments</p>
            </Col>
          </Row>
        </motion.div>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-sm h-100 stat-card">
                <Card.Body className="text-center">
                  <FaRupeeSign className="text-success mb-3" size={40} />
                  <h3 className="mb-1">₹{(stats.totalRevenue / 1000).toFixed(0)}K</h3>
                  <p className="text-muted mb-0">Total Revenue</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-sm h-100 stat-card">
                <Card.Body className="text-center">
                  <FaExclamationTriangle className="text-warning mb-3" size={40} />
                  <h3 className="mb-1">₹{(stats.pendingRevenue / 1000).toFixed(0)}K</h3>
                  <p className="text-muted mb-0">Pending Revenue</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm h-100 stat-card">
                <Card.Body className="text-center">
                  <FaClock className="text-danger mb-3" size={40} />
                  <h3 className="mb-1">{stats.overdueCount}</h3>
                  <p className="text-muted mb-0">Overdue Payments</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-sm h-100 stat-card">
                <Card.Body className="text-center">
                  <FaUser className="text-info mb-3" size={40} />
                  <h3 className="mb-1">{stats.totalStudents}</h3>
                  <p className="text-muted mb-0">Total Students</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="custom-tabs mb-4">
          <Tab eventKey="overview" title={<><FaMoneyBillWave className="me-2" />Overview</>}>
            {/* Search and Filter */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <Form.Control
                    type="text"
                    placeholder="Search by student name, course, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-5"
                  />
                </div>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                  <option value="pending">Pending</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="outline-primary" className="w-100">
                  <FaDownload className="me-2" />
                  Export
                </Button>
              </Col>
            </Row>

            {/* Fees Table */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Total Amount</th>
                        <th>Paid</th>
                        <th>Pending</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Next Due</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFees.map((fee) => {
                        const nextDue = getNextDueInstallment(fee);
                        return (
                          <tr key={fee.id}>
                            <td>
                              <div>
                                <div className="fw-bold">{fee.studentName}</div>
                                <small className="text-muted">{fee.studentId}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div>{fee.courseName}</div>
                                <Badge bg="secondary" className="mt-1">{fee.mode}</Badge>
                              </div>
                            </td>
                            <td>₹{fee.totalAmount.toLocaleString()}</td>
                            <td className="text-success">₹{fee.paidAmount.toLocaleString()}</td>
                            <td className="text-danger">₹{fee.pendingAmount.toLocaleString()}</td>
                            <td>
                              <ProgressBar 
                                now={(fee.paidAmount / fee.totalAmount) * 100}
                                variant={fee.status === 'paid' ? 'success' : fee.status === 'overdue' ? 'danger' : 'warning'}
                                style={{ height: '8px' }}
                              />
                              <small className="text-muted">
                                {Math.round((fee.paidAmount / fee.totalAmount) * 100)}%
                              </small>
                            </td>
                            <td>{getStatusBadge(fee.status)}</td>
                            <td>
                              {nextDue ? (
                                <div>
                                  <div>₹{nextDue.amount.toLocaleString()}</div>
                                  <small className="text-muted">
                                    {new Date(nextDue.dueDate).toLocaleDateString()}
                                  </small>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => openModal('view', fee)}
                                >
                                  <FaEye />
                                </Button>
                                {fee.status !== 'paid' && (
                                  <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => openModal('payment', fee)}
                                  >
                                    <FaRupeeSign />
                                  </Button>
                                )}
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => openModal('receipt', fee)}
                                >
                                  <FaPrint />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="reports" title={<><FaFileInvoiceDollar className="me-2" />Reports</>}>
            <Row>
              <Col lg={6}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Payment Status Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Paid ({stats.paidCount})</span>
                        <span>{Math.round((stats.paidCount / stats.totalStudents) * 100)}%</span>
                      </div>
                      <ProgressBar variant="success" now={(stats.paidCount / stats.totalStudents) * 100} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Partial ({stats.partialCount})</span>
                        <span>{Math.round((stats.partialCount / stats.totalStudents) * 100)}%</span>
                      </div>
                      <ProgressBar variant="warning" now={(stats.partialCount / stats.totalStudents) * 100} />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Overdue ({stats.overdueCount})</span>
                        <span>{Math.round((stats.overdueCount / stats.totalStudents) * 100)}%</span>
                      </div>
                      <ProgressBar variant="danger" now={(stats.overdueCount / stats.totalStudents) * 100} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white border-0">
                    <h5 className="mb-0">Revenue Summary</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center">
                      <h2 className="text-success">₹{stats.totalRevenue.toLocaleString()}</h2>
                      <p className="text-muted">Total Revenue Collected</p>
                      
                      <hr />
                      
                      <div className="d-flex justify-content-between mb-2">
                        <span>Pending Revenue:</span>
                        <span className="text-warning">₹{stats.pendingRevenue.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Collection Rate:</span>
                        <span className="text-info">
                          {Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingRevenue)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>

        {/* Modals */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalType === 'view' && <><FaEye className="me-2" />Fee Details</>}
              {modalType === 'payment' && <><FaRupeeSign className="me-2" />Record Payment</>}
              {modalType === 'receipt' && <><FaPrint className="me-2" />Payment Receipt</>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedFee && modalType === 'view' && (
              <div>
                <Row className="mb-4">
                  <Col md={6}>
                    <h6>Student Information</h6>
                    <p><strong>Name:</strong> {selectedFee.studentName}</p>
                    <p><strong>ID:</strong> {selectedFee.studentId}</p>
                    <p><strong>Email:</strong> {selectedFee.email}</p>
                    <p><strong>Phone:</strong> {selectedFee.phone}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Course Information</h6>
                    <p><strong>Course:</strong> {selectedFee.courseName}</p>
                    <p><strong>Mode:</strong> {selectedFee.mode}</p>
                    <p><strong>Join Date:</strong> {new Date(selectedFee.joinDate).toLocaleDateString()}</p>
                  </Col>
                </Row>

                <h6>Payment History</h6>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Paid Date</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFee.installments.map((inst, index) => (
                      <tr key={inst.id}>
                        <td>{index + 1}</td>
                        <td>₹{inst.amount.toLocaleString()}</td>
                        <td>{new Date(inst.dueDate).toLocaleDateString()}</td>
                        <td>{getStatusBadge(inst.status)}</td>
                        <td>{inst.paidDate ? new Date(inst.paidDate).toLocaleDateString() : '-'}</td>
                        <td>{inst.method || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

            {selectedFee && modalType === 'payment' && (
              <div>
                <Alert variant="info">
                  <strong>Student:</strong> {selectedFee.studentName} | 
                  <strong> Course:</strong> {selectedFee.courseName}
                </Alert>

                <h6>Pending Installments</h6>
                {selectedFee.installments
                  .filter(inst => inst.status === 'pending' || inst.status === 'overdue')
                  .map((inst, index) => (
                    <Card key={inst.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6>Installment #{selectedFee.installments.indexOf(inst) + 1}</h6>
                            <p className="mb-1">Amount: ₹{inst.amount.toLocaleString()}</p>
                            <p className="mb-0">Due: {new Date(inst.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            {getStatusBadge(inst.status)}
                            <Button 
                              variant="success" 
                              size="sm" 
                              className="ms-2"
                              onClick={() => handlePayment(selectedFee.id, inst.id, inst.amount)}
                            >
                              Mark as Paid
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
              </div>
            )}

            {selectedFee && modalType === 'receipt' && (
              <div className="text-center">
                <h4>Payment Receipt</h4>
                <hr />
                <div className="text-start">
                  <p><strong>Student:</strong> {selectedFee.studentName}</p>
                  <p><strong>Course:</strong> {selectedFee.courseName}</p>
                  <p><strong>Total Paid:</strong> ₹{selectedFee.paidAmount.toLocaleString()}</p>
                  <p><strong>Pending:</strong> ₹{selectedFee.pendingAmount.toLocaleString()}</p>
                </div>
                <Button variant="primary" className="mt-3">
                  <FaDownload className="me-2" />
                  Download Receipt
                </Button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Fees;
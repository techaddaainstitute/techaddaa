import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminUsecase from '../../lib/usecase/AdminUsecase';

const AdminChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateAdminAccess = async () => {
      try {
        const validation = await AdminUsecase.validateAdminAccess();
        
        if (!validation.valid) {
          navigate('/admin/login');
          return;
        }

        setAdminUser(validation.user);
      } catch (error) {
        console.error('Admin validation error:', error);
        navigate('/admin/login');
      }
    };

    validateAdminAccess();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return false;
    }

    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return false;
    }

    if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      setError('New password must contain at least one lowercase letter');
      return false;
    }

    if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      setError('New password must contain at least one uppercase letter');
      return false;
    }

    if (!/(?=.*\d)/.test(formData.newPassword)) {
      setError('New password must contain at least one number');
      return false;
    }

    if (!/(?=.*[@$!%*?&])/.test(formData.newPassword)) {
      setError('New password must contain at least one special character (@$!%*?&)');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AdminUsecase.changePasswordUsecase(
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        setSuccess('Password changed successfully! You will be redirected to login.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  if (!adminUser) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Validating admin access...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="min-vh-100 bg-light py-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="me-3"
              >
                <FaArrowLeft className="me-1" />
                Back to Dashboard
              </Button>
              <div>
                <h2 className="mb-0">Change Password</h2>
                <small className="text-muted">
                  Logged in as: {adminUser.full_name || adminUser.email}
                </small>
              </div>
            </div>

            {/* Change Password Form */}
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaKey className="me-2" />
                  Update Your Password
                </h5>
              </Card.Header>
              <Card.Body>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="mb-3">
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Current Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter your current password"
                        required
                        disabled={loading}
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        style={{ zIndex: 10 }}
                        onClick={() => togglePasswordVisibility('current')}
                        disabled={loading}
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  {/* New Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter your new password"
                        required
                        disabled={loading}
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        style={{ zIndex: 10 }}
                        onClick={() => togglePasswordVisibility('new')}
                        disabled={loading}
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                    </Form.Text>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your new password"
                        required
                        disabled={loading}
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                        style={{ zIndex: 10 }}
                        onClick={() => togglePasswordVisibility('confirm')}
                        disabled={loading}
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <FaKey className="me-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Security Notice */}
            <Card className="mt-3 border-warning">
              <Card.Body className="text-center">
                <small className="text-muted">
                  <strong>Security Notice:</strong> After changing your password, you will be automatically logged out 
                  and redirected to the login page for security purposes.
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default AdminChangePassword;
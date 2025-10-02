import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import AdminUsecase from '../../lib/usecase/AdminUsecase';

const AdminChangePassword = ({ onClose, onSuccess }) => {
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');

    // Check password strength for new password
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const checks = [
      { test: password.length >= 8, text: 'At least 8 characters' },
      { test: /[a-z]/.test(password), text: 'One lowercase letter' },
      { test: /[A-Z]/.test(password), text: 'One uppercase letter' },
      { test: /\d/.test(password), text: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' }
    ];

    const passedChecks = checks.filter(check => check.test);
    setPasswordStrength({
      score: passedChecks.length,
      feedback: checks
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AdminUsecase.changePasswordUsecase(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );

      if (result.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Call success callback if provided
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      } else {
        setError(result.error || 'Password change failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'danger';
    if (passwordStrength.score <= 3) return 'warning';
    if (passwordStrength.score <= 4) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaLock className="me-2" />
                  Change Admin Password
                </h5>
                {onClose && (
                  <Button variant="outline-light" size="sm" onClick={onClose}>
                    <FaTimes />
                  </Button>
                )}
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Current Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                {/* New Password */}
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  
                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Password Strength:</small>
                        <small className={`text-${getPasswordStrengthColor()}`}>
                          {getPasswordStrengthText()}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div
                          className={`progress-bar bg-${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      {/* Password Requirements */}
                      <div className="mt-2">
                        {passwordStrength.feedback.map((check, index) => (
                          <div key={index} className="d-flex align-items-center">
                            {check.test ? (
                              <FaCheck className="text-success me-2" size="12" />
                            ) : (
                              <FaTimes className="text-danger me-2" size="12" />
                            )}
                            <small className={check.test ? 'text-success' : 'text-muted'}>
                              {check.text}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-1">
                      {formData.newPassword === formData.confirmPassword ? (
                        <small className="text-success">
                          <FaCheck className="me-1" />
                          Passwords match
                        </small>
                      ) : (
                        <small className="text-danger">
                          <FaTimes className="me-1" />
                          Passwords do not match
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={
                      loading || 
                      !formData.currentPassword || 
                      !formData.newPassword || 
                      !formData.confirmPassword ||
                      formData.newPassword !== formData.confirmPassword ||
                      passwordStrength.score < 4
                    }
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                  
                  {onClose && (
                    <Button variant="outline-secondary" onClick={onClose}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>

              {/* Security Tips */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="text-muted mb-2">Security Tips:</h6>
                <ul className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
                  <li>Use a unique password that you don't use elsewhere</li>
                  <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                  <li>Avoid using personal information in your password</li>
                  <li>Consider using a password manager</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminChangePassword;
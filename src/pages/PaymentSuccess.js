import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PaymentDatasource from '../lib/datasource/PaymentDatasource';
import FeesUsecase from '../lib/usecase/FeesUsecase';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, purchaseCourse } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  // Get payment parameters from URL
  const paymentId = searchParams.get('payment_id');
  const paymentRequestId = searchParams.get('payment_request_id');

  useEffect(() => {
    const verifyPaymentAndEnroll = async () => {
      if (!paymentRequestId) {
        setPaymentStatus('error');
        setLoading(false);
        return;
      }

      try {
        // Retrieve payment data from localStorage
        const paymentDataKey = `payment_data_${paymentRequestId}`;
        const storedPaymentData = localStorage.getItem(paymentDataKey);
        
        if (!storedPaymentData) {
          console.error('Payment data not found in localStorage');
          setPaymentStatus('error');
          setLoading(false);
          return;
        }

        const paymentData = JSON.parse(storedPaymentData);

        // Verify payment and create database record
        const verificationResult = await PaymentDatasource.verifyAndCreatePayment(paymentRequestId, paymentData);
        
        if (!verificationResult.success) {
          setPaymentStatus('failed');
          setLoading(false);
          return;
        }

        const { payment, verification } = verificationResult.data;
        setPaymentDetails(verification);
        setPaymentStatus('success');

        // Clean up localStorage
        localStorage.removeItem(paymentDataKey);

        // Enroll user in course
        const enrollmentResult = await purchaseCourse(payment.course_id, 'online'); // Default to online, can be enhanced
        
        if (enrollmentResult.success) {
          // Create fees entry
          const feesResult = await FeesUsecase.createEnrollmentFeesUsecase(
            payment.user_id,
            payment.course_id,
            { title: verification.purpose }, // Simplified course object
            payment.payment_type,
            payment.amount,
            'online', // Default mode
            6 // Default EMI months
          );
          
          if (feesResult.success) {
            setEnrollmentStatus('success');
            toast.success('Payment successful! You have been enrolled in the course.');
          } else {
            setEnrollmentStatus('partial');
            toast.warning('Payment successful but there was an issue with enrollment. Please contact support.');
          }
        } else {
          setEnrollmentStatus('failed');
          toast.error('Payment successful but enrollment failed. Please contact support.');
        }
        
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('error');
        toast.error('Error verifying payment status');
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndEnroll();
  }, [paymentRequestId, purchaseCourse, user]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <FaCheckCircle className="text-success" size={64} />;
      case 'failed':
      case 'error':
        return <FaTimesCircle className="text-danger" size={64} />;
      default:
        return <Spinner animation="border" variant="primary" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          variant: 'success'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          variant: 'danger'
        };
      case 'pending':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait.',
          variant: 'warning'
        };
      case 'error':
        return {
          title: 'Error',
          message: 'There was an error processing your payment. Please contact support.',
          variant: 'danger'
        };
      default:
        return {
          title: 'Verifying Payment...',
          message: 'Please wait while we verify your payment.',
          variant: 'info'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-4"
                  >
                    {getStatusIcon()}
                  </motion.div>

                  <h2 className="mb-3">{statusInfo.title}</h2>
                  <p className="text-muted mb-4">{statusInfo.message}</p>

                  {paymentDetails && (
                    <Alert variant={statusInfo.variant} className="text-start">
                      <h6>Payment Details:</h6>
                      <div className="row">
                        <div className="col-sm-6">
                          <strong>Amount:</strong> ₹{paymentDetails.amount}
                        </div>
                        <div className="col-sm-6">
                          <strong>Status:</strong> {paymentDetails.status}
                        </div>
                        <div className="col-12 mt-2">
                          <strong>Purpose:</strong> {paymentDetails.purpose}
                        </div>
                        {paymentDetails.payment && (
                          <div className="col-12 mt-2">
                            <strong>Transaction ID:</strong> {paymentDetails.payment.payment_id}
                          </div>
                        )}
                      </div>
                    </Alert>
                  )}

                  {enrollmentStatus && (
                    <Alert 
                      variant={enrollmentStatus === 'success' ? 'success' : enrollmentStatus === 'partial' ? 'warning' : 'danger'}
                      className="text-start"
                    >
                      <h6>Enrollment Status:</h6>
                      {enrollmentStatus === 'success' && 'Successfully enrolled in the course!'}
                      {enrollmentStatus === 'partial' && 'Payment successful but enrollment needs manual verification.'}
                      {enrollmentStatus === 'failed' && 'Payment successful but enrollment failed. Please contact support.'}
                    </Alert>
                  )}

                  <div className="d-flex gap-3 justify-content-center mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/courses')}
                      className="d-flex align-items-center"
                    >
                      <FaArrowLeft className="me-2" />
                      Back to Courses
                    </Button>
                    
                    {paymentStatus === 'success' && (
                      <Button
                        variant="primary"
                        onClick={() => navigate('/dashboard')}
                      >
                        Go to Dashboard
                      </Button>
                    )}
                    
                    {(paymentStatus === 'failed' || paymentStatus === 'error') && (
                      <Button
                        variant="primary"
                        onClick={() => navigate(-1)}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaymentSuccess;
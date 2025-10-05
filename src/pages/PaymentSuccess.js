import React, { useState, useEffect, useCallback } from 'react';
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
  const urlPaymentStatus = searchParams.get('payment_status');

  // Memoize the verification function to prevent recreation on every render
  const verifyPaymentAndEnroll = useCallback(async () => {
    console.log('🔍 PaymentSuccess: Starting payment verification...');
    console.log('📋 URL Parameters:', {
      paymentId,
      paymentRequestId,
      urlPaymentStatus
    });
    console.log('👤 Current user:', user);
    
    // Debug authentication state
    console.log('🔍 Authentication Debug:');
    console.log('  - User object:', user);
    console.log('  - User ID:', user?.id);
    console.log('  - User email:', user?.email);
    console.log('  - User phone:', user?.phone_number);
    console.log('  - LocalStorage techaddaa_user:', localStorage.getItem('techaddaa_user'));
    
    // Check if user is logged in
    const isLoggedIn = !!user && !!user.id;
    console.log('🔐 Is user logged in?', isLoggedIn);

    if (!paymentRequestId) {
      console.log('❌ Missing payment request ID');
      setPaymentStatus('error');
      setLoading(false);
      return;
    }

    if (!user) {
      console.log('❌ No user logged in');
      setPaymentStatus('error');
      setLoading(false);
      toast.error('Please login to complete payment verification');
      return;
    }

    // Retrieve payment data from localStorage
    const paymentDataKey = `payment_data_${paymentRequestId}`;
    const storedPaymentData = localStorage.getItem(paymentDataKey);
    
    let paymentData = null;
    if (storedPaymentData) {
      paymentData = JSON.parse(storedPaymentData);
    } else {
      console.warn('Payment data not found in localStorage, proceeding with verification only');
    }

    try {

      console.log('🔍 Verifying payment with ID:', paymentRequestId);
      console.log('📦 Payment data from localStorage:', paymentData);
      console.log('🌐 URL parameters:', { paymentId, urlPaymentStatus, paymentRequestId });

      // Verify payment using the secure Edge Function
      console.log('🔍 Verifying payment with secure Edge Function...');

      // Ensure we have payment data for verification
      if (!paymentData && !urlPaymentStatus) {
        console.log('❌ No payment data available for verification');
        setPaymentStatus('error');
        setLoading(false);
        toast.error('Payment data not found. Please try again.');
        return;
      }

      // Verify payment and create database record using secure Edge Function
      const verificationResult = await PaymentDatasource.verifyAndCreatePaymentSecure(paymentRequestId, paymentData);
      
      if (!verificationResult.success) {
        console.log('❌ Payment verification failed:', verificationResult);
        setPaymentStatus('failed');
        setLoading(false);
        toast.error(verificationResult.message || 'Payment verification failed');
        return;
      }

      // Handle verification result
      const { payment_completed, payment_request, payment_record } = verificationResult;
      
      if (!payment_completed) {
        console.log('❌ Payment not completed');
        setPaymentStatus('pending');
        setLoading(false);
        toast.warning('Payment is still being processed. Please check back later.');
        return;
      }

      setPaymentDetails(payment_request);
      setPaymentStatus('success');
      console.log('✅ Payment verification successful:', verificationResult);

      // Clean up localStorage
      if (paymentDataKey) {
        localStorage.removeItem(paymentDataKey);
      }

      // Enroll user in course using payment record data
      console.log('📚 Enrolling user in course:', payment_record.course_id);
      const enrollmentResult = await purchaseCourse(payment_record.course_id, payment_record.payment_type || 'online');
      
      if (enrollmentResult.success) {
        // Create fees entry
        const feesResult = await FeesUsecase.createEnrollmentFeesUsecase(
          payment_record.user_id,
          payment_record.course_id,
          { title: payment_request.purpose }, // Course object from payment request
          payment_record.payment_type || 'online',
          payment_record.amount,
          payment_record.payment_type || 'online',
          payment_record.emi_months || 6 // Use EMI months from payment record or default to 6
        );
        
        if (feesResult.success) {
          setEnrollmentStatus('success');
          toast.success('Payment successful! You have been enrolled in the course.');
          console.log('✅ Course enrollment and fees creation completed successfully');
        } else {
          setEnrollmentStatus('partial');
          toast.warning('Payment successful but there was an issue with fees creation. Please contact support.');
          console.log('⚠️ Fees creation failed:', feesResult);
        }
      } else {
        setEnrollmentStatus('failed');
        toast.error('Payment successful but enrollment failed. Please contact support.');
        console.log('❌ Course enrollment failed:', enrollmentResult);
      }
      
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        paymentRequestId,
        paymentData,
        urlParams: { paymentId, urlPaymentStatus, paymentRequestId }
      });
      setPaymentStatus('error');
      toast.error('Error verifying payment status');
    } finally {
      setLoading(false);
    }
  }, [paymentRequestId, user?.id, purchaseCourse, paymentId, urlPaymentStatus]);

  useEffect(() => {
    verifyPaymentAndEnroll();
  }, [verifyPaymentAndEnroll]);

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
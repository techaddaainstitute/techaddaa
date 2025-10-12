import React, { createContext, useContext, useState } from 'react';
import PaymentDataSource from '../lib/datasource/PaymentDataSource';
import { Status } from '../tool';
// Create Payment Context
const PaymentContext = createContext();

// Payment Status Constants


// Payment Context Provider
export const PaymentProvider = ({ children }) => {
  const [paymentState, setPaymentState] = useState({
    status: Status.INIT,
    paymentData: null,
    error: null,
    loading: false
  });

  /**
   * Initialize payment with Instamojo gateway
   * @param {Object} paymentDetails - Payment information
   * @param {number} paymentDetails.amount - Payment amount
   * @param {string} paymentDetails.name - Customer name
   * @param {string} paymentDetails.phone - Customer phone number
   * @param {string} paymentDetails.email - Customer email
   * @param {string} paymentDetails.purpose - Payment purpose/description
   */
  const initiatePayment = async (paymentDetails) => {
    try {
      // Set loading state
      setPaymentState(prev => ({
        ...prev,
        status: Status.LOADING,
        loading: true,
        error: null
      }));

      console.log('Initiating payment with Instamojo gateway...', paymentDetails);

      // Validate payment details
      if (!paymentDetails.amount || !paymentDetails.name || !paymentDetails.phone || !paymentDetails.email) {
        throw new Error('Missing required payment details');
      }

      // Simulate Instamojo payment gateway
      const instamojoPayment = {
        payment_request: {
          id: `PR_${Date.now()}`,
          longurl: `https://test.instamojo.com/@techaddaa/payment_${Date.now()}`,
          shorturl: `https://imjo.in/payment_${Date.now()}`,
          status: 'Pending',
          purpose: paymentDetails.purpose || 'Course Payment',
          amount: paymentDetails.amount,
          buyer_name: paymentDetails.name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          created_at: new Date().toISOString(),
          redirect_url: `${window.location.origin}/payment-check`
        }
      };

      console.log('Instamojo payment request created:', instamojoPayment);

      // Simulate opening payment gateway (in real implementation, this would redirect to Instamojo)
      const shouldSimulateSuccess = window.confirm(
        `Instamojo Payment Gateway\n\nAmount: ₹${paymentDetails.amount}\nName: ${paymentDetails.name}\nEmail: ${paymentDetails.email}\nPhone: ${paymentDetails.phone}\n\nClick OK to simulate successful payment, Cancel to simulate failure.`
      );

      if (shouldSimulateSuccess) {
        // Process payment through datasource
        const result = await PaymentDataSource.processPayment({
          ...paymentDetails,
          payment_request_id: instamojoPayment.payment_request.id,
          redirect_url: `${window.location.origin}/payment-check`
        });

        if (result.success) {
          // Update state to success
          setPaymentState(prev => ({
            ...prev,
            status: Status.SUCCESS,
            paymentData: result.data,
            loading: false,
            error: null
          }));

          console.log('Payment successful:', result.data);

          return result;
        } else {
          throw new Error(result.error || 'Payment processing failed');
        }
      } else {
        // User cancelled payment
        setPaymentState(prev => ({
          ...prev,
          status: Status.ERROR,
          loading: false,
          error: 'Payment cancelled by user'
        }));

        return {
          success: false,
          error: 'Payment cancelled by user'
        };
      }

    } catch (error) {
      console.error('Payment initiation error:', error);

      // Update state to failed
      setPaymentState(prev => ({
        ...prev,
        status: Status.ERROR,
        loading: false,
        error: error.message
      }));

      return {
        success: false,
        error: error.message
      };
    }
  };

  /**
   * Reset payment state
   */
  const resetPaymentState = () => {
    setPaymentState({
      status: Status.INIT,
      paymentData: null,
      error: null,
      loading: false
    });
  };

  /**
   * Verify payment status
   * @param {string} paymentRequestId - Payment request ID to verify
   * @param {string} paymentStatus - Payment status from Instamojo
   */
  const verifyPayment = async (paymentRequestId, paymentStatus) => {
    try {
      setPaymentState(prev => ({ ...prev, loading: true }));

      const result = await PaymentDataSource.verifyPayment(paymentRequestId, paymentStatus);

      if (result.success) {
        setPaymentState(prev => ({
          ...prev,
          status: Status.SUCCESS,
          loading: false
        }));
      } else {
        setPaymentState(prev => ({
          ...prev,
          status: Status.ERROR,
          error: result.error,
          loading: false
        }));
      }

      return result;
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentState(prev => ({
        ...prev,
        status: Status.ERROR,
        error: error.message,
        loading: false
      }));

      return {
        success: false,
        error: error.message
      };
    }
  };

  /**
   * Get payment details
   * @param {string} paymentId - Payment ID
   */
  const getPaymentDetails = async (paymentId) => {
    try {
      const result = await PaymentDataSource.getPaymentDetails(paymentId);
      return result;
    } catch (error) {
      console.error('Error getting payment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  // Inside PaymentProvider, after getPaymentDetails:

  /** Mark payment success and store minimal payload */
  const markPaymentSuccess = (data) => {
    setPaymentState(prev => ({
      ...prev,
      status: Status.SUCCESS,
      loading: false,
      error: null,
      paymentData: data || prev.paymentData
    }));
  };

  /** Mark payment failure with reason */
  const markPaymentFailure = (reason) => {
    setPaymentState(prev => ({
      ...prev,
      status: Status.ERROR,
      loading: false,
      error: reason || "Payment failed",
    }));
  };

  const contextValue = {
    // State
    paymentState,

    // Actions
    initiatePayment,
    resetPaymentState,
    verifyPayment,
    getPaymentDetails,
    markPaymentSuccess,
    markPaymentFailure,
    // Computed values
    isLoading: paymentState.loading,
    isSuccess: paymentState.status === Status.SUCCESS,
    isFailed: paymentState.status === Status.ERROR,
    isCancelled: paymentState.status === Status.ERROR,
    isProcessing: paymentState.status === Status.LOADING
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook to use Payment Context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
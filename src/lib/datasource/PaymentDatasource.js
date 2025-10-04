import { supabase } from '../supabase';
import Payment from '../model/Payment';

/**
 * PaymentDatasource
 * Handles all payment-related data operations with Supabase
 */
export class PaymentDatasource {

  // ==================== PAYMENT CREATION ====================

  /**
   * Create a new payment record
   * @param {Object} paymentData - Payment information
   * @returns {Object} Result with success/error status
   */
  static async createPayment(paymentData) {
    try {
      const payment = Payment.createNew(paymentData);

      if (!payment.isValid()) {
        throw new Error('Invalid payment data provided');
      }

      const { data, error } = await supabase
        .from('payments')
        .insert([payment.toJSON()])
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        throw error;
      }

      return {
        success: true,
        data: Payment.fromDatabaseRow(data),
        message: 'Payment record created successfully'
      };
    } catch (error) {
      console.error('PaymentDatasource.createPayment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment record'
      };
    }
  }

  /**
   * Create multiple payment records (for EMI payments)
   * @param {Array} paymentsData - Array of payment information
   * @returns {Object} Result with success/error status
   */
  static async createMultiplePayments(paymentsData) {
    try {
      const payments = paymentsData.map(data => Payment.createNew(data).toJSON());

      const { data, error } = await supabase
        .from('payments')
        .insert(payments)
        .select();

      if (error) {
        console.error('Error creating multiple payments:', error);
        throw error;
      }

      return {
        success: true,
        data: data.map(row => Payment.fromDatabaseRow(row)),
        message: `${data.length} payment records created successfully`
      };
    } catch (error) {
      console.error('PaymentDatasource.createMultiplePayments error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment records'
      };
    }
  }

  /**
   * Generate Instamojo payment link
   * @param {Object} paymentData - Payment information for Instamojo
   * @returns {Object} Result with payment link or error
   */
  static async generateInstamojoPayment(paymentData) {
    try {
      const {
        amount,
        purpose,
        buyer_name,
        email,
        phone,
        redirect_url,
        webhook,
        allow_repeated_payments = false
      } = paymentData;

      // Validate required fields
      if (!amount || !purpose || !buyer_name || !email) {
        throw new Error('Missing required fields for Instamojo payment');
      }

      // Get environment variables
      const apiKey = process.env.REACT_APP_INSTAMOJO_API_KEY;
      const authToken = process.env.REACT_APP_INSTAMOJO_AUTH_TOKEN;
      const endpoint = process.env.REACT_APP_INSTAMOJO_ENDPOINT;
      const redirectUrl = process.env.REACT_APP_INSTAMOJO_REDIRECT_URL;

      // Only use mock responses if credentials are missing
      // Allow test.instamojo.com calls to go through for testing
      const isDevelopment = !apiKey || !authToken || !endpoint;

      let result;

      if (isDevelopment) {
        // Mock response for development
        console.log('🔧 Development mode: Creating mock Instamojo payment');
        result = {
          success: true,
          payment_request: {
            id: `MOCK_${Date.now()}`,
            longurl: `${process.env.REACT_APP_INSTAMOJO_REDIRECT_URL}?payment_id=MOCK_${Date.now()}&payment_request_id=MOCK_REQ_${Date.now()}&payment_status=Credit`,
            shorturl: `${process.env.REACT_APP_INSTAMOJO_REDIRECT_URL}?payment_id=MOCK_${Date.now()}`,
            status: 'Pending',
            purpose: purpose,
            amount: amount
          }
        };
      } else {
        // Prepare Instamojo API request for production
        const instamojoData = {
          purpose: purpose,
          amount: amount.toString(),
          buyer_name: buyer_name,
          email: email,
          phone: phone || '',
          redirect_url: redirect_url || redirectUrl,
          send_email: "true",
          allow_repeated_payments: allow_repeated_payments ? "true" : "false"
        };

        // Add webhook if provided
        if (webhook || process.env.REACT_APP_INSTAMOJO_WEBHOOK_URL) {
          instamojoData.webhook = webhook || process.env.REACT_APP_INSTAMOJO_WEBHOOK_URL;
        }

        console.log('🚀 Making Instamojo API call with data:', instamojoData);
        console.log('🔑 Using endpoint:', endpoint);

        // Make API call to Instamojo
        const response = await fetch(`${endpoint}payment-requests/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Api-Key': apiKey,
            'X-Auth-Token': authToken
          },
          body: new URLSearchParams(instamojoData)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          const htmlText = await response.text();
          console.error('❌ Received HTML response:', htmlText.substring(0, 500));
          throw new Error('Invalid API response - received HTML instead of JSON. Please check API credentials and endpoint.');
        }

        result = await response.json();
        console.log('📦 Instamojo API Response:', result);

        if (!response.ok || !result.success) {
          console.error('❌ Instamojo API Error:', result);
          throw new Error(result.message || `API Error: ${response.status} - Failed to create Instamojo payment link`);
        }
      }

      // Store payment data in localStorage for later retrieval after payment verification
      const paymentDataForStorage = {
        user_id: paymentData.user_id,
        course_id: paymentData.course_id,
        enrollment_id: paymentData.enrollment_id || null,
        amount: amount,
        payment_method: 'instamojo',
        payment_status: 'pending',
        payment_type: paymentData.payment_type || 'course_fee',
        description: purpose,
        gateway_payment_id: result.payment_request.id,
        gateway_response: result,
        instamojo_payment_request_id: result.payment_request.id,
        instamojo_longurl: result.payment_request.longurl,
        instamojo_shorturl: result.payment_request.shorturl,
        buyer_name: paymentData.buyer_name,
        buyer_email: paymentData.email,
        buyer_phone: paymentData.phone
      };
      
      const paymentDataKey = `payment_data_${result.payment_request.id}`;
      localStorage.setItem(paymentDataKey, JSON.stringify(paymentDataForStorage));

      // Return payment gateway URL directly without creating database record
      // The payment record will be created after successful payment verification
      return {
        success: true,
        data: {
          payment_url: result.payment_request.longurl,
          payment_request_id: result.payment_request.id,
          instamojo_response: result
        },
        message: 'Instamojo payment link generated successfully'
      };

    } catch (error) {
      console.error('PaymentDatasource.generateInstamojoPayment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate Instamojo payment link'
      };
    }
  }

  /**
   * Verify Instamojo payment status
   * @param {string} paymentRequestId - Instamojo payment request ID
   * @returns {Object} Payment status result
   */
  static async verifyInstamojoPayment(paymentRequestId) {
    try {
      // Get environment variables
      const apiKey = process.env.REACT_APP_INSTAMOJO_API_KEY;
      const authToken = process.env.REACT_APP_INSTAMOJO_AUTH_TOKEN;
      const endpoint = process.env.REACT_APP_INSTAMOJO_ENDPOINT;

      // Check if in development mode
      const isDevelopment = process.env.NODE_ENV === 'development' ||
        endpoint?.includes('test') ||
        paymentRequestId?.startsWith('MOCK_') ||
        !apiKey || !authToken;

      let result;

      if (isDevelopment) {
        // Mock verification for development
        console.log('🔧 Development mode: Verifying mock Instamojo payment');
        result = {
          success: true,
          payment_request: {
            id: paymentRequestId,
            status: 'Completed',
            amount: '1000', // Mock amount
            purpose: 'Course Enrollment Payment',
            payment: {
              payment_id: `PAY_${Date.now()}`,
              status: 'Credit',
              amount: '1000'
            }
          }
        };
      } else {
        // Real API call for production
        const response = await fetch(`${endpoint}payment-requests/${paymentRequestId}/`, {
          method: 'GET',
          headers: {
            'X-Api-Key': apiKey,
            'X-Auth-Token': authToken
          }
        });

        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          throw new Error('Invalid API response - received HTML instead of JSON. Please check API credentials and endpoint.');
        }

        result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to verify payment status');
        }
      }

      return {
        success: true,
        data: result.payment_request,
        message: 'Payment status verified successfully'
      };

    } catch (error) {
      console.error('PaymentDatasource.verifyInstamojoPayment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify payment status'
      };
    }
  }

  /**
   * Verify Instamojo payment and create database record after successful verification
   * @param {string} paymentRequestId - Payment request ID from Instamojo
   * @param {Object} paymentData - Payment data to store in database
   * @returns {Object} Result with success/error status
   */
  static async verifyAndCreatePayment(paymentRequestId, paymentData) {
    try {
      // First verify the payment with Instamojo
      const verificationResult = await this.verifyInstamojoPayment(paymentRequestId);
      
      if (!verificationResult.success) {
        return {
          success: false,
          error: 'Payment verification failed'
        };
      }

      const paymentRequest = verificationResult.data;
      
      // Check if payment is successful
      const isPaymentSuccessful = paymentRequest.status === 'Completed' || 
                                  (paymentRequest.payment && paymentRequest.payment.status === 'Credit');

      if (!isPaymentSuccessful) {
        return {
          success: false,
          error: 'Payment not completed successfully'
        };
      }

      // Update payment data with verification results
      const updatedPaymentData = {
        ...paymentData,
        payment_status: 'completed',
        gateway_transaction_id: paymentRequest.payment?.payment_id || paymentRequest.id,
        payment_date: new Date().toISOString(),
        gateway_response: {
          ...paymentData.gateway_response,
          verification_response: paymentRequest
        }
      };

      // Create payment record in database
      const dbResult = await this.createPayment(updatedPaymentData);

      if (!dbResult.success) {
        console.error('Failed to create payment record after verification:', dbResult.error);
        return {
          success: false,
          error: 'Payment verified but failed to create database record'
        };
      }

      return {
        success: true,
        data: {
          payment: dbResult.data,
          verification: paymentRequest
        },
        message: 'Payment verified and recorded successfully'
      };

    } catch (error) {
      console.error('PaymentDatasource.verifyAndCreatePayment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify and create payment record'
      };
    }
  }

  // ==================== PAYMENT RETRIEVAL ====================

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Object} Payment data or error
   */
  static async getPaymentById(paymentId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          user_profiles!payments_user_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('id', paymentId)
        .single();

      if (error) {
        console.error('Error fetching payment:', error);
        throw error;
      }

      return {
        success: true,
        data: Payment.fromDatabaseRow(data)
      };
    } catch (error) {
      console.error('PaymentDatasource.getPaymentById error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch payment'
      };
    }
  }

  /**
   * Get all payments for a user
   * @param {string} userId - User ID
   * @returns {Object} Array of payments or error
   */
  static async getUserPayments(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user payments:', error);
        throw error;
      }

      return {
        success: true,
        data: data.map(row => Payment.fromDatabaseRow(row))
      };
    } catch (error) {
      console.error('PaymentDatasource.getUserPayments error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user payments'
      };
    }
  }

  /**
   * Get payments for a specific course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Object} Array of payments or error
   */
  static async getCoursePayments(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('installment_number', { ascending: true });

      if (error) {
        console.error('Error fetching course payments:', error);
        throw error;
      }

      return {
        success: true,
        data: data.map(row => Payment.fromDatabaseRow(row))
      };
    } catch (error) {
      console.error('PaymentDatasource.getCoursePayments error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch course payments'
      };
    }
  }

  /**
   * Get pending payments for a user
   * @param {string} userId - User ID
   * @returns {Object} Array of pending payments or error
   */
  static async getPendingPayments(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .eq('payment_status', 'pending')
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching pending payments:', error);
        throw error;
      }

      return {
        success: true,
        data: data.map(row => Payment.fromDatabaseRow(row))
      };
    } catch (error) {
      console.error('PaymentDatasource.getPendingPayments error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch pending payments'
      };
    }
  }

  /**
   * Get overdue payments for a user
   * @param {string} userId - User ID
   * @returns {Object} Array of overdue payments or error
   */
  static async getOverduePayments(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .eq('payment_status', 'pending')
        .lt('due_date', today)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching overdue payments:', error);
        throw error;
      }

      return {
        success: true,
        data: data.map(row => Payment.fromDatabaseRow(row))
      };
    } catch (error) {
      console.error('PaymentDatasource.getOverduePayments error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch overdue payments'
      };
    }
  }

  // ==================== PAYMENT UPDATES ====================

  /**
   * Update payment status
   * @param {string} paymentId - Payment ID
   * @param {string} status - New payment status
   * @param {Object} additionalData - Additional data to update
   * @returns {Object} Result with success/error status
   */
  static async updatePaymentStatus(paymentId, status, additionalData = {}) {
    try {
      const updateData = {
        payment_status: status,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      if (status === 'completed' && !updateData.payment_date) {
        updateData.payment_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }

      return {
        success: true,
        data: Payment.fromDatabaseRow(data),
        message: 'Payment status updated successfully'
      };
    } catch (error) {
      console.error('PaymentDatasource.updatePaymentStatus error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update payment status'
      };
    }
  }

  /**
   * Mark payment as completed
   * @param {string} paymentId - Payment ID
   * @param {Object} paymentData - Payment completion data
   * @returns {Object} Result with success/error status
   */
  static async markPaymentCompleted(paymentId, paymentData = {}) {
    try {
      const updateData = {
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...paymentData
      };

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error marking payment as completed:', error);
        throw error;
      }

      return {
        success: true,
        data: Payment.fromDatabaseRow(data),
        message: 'Payment marked as completed successfully'
      };
    } catch (error) {
      console.error('PaymentDatasource.markPaymentCompleted error:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark payment as completed'
      };
    }
  }

  /**
   * Update payment gateway response
   * @param {string} paymentId - Payment ID
   * @param {Object} gatewayResponse - Gateway response data
   * @returns {Object} Result with success/error status
   */
  static async updateGatewayResponse(paymentId, gatewayResponse) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          gateway_response: gatewayResponse,
          gateway_transaction_id: gatewayResponse.transaction_id || gatewayResponse.txnid,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating gateway response:', error);
        throw error;
      }

      return {
        success: true,
        data: Payment.fromDatabaseRow(data),
        message: 'Gateway response updated successfully'
      };
    } catch (error) {
      console.error('PaymentDatasource.updateGatewayResponse error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update gateway response'
      };
    }
  }

  // ==================== PAYMENT ANALYTICS ====================

  /**
   * Get payment summary for a user
   * @param {string} userId - User ID
   * @returns {Object} Payment summary or error
   */
  static async getPaymentSummary(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('payment_status, amount, payment_type')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching payment summary:', error);
        throw error;
      }

      const summary = {
        total_payments: data.length,
        total_amount: data.reduce((sum, payment) => sum + payment.amount, 0),
        completed_payments: data.filter(p => p.payment_status === 'completed').length,
        pending_payments: data.filter(p => p.payment_status === 'pending').length,
        failed_payments: data.filter(p => p.payment_status === 'failed').length,
        completed_amount: data.filter(p => p.payment_status === 'completed').reduce((sum, payment) => sum + payment.amount, 0),
        pending_amount: data.filter(p => p.payment_status === 'pending').reduce((sum, payment) => sum + payment.amount, 0)
      };

      return {
        success: true,
        data: summary
      };
    } catch (error) {
      console.error('PaymentDatasource.getPaymentSummary error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch payment summary'
      };
    }
  }

  /**
   * Get payments grouped by course
   * @param {string} userId - User ID
   * @returns {Object} Payments grouped by course or error
   */
  static async getPaymentsGroupedByCourse(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments grouped by course:', error);
        throw error;
      }

      const groupedPayments = data.reduce((acc, payment) => {
        const courseId = payment.course_id;
        if (!acc[courseId]) {
          acc[courseId] = {
            course: payment.courses,
            payments: []
          };
        }
        acc[courseId].payments.push(Payment.fromDatabaseRow(payment));
        return acc;
      }, {});

      return {
        success: true,
        data: groupedPayments
      };
    } catch (error) {
      console.error('PaymentDatasource.getPaymentsGroupedByCourse error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch payments grouped by course'
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user has pending payments
   * @param {string} userId - User ID
   * @returns {Object} Boolean result or error
   */
  static async hasPendingPayments(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', userId)
        .eq('payment_status', 'pending')
        .limit(1);

      if (error) {
        console.error('Error checking pending payments:', error);
        throw error;
      }

      return {
        success: true,
        data: data.length > 0
      };
    } catch (error) {
      console.error('PaymentDatasource.hasPendingPayments error:', error);
      return {
        success: false,
        error: error.message || 'Failed to check pending payments'
      };
    }
  }

  /**
   * Get next due payment for a user
   * @param {string} userId - User ID
   * @returns {Object} Next due payment or error
   */
  static async getNextDuePayment(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses!payments_course_id_fkey (
            id,
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .eq('payment_status', 'pending')
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })
        .limit(1);

      if (error) {
        console.error('Error fetching next due payment:', error);
        throw error;
      }

      return {
        success: true,
        data: data.length > 0 ? Payment.fromDatabaseRow(data[0]) : null
      };
    } catch (error) {
      console.error('PaymentDatasource.getNextDuePayment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch next due payment'
      };
    }
  }
}

export default PaymentDatasource;
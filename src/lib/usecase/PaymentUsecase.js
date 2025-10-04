import PaymentDatasource from '../datasource/PaymentDatasource';
import FeesDatasource from '../datasource/FeesDatasource';
import { toast } from 'react-toastify';

/**
 * PaymentUsecase
 * Business logic layer for payment operations
 */
export class PaymentUsecase {

  // ==================== PAYMENT CREATION ====================

  /**
   * Create a new payment record
   * @param {Object} paymentData - Payment information
   * @returns {Object} Result with success/error status
   */
  static async createPaymentUsecase(paymentData) {
    try {
      // Validate required fields
      if (!paymentData.user_id || !paymentData.amount || paymentData.amount <= 0) {
        return {
          success: false,
          error: 'User ID and valid amount are required'
        };
      }

      // Validate payment method
      const validMethods = ['online', 'offline', 'cash', 'cheque', 'bank_transfer', 'upi', 'card'];
      if (!validMethods.includes(paymentData.payment_method)) {
        return {
          success: false,
          error: 'Invalid payment method'
        };
      }

      const result = await PaymentDatasource.createPayment(paymentData);

      if (result.success) {
        toast.success('Payment record created successfully');
        return {
          success: true,
          data: result.data,
          message: 'Payment record created successfully'
        };
      } else {
        toast.error(result.error || 'Failed to create payment record');
        return result;
      }
    } catch (error) {
      console.error('PaymentUsecase.createPaymentUsecase error:', error);
      toast.error('An error occurred while creating payment record');
      return {
        success: false,
        error: error.message || 'Failed to create payment record'
      };
    }
  }

  /**
   * Create EMI payment schedule
   * @param {Object} emiData - EMI payment information
   * @returns {Object} Result with success/error status
   */
  static async createEMIPaymentScheduleUsecase(emiData) {
    try {
      const { user_id, course_id, fee_id, total_amount, emi_months, payment_method, start_date } = emiData;

      // Validate inputs
      if (!user_id || !total_amount || !emi_months || emi_months < 2) {
        return {
          success: false,
          error: 'Invalid EMI data provided'
        };
      }

      // Calculate EMI amount
      const emiAmount = Math.ceil(total_amount / emi_months);
      const lastEmiAmount = total_amount - (emiAmount * (emi_months - 1));

      // Create payment schedule
      const paymentsData = [];
      const baseDate = start_date ? new Date(start_date) : new Date();

      for (let i = 1; i <= emi_months; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + i - 1);

        const amount = i === emi_months ? lastEmiAmount : emiAmount;

        paymentsData.push({
          user_id,
          course_id,
          fee_id,
          amount,
          payment_method: payment_method || 'online',
          payment_type: 'emi',
          installment_number: i,
          total_installments: emi_months,
          due_date: dueDate.toISOString().split('T')[0],
          description: `EMI ${i} of ${emi_months} for course enrollment`
        });
      }

      const result = await PaymentDatasource.createMultiplePayments(paymentsData);

      if (result.success) {
        toast.success(`EMI schedule created with ${emi_months} installments`);
        return {
          success: true,
          data: result.data,
          message: `EMI schedule created successfully with ${emi_months} installments`
        };
      } else {
        toast.error(result.error || 'Failed to create EMI schedule');
        return result;
      }
    } catch (error) {
      console.error('PaymentUsecase.createEMIPaymentScheduleUsecase error:', error);
      toast.error('An error occurred while creating EMI schedule');
      return {
        success: false,
        error: error.message || 'Failed to create EMI schedule'
      };
    }
  }

  // ==================== PAYMENT PROCESSING ====================

  /**
   * Process payment completion
   * @param {string} paymentId - Payment ID
   * @param {Object} paymentData - Payment completion data
   * @returns {Object} Result with success/error status
   */
  static async processPaymentCompletionUsecase(paymentId, paymentData = {}) {
    try {
      if (!paymentId) {
        return {
          success: false,
          error: 'Payment ID is required'
        };
      }

      // Get payment details
      const paymentResult = await PaymentDatasource.getPaymentById(paymentId);
      if (!paymentResult.success) {
        return paymentResult;
      }

      const payment = paymentResult.data;

      // Check if payment is already completed
      if (payment.isCompleted()) {
        return {
          success: false,
          error: 'Payment is already completed'
        };
      }

      // Mark payment as completed
      const result = await PaymentDatasource.markPaymentCompleted(paymentId, paymentData);

      if (result.success) {
        // Update corresponding fee record if fee_id exists
        if (payment.fee_id) {
          try {
            await FeesDatasource.markFeePaid(payment.fee_id, {
              payment_id: paymentId,
              payment_date: new Date().toISOString(),
              payment_method: payment.payment_method,
              transaction_id: paymentData.transaction_id || payment.transaction_id
            });
          } catch (feeError) {
            console.error('Error updating fee record:', feeError);
            // Don't fail the payment completion if fee update fails
          }
        }

        toast.success('Payment completed successfully');
        return {
          success: true,
          data: result.data,
          message: 'Payment completed successfully'
        };
      } else {
        toast.error(result.error || 'Failed to complete payment');
        return result;
      }
    } catch (error) {
      console.error('PaymentUsecase.processPaymentCompletionUsecase error:', error);
      toast.error('An error occurred while processing payment');
      return {
        success: false,
        error: error.message || 'Failed to process payment completion'
      };
    }
  }

  /**
   * Process payment failure
   * @param {string} paymentId - Payment ID
   * @param {string} failureReason - Reason for failure
   * @param {Object} gatewayResponse - Gateway response data
   * @returns {Object} Result with success/error status
   */
  static async processPaymentFailureUsecase(paymentId, failureReason, gatewayResponse = {}) {
    try {
      if (!paymentId || !failureReason) {
        return {
          success: false,
          error: 'Payment ID and failure reason are required'
        };
      }

      const result = await PaymentDatasource.updatePaymentStatus(paymentId, 'failed', {
        failure_reason: failureReason,
        gateway_response: gatewayResponse
      });

      if (result.success) {
        toast.error(`Payment failed: ${failureReason}`);
        return {
          success: true,
          data: result.data,
          message: 'Payment failure recorded'
        };
      } else {
        toast.error(result.error || 'Failed to record payment failure');
        return result;
      }
    } catch (error) {
      console.error('PaymentUsecase.processPaymentFailureUsecase error:', error);
      toast.error('An error occurred while processing payment failure');
      return {
        success: false,
        error: error.message || 'Failed to process payment failure'
      };
    }
  }

  // ==================== PAYMENT RETRIEVAL ====================

  /**
   * Get user payments with enhanced data
   * @param {string} userId - User ID
   * @returns {Object} Array of payments with additional info
   */
  static async getUserPaymentsUsecase(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const result = await PaymentDatasource.getUserPayments(userId);

      if (result.success) {
        // Enhance payment data with additional information
        const enhancedPayments = result.data.map(payment => ({
          ...payment.toJSON(),
          formatted_amount: payment.getFormattedAmount(),
          formatted_payment_date: payment.getFormattedPaymentDate(),
          formatted_due_date: payment.getFormattedDueDate(),
          payment_method_text: payment.getPaymentMethodText(),
          payment_status_text: payment.getPaymentStatusText(),
          installment_text: payment.getInstallmentText(),
          is_overdue: payment.isOverdue(),
          status_color: this.getStatusColor(payment.payment_status)
        }));

        return {
          success: true,
          data: enhancedPayments
        };
      } else {
        toast.error(result.error || 'Failed to fetch payments');
        return result;
      }
    } catch (error) {
      console.error('PaymentUsecase.getUserPaymentsUsecase error:', error);
      toast.error('An error occurred while fetching payments');
      return {
        success: false,
        error: error.message || 'Failed to fetch user payments'
      };
    }
  }

  /**
   * Get payment summary with analytics
   * @param {string} userId - User ID
   * @returns {Object} Payment summary with analytics
   */
  static async getPaymentSummaryUsecase(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const [summaryResult, overdueResult, nextDueResult] = await Promise.all([
        PaymentDatasource.getPaymentSummary(userId),
        PaymentDatasource.getOverduePayments(userId),
        PaymentDatasource.getNextDuePayment(userId)
      ]);

      if (summaryResult.success) {
        const summary = summaryResult.data;
        const overduePayments = overdueResult.success ? overdueResult.data : [];
        const nextDuePayment = nextDueResult.success ? nextDueResult.data : null;

        const enhancedSummary = {
          ...summary,
          formatted_total_amount: this.formatAmount(summary.total_amount),
          formatted_completed_amount: this.formatAmount(summary.completed_amount),
          formatted_pending_amount: this.formatAmount(summary.pending_amount),
          completion_percentage: summary.total_amount > 0 ? 
            Math.round((summary.completed_amount / summary.total_amount) * 100) : 0,
          overdue_count: overduePayments.length,
          overdue_amount: overduePayments.reduce((sum, payment) => sum + payment.amount, 0),
          next_due_payment: nextDuePayment ? {
            ...nextDuePayment.toJSON(),
            formatted_amount: nextDuePayment.getFormattedAmount(),
            formatted_due_date: nextDuePayment.getFormattedDueDate(),
            days_until_due: this.getDaysUntilDue(nextDuePayment.due_date)
          } : null
        };

        return {
          success: true,
          data: enhancedSummary
        };
      } else {
        toast.error(summaryResult.error || 'Failed to fetch payment summary');
        return summaryResult;
      }
    } catch (error) {
      console.error('PaymentUsecase.getPaymentSummaryUsecase error:', error);
      toast.error('An error occurred while fetching payment summary');
      return {
        success: false,
        error: error.message || 'Failed to fetch payment summary'
      };
    }
  }

  /**
   * Get payments grouped by course with analytics
   * @param {string} userId - User ID
   * @returns {Object} Payments grouped by course with analytics
   */
  static async getPaymentsGroupedByCourseUsecase(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const result = await PaymentDatasource.getPaymentsGroupedByCourse(userId);

      if (result.success) {
        const enhancedData = {};

        Object.keys(result.data).forEach(courseId => {
          const courseData = result.data[courseId];
          const payments = courseData.payments;

          const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
          const completedAmount = payments
            .filter(p => p.isCompleted())
            .reduce((sum, payment) => sum + payment.amount, 0);
          const pendingAmount = payments
            .filter(p => p.isPending())
            .reduce((sum, payment) => sum + payment.amount, 0);

          enhancedData[courseId] = {
            course: courseData.course,
            payments: payments.map(payment => ({
              ...payment.toJSON(),
              formatted_amount: payment.getFormattedAmount(),
              formatted_payment_date: payment.getFormattedPaymentDate(),
              formatted_due_date: payment.getFormattedDueDate(),
              payment_status_text: payment.getPaymentStatusText(),
              installment_text: payment.getInstallmentText(),
              is_overdue: payment.isOverdue(),
              status_color: this.getStatusColor(payment.payment_status)
            })),
            analytics: {
              total_payments: payments.length,
              completed_payments: payments.filter(p => p.isCompleted()).length,
              pending_payments: payments.filter(p => p.isPending()).length,
              total_amount: totalAmount,
              completed_amount: completedAmount,
              pending_amount: pendingAmount,
              formatted_total_amount: this.formatAmount(totalAmount),
              formatted_completed_amount: this.formatAmount(completedAmount),
              formatted_pending_amount: this.formatAmount(pendingAmount),
              completion_percentage: totalAmount > 0 ? 
                Math.round((completedAmount / totalAmount) * 100) : 0
            }
          };
        });

        return {
          success: true,
          data: enhancedData
        };
      } else {
        toast.error(result.error || 'Failed to fetch course payments');
        return result;
      }
    } catch (error) {
      console.error('PaymentUsecase.getPaymentsGroupedByCourseUsecase error:', error);
      toast.error('An error occurred while fetching course payments');
      return {
        success: false,
        error: error.message || 'Failed to fetch payments grouped by course'
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get status color for UI display
   * @param {string} status - Payment status
   * @returns {string} Color code
   */
  static getStatusColor(status) {
    const colorMap = {
      'pending': '#fbbf24',      // yellow
      'processing': '#3b82f6',   // blue
      'completed': '#10b981',    // green
      'failed': '#ef4444',       // red
      'cancelled': '#6b7280',    // gray
      'refunded': '#8b5cf6'      // purple
    };
    return colorMap[status] || '#6b7280';
  }

  /**
   * Format amount for display
   * @param {number} amount - Amount to format
   * @returns {string} Formatted amount
   */
  static formatAmount(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  static formatDate(dateString) {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN');
  }

  /**
   * Get days until due date
   * @param {string} dueDate - Due date string
   * @returns {number} Days until due (negative if overdue)
   */
  static getDaysUntilDue(dueDate) {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get payment method display text
   * @param {string} method - Payment method
   * @returns {string} Display text
   */
  static getPaymentMethodText(method) {
    const methodMap = {
      'online': 'Online Payment',
      'offline': 'Offline Payment',
      'cash': 'Cash Payment',
      'cheque': 'Cheque Payment',
      'bank_transfer': 'Bank Transfer',
      'upi': 'UPI Payment',
      'card': 'Card Payment'
    };
    return methodMap[method] || method;
  }

  /**
   * Get payment type display text
   * @param {string} type - Payment type
   * @returns {string} Display text
   */
  static getPaymentTypeText(type) {
    const typeMap = {
      'full': 'Full Payment',
      'emi': 'EMI Payment',
      'partial': 'Partial Payment'
    };
    return typeMap[type] || type;
  }

  /**
   * Calculate EMI amount
   * @param {number} totalAmount - Total amount
   * @param {number} months - Number of months
   * @returns {number} EMI amount
   */
  static calculateEMIAmount(totalAmount, months) {
    return Math.ceil(totalAmount / months);
  }

  /**
   * Validate payment data
   * @param {Object} paymentData - Payment data to validate
   * @returns {Object} Validation result
   */
  static validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.user_id) {
      errors.push('User ID is required');
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Valid amount is required');
    }

    if (!paymentData.payment_method) {
      errors.push('Payment method is required');
    }

    const validMethods = ['online', 'offline', 'cash', 'cheque', 'bank_transfer', 'upi', 'card'];
    if (paymentData.payment_method && !validMethods.includes(paymentData.payment_method)) {
      errors.push('Invalid payment method');
    }

    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
    if (paymentData.payment_status && !validStatuses.includes(paymentData.payment_status)) {
      errors.push('Invalid payment status');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default PaymentUsecase;
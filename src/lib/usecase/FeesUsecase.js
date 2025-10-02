import FeesDatasource from '../datasource/FeesDatasource';
import { toast } from 'react-toastify';

/**
 * FeesUsecase
 * Business logic layer for fees operations
 */
export class FeesUsecase {

  // ==================== ENROLLMENT FEES ====================

  /**
   * Create fees entries when user enrolls in a course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {Object} courseData - Course information
   * @param {string} paymentType - 'full' or 'emi'
   * @param {number} amount - Course amount
   * @param {string} mode - 'online' or 'offline'
   * @param {number} emiMonths - Number of EMI months (default 6)
   */
  static async createEnrollmentFeesUsecase(userId, courseId, courseData, paymentType, amount, mode, emiMonths = 6) {
    try {
      // Validate inputs
      if (!userId || !courseId || !courseData || !paymentType || !amount) {
        return {
          success: false,
          error: 'Missing required parameters for fee creation'
        };
      }

      if (paymentType === 'emi' && (!emiMonths || emiMonths < 2)) {
        return {
          success: false,
          error: 'EMI months must be at least 2'
        };
      }

      // Create fees entries
      const result = await FeesDatasource.createFeesForEnrollment(
        userId, 
        courseId, 
        courseData, 
        paymentType, 
        amount, 
        mode, 
        emiMonths
      );

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to create fees entries'
        };
      }

      // Show success message
      if (paymentType === 'full') {
        toast.success('Course enrolled successfully with full payment!');
      } else {
        toast.success(`Course enrolled successfully! First EMI paid, ${emiMonths - 1} installments remaining.`);
      }

      return {
        success: true,
        data: result.data,
        message: paymentType === 'full' 
          ? 'Full payment completed successfully' 
          : `First EMI paid successfully. ${emiMonths - 1} installments remaining.`
      };

    } catch (error) {
      console.error('Error in createEnrollmentFeesUsecase:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while creating fees'
      };
    }
  }

  // ==================== FEES RETRIEVAL ====================

  /**
   * Get fees summary for student dashboard
   */
  static async getFeesSummaryUsecase(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const result = await FeesDatasource.getFeesSummary(userId);

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to fetch fees summary'
        };
      }

      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('Error in getFeesSummaryUsecase:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while fetching fees summary'
      };
    }
  }

  /**
   * Get all fees for a user (for detailed view)
   */
  static async getUserFeesUsecase(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const result = await FeesDatasource.getUserFees(userId);

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to fetch user fees'
        };
      }

      const fees = (result.data || []).map(fee => ({
        ...fee,
        // Map database fields to UI expected fields
        course_title: fee.course_name,
        mode: fee.course_mode,
        amount: fee.installment_amount
      }));
      
      // Calculate summary
      const summary = {
        total_amount: fees.reduce((sum, fee) => sum + fee.installment_amount, 0),
        paid_amount: fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.installment_amount, 0),
        pending_amount: fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue').reduce((sum, fee) => sum + fee.installment_amount, 0)
      };

      return {
        success: true,
        data: {
          fees: fees,
          summary: summary
        }
      };

    } catch (error) {
      console.error('Error in getUserFeesUsecase:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while fetching fees'
      };
    }
  }

  /**
   * Get fees grouped by course
   */
  static async getFeesGroupedByCourseUsecase(userId) {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      const result = await FeesDatasource.getFeesGroupedByCourse(userId);

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to fetch grouped fees'
        };
      }

      return {
        success: true,
        data: result.data || []
      };

    } catch (error) {
      console.error('Error in getFeesGroupedByCourseUsecase:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while fetching grouped fees'
      };
    }
  }

  // ==================== PAYMENT OPERATIONS ====================

  /**
   * Mark a fee installment as paid
   */
  static async markFeePaidUsecase(feeId, paymentData = {}) {
    try {
      if (!feeId) {
        return {
          success: false,
          error: 'Fee ID is required'
        };
      }

      const result = await FeesDatasource.markFeePaid(feeId, paymentData);

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to mark fee as paid'
        };
      }

      toast.success('Payment recorded successfully!');

      return {
        success: true,
        data: result.data,
        message: 'Payment recorded successfully'
      };

    } catch (error) {
      console.error('Error in markFeePaidUsecase:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while recording payment'
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get status badge color for fee status
   */
  static getStatusBadgeColor(status) {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  /**
   * Format fee amount for display
   */
  static formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format date for display
   */
  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Check if a fee is overdue
   */
  static isOverdue(dueDate, status) {
    if (status === 'paid') return false;
    return new Date(dueDate) < new Date();
  }

  /**
   * Get next due installment from fees list
   */
  static getNextDueInstallment(fees) {
    if (!fees || fees.length === 0) return null;

    const pendingFees = fees.filter(fee => fee.status === 'pending');
    if (pendingFees.length === 0) return null;

    // Sort by due date and return the earliest
    return pendingFees.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];
  }

  /**
   * Calculate EMI amount based on total amount and months
   */
  static calculateEMIAmount(totalAmount, months) {
    return Math.ceil(totalAmount / months);
  }

  /**
   * Get payment type display text
   */
  static getPaymentTypeText(paymentType) {
    switch (paymentType) {
      case 'full':
        return 'Full Payment';
      case 'emi':
        return 'EMI';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get course mode display text
   */
  static getCourseModeText(mode) {
    switch (mode) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  }
}

export default FeesUsecase;
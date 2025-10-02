import { supabase } from '../supabase';

/**
 * FeesDatasource
 * Handles all fees-related data operations with Supabase
 */
export class FeesDatasource {

  // ==================== FEES CREATION ====================

  /**
   * Create fees entries for course enrollment
   * Supports both full payment and EMI payment options
   * 
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {object} courseData - Course information
   * @param {string} paymentType - 'full' or 'emi'
   * @param {number} totalAmount - Total course amount
   * @param {string} mode - 'online' or 'offline'
   * @param {number} emiMonths - Number of EMI months (for EMI payment)
   */
  static async createFeesForEnrollment(userId, courseId, courseData, paymentType, totalAmount, mode, emiMonths = 1) {
    try {
      // Validate that user exists in user_profiles table
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError || !userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }

      // Validate that course exists in courses table
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('id', courseId)
        .single();

      if (courseError || !course) {
        throw new Error(`Course not found for course ID: ${courseId}`);
      }

      const feesEntries = [];
      
      if (paymentType === 'full') {
        // Create single entry for full payment
        feesEntries.push({
          user_id: userId,
          course_id: courseId,
          total_amount: totalAmount,
          installment_amount: totalAmount,
          installment_number: 1,
          total_installments: 1,
          status: 'paid', // Mark as paid for full payment
          payment_type: 'full',
          due_date: new Date().toISOString().split('T')[0],
          paid_date: new Date().toISOString(),
          course_name: course.title,
          course_mode: mode,
          payment_method: 'online', // Default for now
          notes: 'Full payment on enrollment'
        });
      } else {
        // Create multiple entries for EMI
        const installmentAmount = Math.ceil(totalAmount / emiMonths);
        
        for (let i = 1; i <= emiMonths; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i - 1);
          
          const isFirstInstallment = i === 1;
          
          feesEntries.push({
            user_id: userId,
            course_id: courseId,
            total_amount: totalAmount,
            installment_amount: installmentAmount,
            installment_number: i,
            total_installments: emiMonths,
            status: isFirstInstallment ? 'paid' : 'pending',
            payment_type: 'emi',
            due_date: dueDate.toISOString().split('T')[0],
            paid_date: isFirstInstallment ? new Date().toISOString() : null,
            course_name: course.title,
            course_mode: mode,
            payment_method: isFirstInstallment ? 'online' : null,
            notes: isFirstInstallment ? 'First EMI payment on enrollment' : `EMI ${i} of ${emiMonths}`
          });
        }
      }

      const { data, error } = await supabase
        .from('fees')
        .insert(feesEntries)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating fees entries:', error);
      return { data: null, error };
    }
  }

  // ==================== FEES RETRIEVAL ====================

  /**
   * Get all fees for a user
   */
  static async getUserFees(userId) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user fees:', error);
      return { data: null, error };
    }
  }

  /**
   * Get fees for a specific course
   */
  static async getCourseFees(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('installment_number', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching course fees:', error);
      return { data: null, error };
    }
  }

  /**
   * Get pending fees for a user
   */
  static async getPendingFees(userId) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching pending fees:', error);
      return { data: null, error };
    }
  }

  /**
   * Get fees summary for dashboard
   */
  static async getFeesSummary(userId) {
    try {
      const { data: allFees, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!allFees || allFees.length === 0) {
        return {
          data: {
            totalFees: 0,
            paidAmount: 0,
            pendingAmount: 0,
            overdueAmount: 0,
            totalInstallments: 0,
            paidInstallments: 0,
            pendingInstallments: 0,
            nextDueDate: null,
            nextDueAmount: 0
          },
          error: null
        };
      }

      const totalFees = allFees.reduce((sum, fee) => sum + fee.installment_amount, 0);
      const paidFees = allFees.filter(fee => fee.status === 'paid');
      const pendingFees = allFees.filter(fee => fee.status === 'pending');
      const overdueFees = allFees.filter(fee => 
        fee.status === 'pending' && new Date(fee.due_date) < new Date()
      );

      const paidAmount = paidFees.reduce((sum, fee) => sum + fee.installment_amount, 0);
      const pendingAmount = pendingFees.reduce((sum, fee) => sum + fee.installment_amount, 0);
      const overdueAmount = overdueFees.reduce((sum, fee) => sum + fee.installment_amount, 0);

      // Find next due installment
      const nextDue = pendingFees
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];

      return {
        data: {
          totalFees,
          paidAmount,
          pendingAmount,
          overdueAmount,
          totalInstallments: allFees.length,
          paidInstallments: paidFees.length,
          pendingInstallments: pendingFees.length,
          nextDueDate: nextDue?.due_date || null,
          nextDueAmount: nextDue?.installment_amount || 0,
          fees: allFees
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching fees summary:', error);
      return { data: null, error };
    }
  }

  // ==================== FEES UPDATES ====================

  /**
   * Mark a fee installment as paid
   */
  static async markFeePaid(feeId, paymentData = {}) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          payment_method: paymentData.method || 'online',
          transaction_id: paymentData.transactionId || null,
          payment_gateway_response: paymentData.gatewayResponse || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', feeId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking fee as paid:', error);
      return { data: null, error };
    }
  }

  /**
   * Update fee status (paid, pending, overdue, cancelled)
   */
  static async updateFeeStatus(feeId, status, notes = null) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updateData.notes = notes;
      }

      if (status === 'paid') {
        updateData.paid_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('fees')
        .update(updateData)
        .eq('id', feeId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating fee status:', error);
      return { data: null, error };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user has any pending fees
   */
  static async hasPendingFees(userId) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .limit(1);

      if (error) throw error;
      return { data: data && data.length > 0, error: null };
    } catch (error) {
      console.error('Error checking pending fees:', error);
      return { data: false, error };
    }
  }

  /**
   * Get overdue fees
   */
  static async getOverdueFees(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .lt('due_date', today)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching overdue fees:', error);
      return { data: null, error };
    }
  }

  /**
   * Get fees grouped by course
   */
  static async getFeesGroupedByCourse(userId) {
    try {
      const { data: fees, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId)
        .order('course_name', { ascending: true });

      if (error) throw error;

      // Group fees by course
      const groupedFees = fees.reduce((acc, fee) => {
        const courseKey = fee.course_id;
        if (!acc[courseKey]) {
          acc[courseKey] = {
            courseId: fee.course_id,
            courseName: fee.course_name,
            courseMode: fee.course_mode,
            totalAmount: fee.total_amount,
            paymentType: fee.payment_type,
            fees: []
          };
        }
        acc[courseKey].fees.push(fee);
        return acc;
      }, {});

      return { data: Object.values(groupedFees), error: null };
    } catch (error) {
      console.error('Error fetching grouped fees:', error);
      return { data: null, error };
    }
  }
}

export default FeesDatasource;
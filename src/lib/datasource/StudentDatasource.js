import { supabase } from '../supabase';
import { StudentAuthDataSource } from './StudentAuthDatasource';
/**
 * StudentDatasource
 * Handles all student-related data operations with Supabase
 */
export class StudentDatasource {

  // ==================== STUDENT PROFILE ====================

  /**
   * Get student profile with additional details
   */
  static async getStudentProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .eq('role', 'student')
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching student profile:', error);
      return { data: null, error };
    }
  }

  /**
   * Update student profile
   */
  static async updateStudentProfile(userId, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .eq('role', 'student')
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating student profile:', error);
      return { data: null, error };
    }
  }

  // ==================== COURSE ENROLLMENTS ====================

  /**
   * Get all course enrollments for a student with course details
   */
  static async getStudentEnrollments(userId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            price,
            duration,
            level,
            category,
            image_url,
            instructor_id,
            user_profiles!courses_instructor_id_fkey (
              full_name
            )
          )
        `)
        .eq('user_id', userId)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return { data: null, error };
    }
  }

  /**
   * Get specific enrollment details
   */
  static async getEnrollmentDetails(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            price,
            duration,
            level,
            category,
            image_url
          )
        `)
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
      return { data: null, error };
    }
  }

  /**
   * Create fee records based on payment type
   */
  static async createFeeRecords(userId, courseId, enrollmentId, courseData, enrollmentData, firstPaid = false) {
    try {
      const paymentType = enrollmentData.payment_type || 'full';
      const totalAmount = enrollmentData.price_paid || courseData.price || 0;
      const courseName = courseData.title;
      const courseMode = enrollmentData.enrollment_mode || 'online';

      const feeRecords = [];

      if (paymentType === 'emi') {
        // For EMI, divide the amount into monthly installments
        // Default to 6 months if not specified, but allow customization
        const emiMonths = enrollmentData.emi_months || 6;
        const installmentAmount = Math.ceil(totalAmount / emiMonths);

        for (let i = 1; i <= emiMonths; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i - 1); // First installment due immediately

          feeRecords.push({
            user_id: userId,
            course_id: courseId,
            enrollment_id: enrollmentId,
            total_amount: totalAmount,
            installment_amount: installmentAmount,
            installment_number: i,
            total_installments: emiMonths,
            status: i === 1 && firstPaid ? 'paid' : 'pending',
            payment_type: 'emi',
            due_date: dueDate.toISOString().split('T')[0],
            course_name: courseName,
            course_mode: courseMode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else {
        // For full payment, create a single fee record
        const dueDate = new Date();

        feeRecords.push({
          user_id: userId,
          course_id: courseId,
          enrollment_id: enrollmentId,
          total_amount: totalAmount,
          installment_amount: totalAmount,
          installment_number: 1,
          total_installments: 1,
          status: firstPaid ? 'paid' : 'pending',
          payment_type: 'full',
          due_date: dueDate.toISOString().split('T')[0],
          course_name: courseName,
          course_mode: courseMode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      // Insert all fee records
      const { data, error } = await supabase
        .from('fees')
        .insert(feeRecords)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating fee records:', error);
      return { data: null, error };
    }
  }

  /**
   * Enroll a student in a course
   */
  static async enrollCourse(userId, courseId, enrollmentData = {}, firstPaid = false) {
    try {
      userId = userId || StudentAuthDataSource.getUserFromStorage().id;
      // Check if user is already enrolled in this course
      const { data: existingEnrollment, error: checkError } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingEnrollment) {
        return {
          data: null,
          error: { message: 'You are already enrolled in this course' }
        };
      }

      // Get course details to set price_paid
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('price, title, duration')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      const enrollmentRecord = {
        user_id: userId,
        course_id: courseId,
        enrollment_mode: enrollmentData.enrollment_mode || 'online',
        price_paid: enrollmentData.price_paid || courseData.price || 0,
        enrollment_date: new Date().toISOString(),
        progress: 0,
        progress_percentage: 0,
        completed_lessons: 0,
        status: 'active',
        updated_at: new Date().toISOString()
      };

      // Create the enrollment record first
      const { data: enrollmentResult, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert(enrollmentRecord)
        .select(`
          *,
          courses (
            id,
            title,
            description,
            price,
            duration,
            level,
            category,
            image_url,
            instructor_id,
            user_profiles!courses_instructor_id_fkey (
              full_name
            )
          )
        `)
        .single();

      if (enrollmentError) throw enrollmentError;

      // Create fee records based on payment type
      const feeResult = await this.createFeeRecords(
        userId,
        courseId,
        enrollmentResult.id,
        courseData,
        enrollmentData,
        firstPaid
      );

      if (feeResult.error) {
        console.error('Error creating fee records:', feeResult.error);
        // Note: We don't fail the enrollment if fee creation fails
        // but we log the error for debugging
      }

      return {
        data: {
          ...enrollmentResult,
          fees: feeResult.data || []
        },
        error: null
      };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return { data: null, error };
    }
  }

  /**
   * Update course progress
   */
  static async updateCourseProgress(userId, courseId, progressData) {
    try {
      const updates = {
        ...progressData,
        updated_at: new Date().toISOString()
      };

      // If progress reaches 100%, mark as completed
      if (progressData.progress >= 100 || progressData.progress_percentage >= 100) {
        updates.status = 'completed';
        updates.completion_date = new Date().toISOString();
        updates.progress = 100;
        updates.progress_percentage = 100;
      }

      const { data, error } = await supabase
        .from('course_enrollments')
        .update(updates)
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating course progress:', error);
      return { data: null, error };
    }
  }

  // ==================== CERTIFICATES ====================

  /**
   * Get all certificates for a student
   */
  static async getStudentCertificates(userId) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .eq('is_valid', true)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching student certificates:', error);
      return { data: null, error };
    }
  }

  /**
   * Get certificate by course
   */
  static async getCertificateByCourse(userId, courseId) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('is_valid', true)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return { data: null, error };
    }
  }

  /**
   * Log certificate download
   */
  static async logCertificateDownload(userId, certificateId, phoneNumber, dateOfBirth) {
    try {
      const { data, error } = await supabase
        .from('certificate_downloads')
        .insert({
          user_id: userId,
          certificate_id: certificateId,
          phone_number: phoneNumber,
          date_of_birth: dateOfBirth,
          download_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error logging certificate download:', error);
      return { data: null, error };
    }
  }

  // ==================== DASHBOARD STATISTICS ====================

  /**
   * Get comprehensive dashboard statistics for a student
   */
  static async getDashboardStats(userId) {
    try {
      // Get enrollment statistics
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('status, progress, progress_percentage, enrollment_date, completion_date')
        .eq('user_id', userId);

      if (enrollmentError) throw enrollmentError;

      // Get certificate count
      const { data: certificates, error: certError } = await supabase
        .from('certificates')
        .select('id')
        .eq('user_id', userId)
        .eq('is_valid', true);

      if (certError) throw certError;

      // Calculate statistics
      const totalCourses = enrollments?.length || 0;
      const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0;
      const inProgressCourses = enrollments?.filter(e => e.status === 'active' && e.progress > 0).length || 0;
      const totalCertificates = certificates?.length || 0;

      // Calculate average progress
      const activeEnrollments = enrollments?.filter(e => e.status === 'active') || [];
      const averageProgress = activeEnrollments.length > 0
        ? activeEnrollments.reduce((sum, e) => sum + (e.progress_percentage || e.progress || 0), 0) / activeEnrollments.length
        : 0;

      return {
        data: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          totalCertificates,
          averageProgress: Math.round(averageProgress),
          enrollments,
          recentActivity: this.generateRecentActivity(enrollments)
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error };
    }
  }

  /**
   * Generate recent activity from enrollments
   */
  static generateRecentActivity(enrollments) {
    if (!enrollments || enrollments.length === 0) return [];

    const activities = [];

    // Add completion activities
    enrollments
      .filter(e => e.completion_date)
      .sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date))
      .slice(0, 3)
      .forEach(enrollment => {
        activities.push({
          type: 'completion',
          title: 'Course Completed',
          description: `Completed course with ${enrollment.progress}% progress`,
          date: enrollment.completion_date,
          icon: 'FaCheckCircle',
          color: 'success'
        });
      });

    // Add enrollment activities
    enrollments
      .sort((a, b) => new Date(b.enrollment_date) - new Date(a.enrollment_date))
      .slice(0, 2)
      .forEach(enrollment => {
        activities.push({
          type: 'enrollment',
          title: 'Course Enrolled',
          description: `Started new learning journey`,
          date: enrollment.enrollment_date,
          icon: 'FaBook',
          color: 'primary'
        });
      });

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }

  // ==================== FEES AND PAYMENTS ====================

  /**
   * Get fees summary for a student
   * Note: This creates a mock fees structure based on enrollments
   * In a real application, you would have a separate fees/payments table
   */
  static async getFeesData(userId) {
    try {
      // Fetch all fee records for the user
      const { data: fees, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      if (!fees || fees.length === 0) {
        return {
          data: {
            fees: [],
            summary: {
              total_amount: 0,
              paid_amount: 0,
              pending_amount: 0,
              total_installments: 0,
              paid_installments: 0,
              pending_installments: 0
            }
          },
          error: null
        };
      }

      // Calculate summary statistics
      const totalAmount = fees.reduce((sum, fee) => sum + (fee.installment_amount || 0), 0);
      const paidAmount = fees
        .filter(fee => fee.status === 'paid')
        .reduce((sum, fee) => sum + (fee.installment_amount || 0), 0);
      const pendingAmount = totalAmount - paidAmount;

      const totalInstallments = fees.length;
      const paidInstallments = fees.filter(fee => fee.status === 'paid').length;
      const pendingInstallments = totalInstallments - paidInstallments;

      // Transform fees data for frontend consumption
      const transformedFees = fees.map(fee => ({
        id: fee.id,
        course_title: fee.course_name,
        mode: fee.course_mode,
        installment_number: fee.installment_number,
        total_installments: fee.total_installments,
        amount: fee.installment_amount,
        total_amount: fee.total_amount,
        due_date: fee.due_date,
        paid_date: fee.paid_date,
        status: fee.status,
        payment_type: fee.payment_type,
        payment_method: fee.payment_method,
        transaction_id: fee.transaction_id,
        notes: fee.notes,
        created_at: fee.created_at,
        updated_at: fee.updated_at
      }));

      return {
        data: {
          fees: transformedFees,
          summary: {
            total_amount: totalAmount,
            paid_amount: paidAmount,
            pending_amount: pendingAmount,
            total_installments: totalInstallments,
            paid_installments: paidInstallments,
            pending_installments: pendingInstallments
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching fees data:', error);
      return { data: null, error };
    }
  }

  /**
   * Generate mock installments for demo purposes
   */

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user has any active enrollments
   */
  static async hasActiveEnrollments(userId) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(1);

      if (error) throw error;
      return { hasActive: data && data.length > 0, error: null };
    } catch (error) {
      console.error('Error checking active enrollments:', error);
      return { hasActive: false, error };
    }
  }

  /**
   * Get next due installment
   */
  static getNextDueInstallment(installments) {
    if (!installments || installments.length === 0) return null;

    return installments
      .filter(inst => inst.status === 'pending')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0] || null;
  }
}

export default StudentDatasource;
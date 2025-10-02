import { supabase } from '../supabase';

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
        .single();

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
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
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
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching enrollment details:', error);
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
        .single();

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
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            title,
            price
          )
        `)
        .eq('user_id', userId)
        .eq('enrollment_mode', 'offline'); // Only offline courses have installment fees

      if (error) throw error;

      if (!enrollments || enrollments.length === 0) {
        return {
          data: {
            totalFees: 0,
            paidAmount: 0,
            pendingAmount: 0,
            installments: [],
            hasOfflineCourses: false
          },
          error: null
        };
      }

      // Calculate total fees from offline enrollments
      const totalFees = enrollments.reduce((sum, enrollment) => sum + (enrollment.price_paid || 0), 0);
      
      // For demo purposes, assume 60% is paid and 40% is pending
      const paidAmount = Math.floor(totalFees * 0.6);
      const pendingAmount = totalFees - paidAmount;

      // Generate mock installments
      const installments = this.generateMockInstallments(totalFees, paidAmount);

      return {
        data: {
          totalFees,
          paidAmount,
          pendingAmount,
          installments,
          hasOfflineCourses: true,
          enrollments
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
  static generateMockInstallments(totalFees, paidAmount) {
    const installmentAmount = Math.floor(totalFees / 5); // 5 installments
    const installments = [];
    
    for (let i = 1; i <= 5; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i - 1);
      
      const isPaid = (i * installmentAmount) <= paidAmount;
      
      installments.push({
        id: i,
        amount: installmentAmount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: isPaid ? 'paid' : 'pending',
        paidDate: isPaid ? new Date(dueDate.getTime() - 86400000 * 2).toISOString().split('T')[0] : null
      });
    }

    return installments;
  }

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
import { supabase } from '../supabase';

export class AdminDatasource {

  /**
   * Admin login with email and password using dedicated admin_user table
   */
  static async adminLogin(email, password) {
    try {
      console.log('🔐 AdminDatasource: Attempting admin login for:', email);

      // Use the verify_admin_password function to authenticate
      const { data: adminData, error: adminError } = await supabase
        .rpc('verify_admin_password', {
          p_email: email,
          p_password: password
        });

      if (adminError) {
        console.error('❌ Admin verification error:', adminError);
        // Handle failed login attempt
        await supabase.rpc('handle_admin_failed_login', { p_email: email });
        throw new Error('Invalid admin credentials');
      }

      if (!adminData || adminData.length === 0) {
        console.error('❌ No admin user found or invalid credentials');
        // Handle failed login attempt
        await supabase.rpc('handle_admin_failed_login', { p_email: email });
        throw new Error('Invalid admin credentials');
      }

      const admin = adminData[0];

      // Update last login timestamp
      await supabase.rpc('update_admin_last_login', { p_admin_id: admin.admin_id });

      // Create a session token for the admin
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

      // Store session in admin_sessions table
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: admin.admin_id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        console.warn('⚠️ Failed to create admin session record:', sessionError);
      }

      console.log('✅ Admin login successful');
      
      return {
        success: true,
        user: {
          id: admin.admin_id,
          email: admin.email,
          full_name: admin.full_name,
          phone_number: admin.phone_number,
          role: admin.role,
          last_login: admin.last_login
        },
        sessionToken: sessionToken,
        expiresAt: expiresAt
      };

    } catch (error) {
      console.error('❌ AdminDatasource login error:', error);
      throw error;
    }
  }

  /**
   * Change admin password using admin_user table
   */
  static async changePassword(adminId, currentPassword, newPassword) {
    try {
      console.log('🔐 AdminDatasource: Attempting to change admin password for ID:', adminId);

      // First verify the current password
      const { data: adminData, error: verifyError } = await supabase
        .from('admin_user')
        .select('email, password_hash')
        .eq('admin_id', adminId)
        .eq('is_active', true)
        .single();

      if (verifyError || !adminData) {
        throw new Error('Admin user not found or inactive');
      }

      // Verify current password using the verify function
      const { data: verifyResult, error: passwordError } = await supabase
        .rpc('verify_admin_password', {
          p_email: adminData.email,
          p_password: currentPassword
        });

      if (passwordError || !verifyResult || verifyResult.length === 0) {
        throw new Error('Current password is incorrect');
      }

      // Use server-side function to change password (handles hashing securely)
      const { data: changeResult, error: updateError } = await supabase
        .rpc('change_admin_password', {
          p_admin_id: adminId,
          p_new_password: newPassword
        });

      if (updateError) {
        throw new Error('Failed to update password: ' + updateError.message);
      }

      if (!changeResult) {
        throw new Error('Password change failed');
      }

      console.log('✅ Admin password changed successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ AdminDatasource changePassword error:', error);
      throw error;
    }
  }

  /**
   * Get current admin session
   */
  static async getAdminSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      if (!session) {
        return { session: null, user: null };
      }

      // Verify admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, phone')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        // Invalid admin session, sign out
        await supabase.auth.signOut();
        return { session: null, user: null };
      }

      return {
        session,
        user: {
          id: session.user.id,
          email: session.user.email,
          full_name: profile.full_name,
          phone: profile.phone,
          role: profile.role
        }
      };

    } catch (error) {
      console.error('❌ AdminDatasource session error:', error);
      throw error;
    }
  }

  /**
   * Admin logout - invalidate session
   */
  static async adminLogout(sessionToken) {
    try {
      console.log('🔐 AdminDatasource: Logging out admin');
      
      if (sessionToken) {
        // Invalidate the session in the database
        const { error } = await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);
        
        if (error) {
          console.warn('⚠️ Failed to invalidate session:', error);
        }
      }

      console.log('✅ Admin logout successful');
      return { success: true };

    } catch (error) {
      console.error('❌ AdminDatasource logout error:', error);
      throw error;
    }
  }

  /**
   * Generate a secure session token (browser-compatible)
   */
  static generateSessionToken() {
    // Generate a random token using browser-compatible methods
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto.getRandomValues
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate admin session token
   */
  static async validateSession(sessionToken) {
    try {
      const { data: session, error } = await supabase
        .from('admin_sessions')
        .select(`
          admin_user_id,
          expires_at,
          admin_user:admin_user_id (
            id,
            email,
            full_name,
            role,
            is_active
          )
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session) {
        return { valid: false };
      }

      if (!session.admin_user.is_active) {
        return { valid: false, reason: 'Admin account is inactive' };
      }

      return {
        valid: true,
        admin: {
          ...session.admin_user,
          admin_id: session.admin_user.id
        }
      };

    } catch (error) {
      console.error('❌ Session validation error:', error);
      return { valid: false };
    }
  }

  /**
   * Create a new admin user
   */
  static async createAdminUser(email, password, fullName, role = 'admin') {
    try {
      const { data, error } = await supabase
        .rpc('create_admin_user', {
          p_email: email,
          p_password: password,
          p_full_name: fullName,
          p_role: role
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, adminId: data };

    } catch (error) {
      console.error('❌ Create admin user error:', error);
      throw error;
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password) {
    if (!password || password.length < 8) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters long'
      };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter'
      };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one number'
      };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one special character (@$!%*?&)'
      };
    }

    return {
      valid: true,
      message: 'Password is strong'
    };
  }

  /**
   * Get all students for admin management
   */
  static async getAllStudents() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          email,
          phone_number,
          role,
          created_at,
          updated_at,
          date_of_birth
        `)
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Get enrollment info for each student
      const studentsWithEnrollments = await Promise.all(
        (data || []).map(async (student) => {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('course_enrollments')
            .select(`
              id,
              course_id,
              status,
              enrollment_date,
              courses (
                title
              )
            `)
            .eq('user_id', student.id);

          const enrollments = enrollmentData || [];
          const activeEnrollments = enrollments.filter(e => e.status === 'active');

          return {
            ...student,
            enrollment_count: enrollments.length,
            active_enrollments: activeEnrollments.length,
            latest_course: enrollments.length > 0 ? enrollments[0].courses?.title : null,
            is_active: activeEnrollments.length > 0
          };
        })
      );

      return { success: true, students: studentsWithEnrollments };

    } catch (error) {
      console.error('❌ AdminDatasource get students error:', error);
      throw error;
    }
  }

  /**
   * Get all enrollments for admin management
   */
  static async getAllEnrollments() {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          user_id,
          course_id,
          status,
          progress,
          enrollment_date,
          completion_date,
          user_profiles!course_enrollments_user_id_fkey (
            full_name,
            email,
            phone_number
          ),
          courses (
            title,
            category,
            price,
            level
          )
        `)
        .order('enrollment_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Transform data for better display
      const transformedEnrollments = (data || []).map(enrollment => ({
        id: enrollment.id,
        student_id: enrollment.user_id,
        course_id: enrollment.course_id,
        student_name: enrollment.user_profiles?.full_name || 'Unknown',
        student_email: enrollment.user_profiles?.email || 'Unknown',
        student_phone: enrollment.user_profiles?.phone_number || 'Unknown',
        course_title: enrollment.courses?.title || 'Unknown Course',
        course_category: enrollment.courses?.category || 'Unknown',
        course_price: enrollment.courses?.price || 0,
        course_level: enrollment.courses?.level || 'Unknown',
        enrollment_mode: 'online',
        status: enrollment.status || 'active',
        progress: enrollment.progress || 0,
        enrollment_date: enrollment.enrollment_date,
        completion_date: enrollment.completion_date,
        price_paid: 0,
        created_at: enrollment.enrollment_date,
        is_active: enrollment.status === 'active'
      }));

      return { success: true, enrollments: transformedEnrollments };

    } catch (error) {
      console.error('❌ AdminDatasource get enrollments error:', error);
      throw error;
    }
  }

  /**
   * Get all courses for admin management
   */
  static async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          category,
          level,
          duration,
          price,
          instructor_id,
          is_active,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Get enrollment counts for each course
      const coursesWithStats = await Promise.all(
        (data || []).map(async (course) => {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('course_enrollments')
            .select('id, status, progress')
            .eq('course_id', course.id);

          const enrollments = enrollmentData || [];
          const enrollmentCount = enrollments.length;
          const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
          const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
          const totalRevenue = 0; // price_paid column doesn't exist yet

          return {
            ...course,
            enrollment_count: enrollmentCount,
            active_enrollments: activeEnrollments,
            completed_enrollments: completedEnrollments,
            total_revenue: totalRevenue,
            is_active: course.is_active
          };
        })
      );

      return { success: true, courses: coursesWithStats };

    } catch (error) {
      console.error('❌ AdminDatasource get courses error:', error);
      throw error;
    }
  }

  /**
   * Get financial statistics for admin dashboard
   */
  static async getFinancialStats() {
    try {
      // Get fees data with related user and course information
      const { data: feesData, error: feesError } = await supabase
        .from('fees')
        .select(`
          id,
          installment_amount,
          status,
          due_date,
          paid_date,
          created_at,
          course_mode,
          payment_type,
          transaction_id,
          user_id,
          course_id,
          course_name,
          user_profiles!user_id (
            full_name,
            email
          ),
          courses!course_id (
            title,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (feesError) {
        console.warn('⚠️ Fees data fetch warning:', feesError);
      }

      // Calculate financial statistics
      const fees = feesData || [];
      
      // Debug logging
      console.log('🔍 Total fees records:', fees.length);
      const uniqueStatuses = [...new Set(fees.map(fee => fee.status))];
      console.log('🏷️ Unique status values:', uniqueStatuses);
      const paidFees = fees.filter(fee => fee.status === 'paid');
      console.log('💰 Paid fees count:', paidFees.length);
      
      const totalRevenue = fees
        .filter(fee => fee.status === 'paid')
        .reduce((sum, fee) => sum + (fee.installment_amount || 0), 0);

      const pendingRevenue = fees
        .filter(fee => fee.status === 'pending' || fee.status === 'overdue')
        .reduce((sum, fee) => sum + (fee.installment_amount || 0), 0);

      const onlineRevenue = fees
        .filter(fee => fee.status === 'paid' && fee.course_mode === 'online')
        .reduce((sum, fee) => sum + (fee.installment_amount || 0), 0);

      const offlineRevenue = fees
        .filter(fee => fee.status === 'paid' && fee.course_mode === 'offline')
        .reduce((sum, fee) => sum + (fee.installment_amount || 0), 0);

      // Get recent payments (last 30 days) with details
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentPaymentRecords = fees
        .filter(fee => {
          const isPaid = fee.status === 'paid';
          const dateToCheck = new Date(fee.created_at || fee.paid_date || new Date());
          const isRecent = dateToCheck >= thirtyDaysAgo;
          
          // Debug logging for first few records
          if (fees.indexOf(fee) < 3) {
            console.log(`🔍 Record ${fees.indexOf(fee) + 1}:`, {
              id: fee.id,
              status: fee.status,
              isPaid,
              created_at: fee.created_at,
              paid_date: fee.paid_date,
              dateToCheck: dateToCheck.toISOString(),
              isRecent,
              willInclude: isPaid && isRecent
            });
          }
          
          return isPaid && isRecent;
        })
        .sort((a, b) => new Date(b.paid_date || b.created_at) - new Date(a.paid_date || a.created_at)) // Sort by date descending
        .map(fee => {
          const paymentDate = new Date(fee.paid_date || fee.created_at);
          const formattedDateTime = paymentDate.toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          
          return {
            id: fee.id,
            transaction_id: fee.transaction_id || `TXN${fee.id.slice(-8)}`,
            student_name: fee.user_profiles?.full_name || 'N/A',
            student_email: fee.user_profiles?.email || 'N/A',
            course_title: fee.courses?.title || fee.course_name || 'N/A',
            amount: fee.installment_amount || 0,
            payment_mode: fee.course_mode || 'online',
            payment_type: fee.payment_type || 'N/A',
            payment_date: fee.paid_date || fee.created_at,
            payment_datetime: formattedDateTime,
            status: fee.status
          };
        })
        .slice(0, 10); // Limit to 10 recent payments

      console.log('📋 Final recent payment records:', recentPaymentRecords.length);
      recentPaymentRecords.forEach((payment, index) => {
        if (index < 3) {
          console.log(`Payment ${index + 1}:`, {
            id: payment.id,
            student: payment.student_name,
            course: payment.course_title,
            status: payment.status,
            payment_datetime: payment.payment_datetime,
            amount: payment.amount
          });
        }
      });

      const recentPaymentsTotal = recentPaymentRecords
        .reduce((sum, payment) => sum + payment.amount, 0);

      return {
        success: true,
        stats: {
          totalRevenue,
          pendingRevenue,
          onlineRevenue,
          offlineRevenue,
          recentPaymentsTotal: recentPaymentsTotal,
          totalTransactions: fees.filter(fee => fee.status === 'paid').length,
          pendingTransactions: fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue').length,
          recentPayments: recentPaymentRecords
        }
      };

    } catch (error) {
      console.error('❌ AdminDatasource get financial stats error:', error);
      return {
        success: false,
        stats: {
          totalRevenue: 0,
          pendingRevenue: 0,
          onlineRevenue: 0,
          offlineRevenue: 0,
          recentPayments: 0,
          totalTransactions: 0,
          pendingTransactions: 0,
          recentPayments: []
        }
      };
    }
  }

  /**
   * Update student status (activate/deactivate)
   */
  static async updateStudentStatus(studentId, isActive) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)
        .eq('role', 'student');

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };

    } catch (error) {
      console.error('❌ AdminDatasource update student status error:', error);
      throw error;
    }
  }

  /**
   * Get complete account statement - all paid transactions ordered by paid_date descending
   */
  static async getAccountStatement(limit = 50, offset = 0) {
    try {
      // Get all paid fees with related enrollment and course information
      const { data: feesData, error: feesError } = await supabase
        .from('fees')
        .select(`
          id,
          installment_amount,
          status,
          due_date,
          paid_date,
          course_mode,
          payment_type,
          transaction_id,
          course_enrollments!fees_enrollment_id_fkey (
            user_profiles!course_enrollments_user_id_fkey (
              full_name,
              email
            ),
            courses (
              title,
              category
            )
          )
        `)
        .not('paid_date', 'is', null) // Only get records where paid_date is not null
        .eq('status', 'paid')
        .order('paid_date', { ascending: false }) // Order by paid_date descending
        .range(offset, offset + limit - 1);

      if (feesError) {
        console.warn('⚠️ Account statement fetch warning:', feesError);
        return {
          success: false,
          error: feesError.message,
          transactions: []
        };
      }

      const fees = feesData || [];

      // Format the transactions for account statement
      const transactions = fees.map(fee => ({
        id: fee.id,
        transaction_id: fee.transaction_id || `TXN${fee.id.slice(-8)}`,
        student_name: fee.course_enrollments?.user_profiles?.full_name || 'N/A',
        student_email: fee.course_enrollments?.user_profiles?.email || 'N/A',
        course_title: fee.course_enrollments?.courses?.title || 'N/A',
        course_category: fee.course_enrollments?.courses?.category || 'N/A',
        amount: fee.installment_amount || 0,
        payment_mode: fee.payment_type || fee.course_mode || 'online',
        course_mode: fee.course_mode || 'online',
        payment_date: fee.paid_date,
        due_date: fee.due_date,
        status: fee.status
      }));

      // Calculate total amount
      const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        success: true,
        transactions,
        totalAmount,
        count: transactions.length
      };

    } catch (error) {
      console.error('❌ AdminDatasource get account statement error:', error);
      return {
        success: false,
        error: error.message,
        transactions: [],
        totalAmount: 0,
        count: 0
      };
    }
  }

}

export default AdminDatasource;
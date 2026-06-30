import { supabase } from '../supabase';

export class AdminDatasource {
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
        .eq('id', adminId)
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

  // ==================== ATTENDANCE ====================
  /**
   * Fetch attendance records for a specific date
   * @param {string} date - in `YYYY-MM-DD` format
   */
  static async getAttendanceByDate(date) {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('attendance_date', date)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { attendance: data || [], error: null };
    } catch (error) {
      console.error('❌ AdminDatasource.getAttendanceByDate error:', error);
      return { attendance: [], error };
    }
  }

  /**
   * Upsert attendance record for a user and date
   * @param {string} userId
   * @param {string} date - `YYYY-MM-DD`
   * @param {{status?: string, check_in_at?: string|null, check_out_at?: string|null, remarks?: string|null}} payload
   */
  static async upsertAttendance(userId, date, payload) {
    try {
      // Sanitize status to avoid NOT NULL and invalid enum values
      let status = payload?.status;
      const allowed = ['present', 'absent', 'late', 'excused'];
      if (!status || !allowed.includes(status)) {
        status = 'absent';
      }

      const record = {
        user_id: userId,
        attendance_date: date,
        status,
        check_in_at: payload?.check_in_at ?? null,
        check_out_at: payload?.check_out_at ?? null,
        remarks: payload?.remarks ?? null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('attendance')
        .upsert(record, { onConflict: 'user_id,attendance_date' })
        .select('*')
        .single();

      if (error) throw error;
      return { attendance: data, error: null };
    } catch (error) {
      console.error('❌ AdminDatasource.upsertAttendance error:', error);
      return { attendance: null, error };
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
      // Step 1: Get session data (this works because admin_sessions doesn't have restrictive RLS)
      const { data: session, error: sessionError } = await supabase
        .from('admin_sessions')
        .select('admin_user_id, expires_at')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (sessionError || !session) {
        return { valid: false };
      }

      // Step 2: Get admin user data by querying with the admin_user_id
      // We'll use a direct query to admin_user table, but if RLS blocks it,
      // we'll fall back to getting admin data another way
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_user')
        .select('id, email, full_name, role, is_active, last_login')
        .eq('id', session.admin_user_id)
        .eq('is_active', true)
        .single();

      if (adminError || !adminUsers) {
        // If direct query fails due to RLS, we know the session is valid
        // but we can't get admin details due to RLS policies
        // In this case, we'll return a minimal valid response
        console.warn('⚠️ Admin user query blocked by RLS, session is valid but admin details unavailable');
        return {
          valid: true,
          admin: {
            id: session.admin_user_id,
            email: 'admin@techaddaa.com', // Fallback
            full_name: 'Admin User', // Fallback
            role: 'admin', // Fallback
            is_active: true
          }
        };
      }

      return {
        valid: true,
        admin: {
          ...adminUsers
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
          image_url,
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
   * Get a single course by ID (admin)
   */
  static async getCourseById(courseId) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, course: data };
    } catch (error) {
      console.error('❌ AdminDatasource get course by id error:', error);
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
      // Load all paid fee rows. Some historical rows are marked paid but may not
      // have paid_date populated, so do not exclude them from the accounts view.
      const { data: feesData, error: feesError } = await supabase
        .from('fees')
        .select(`
          id,
          user_id,
          course_id,
          course_name,
          installment_amount,
          status,
          due_date,
          paid_date,
          created_at,
          updated_at,
          course_mode,
          payment_type,
          transaction_id,
          user_profiles!user_id (
            full_name,
            email
          ),
          courses!course_id (
            title,
            category
          )
        `)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (feesError) {
        console.warn('⚠️ Account statement fetch warning:', feesError);
        return {
          success: false,
          error: feesError.message,
          transactions: []
        };
      }

      const fees = (feesData || []).sort((a, b) => {
        const aTime = new Date(a.paid_date || a.updated_at || a.created_at || a.due_date || 0).getTime();
        const bTime = new Date(b.paid_date || b.updated_at || b.created_at || b.due_date || 0).getTime();
        return bTime - aTime;
      });

      // Format the transactions for account statement
      const transactions = fees.map(fee => ({
        id: fee.id,
        transaction_id: fee.transaction_id || `TXN${fee.id.slice(-8)}`,
        student_name: fee.user_profiles?.full_name || 'N/A',
        student_email: fee.user_profiles?.email || 'N/A',
        course_title: fee.courses?.title || fee.course_name || 'N/A',
        course_category: fee.courses?.category || 'N/A',
        amount: fee.installment_amount || 0,
        payment_mode: fee.payment_type || fee.course_mode || 'online',
        course_mode: fee.course_mode || 'online',
        payment_date: fee.paid_date || fee.updated_at || fee.created_at || fee.due_date,
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

  /**
   * Accounts: List entries from 'account' table
   */
  static async getAccounts(limit = 100, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('account')
        .select('*', { count: 'exact' })
        .order('txn_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        accounts: data || [],
        count: count || (data ? data.length : 0),
      };
    } catch (error) {
      console.error('❌ AdminDatasource getAccounts error:', error);
      return { success: false, error: error.message, accounts: [], count: 0 };
    }
  }

  /**
   * Accounts: Insert a new entry into 'account' table
   */
  static async addAccountEntry({ description, credit, txn_date, amount }) {
    try {
      if (!description || typeof credit === 'undefined' || !txn_date) {
        return { success: false, error: 'description, credit and txn_date are required' };
      }

      const payload = {
        description,
        credit: !!credit,
        txn_date,
      };

      if (typeof amount !== 'undefined') {
        const amtNum = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (Number.isNaN(amtNum)) {
          return { success: false, error: 'amount must be a valid number' };
        }
        payload.amount = amtNum;
      }

      const { data, error } = await supabase
        .from('account')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, account: data };
    } catch (error) {
      console.error('❌ AdminDatasource addAccountEntry error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new student with course enrollment
   */
  static async addStudentWithEnrollment(studentData) {
    try {
      console.log('🔄 Starting student creation with data:', {
        email: studentData.email,
        full_name: studentData.full_name,
        phone_number: studentData.phone_number,
        course_id: studentData.course_id,
        dob: studentData.dob,
        payment_mode: studentData.payment_mode
      });

      // Map form fields to database fields
      const mappedData = {
        ...studentData,
        date_of_birth: studentData.dob, // Map dob to date_of_birth
        payment_type: studentData.payment_mode, // Map payment_mode to payment_type
        price_paid: studentData.total_amount ? parseFloat(studentData.total_amount) : 0,
        emi_months: studentData.installment_count || 6,
        first_payment_made: false, // Default to false, can be updated based on form logic
        first_installment_date: studentData.first_installment_date || null // Capture first installment date if provided
      };

      // Validate required fields
      if (!mappedData.phone_number || mappedData.phone_number.trim() === '') {
        throw new Error('Phone number is required and cannot be empty');
      }

      // Check for existing users with same email or phone
      console.log('🔍 Checking for existing users...');
      const { data: existingUsers, error: checkError } = await supabase
        .from('user_profiles')
        .select('email, phone_number')
        .or(`email.eq.${mappedData.email},phone_number.eq.${mappedData.phone_number.trim()}`);

      if (checkError) {
        console.warn('⚠️ Could not check for existing users:', checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        if (existingUser.email === mappedData.email) {
          throw new Error(`A user with email ${mappedData.email} already exists`);
        }
        if (existingUser.phone_number === mappedData.phone_number.trim()) {
          throw new Error(`A user with phone number ${mappedData.phone_number} already exists`);
        }
      }

      // Generate a UUID for the student (without auth signup)
      const studentId = crypto.randomUUID();
      console.log('🆔 Generated student ID:', studentId);

      // Create the user profile directly (bypassing auth system)
      console.log('🔄 Attempting to create user profile directly...');
      const profileData = {
        id: studentId,
        full_name: mappedData.full_name || '',
        email: mappedData.email,
        phone_number: mappedData.phone_number.trim(), // Ensure NOT NULL constraint is met
        date_of_birth: mappedData.date_of_birth || null, // Include date_of_birth field
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('📝 Profile data to insert:', profileData);

      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (userError) {
        // Handle specific constraint violations
        if (userError.message.includes('user_profiles_email_key')) {
          throw new Error(`A user with email ${mappedData.email} already exists in the system`);
        }
        if (userError.message.includes('user_profiles_phone_number_key')) {
          throw new Error(`A user with phone number ${mappedData.phone_number} already exists in the system`);
        }

        // If insert fails, try to update (profile might already exist from trigger)
        console.log('❌ Profile insert failed, trying update:', userError);
        console.log('🔄 Attempting to update existing profile...');

        const updateData = {
          full_name: mappedData.full_name || '',
          phone_number: mappedData.phone_number.trim(), // Ensure NOT NULL constraint is met
          date_of_birth: mappedData.date_of_birth || null, // Include date_of_birth field
          role: 'student',
          updated_at: new Date().toISOString()
        };
        console.log('📝 Profile update data:', updateData);

        const { data: updatedData, error: updateError } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', studentId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Both profile insert and update failed:', {
            insertError: userError,
            updateError: updateError
          });
          throw new Error(`Profile creation failed: ${updateError.message}`);
        }

        console.log('✅ Profile updated successfully:', updatedData);
        userData = updatedData;
      } else {
        console.log('✅ Profile created successfully:', userData);
      }

      // If course_id is provided, create enrollment
      if (mappedData.course_id) {
        console.log('🔄 Attempting to create course enrollment...');
        const enrollmentData = {
          user_id: userData.id,
          course_id: mappedData.course_id,
          status: 'active',
          progress: 0,
          enrollment_date: new Date().toISOString(),
          enrollment_mode: mappedData.enrollment_mode || 'online',
          price_paid: mappedData.price_paid || 0
        };
        console.log('📝 Enrollment data:', enrollmentData);

        const { data: enrollmentResult, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .insert(enrollmentData)
          .select()
          .single();

        if (enrollmentError) {
          // If enrollment fails, log the error but don't rollback user creation
          // The user account will exist but without enrollment
          console.error('❌ Enrollment creation failed:', enrollmentError);
          throw new Error(`Student created but enrollment failed: ${enrollmentError.message}`);
        }

        console.log('✅ Enrollment created successfully');

        // Create fee records for the enrollment
        if (enrollmentResult && (mappedData.price_paid > 0 || mappedData.payment_type)) {
          console.log('🔄 Attempting to create fee records...');

          // Get course data for fee creation
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id, title, price')
            .eq('id', mappedData.course_id)
            .single();

          if (courseError) {
            console.warn('⚠️ Could not fetch course data for fee creation:', courseError);
          } else {
            try {
              const paymentType = mappedData.payment_type || 'full';
              const totalAmount = mappedData.price_paid || courseData.price || 0;
              const courseName = courseData.title;
              const courseMode = mappedData.enrollment_mode || 'online';
              const emiMonths = mappedData.emi_months || 6;

              const feeRecords = [];

              if (paymentType === 'emi') {
                // Create multiple entries for EMI
                const installmentAmount = Math.ceil(totalAmount / emiMonths);
                // Use provided first_installment_date as the base due date if available
                const baseDueDate = mappedData.first_installment_date
                  ? new Date(mappedData.first_installment_date)
                  : new Date();

                for (let i = 1; i <= emiMonths; i++) {
                  const dueDate = new Date(baseDueDate);
                  // For subsequent installments, add months relative to the base date
                  dueDate.setMonth(baseDueDate.getMonth() + i - 1);

                  const isFirstInstallment = i === 1;

                  feeRecords.push({
                    user_id: userData.id,
                    course_id: mappedData.course_id,
                    enrollment_id: enrollmentResult.id,
                    total_amount: totalAmount,
                    installment_amount: installmentAmount,
                    installment_number: i,
                    total_installments: emiMonths,
                    status: isFirstInstallment && mappedData.first_payment_made ? 'paid' : 'pending',
                    payment_type: 'emi',
                    due_date: dueDate.toISOString().split('T')[0],
                    paid_date: isFirstInstallment && mappedData.first_payment_made ? new Date().toISOString() : null,
                    course_name: courseName,
                    course_mode: courseMode,
                    payment_method: isFirstInstallment && mappedData.first_payment_made ? 'online' : null,
                    notes: isFirstInstallment ? 'First EMI payment on enrollment' : `EMI ${i} of ${emiMonths}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                }
              } else {
                // Create single entry for full payment
                feeRecords.push({
                  user_id: userData.id,
                  course_id: mappedData.course_id,
                  enrollment_id: enrollmentResult.id,
                  total_amount: totalAmount,
                  installment_amount: totalAmount,
                  installment_number: 1,
                  total_installments: 1,
                  status: mappedData.first_payment_made ? 'paid' : 'pending',
                  payment_type: 'full',
                  // Use provided first_installment_date as due date if available
                  due_date: (mappedData.first_installment_date
                    ? new Date(mappedData.first_installment_date)
                    : new Date()).toISOString().split('T')[0],
                  paid_date: mappedData.first_payment_made ? new Date().toISOString() : null,
                  course_name: courseName,
                  course_mode: courseMode,
                  payment_method: mappedData.first_payment_made ? 'online' : null,
                  notes: mappedData.first_payment_made ? 'Full payment on enrollment' : 'Payment pending',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              }

              const { error: feeError } = await supabase
                .from('fees')
                .insert(feeRecords);

              if (feeError) {
                console.error('❌ Fee creation failed:', feeError);
                // Don't throw error for fee creation failure, just log it
                console.warn('⚠️ Student and enrollment created successfully, but fee records failed');
              } else {
                console.log('✅ Fee records created successfully');
              }
            } catch (feeCreationError) {
              console.error('❌ Error during fee creation:', feeCreationError);
              console.warn('⚠️ Student and enrollment created successfully, but fee records failed');
            }
          }
        }
      }

      console.log('🎉 Student creation completed successfully!');
      return {
        success: true,
        student: userData,
        message: 'Student created successfully without authentication credentials'
      };

    } catch (error) {
      console.error('❌ AdminDatasource add student error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Add a new course
   */
  static async addCourse(courseData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description || '',
          category: courseData.category || 'General',
          // Must be one of: 'beginner', 'intermediate', 'advanced'
          level: (courseData.level || 'beginner'),
          duration: courseData.duration || '0',
          price: parseFloat(courseData.price) || 0,
          image_url: courseData.image_url || '',
          is_active: courseData.is_active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, course: data };

    } catch (error) {
      console.error('❌ AdminDatasource add course error:', error);
      throw error;
    }
  }

  /**
   * Update student information
   */
  static async updateStudent(studentId, studentData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          full_name: studentData.full_name || studentData.name,
          email: studentData.email,
          phone_number: studentData.phone || studentData.phone_number,
          date_of_birth: studentData.date_of_birth,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)
        .eq('role', 'student')
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, student: data };

    } catch (error) {
      console.error('❌ AdminDatasource update student error:', error);
      throw error;
    }
  }

  /**
   * Update course information
   */
  static async updateCourse(courseId, courseData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description || '',
          category: courseData.category || 'General',
          // Must be one of: 'beginner', 'intermediate', 'advanced'
          level: (courseData.level || 'beginner'),
          duration: courseData.duration || '0',
          price: parseFloat(courseData.price) || 0,
          image_url: courseData.image_url || '',
          is_active: courseData.is_active !== false,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, course: data };

    } catch (error) {
      console.error('❌ AdminDatasource update course error:', error);
      throw error;
    }
  }

  /**
   * Get detailed student information
   */
  static async getStudentDetails(studentId) {
    try {
      console.log('📊 AdminDatasource: Fetching student details for ID:', studentId);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) {
        console.error('❌ Error fetching student details:', error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Student not found' };
      }

      console.log('✅ Student details fetched successfully');
      return { success: true, student: data };

    } catch (error) {
      console.error('❌ AdminDatasource get student details error:', error);
      return { success: false, error: 'Failed to fetch student details' };
    }
  }

  /**
   * Get student course enrollments
   */
  static async getStudentEnrollments(studentId) {
    try {
      console.log('📚 AdminDatasource: Fetching enrollments for student ID:', studentId);

      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            duration,
            price
          )
        `)
        .eq('user_id', studentId)
        .order('enrollment_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching student enrollments:', error);
        return { success: false, error: error.message };
      }

      // Transform the data to include course details
      const enrollments = data.map(enrollment => ({
        ...enrollment,
        course_title: enrollment.courses?.title || 'Unknown Course',
        course_description: enrollment.courses?.description || '',
        course_duration: enrollment.courses?.duration || '',
        course_price: enrollment.courses?.price || 0,
        created_at: enrollment.enrollment_date,
        is_active: enrollment.status === 'active'
      }));

      console.log('✅ Student enrollments fetched successfully');
      return { success: true, enrollments };

    } catch (error) {
      console.error('❌ AdminDatasource get student enrollments error:', error);
      return { success: false, error: 'Failed to fetch student enrollments' };
    }
  }

  /**
   * Get student fees information
   */
  static async getStudentFees(studentId) {
    try {
      console.log('💰 AdminDatasource: Fetching fees for student ID:', studentId);

      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('user_id', studentId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('❌ Error fetching student fees:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Student fees fetched successfully');
      return { success: true, fees: data || [] };

    } catch (error) {
      console.error('❌ AdminDatasource get student fees error:', error);
      return { success: false, error: 'Failed to fetch student fees' };
    }
  }

  /**
   * Update student details
   */
  static async updateStudentDetails(studentId, studentData) {
    try {
      console.log('✏️ AdminDatasource: Updating student details for ID:', studentId);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          full_name: studentData.full_name || studentData.name,
          email: studentData.email,
          phone_number: studentData.phone || studentData.phone_number,
          date_of_birth: studentData.date_of_birth,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating student details:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Student details updated successfully');
      return { success: true, student: data };

    } catch (error) {
      console.error('❌ AdminDatasource update student details error:', error);
      return { success: false, error: 'Failed to update student details' };
    }
  }

  /**
   * Mark fee as paid
   */
  static async markFeeAsPaid(feeId) {
    try {
      console.log('💳 AdminDatasource: Marking fee as paid for ID:', feeId);

      const { data, error } = await supabase
        .from('fees')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', feeId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error marking fee as paid:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Fee marked as paid successfully');
      return { success: true, fee: data };

    } catch (error) {
      console.error('❌ AdminDatasource mark fee as paid error:', error);
      return { success: false, error: 'Failed to mark fee as paid' };
    }
  }

  /**
   * Get all pending/overdue fees with student and course info
   */
  static async getPendingFees(limit = 200, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select(`
          id,
          user_id,
          course_id,
          course_name,
          installment_number,
          total_installments,
          installment_amount,
          status,
          due_date,
          created_at,
          user_profiles!user_id (
            full_name,
            email,
            phone_number
          ),
          courses!course_id (
            title,
            category
          )
        `)
        .in('status', ['pending', 'overdue'])
        .order('due_date', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        return { success: false, error: error.message, fees: [] };
      }

      const fees = (data || []).map(fee => ({
        id: fee.id,
        user_id: fee.user_id,
        student_name: fee.user_profiles?.full_name || 'N/A',
        student_email: fee.user_profiles?.email || 'N/A',
        phone_number: fee.user_profiles?.phone_number || null,
        course_title: fee.courses?.title || fee.course_name || 'N/A',
        installment_number: fee.installment_number || 0,
        total_installments: fee.total_installments || 0,
        amount: fee.installment_amount || 0,
        status: fee.status,
        due_date: fee.due_date,
        created_at: fee.created_at,
      }));

      return { success: true, fees };
    } catch (err) {
      console.error('❌ AdminDatasource getPendingFees error:', err);
      return { success: false, error: 'Failed to fetch pending fees', fees: [] };
    }
  }

  /**
   * Update fee details
   */
  static async updateFee(feeId, feeData) {
    try {
      console.log('💰 AdminDatasource: Updating fee details for ID:', feeId);
      console.log('💰 Fee data received:', feeData);

      const updateData = {
        updated_at: new Date().toISOString()
      };

      // Map the correct database field names
      if (feeData.payment_type !== undefined) updateData.payment_type = feeData.payment_type;
      if (feeData.installment_amount !== undefined) updateData.installment_amount = feeData.installment_amount;
      if (feeData.total_amount !== undefined) updateData.total_amount = feeData.total_amount;
      if (feeData.due_date !== undefined) updateData.due_date = feeData.due_date;
      if (feeData.status !== undefined) updateData.status = feeData.status;
      if (feeData.notes !== undefined) updateData.notes = feeData.notes;
      if (feeData.course_name !== undefined) updateData.course_name = feeData.course_name;

      // If marking as paid, set paid_date
      if (feeData.status === 'paid' && !feeData.paid_date) {
        updateData.paid_date = new Date().toISOString();
      }

      console.log('💰 Update data to be sent:', updateData);

      const { data, error } = await supabase
        .from('fees')
        .update(updateData)
        .eq('id', feeId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating fee:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Fee updated successfully:', data);
      return { success: true, fee: data };

    } catch (error) {
      console.error('❌ AdminDatasource update fee error:', error);
      return { success: false, error: 'Failed to update fee' };
    }
  }

  /**
   * Create a single fee record
   */
  static async createFee(feeData) {
    try {
      console.log('💰 AdminDatasource: Creating fee record:', feeData);

      const insertData = {
        user_id: feeData.user_id,
        course_id: feeData.course_id,
        enrollment_id: feeData.enrollment_id || null,
        total_amount: feeData.total_amount,
        installment_amount: feeData.installment_amount,
        installment_number: feeData.installment_number || 1,
        total_installments: feeData.total_installments || 1,
        status: feeData.status || 'pending',
        payment_type: feeData.payment_type || 'full',
        due_date: feeData.due_date,
        paid_date: feeData.paid_date || null,
        course_name: feeData.course_name,
        course_mode: feeData.course_mode || 'online',
        payment_method: feeData.payment_method || null,
        transaction_id: feeData.transaction_id || null,
        payment_gateway_response: feeData.payment_gateway_response || null,
        notes: feeData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('fees')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating fee:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Fee created successfully:', data);
      return { success: true, fee: data };

    } catch (error) {
      console.error('❌ AdminDatasource create fee error:', error);
      return { success: false, error: 'Failed to create fee' };
    }
  }

  /**
   * Delete a fee record by ID
   */
  static async deleteFee(feeId) {
    try {
      console.log('🗑️ AdminDatasource: Deleting fee ID:', feeId);

      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', feeId);

      if (error) {
        console.error('❌ Error deleting fee:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Fee deleted successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ AdminDatasource delete fee error:', error);
      return { success: false, error: 'Failed to delete fee' };
    }
  }

  /**
   * Get all teachers for admin management
   */
  static async getAllTeachers() {
    try {
      const { data, error } = await supabase.rpc('get_all_teachers');

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        teachers: (data || []).map((teacher) => ({
          ...teacher,
          salary: Number(teacher.salary || 0)
        }))
      };
    } catch (error) {
      console.error('❌ AdminDatasource getAllTeachers error:', error);
      return { success: false, error: error.message, teachers: [] };
    }
  }

  /**
   * Create a teacher via RPC
   */
  static async createTeacher(teacherData) {
    try {
      const { data, error } = await supabase.rpc('create_teacher', {
        p_email: teacherData.email,
        p_password: teacherData.password,
        p_full_name: teacherData.full_name,
        p_phone_number: teacherData.phone_number || null,
        p_joining_date: teacherData.joining_date || null,
        p_salary: Number(teacherData.salary || 0),
        p_designation: teacherData.designation || 'teacher',
        p_address: teacherData.address || null,
        p_created_by: teacherData.created_by || null
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, teacherId: data };
    } catch (error) {
      console.error('❌ AdminDatasource createTeacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update teacher via RPC
   */
  static async updateTeacher(teacherId, teacherData) {
    try {
      const { data, error } = await supabase.rpc('update_teacher_profile', {
        p_teacher_id: teacherId,
        p_email: teacherData.email,
        p_full_name: teacherData.full_name,
        p_phone_number: teacherData.phone_number || null,
        p_joining_date: teacherData.joining_date || null,
        p_salary: Number(teacherData.salary || 0),
        p_designation: teacherData.designation || 'teacher',
        p_address: teacherData.address || null,
        p_is_active: teacherData.is_active !== false,
        p_password: teacherData.password || null
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, teacherId: data || teacherId };
    } catch (error) {
      console.error('❌ AdminDatasource updateTeacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete teacher via RPC
   */
  static async deleteTeacher(teacherId) {
    try {
      const { error } = await supabase.rpc('delete_teacher_record', {
        p_teacher_id: teacherId
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ AdminDatasource deleteTeacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all certificates for admin management
   */
  static async getAllCertificates() {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id,
          user_id,
          course_id,
          enrollment_id,
          certificate_number,
          issue_date,
          grade,
          instructor_name,
          course_name,
          course_duration,
          completion_date,
          certificate_url,
          is_valid,
          user_profiles!certificates_user_id_fkey (
            full_name,
            email,
            phone_number
          )
        `)
        .order('issue_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const certificates = (data || []).map((item) => ({
        id: item.id,
        user_id: item.user_id,
        course_id: item.course_id,
        enrollment_id: item.enrollment_id,
        certificate_number: item.certificate_number,
        issue_date: item.issue_date,
        grade: item.grade,
        instructor_name: item.instructor_name,
        course_name: item.course_name,
        course_duration: item.course_duration,
        completion_date: item.completion_date,
        certificate_url: item.certificate_url,
        is_valid: item.is_valid,
        student_name: item.user_profiles?.full_name || 'N/A',
        student_email: item.user_profiles?.email || 'N/A',
        student_phone: item.user_profiles?.phone_number || 'N/A'
      }));

      return { success: true, certificates };
    } catch (error) {
      console.error('❌ AdminDatasource getAllCertificates error:', error);
      return { success: false, error: error.message, certificates: [] };
    }
  }

  static generateCertificateNumber() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TECH-${y}${m}${d}-${random}`;
  }

  /**
   * Create certificate for a student's enrollment
   */
  static async createCertificate(payload) {
    try {
      if (!payload?.user_id || !payload?.course_id || !payload?.enrollment_id) {
        return { success: false, error: 'user_id, course_id and enrollment_id are required' };
      }

      // Use SECURITY DEFINER function to bypass strict RLS on certificates table.
      const { data: certificateId, error: rpcError } = await supabase.rpc('create_certificate', {
        p_user_id: payload.user_id,
        p_course_id: payload.course_id,
        p_enrollment_id: payload.enrollment_id,
        p_grade: payload.grade || 'A'
      });

      if (!rpcError && certificateId) {
        const { data: certRow, error: certFetchError } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', certificateId)
          .maybeSingle();

        if (!certFetchError && certRow) {
          return { success: true, certificate: certRow };
        }

        // If row fetch is blocked by RLS, still return success with created id.
        return { success: true, certificate: { id: certificateId } };
      }

      // Fallback for environments without the RPC function
      const certificateNumber = payload.certificate_number || this.generateCertificateNumber();
      const issueDate = payload.issue_date || new Date().toISOString();

      const insertData = {
        user_id: payload.user_id,
        course_id: payload.course_id,
        enrollment_id: payload.enrollment_id,
        certificate_number: certificateNumber,
        issue_date: issueDate,
        grade: payload.grade || null,
        instructor_name: payload.instructor_name || null,
        course_name: payload.course_name || 'Course',
        course_duration: payload.course_duration || null,
        completion_date: payload.completion_date || null,
        certificate_url: payload.certificate_url || null,
        is_valid: typeof payload.is_valid === 'boolean' ? payload.is_valid : true
      };

      const { data, error } = await supabase
        .from('certificates')
        .insert(insertData)
        .select('*')
        .single();

      if (error) {
        throw new Error(rpcError?.message || error.message);
      }

      return { success: true, certificate: data };
    } catch (error) {
      console.error('❌ AdminDatasource createCertificate error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Toggle certificate validity
   */
  static async updateCertificateStatus(certificateId, isValid) {
    try {
      if (!certificateId) {
        return { success: false, error: 'Certificate id is required' };
      }

      const { data, error } = await supabase
        .from('certificates')
        .update({ is_valid: !!isValid })
        .eq('id', certificateId)
        .select('id, is_valid')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, certificate: data };
    } catch (error) {
      console.error('❌ AdminDatasource updateCertificateStatus error:', error);
      return { success: false, error: error.message || 'Failed to update certificate status' };
    }
  }

}

export default AdminDatasource;

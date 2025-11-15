/**
 * AdminUsecase
 * Contains business logic for admin authentication and management operations
 * Handles interactions between admin UI components and datasource
 */

import AdminDatasource from '../datasource/AdminDatasource';
import { toast } from 'react-toastify';

export class AdminUsecase {

  // ==================== ADMIN AUTHENTICATION ====================

  /**
   * Admin login usecase with new admin_user table
   */
  static async adminLoginUsecase(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!AdminDatasource.validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Call datasource
      const result = await AdminDatasource.adminLogin(email, password);

      if (result.success) {
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        localStorage.setItem('adminSessionToken', result.sessionToken);
        localStorage.setItem('adminSessionExpiry', result.expiresAt);
        
        toast.success('Admin login successful!');
        
        return {
          success: true,
          user: result.user,
          sessionToken: result.sessionToken,
          expiresAt: result.expiresAt,
          message: 'Login successful'
        };
      } else {
        throw new Error('Login failed');
      }

    } catch (error) {
      console.error('Admin login usecase error:', error);
      toast.error(error.message || 'Login failed');
      
      return {
        success: false,
        error: error.message || 'Login failed',
        user: null,
        sessionToken: null
      };
    }
  }

  /**
   * Admin logout usecase with session invalidation
   */
  static async adminLogoutUsecase() {
    try {
      const sessionToken = localStorage.getItem('adminSessionToken');
      const result = await AdminDatasource.adminLogout(sessionToken);
      
      if (result.success) {
        // Clear local storage
        localStorage.removeItem('adminSessionToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionExpiry');
        
        toast.success('Logged out successfully');
        
        return {
          success: true,
          message: 'Logout successful'
        };
      } else {
        throw new Error('Logout failed');
      }

    } catch (error) {
      console.error('Admin logout usecase error:', error);
      toast.error(error.message || 'Logout failed');
      
      return {
        success: false,
        error: error.message || 'Logout failed'
      };
    }
  }



  /**
   * Change admin password usecase with admin_user table
   */
  static async changePasswordUsecase(currentPassword, newPassword, confirmPassword) {
    try {
      // Validate input
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('All password fields are required');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      if (currentPassword === newPassword) {
        throw new Error('New password must be different from current password');
      }

      // Validate new password strength
      const passwordValidation = AdminDatasource.validatePassword(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Get current admin user
      const adminUser = this.getStoredAdminUser();
      if (!adminUser || !adminUser.id) {
        throw new Error('Admin user not found. Please login again.');
      }

      // Call datasource with admin ID
      const result = await AdminDatasource.changePassword(adminUser.id, currentPassword, newPassword);

      if (result.success) {
        toast.success('Password changed successfully!');
        
        return {
          success: true,
          message: 'Password changed successfully'
        };
      } else {
        throw new Error('Password change failed');
      }

    } catch (error) {
      console.error('Change password usecase error:', error);
      toast.error(error.message || 'Password change failed');
      
      return {
        success: false,
        error: error.message || 'Password change failed'
      };
    }
  }

  // ==================== ADMIN MANAGEMENT ====================

  /**
   * Get all students usecase
   */
  static async getAllStudentsUsecase() {
    try {
      const result = await AdminDatasource.getAllStudents();
      
      if (result.success) {
        return {
          success: true,
          students: result.students,
          count: result.students.length
        };
      } else {
        throw new Error('Failed to fetch students');
      }

    } catch (error) {
      console.error('Get students usecase error:', error);
      toast.error(error.message || 'Failed to fetch students');
      
      return {
        success: false,
        students: [],
        count: 0,
        error: error.message
      };
    }
  }

  /**
   * Get all enrollments usecase
   */
  static async getAllEnrollmentsUsecase() {
    try {
      const result = await AdminDatasource.getAllEnrollments();
      
      if (result.success) {
        return {
          success: true,
          enrollments: result.enrollments,
          count: result.enrollments.length
        };
      } else {
        throw new Error('Failed to fetch enrollments');
      }

    } catch (error) {
      console.error('Get enrollments usecase error:', error);
      toast.error(error.message || 'Failed to fetch enrollments');
      
      return {
        success: false,
        enrollments: [],
        count: 0,
        error: error.message
      };
    }
  }

  /**
   * Get all courses usecase
   */
  static async getAllCoursesUsecase() {
    try {
      const result = await AdminDatasource.getAllCourses();
      
      if (result.success) {
        return {
          success: true,
          courses: result.courses,
          count: result.courses.length
        };
      } else {
        throw new Error('Failed to fetch courses');
      }

    } catch (error) {
      console.error('Get courses usecase error:', error);
      toast.error(error.message || 'Failed to fetch courses');
      
      return {
        success: false,
        courses: [],
        count: 0,
        error: error.message
      };
    }
  }

  /**
   * Get financial statistics usecase
   */
  static async getFinancialStatsUsecase() {
    try {
      const result = await AdminDatasource.getFinancialStats();
      
      if (result.success) {
        return {
          success: true,
          ...result.stats
        };
      } else {
        throw new Error('Failed to fetch financial statistics');
      }

    } catch (error) {
      console.error('Get financial stats usecase error:', error);
      // Don't show toast error for financial stats as it's not critical
      
      return {
        success: false,
        totalRevenue: 0,
        pendingRevenue: 0,
        onlineRevenue: 0,
        offlineRevenue: 0,
        recentPaymentsTotal: 0,
        totalTransactions: 0,
        pendingTransactions: 0,
        recentPayments: [],
        error: error.message
      };
    }
  }

  /**
   * Update student status usecase
   */
  static async updateStudentStatusUsecase(studentId, isActive) {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const result = await AdminDatasource.updateStudentStatus(studentId, isActive);
      
      if (result.success) {
        const action = isActive ? 'activated' : 'deactivated';
        toast.success(`Student ${action} successfully!`);
        
        return {
          success: true,
          message: `Student ${action} successfully`
        };
      } else {
        throw new Error('Failed to update student status');
      }

    } catch (error) {
      console.error('Update student status usecase error:', error);
      toast.error(error.message || 'Failed to update student status');
      
      return {
        success: false,
        error: error.message || 'Failed to update student status'
      };
    }
  }

  /**
   * Add student with enrollment usecase
   */
  static async addStudentWithEnrollment(studentData) {
    try {
      // Validate required fields
      if (!studentData.full_name || !studentData.email || !studentData.course_id) {
        throw new Error('Full name, email, and course are required');
      }

      if (!AdminDatasource.validateEmail(studentData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const result = await AdminDatasource.addStudentWithEnrollment(studentData);
      
      if (result.success) {
        toast.success(`Student added successfully! Temporary password: ${result.tempPassword}`);
        
        return {
          success: true,
          student: result.student,
          tempPassword: result.tempPassword,
          message: `Student added successfully! Temporary password: ${result.tempPassword}`
        };
      } else {
        throw new Error(result.error || 'Failed to add student');
      }

    } catch (error) {
      console.error('Add student with enrollment usecase error:', error);
      toast.error(error.message || 'Failed to add student');
      
      return {
        success: false,
        error: error.message || 'Failed to add student'
      };
    }
  }

  /**
   * Add course usecase
   */
  static async addCourse(courseData) {
    try {
      // Validate required fields
      if (!courseData.title || !courseData.price) {
        throw new Error('Course title and price are required');
      }

      if (isNaN(courseData.price) || courseData.price <= 0) {
        throw new Error('Please enter a valid price');
      }

      const result = await AdminDatasource.addCourse(courseData);
      
      if (result.success) {
        toast.success('Course added successfully!');
        
        return {
          success: true,
          course: result.course,
          message: 'Course added successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to add course');
      }

    } catch (error) {
      console.error('Add course usecase error:', error);
      toast.error(error.message || 'Failed to add course');
      
      return {
        success: false,
        error: error.message || 'Failed to add course'
      };
    }
  }

  /**
   * Update student usecase
   */
  static async updateStudent(studentId, studentData) {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      // Validate required fields
      if (!studentData.full_name || !studentData.email) {
        throw new Error('Full name and email are required');
      }

      if (!AdminDatasource.validateEmail(studentData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const result = await AdminDatasource.updateStudent(studentId, studentData);
      
      if (result.success) {
        toast.success('Student updated successfully!');
        
        return {
          success: true,
          student: result.student,
          message: 'Student updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update student');
      }

    } catch (error) {
      console.error('Update student usecase error:', error);
      toast.error(error.message || 'Failed to update student');
      
      return {
        success: false,
        error: error.message || 'Failed to update student'
      };
    }
  }

  /**
   * Update course usecase
   */
  static async updateCourse(courseId, courseData) {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      // Validate required fields
      if (!courseData.title || !courseData.price) {
        throw new Error('Course title and price are required');
      }

      if (isNaN(courseData.price) || courseData.price <= 0) {
        throw new Error('Please enter a valid price');
      }

      const result = await AdminDatasource.updateCourse(courseId, courseData);
      
      if (result.success) {
        toast.success('Course updated successfully!');
        
        return {
          success: true,
          course: result.course,
          message: 'Course updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update course');
      }

    } catch (error) {
      console.error('Update course usecase error:', error);
      toast.error(error.message || 'Failed to update course');
      
      return {
        success: false,
        error: error.message || 'Failed to update course'
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if user is authenticated admin with session token
   */
  static isAdminAuthenticated() {
    const sessionToken = localStorage.getItem('adminSessionToken');
    const adminUser = localStorage.getItem('adminUser');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (!sessionToken || !adminUser || !sessionExpiry) {
      return false;
    }

    // Check if session has expired
    const expiryDate = new Date(sessionExpiry);
    const now = new Date();
    
    if (now >= expiryDate) {
      this.clearAdminSession();
      return false;
    }
    
    return true;
  }

  /**
   * Get stored admin user data
   */
  static getStoredAdminUser() {
    try {
      const adminUser = localStorage.getItem('adminUser');
      return adminUser ? JSON.parse(adminUser) : null;
    } catch (error) {
      console.error('Error parsing stored admin user:', error);
      return null;
    }
  }

  /**
   * Clear admin session data
   */
  static clearAdminSession() {
    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSessionExpiry');
  }

  /**
   * Validate admin access for protected routes with session validation
   */
  static async validateAdminAccess() {
    try {
      // Check local storage first
      if (!this.isAdminAuthenticated()) {
        return { valid: false, reason: 'No local admin session' };
      }

      // Verify session with server
      const sessionToken = localStorage.getItem('adminSessionToken');
      const sessionResult = await AdminDatasource.validateSession(sessionToken);
      
      if (!sessionResult.valid) {
        this.clearAdminSession();
        return { valid: false, reason: sessionResult.reason || 'Invalid server session' };
      }

      return { valid: true, user: sessionResult.admin };

    } catch (error) {
      console.error('Admin access validation error:', error);
      this.clearAdminSession();
      return { valid: false, reason: 'Validation error' };
    }
  }

  /**
   * Get detailed student information
   */
  static async getStudentDetails(studentId) {
    try {
      if (!studentId) {
        return { success: false, error: 'Student ID is required' };
      }

      const result = await AdminDatasource.getStudentDetails(studentId);
      return result;
    } catch (error) {
      console.error('Error fetching student details:', error);
      return { success: false, error: 'Failed to fetch student details' };
    }
  }

  /**
   * Get student course enrollments
   */
  static async getStudentEnrollments(studentId) {
    try {
      if (!studentId) {
        return { success: false, error: 'Student ID is required' };
      }

      const result = await AdminDatasource.getStudentEnrollments(studentId);
      return result;
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return { success: false, error: 'Failed to fetch student enrollments' };
    }
  }

  /**
   * Accounts: List entries
   */
  static async getAccountsUsecase(limit = 100, offset = 0) {
    try {
      // Fetch manual account entries
      const accountsResult = await AdminDatasource.getAccounts(limit, offset);
      // Fetch paid fee transactions (account statement)
      const statementResult = await AdminDatasource.getAccountStatement(limit, offset);

      if (!accountsResult.success && !statementResult.success) {
        throw new Error(accountsResult.error || statementResult.error || 'Failed to fetch accounts');
      }

      const manualAccounts = accountsResult.success ? (accountsResult.accounts || []) : [];
      const paidTransactions = statementResult.success ? (statementResult.transactions || []) : [];

      // Map paid fees into account-like rows with required description
      const mappedPaid = paidTransactions.map((txn) => ({
        id: txn.id,
        description: `${txn.student_name || 'Student'} Fee Paid`,
        amount: txn.amount || 0,
        credit: true,
        txn_date: txn.payment_date, // align to the accounts table date field
        created_at: null,
      }));

      // Combine and sort by date DESC (newest first)
      const combined = [...manualAccounts, ...mappedPaid].sort((a, b) => {
        const da = new Date(a.txn_date || a.created_at || 0).getTime();
        const db = new Date(b.txn_date || b.created_at || 0).getTime();
        return db - da;
      });

      // Compute running balance per row: credit adds, debit subtracts.
      // Running balance is based on chronological order, so calculate from oldest to newest.
      let running = 0;
      const withBalance = combined
        .slice()
        .reverse()
        .map((row) => {
          const amtRaw = typeof row.amount === 'string' ? parseFloat(row.amount) : row.amount;
          const amt = Number.isFinite(amtRaw) ? amtRaw : 0;
          const delta = (row.credit ? 1 : -1) * amt;
          running += delta;
          return { ...row, balance: running };
        })
        .reverse();

      return {
        success: true,
        accounts: withBalance,
        count: withBalance.length,
      };
    } catch (error) {
      console.error('Get accounts usecase error:', error);
      toast.error(error.message || 'Failed to fetch accounts');
      return { success: false, accounts: [], count: 0, error: error.message };
    }
  }

  /**
   * Accounts: Add a new statement
   */
  static async addAccountStatementUsecase({ description, credit, txn_date, amount }) {
    try {
      if (!description || typeof credit === 'undefined' || !txn_date) {
        return { success: false, error: 'Please provide description, credit and date' };
      }

      if (typeof amount === 'undefined' || amount === '' || Number.isNaN(parseFloat(amount))) {
        return { success: false, error: 'Please provide a valid amount' };
      }
      const amtNum = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (amtNum <= 0) {
        return { success: false, error: 'Amount must be greater than 0' };
      }

      const result = await AdminDatasource.addAccountEntry({ description, credit, txn_date, amount: amtNum });
      if (result.success) {
        toast.success('Account entry added');
        return { success: true, account: result.account };
      }
      throw new Error(result.error || 'Failed to add account entry');
    } catch (error) {
      console.error('Add account usecase error:', error);
      toast.error(error.message || 'Failed to add account entry');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get student fees information
   */
  static async getStudentFees(studentId) {
    try {
      if (!studentId) {
        return { success: false, error: 'Student ID is required' };
      }

      const result = await AdminDatasource.getStudentFees(studentId);
      return result;
    } catch (error) {
      console.error('Error fetching student fees:', error);
      return { success: false, error: 'Failed to fetch student fees' };
    }
  }

  /**
   * Update student details
   */
  static async updateStudentDetails(studentId, studentData) {
    try {
      if (!studentId) {
        return { success: false, error: 'Student ID is required' };
      }

      if (!studentData || typeof studentData !== 'object') {
        return { success: false, error: 'Valid student data is required' };
      }

      // Validate required fields
      if (!studentData.full_name && !studentData.name) {
        return { success: false, error: 'Student name is required' };
      }

      if (studentData.email && !this.isValidEmail(studentData.email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (studentData.phone && !this.isValidPhone(studentData.phone)) {
        return { success: false, error: 'Please enter a valid phone number' };
      }

      const result = await AdminDatasource.updateStudentDetails(studentId, studentData);
      
      if (result.success) {
        toast.success('Student details updated successfully!');
      }

      return result;
    } catch (error) {
      console.error('Error updating student details:', error);
      return { success: false, error: 'Failed to update student details' };
    }
  }

  /**
   * Mark fee as paid
   */
  static async markFeeAsPaid(feeId) {
    try {
      if (!feeId) {
        return { success: false, error: 'Fee ID is required' };
      }

      const result = await AdminDatasource.markFeeAsPaid(feeId);
      
      if (result.success) {
        toast.success('Fee marked as paid successfully!');
      }

      return result;
    } catch (error) {
      console.error('Error marking fee as paid:', error);
      return { success: false, error: 'Failed to mark fee as paid' };
    }
  }

  /**
   * Get list of pending fees across all students
   */
  static async getPendingFeesUsecase(limit = 200, offset = 0) {
    try {
      const result = await AdminDatasource.getPendingFees(limit, offset);
      if (result.success) {
        return { success: true, fees: result.fees };
      }
      return { success: false, fees: [], error: result.error || 'Failed to fetch pending fees' };
    } catch (error) {
      console.error('Get pending fees usecase error:', error);
      return { success: false, fees: [], error: error.message || 'Failed to fetch pending fees' };
    }
  }

  /**
   * Create a fee record (admin)
   */
  static async createFee(userId, payload) {
    try {
      if (!userId) return { success: false, error: 'User ID is required' };
      if (!payload || !payload.course_id) return { success: false, error: 'Course is required' };
      if (!payload.installment_amount || !payload.due_date) {
        return { success: false, error: 'Amount and due date are required' };
      }

      const feeData = {
        user_id: userId,
        course_id: payload.course_id,
        enrollment_id: payload.enrollment_id || null,
        total_amount: payload.total_amount || payload.installment_amount,
        installment_amount: payload.installment_amount,
        installment_number: payload.installment_number || 1,
        total_installments: payload.total_installments || 1,
        status: payload.status || 'pending',
        payment_type: payload.payment_type || 'full',
        due_date: payload.due_date,
        paid_date: payload.paid_date || null,
        course_name: payload.course_name || payload.course_title || 'Course Fee',
        course_mode: payload.course_mode || 'online',
        payment_method: payload.payment_method || null,
        transaction_id: payload.transaction_id || null,
        payment_gateway_response: payload.payment_gateway_response || null,
        notes: payload.notes || null
      };

      const result = await AdminDatasource.createFee(feeData);
      if (result.success) {
        toast.success('Fee created successfully');
      }
      return result;
    } catch (error) {
      console.error('Error creating fee:', error);
      return { success: false, error: 'Failed to create fee' };
    }
  }

  /**
   * Delete a fee record (admin)
   */
  static async deleteFee(feeId) {
    try {
      if (!feeId) return { success: false, error: 'Fee ID is required' };
      const result = await AdminDatasource.deleteFee(feeId);
      if (result.success) {
        toast.success('Fee deleted successfully');
      }
      return result;
    } catch (error) {
      console.error('Error deleting fee:', error);
      return { success: false, error: 'Failed to delete fee' };
    }
  }

  /**
   * Update fee details
   */
  static async updateFee(feeId, feeData) {
    try {
      if (!feeId) {
        return { success: false, error: 'Fee ID is required' };
      }

      if (!feeData || typeof feeData !== 'object') {
        return { success: false, error: 'Valid fee data is required' };
      }

      // Validate amount if provided
      if (feeData.amount !== undefined && (isNaN(feeData.amount) || feeData.amount < 0)) {
        return { success: false, error: 'Please enter a valid amount' };
      }

      const result = await AdminDatasource.updateFee(feeId, feeData);
      
      if (result.success) {
        toast.success('Fee updated successfully!');
      }

      return result;
    } catch (error) {
      console.error('Error updating fee:', error);
      return { success: false, error: 'Failed to update fee' };
    }
  }

  /**
   * Helper method to validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Helper method to validate phone number format
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}

export default AdminUsecase;
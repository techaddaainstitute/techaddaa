/**
 * AuthUsecase
 * Contains business logic for authentication operations
 * Handles interactions between UI and datasource
 */

import AuthDatasource from '../datasource/AuthDatasource';
import { User } from '../model/User';
import { AuthResponse, OTPResponse } from '../model/AuthResponse';
import { toast } from 'react-toastify';

export class AuthUsecase {

  // ==================== EMAIL AUTHENTICATION ====================

  /**
   * Register new user with email and password
   */
  static async registerUsecase(email, password, userData = {}) {
    try {
      // Validate input
      if (!AuthDatasource.validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Call datasource
      const result = await AuthDatasource.signUp(email, password, userData);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Create user model if successful
      let user = null;
      if (result.data?.user) {
        user = User.createEmailUser({
          id: result.data.user.id,
          email: result.data.user.email,
          full_name: userData.full_name || ''
        });
      }

      return AuthResponse.success(user, 'Registration successful! Please check your email for verification.');
    } catch (error) {
      console.error('Registration usecase error:', error);
      return AuthResponse.error(error, error.message || 'Registration failed');
    }
  }


  // ==================== PHONE AUTHENTICATION ====================

  /**
   * Send OTP to phone number
   */
  static async sendOTPUsecase(phone) {
    try {
      // Validate phone number
      if (!AuthDatasource.validatePhoneNumber(phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Generate OTP
      const otp = AuthDatasource.generateOTP(6);

      // Store OTP data
      const storeResult = AuthDatasource.storeOTPData(phone, otp, 5); // 5 minutes expiry

      if (!storeResult.success) {
        throw new Error('Failed to store OTP data');
      }

      // In production, integrate with SMS service like Twilio
      // For demo purposes, show OTP in toast
      toast.info(`Demo OTP: ${otp}`, {
        autoClose: 10000,
        position: "top-center"
      });

      return OTPResponse.success('OTP sent successfully', Date.now() + 5 * 60 * 1000);
    } catch (error) {
      console.error('Send OTP usecase error:', error);
      return OTPResponse.error(error, error.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and authenticate user
   */
  static async verifyOTPUsecase(phone, otp) {
    try {
      // Validate input
      if (!AuthDatasource.validatePhoneNumber(phone)) {
        throw new Error('Invalid phone number');
      }

      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // Get stored OTP data
      const otpData = AuthDatasource.getStoredOTPData();

      // Validate OTP
      if (!otpData.otp || !otpData.phone || !otpData.expiry) {
        throw new Error('No OTP found. Please request a new OTP.');
      }

      if (Date.now() > otpData.expiry) {
        AuthDatasource.clearOTPData();
        throw new Error('OTP has expired. Please request a new OTP.');
      }

      if (otpData.phone !== phone) {
        throw new Error('Phone number mismatch.');
      }

      if (otpData.otp !== otp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // Clear OTP data
      AuthDatasource.clearOTPData();

      // Check if user exists in database
      const profileResult = await AuthDatasource.getUserProfileByPhone(phone);

      // Also check localStorage for phone-only users
      const storedUser = AuthDatasource.getStoredUser();
      let localPhoneUser = null;
      if (storedUser && (storedUser.phone_number === phone || storedUser.phone === phone)) {
        localPhoneUser = storedUser;
      }

      if (profileResult.profile) {
        // User exists in database, log them in
        const user = User.fromJSON({
          ...profileResult.profile,
          auth_type: 'phone'
        });

        // Store user locally
        AuthDatasource.storeUserLocally(user.toJSON());

        return AuthResponse.success(user, 'Login successful!', false);
      } else if (localPhoneUser) {
        // User exists locally, log them in
        const user = User.fromJSON(localPhoneUser);
        return AuthResponse.success(user, 'Login successful!', false);
      } else {
        // New user - store phone temporarily and indicate registration needed
        const tempUser = {
          id: AuthDatasource.generateUniqueId(),
          phone_number: phone,
          phone: phone,
          isNewUser: true,
          tempRegistration: true
        };

        // Store temporarily
        AuthDatasource.storeTempUser(tempUser);

        return AuthResponse.success(tempUser, 'OTP verified successfully', true);
      }
    } catch (error) {
      console.error('Verify OTP usecase error:', error);
      return AuthResponse.error(error, error.message || 'OTP verification failed');
    }
  }

  /**
   * Complete user registration with additional information
   */
  static async completeUserRegistrationUsecase(userInfo) {
    try {
      // Get temporary user data
      const tempUser = AuthDatasource.getTempUser();
      if (!tempUser) {
        throw new Error('No temporary user data found. Please start the registration process again.');
      }

      // Validate required fields
      if (!userInfo.full_name || !userInfo.date_of_birth) {
        throw new Error('Please fill in all required fields.');
      }

      if (userInfo.email && !AuthDatasource.validateEmail(userInfo.email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Create complete user profile
      const newProfile = {
        id: tempUser.id,
        phone_number: tempUser.phone_number,
        email: userInfo.email || null,
        full_name: userInfo.full_name,
        date_of_birth: userInfo.date_of_birth,
        role: 'student',
        created_at: new Date().toISOString()
      };

      // Try to create profile in Supabase
      const createResult = await AuthDatasource.createUserProfile(newProfile);

      let user;
      if (createResult.error) {
        console.error('Error creating profile in Supabase:', createResult.error);
        // Fallback to localStorage if Supabase fails
        const localProfile = {
          ...newProfile,
          phone: tempUser.phone_number,
          auth_type: 'phone'
        };
        user = User.fromJSON(localProfile);
        AuthDatasource.storeUserLocally(localProfile);
        AuthDatasource.clearTempUser();

        return AuthResponse.success(user, 'Account created successfully (local storage)!');
      } else {
        // Successfully created in Supabase
        const userWithPhone = {
          ...createResult.profile,
          phone: tempUser.phone_number,
          auth_type: 'phone'
        };
        user = User.fromJSON(userWithPhone);
        AuthDatasource.storeUserLocally(userWithPhone);
        AuthDatasource.clearTempUser();

        return AuthResponse.success(user, 'Account created successfully!');
      }
    } catch (error) {
      console.error('Registration completion usecase error:', error);
      return AuthResponse.error(error, error.message || 'Registration completion failed');
    }
  }

  // ==================== SESSION MANAGEMENT ====================

  /**
   * Initialize authentication state
   */
  static async initializeAuthUsecase() {
    try {
      // Get initial session with proper initialization
      const sessionResult = await AuthDatasource.initializeSession();

      if (sessionResult.error) {
        throw sessionResult.error;
      }

      let user = null;
      if (sessionResult.session?.user) {
        // Load user profile for authenticated user
        const profileResult = await AuthDatasource.getUserProfile(sessionResult.session.user.id);

        if (profileResult.profile) {
          user = User.fromJSON({
            ...profileResult.profile,
            auth_type: 'email'
          });
        }
      } else {
        // Check for phone-only user in localStorage
        const storedUser = AuthDatasource.getStoredUser();
        if (storedUser) {
          user = User.fromJSON(storedUser);
        }
      }

      return {
        session: sessionResult.session,
        user,
        error: null
      };
    } catch (error) {
      console.error('Initialize auth usecase error:', error);
      return {
        session: null,
        user: null,
        error
      };
    }
  }

  /**
   * Logout user
   */
  static async logoutUsecase() {
    try {
      // Sign out from Supabase
      await AuthDatasource.signOut();

      // Clear local storage
      AuthDatasource.clearStoredUser();
      AuthDatasource.clearTempUser();

      return AuthResponse.success(null, 'Logged out successfully');
    } catch (error) {
      console.error('Logout usecase error:', error);
      return AuthResponse.error(error, error.message || 'Error logging out');
    }
  }

  // ==================== COURSE OPERATIONS ====================

  /**
   * Purchase course
   */
  static async purchaseCourseUsecase(user, courseId, mode = 'online', courseData) {
    try {
      if (!user) {
        throw new Error('Please login first');
      }

      if (!courseData) {
        throw new Error('Course not found');
      }

      // Check if already enrolled
      const enrollmentResult = await AuthDatasource.getCourseEnrollment(user.id, courseId);

      if (enrollmentResult.enrollment) {
        throw new Error('Course already purchased');
      }

      const price = mode === 'online' ? courseData.onlinePrice : courseData.offlinePrice;

      // Get the current Supabase auth user ID for RLS policy compliance
      // const sessionResult = await AuthDatasource.getSession();
      // const authUserId = sessionResult.session?.user?.id;

      // if (!authUserId) {
      //   throw new Error('Authentication required. Please login again.');
      // }

      // Create enrollment record using only columns that exist in the actual table
      // Use Supabase auth user ID to satisfy RLS policy: auth.uid() = user_id
      let enrollmentData = {
        user_id: user.id,
        course_id: courseId,
        progress: 0,
        status: 'active'
      };

      let createResult = await AuthDatasource.createCourseEnrollment(enrollmentData);

      // If enrollment still fails, try with minimal data
      if (createResult.error) {
        console.log('First enrollment attempt failed:', createResult.error.message);

        // Fallback to minimal enrollment data
        enrollmentData = {
          user_id: user.id,
          course_id: courseId,
          status: 'active'
        };

        createResult = await AuthDatasource.createCourseEnrollment(enrollmentData);
      }

      if (createResult.error) {
        throw createResult.error;
      }

      return AuthResponse.success(
        createResult.enrollment,
        `Course purchased successfully! Mode: ${mode.toUpperCase()}`
      );
    } catch (error) {
      console.error('Purchase course usecase error:', error);
      return AuthResponse.error(error, error.message || 'Course purchase failed');
    }
  }

  /**
   * Update course progress
   */
  static async updateProgressUsecase(user, courseId, progress) {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateResult = await AuthDatasource.updateCourseProgress(user.id, courseId, progress);

      if (updateResult.error) {
        throw updateResult.error;
      }

      return AuthResponse.success(updateResult.enrollment, 'Progress updated successfully');
    } catch (error) {
      console.error('Update progress usecase error:', error);
      return AuthResponse.error(error, error.message || 'Failed to update progress');
    }
  }

  /**
   * Get user enrollments
   */
  static async getUserEnrollmentsUsecase(user) {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const enrollmentsResult = await AuthDatasource.getUserEnrollments(user.id);

      if (enrollmentsResult.error) {
        throw enrollmentsResult.error;
      }

      return AuthResponse.success(enrollmentsResult.enrollments, 'Enrollments retrieved successfully');
    } catch (error) {
      console.error('Get user enrollments usecase error:', error);
      return AuthResponse.error(error, error.message || 'Failed to get enrollments');
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Load user profile by auth user
   */
  static async loadUserProfileUsecase(authUser) {
    try {
      const profileResult = await AuthDatasource.getUserProfile(authUser.id);

      if (profileResult.profile) {
        return User.fromJSON({
          id: authUser.id,
          email: authUser.email,
          phone: profileResult.profile.phone_number || authUser.phone,
          ...profileResult.profile,
          auth_type: 'email'
        });
      } else {
        // Create new profile if doesn't exist
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          phone_number: authUser.phone || '',
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          role: 'student'
        };

        const createResult = await AuthDatasource.createUserProfile(newProfile);

        if (createResult.profile) {
          return User.fromJSON({
            ...authUser,
            ...createResult.profile,
            auth_type: 'email'
          });
        }
      }

      // Return a basic user object if profile operations fail
      return User.fromJSON({
        id: authUser.id,
        email: authUser.email,
        phone: authUser.phone || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
        role: 'student',
        auth_type: 'email'
      });
    } catch (error) {
      console.error('Load user profile usecase error:', error);
      // Return a basic user object instead of throwing error
      return User.fromJSON({
        id: authUser.id,
        email: authUser.email,
        phone: authUser.phone || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
        role: 'student',
        auth_type: 'email'
      });
    }
  }
}

export default AuthUsecase;
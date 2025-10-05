import { supabase, authHelpers } from '../supabase';

export class AuthDatasource {
 

  /**
   * Sign out current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear manually stored session
      this.clearStoredSession();
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  /**
   * Initialize session - waits for Supabase to be ready and restores session
   */
  static async initializeSession() {
    try {
      console.log('🚀 AuthDatasource: Initializing session...');

      const storedSession = this.getStoredSession();
      if (storedSession) {
        console.log('✅ AuthDatasource: Found manually stored session');
        return { 
          session: storedSession, 
          user: storedSession.user 
        };
      }
      
      // Wait a bit for Supabase to initialize if needed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to get session with retry logic
      const result = await this.getSession();
      
      console.log('🎯 AuthDatasource: Session initialization result:', {
        hasSession: !!result.session,
        hasUser: !!result.session?.user,
        error: result.error?.message
      });
      
      return result;
    } catch (error) {
      console.error('❌ AuthDatasource: Session initialization error:', error);
      return { session: null, error };
    }
  }

  /**
   * Get current session with retry logic for better session restoration
   */
  static async getSession(retryCount = 0, maxRetries = 3) {
    try {
      console.log(`🔍 AuthDatasource: Getting session (attempt ${retryCount + 1}/${maxRetries + 1})...`);
      
      // Check localStorage before calling getSession
      let hasLocalAuth = false;
      try {
        console.log('🌐 AuthDatasource: Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
        
        // Check all possible localStorage keys for Supabase auth
        const allKeys = Object.keys(localStorage);
        const supabaseKeys = allKeys.filter(key => key.includes('supabase') || key.includes('sb-'));
        console.log('🗄️ AuthDatasource: All localStorage keys:', allKeys);
        console.log('🗄️ AuthDatasource: Supabase-related keys:', supabaseKeys);
        
        // Try different possible key formats
        const possibleKeys = [
          'sb-' + process.env.REACT_APP_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token',
          'supabase.auth.token',
          'sb-auth-token'
        ];
        
        console.log('🔑 AuthDatasource: Trying keys:', possibleKeys);
        
        for (const key of possibleKeys) {
          const localAuth = localStorage.getItem(key);
          if (localAuth) {
            console.log(`✅ AuthDatasource: Found auth data with key: ${key}`);
            hasLocalAuth = true;
            try {
              const parsed = JSON.parse(localAuth);
              console.log('🗄️ AuthDatasource: LocalStorage session data:', {
                hasAccessToken: !!parsed?.access_token,
                hasRefreshToken: !!parsed?.refresh_token,
                hasUser: !!parsed?.user,
                expiresAt: parsed?.expires_at,
                currentTime: Math.floor(Date.now() / 1000),
                isExpired: parsed?.expires_at ? Math.floor(Date.now() / 1000) > parsed.expires_at : 'unknown'
              });
              break;
            } catch (parseError) {
              console.error(`❌ AuthDatasource: Error parsing ${key}:`, parseError);
            }
          }
        }
      } catch (localStorageError) {
        console.error('❌ AuthDatasource: Error checking localStorage:', localStorageError);
      }
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('📊 AuthDatasource: getSession result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        sessionId: session?.access_token ? session.access_token.substring(0, 20) + '...' : null,
        userId: session?.user?.id,
        error: error?.message
      });
      
      // If we have localStorage auth data but no session, and we haven't exceeded retries, try again
      if (hasLocalAuth && !session && !error && retryCount < maxRetries) {
        console.log(`⏳ AuthDatasource: LocalStorage has auth data but no session found. Retrying in 500ms...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.getSession(retryCount + 1, maxRetries);
      }
      
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      console.error('❌ AuthDatasource: getSession error:', error);
      
      // If we still don't have a session after retries, check manually stored session
      console.log('🔍 AuthDatasource: Checking manually stored session as fallback...');
      const storedSession = this.getStoredSession();
      if (storedSession) {
        console.log('✅ AuthDatasource: Found manually stored session as fallback');
        return { 
          session: storedSession, 
          user: storedSession.user 
        };
      }
      
      return { session: null, error };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  /**
   * Create Supabase Auth user
   */
  static async createAuthUser(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('AuthDatasource createAuthUser error:', error);
      return { user: null, session: null, error };
    }
  }

  // ==================== USER PROFILE OPERATIONS ====================

  /**
   * Load user profile by ID
   */
  static async getUserProfile(userId) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return { profile, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }

  /**
   * Get user profile by phone number
   */
  static async getUserProfileByPhone(phoneNumber) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return { profile, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }

  /**
   * Get user profile by email
   */
  static async getUserProfileByEmail(email) {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return { profile, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }

  /**
   * Create new user profile
   */
  static async createUserProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error };
    }
  }

  /**
   * Check if user is enrolled in a course
   */
  static async getCourseEnrollment(userId, courseId) {
    try {
      const { data: enrollment, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return { enrollment, error: null };
    } catch (error) {
      return { enrollment: null, error };
    }
  }

  /**
   * Create course enrollment
   */
  static async createCourseEnrollment(enrollmentData) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert([enrollmentData])
        .select()
        .single();

      if (error) throw error;
      return { enrollment: data, error: null };
    } catch (error) {
      return { enrollment: null, error };
    }
  }

  /**
   * Update course progress
   */
  static async updateCourseProgress(userId, courseId, progressData) {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: progressData.completed,
          completed_lessons: progressData.completedLessons,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .select()
        .single();

      if (error) throw error;
      return { enrollment: data, error: null };
    } catch (error) {
      return { enrollment: null, error };
    }
  }

  /**
   * Get all user enrollments
   */
  static async getUserEnrollments(userId) {
    try {
      const { data: enrollments, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return { enrollments, error: null };
    } catch (error) {
      return { enrollments: [], error };
    }
  }


  /**
   * Store OTP data in localStorage
   */
  static storeOTPData(phone, otp, expiryMinutes = 5) {
    try {
      localStorage.setItem('currentOTP', otp);
      localStorage.setItem('otpPhone', phone);
      localStorage.setItem('otpExpiry', Date.now() + expiryMinutes * 60 * 1000);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Get stored OTP data
   */
  static getStoredOTPData() {
    try {
      const storedOTP = localStorage.getItem('currentOTP');
      const storedPhone = localStorage.getItem('otpPhone');
      const otpExpiry = localStorage.getItem('otpExpiry');

      return {
        otp: storedOTP,
        phone: storedPhone,
        expiry: otpExpiry ? parseInt(otpExpiry) : null
      };
    } catch (error) {
      return { otp: null, phone: null, expiry: null };
    }
  }

  /**
   * Clear OTP data from localStorage
   */
  static clearOTPData() {
    try {
      localStorage.removeItem('currentOTP');
      localStorage.removeItem('otpPhone');
      localStorage.removeItem('otpExpiry');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // ==================== LOCAL STORAGE USER OPERATIONS ====================

  /**
   * Store user data in localStorage
   */
  static storeUserLocally(userData) {
    try {
      localStorage.setItem('techaddaa_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // ==================== MANUAL SESSION PERSISTENCE ====================

  /**
   * Store Supabase session manually in localStorage
   */
  static storeSession(session) {
    try {
      if (session) {
        const sessionData = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
          expires_in: session.expires_in,
          token_type: session.token_type,
          user: session.user
        };
        localStorage.setItem('techaddaa_session', JSON.stringify(sessionData));
        console.log('💾 AuthDatasource: Manually stored session in localStorage');
        return { success: true };
      }
      return { success: false, error: 'No session to store' };
    } catch (error) {
      console.error('❌ AuthDatasource: Error storing session:', error);
      return { success: false, error };
    }
  }

  /**
   * Get stored session from localStorage
   */
  static getStoredSession() {
    try {
      const storedSession = localStorage.getItem('techaddaa_session');
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        
        // Check if session is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (sessionData.expires_at && currentTime > sessionData.expires_at) {
          console.log('⏰ AuthDatasource: Stored session is expired, removing...');
          this.clearStoredSession();
          return null;
        }
        
        console.log('✅ AuthDatasource: Retrieved valid session from localStorage');
        return sessionData;
      }
      return null;
    } catch (error) {
      console.error('❌ AuthDatasource: Error getting stored session:', error);
      return null;
    }
  }

  /**
   * Clear stored session from localStorage
   */
  static clearStoredSession() {
    try {
      localStorage.removeItem('techaddaa_session');
      console.log('🗑️ AuthDatasource: Cleared stored session from localStorage');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthDatasource: Error clearing stored session:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user data from localStorage
   */
  static getStoredUser() {
    try {
      const storedUser = localStorage.getItem('techaddaa_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear user data from localStorage
   */
  static clearStoredUser() {
    try {
      localStorage.removeItem('techaddaa_user');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Store temporary user data
   */
  static storeTempUser(userData) {
    try {
      localStorage.setItem('temp_phone_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Get temporary user data
   */
  static getTempUser() {
    try {
      const tempUser = localStorage.getItem('temp_phone_user');
      return tempUser ? JSON.parse(tempUser) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear temporary user data
   */
  static clearTempUser() {
    try {
      localStorage.removeItem('temp_phone_user');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Generate OTP
   */
  static generateOTP(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  /**
   * Generate unique ID (browser-compatible)
   */
  static generateUniqueId() {
    // Generate a UUID-like string using browser-compatible methods
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    } else {
      // Fallback UUID generation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

  /**
   * Validate phone number
   */
  static validatePhoneNumber(phone) {
    return phone && phone.length === 10 && /^\d{10}$/.test(phone);
  }

  /**
   * Validate email
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default AuthDatasource;
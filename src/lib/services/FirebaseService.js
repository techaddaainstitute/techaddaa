import { 
  auth
} from '../firebase';
import { 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';

export class FirebaseOTPService {
  
  static recaptchaVerifier = null;
  static confirmationResult = null;

  // Initialize reCAPTCHA verifier
  static initializeRecaptcha(containerId = 'recaptcha-container', options = {}) {
    try {
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }

      const defaultOptions = {
        size: 'invisible',
        callback: (response) => {
          console.log('🔥 reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          console.log('🔥 reCAPTCHA expired');
        }
      };

      this.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        containerId,
        { ...defaultOptions, ...options }
      );

      console.log('🔥 reCAPTCHA verifier initialized');
      return {
        success: true,
        verifier: this.recaptchaVerifier
      };
    } catch (error) {
      console.error('🔥 reCAPTCHA initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send OTP to phone number
  static async sendOTP(phoneNumber, recaptchaContainerId = 'recaptcha-container') {
    try {
      // Ensure phone number is in international format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      console.log('🔥 Sending OTP to:', formattedPhone);

      // Initialize reCAPTCHA if not already done
      if (!this.recaptchaVerifier) {
        const recaptchaResult = this.initializeRecaptcha(recaptchaContainerId);
        if (!recaptchaResult.success) {
          return recaptchaResult;
        }
      }

      // Send OTP
      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        this.recaptchaVerifier
      );

      console.log('🔥 OTP sent successfully');
      return {
        success: true,
        message: 'OTP sent successfully',
        verificationId: this.confirmationResult.verificationId
      };

    } catch (error) {
      console.error('🔥 Send OTP error:', error);
      
      // Handle specific Firebase Auth errors
      let errorMessage = 'Failed to send OTP';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'reCAPTCHA verification failed';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code
      };
    }
  }

  // Verify OTP
  static async verifyOTP(otpCode) {
    try {
      if (!this.confirmationResult) {
        return {
          success: false,
          error: 'No OTP verification in progress. Please request OTP first.'
        };
      }

      console.log('🔥 Verifying OTP:', otpCode);

      const result = await this.confirmationResult.confirm(otpCode);
      const user = result.user;

      console.log('🔥 OTP verification successful:', user.phoneNumber);

      return {
        success: true,
        message: 'Phone number verified successfully',
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          isAnonymous: user.isAnonymous,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime
          }
        }
      };

    } catch (error) {
      console.error('🔥 Verify OTP error:', error);
      
      let errorMessage = 'OTP verification failed';
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid OTP code';
          break;
        case 'auth/code-expired':
          errorMessage = 'OTP code has expired';
          break;
        case 'auth/session-expired':
          errorMessage = 'Verification session expired. Please request new OTP';
          break;
        default:
          errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code
      };
    }
  }

  // Resend OTP (same as sendOTP but clears previous state)
  static async resendOTP(phoneNumber, recaptchaContainerId = 'recaptcha-container') {
    try {
      // Clear previous confirmation result
      this.confirmationResult = null;
      
      // Clear and reinitialize reCAPTCHA
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      console.log('🔥 Resending OTP to:', phoneNumber);
      return await this.sendOTP(phoneNumber, recaptchaContainerId);

    } catch (error) {
      console.error('🔥 Resend OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sign out current user
  static async signOut() {
    try {
      await auth.signOut();
      
      // Clear verification state
      this.confirmationResult = null;
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      console.log('🔥 User signed out successfully');
      return {
        success: true,
        message: 'Signed out successfully'
      };

    } catch (error) {
      console.error('🔥 Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current authenticated user
  static getCurrentUser() {
    const user = auth.currentUser;
    if (user) {
      return {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        isAnonymous: user.isAnonymous,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        }
      };
    }
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        callback({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          isAnonymous: user.isAnonymous,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime
          }
        });
      } else {
        callback(null);
      }
    });
  }

  // Clean up resources
  static cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}

export default FirebaseOTPService;
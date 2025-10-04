import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseService from '../lib/services/FirebaseService';

const FirebaseContext = createContext();

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 FirebaseContext: Initializing Firebase auth state listener...');
    
    // Set up Firebase auth state listener
    const unsubscribe = FirebaseService.onAuthStateChanged((user) => {
      console.log('🔥 Firebase auth state changed:', user ? 'User signed in' : 'User signed out');
      setFirebaseUser(user);
      setFirebaseLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔥 FirebaseContext: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Firebase OTP Authentication Methods
  const sendOTP = async (phoneNumber, recaptchaContainerId = 'recaptcha-container') => {
    setFirebaseLoading(true);
    try {
      const result = await FirebaseService.sendOTP(phoneNumber, recaptchaContainerId);
      if (result.success) {
        console.log('🔥 OTP sent successfully');
      }
      return result;
    } catch (error) {
      console.error('🔥 Send OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setFirebaseLoading(false);
    }
  };

  const verifyOTP = async (otpCode) => {
    setFirebaseLoading(true);
    try {
      const result = await FirebaseService.verifyOTP(otpCode);
      if (result.success) {
        console.log('🔥 OTP verified successfully');
      }
      return result;
    } catch (error) {
      console.error('🔥 Verify OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setFirebaseLoading(false);
    }
  };

  const signOutFromFirebase = async () => {
    setFirebaseLoading(true);
    try {
      const result = await FirebaseService.signOut();
      if (result.success) {
        console.log('🔥 Firebase sign out successful');
      }
      return result;
    } catch (error) {
      console.error('🔥 Firebase sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setFirebaseLoading(false);
    }
  };

  const resendOTP = async (phoneNumber, recaptchaContainerId = 'recaptcha-container') => {
    setFirebaseLoading(true);
    try {
      const result = await FirebaseService.resendOTP(phoneNumber, recaptchaContainerId);
      if (result.success) {
        console.log('🔥 OTP resent successfully');
      }
      return result;
    } catch (error) {
      console.error('🔥 Resend OTP error:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Utility Methods
  const getCurrentUser = () => {
    return FirebaseService.getCurrentUser();
  };

  const isAuthenticated = () => {
    return FirebaseService.isAuthenticated();
  };

  const cleanup = () => {
    FirebaseService.cleanup();
  };

  const value = {
    // Firebase Auth State
    firebaseUser,
    firebaseLoading,
    
    // OTP Authentication Methods
    sendOTP,
    verifyOTP,
    resendOTP,
    signOutFromFirebase,
    
    // Utility Methods
    getCurrentUser,
    isAuthenticated,
    cleanup
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
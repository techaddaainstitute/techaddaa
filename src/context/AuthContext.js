import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import AuthUsecase from '../lib/usecase/AuthUsecase';
import CourseUsecase from '../lib/usecase/CourseUsecase';
import { User } from '../lib/model/User';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    console.log('🔄 AuthContext: Starting initialization...');

    // Check localStorage for existing user data and restore immediately
    const checkLocalStorage = () => {
      try {
        // Check for techaddaa_user key
        const techaddaaUser = localStorage.getItem('techaddaa_user');
        console.log('🗄️ AuthContext: LocalStorage techaddaa_user exists:', !!techaddaaUser);

        if (techaddaaUser) {
          const userData = JSON.parse(techaddaaUser);
          console.log('🗄️ AuthContext: LocalStorage user data:', {
            hasId: !!userData?.id,
            hasEmail: !!userData?.email,
            hasFullName: !!userData?.full_name,
            hasPhone: !!userData?.phone_number,
            role: userData?.role
          });

          // Immediately restore user if available to reduce perceived loading time
          console.log('⚡ AuthContext: Early user restoration from localStorage:', userData.id);
          setUser(userData);
        }

        // Also check Supabase auth token for session info
        const supabaseAuth = localStorage.getItem('sb-' + process.env.REACT_APP_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
        if (supabaseAuth) {
          const parsed = JSON.parse(supabaseAuth);
          console.log('🗄️ AuthContext: Supabase session data:', {
            hasAccessToken: !!parsed?.access_token,
            hasRefreshToken: !!parsed?.refresh_token,
            expiresAt: parsed?.expires_at,
            currentTime: Math.floor(Date.now() / 1000)
          });
        }
      } catch (error) {
        console.error('❌ AuthContext: Error checking localStorage:', error);
      }
    };

    checkLocalStorage();

    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthContext: Calling initializeAuthUsecase...');

        // First, try to restore user from localStorage if available
        let restoredUser = null;
        try {
          // Check techaddaa_user first (priority)
          const techaddaaUser = localStorage.getItem('techaddaa_user');
          if (techaddaaUser) {
            restoredUser = JSON.parse(techaddaaUser);
            console.log('👤 AuthContext: Restored user from techaddaa_user:', restoredUser.id);
            setUser(restoredUser);
          } else {
            // Fallback to Supabase auth token
            const supabaseAuth = localStorage.getItem('sb-' + process.env.REACT_APP_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
            if (supabaseAuth) {
              const parsed = JSON.parse(supabaseAuth);
              if (parsed?.user) {
                restoredUser = parsed.user;
                console.log('👤 AuthContext: Restored user from Supabase auth:', restoredUser.id);
                setUser(restoredUser);
              }
            }
          }
        } catch (localStorageError) {
          console.error('❌ AuthContext: Error restoring user from localStorage:', localStorageError);
        }

        const { session, user, error } = await AuthUsecase.initializeAuthUsecase();

        console.log('📊 AuthContext: Initial session result:', {
          hasSession: !!session,
          hasUser: !!user,
          hasRestoredUser: !!restoredUser,
          sessionId: session?.access_token ? session.access_token.substring(0, 20) + '...' : null,
          userId: user?.id,
          restoredUserId: restoredUser?.id,
          error: error?.message
        });

        if (error) {
          console.error('❌ AuthContext: Error during initialization:', error);
          setError(error.message);
          // Keep the restored user if session initialization fails but we have localStorage data
          if (!restoredUser) {
            setUser(null);
          }
        } else {
          setSession(session);
          // Use the user from session if available, otherwise keep the restored user
          if (user) {
            setUser(user);
          } else if (session && !restoredUser) {
            // Create basic user from session if no user profile and no restored user
            const basicUser = {
              id: session.user.id,
              email: session.user.email,
              phone: session.user.phone,
              user_metadata: session.user.user_metadata || {},
              app_metadata: session.user.app_metadata || {}
            };
            setUser(basicUser);
          }
        }
      } catch (err) {
        console.error('💥 AuthContext: Exception during initialization:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // // Set up auth state change listener
    // console.log('👂 AuthContext: Setting up auth state change listener...');
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   console.log('🔔 AuthContext: Auth state changed:', {
    //     event,
    //     hasSession: !!session,
    //     sessionId: session?.access_token ? session.access_token.substring(0, 20) + '...' : null,
    //     userId: session?.user?.id,
    //     timestamp: new Date().toISOString()
    //   });

    //   // Check localStorage after auth state change
    //   try {
    //     const supabaseAuth = localStorage.getItem('sb-' + process.env.REACT_APP_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
    //     console.log('🗄️ AuthContext: LocalStorage after auth change:', {
    //       hasToken: !!supabaseAuth,
    //       event: event
    //     });
    //   } catch (error) {
    //     console.error('❌ AuthContext: Error checking localStorage after auth change:', error);
    //   }

    //   if (session) {
    //     try {
    //       console.log('👤 AuthContext: Loading user profile for session...');
    //       const userProfile = await AuthUsecase.loadUserProfileUsecase(session.user);

    //       let finalUser;
    //       if (userProfile) {
    //         console.log('✅ AuthContext: User profile loaded successfully:', userProfile.id);
    //         finalUser = userProfile;
    //       } else {
    //         console.log('⚠️ AuthContext: No user profile, creating basic user object');
    //         // Create a basic user object if profile loading fails
    //         finalUser = {
    //           id: session.user.id,
    //           email: session.user.email,
    //           phone: session.user.phone,
    //           user_metadata: session.user.user_metadata || {},
    //           app_metadata: session.user.app_metadata || {}
    //         };
    //       }

    //       setUser(finalUser);
    //       setSession(session);
    //       setError(null);

    //       // Update localStorage with the current user data for future reloads
    //       try {
    //         // Save user data with techaddaa_user key
    //         localStorage.setItem('techaddaa_user', JSON.stringify(finalUser));
    //         console.log('💾 AuthContext: Saved user data to techaddaa_user key');

    //         // Also update Supabase auth token if it exists (for compatibility)
    //         const supabaseAuthKey = 'sb-' + process.env.REACT_APP_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token';
    //         const existingAuth = localStorage.getItem(supabaseAuthKey);
    //         if (existingAuth) {
    //           const parsed = JSON.parse(existingAuth);
    //           parsed.user = finalUser;
    //           localStorage.setItem(supabaseAuthKey, JSON.stringify(parsed));
    //           console.log('💾 AuthContext: Updated Supabase localStorage with user data');
    //         }
    //       } catch (storageError) {
    //         console.error('❌ AuthContext: Error updating localStorage:', storageError);
    //       }

    //     } catch (error) {
    //       console.error('❌ AuthContext: Error loading user profile:', error);
    //       // Don't clear the session, just create a basic user
    //       const basicUser = {
    //         id: session.user.id,
    //         email: session.user.email,
    //         phone: session.user.phone,
    //         user_metadata: session.user.user_metadata || {},
    //         app_metadata: session.user.app_metadata || {}
    //       };
    //       setUser(basicUser);
    //       setSession(session);

    //       // Update localStorage even with basic user
    //       try {
    //         // Save basic user data with techaddaa_user key
    //         localStorage.setItem('techaddaa_user', JSON.stringify(basicUser));
    //         console.log('💾 AuthContext: Saved basic user data to techaddaa_user key');

    //         // Also update Supabase auth token if it exists (for compatibility)
    //         const supabaseAuthKey = 'sb-' + process.env.REACT_APP_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token';
    //         const existingAuth = localStorage.getItem(supabaseAuthKey);
    //         if (existingAuth) {
    //           const parsed = JSON.parse(existingAuth);
    //           parsed.user = basicUser;
    //           localStorage.setItem(supabaseAuthKey, JSON.stringify(parsed));
    //           console.log('💾 AuthContext: Updated Supabase localStorage with basic user data');
    //         }
    //       } catch (storageError) {
    //         console.error('❌ AuthContext: Error updating localStorage with basic user:', storageError);
    //       }
    //     }
    //   } else {
    //     console.log('🚪 AuthContext: No session, clearing user state');
    //     console.log('🔍 AuthContext: Event that caused session clearing:', event);
    //     setUser(null);
    //     setSession(null);
    //     setError(null);

    //     // Clear localStorage when session is cleared
    //     try {
    //       localStorage.removeItem('techaddaa_user');
    //       console.log('🗑️ AuthContext: Cleared techaddaa_user from localStorage');
    //     } catch (storageError) {
    //       console.error('❌ AuthContext: Error clearing localStorage:', storageError);
    //     }
    //   }
    // });

    // return () => {
    //   console.log('🧹 AuthContext: Cleaning up auth state listener');
    //   subscription.unsubscribe();
    // };
  }, []);

  // Fetch all courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      try {
        console.log('📚 AuthContext: Fetching courses from database...');
        const result = await CourseUsecase.getAllCoursesUsecase();

        if (result.success && result.data) {
          // Convert to mock course format for compatibility
          const mockFormatCourses = CourseUsecase.convertToMockCourseFormat(result.data);
          setCourses(mockFormatCourses);
          console.log('✅ AuthContext: Successfully loaded', mockFormatCourses.length, 'courses from database');
        } else {
          console.warn('⚠️ AuthContext: Failed to fetch courses from database, using fallback');
          setCourses(mockCourses);
        }
      } catch (error) {
        console.error('❌ AuthContext: Error fetching courses:', error);
        setCourses(mockCourses);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const mockCourses = [];



  // Register new user
  const register = async (email, password, userData = {}) => {
    setLoading(true);
    try {
      const result = await AuthUsecase.registerUsecase(email, password, userData);

      if (result.success) {
        toast.success(result.message);
        return { success: true, message: result.message };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };


  // Send OTP for phone authentication
  const sendOTP = async (phone) => {
    setLoading(true);
    try {
      const result = await AuthUsecase.sendOTPUsecase(phone);

      if (result.success) {
        toast.info(result.message, {
          autoClose: 10000,
          position: "top-center"
        });
        return { success: true, message: result.message };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and authenticate user
  const verifyOTP = async (phone, otp) => {
    setLoading(true);
    try {
      const result = await AuthUsecase.verifyOTPUsecase(phone, otp);

      if (result.success) {
        if (result.data && !result.isNewUser) {
          setUser(result.data);
          toast.success(result.message);
        }
        return result;
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'OTP verification failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Complete user registration with additional information
  const completeUserRegistration = async (userInfo) => {
    setLoading(true);
    try {
      const result = await AuthUsecase.completeUserRegistrationUsecase(userInfo);

      if (result.success) {
        if (result.data) {
          setUser(result.data);
        }
        toast.success(result.message);
        return { success: true, message: result.message };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Registration completion error:', error);
      toast.error(error.message || 'Registration completion failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const result = await AuthUsecase.logoutUsecase();

      if (result.success) {
        setUser(null);
        setSession(null);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    } finally {
      setLoading(false);
    }
  };

  // Function to convert integer course IDs to consistent UUIDs


  const purchaseCourse = useCallback(async (courseId, mode = 'online') => {
    if (!user) return { success: false, message: 'Please login first' };

    setLoading(true);
    try {
      let course = courses.find(c => c.id === courseId);

      // If course not found in loaded courses, try to fetch it from database
      if (!course) {
        console.log('🔍 Course not found in loaded courses, fetching from database...');
        try {
          const courseResult = await CourseUsecase.getCourseByIdUsecase(String(courseId));
          if (courseResult.success && courseResult.data) {
            course = courseResult.data.toMockCourseFormat();
            console.log('✅ Successfully fetched course from database:', course.title);
          }
        } catch (fetchError) {
          console.warn('⚠️ Failed to fetch course from database:', fetchError);
        }
      }

      const result = await AuthUsecase.purchaseCourseUsecase(user, courseId, mode, course);

      if (result.success) {
        // Update user's purchased courses in local state (keep using integer ID for frontend)
        const updatedUser = {
          ...user,
          purchasedCourses: [...(user.purchasedCourses || []), courseId]
        };
        setUser(updatedUser);

        toast.success(result.message);
        return { success: true, message: result.message };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error.message || 'Course purchase failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, courses]);

  const updateProgress = async (courseId, progress) => {
    if (!user) return { success: false, message: 'Please login first' };

    setLoading(true);
    try {
      const result = await AuthUsecase.updateProgressUsecase(user, courseId, progress);

      if (result.success) {
        toast.success(result.message);
        return { success: true, message: result.message };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Progress update error:', error);
      toast.error(error.message || 'Progress update failed');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    session,
    register,
    sendOTP,
    verifyOTP,
    completeUserRegistration,
    logout,
    purchaseCourse,
    updateProgress,
    mockCourses: courses, // Use dynamic courses from database
    coursesLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
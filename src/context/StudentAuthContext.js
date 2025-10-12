// context/StudentAuthContext.js
import { toast } from 'react-toastify';
import React, { createContext, useContext, useState, useEffect } from "react";
import { Status } from "../tool";
import { StudentAuthDataSource } from "../lib/datasource/StudentAuthDatasource";

const StudentAuthContext = createContext();
export const useStudentAuth = () => useContext(StudentAuthContext);

export const StudentAuthProvider = ({ children }) => {
  const [state, setState] = useState({
    sendOtpStatus: Status.INIT,
    verifyOtpStatus: Status.INIT,
    loginStatus: Status.INIT,
    isNewUser: false,
    error: null,
    user: null,
  });

  // Initialize auth state from local storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const restoredData = await StudentAuthDataSource.getUserFromStorage();

        if (restoredData) {
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              user: restoredData
            }));
          }, 0);
          console.log("Restored user data:", restoredData);

        }
      } catch (error) {
        console.warn("Failed to initialize auth:", error);
      }
    };
    initializeAuth();
  }, []);

  // 🔹 sendOtp (generate random & save locally)
  const sendOtp = async (phone) => {
    setState((prev) => ({
      ...prev, sendOtpStatus: Status.LOADING,
    }));

    const result = await StudentAuthDataSource.sendOtp(phone);
    if (result) {
      toast.success("OTP sent successfully!");
      setState((prev) => ({ ...prev, sendOtpStatus: Status.SUCCESS }));
      // Defer reset so BlocConsumer listener can catch SUCCESS
      setTimeout(() => {
        setState((prev) => ({ ...prev, sendOtpStatus: Status.INIT }));
      }, 0);
    } else {
      toast.error("Failed to send OTP. Please try again.");
      setState((prev) => ({ ...prev, sendOtpStatus: Status.ERROR }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, sendOtpStatus: Status.INIT }));
      }, 0);
    }
  };
  const updateLocalProfile = async (data) => {
    const result = StudentAuthDataSource.saveUserToStorage(data);
    if (result) {
      setState((prev) => ({ ...prev, user: data }));
    }
  };

  // 🔹 verifyOtp
  const verifyOtp = async (phone, otp) => {
    setState((prev) => ({ ...prev, verifyOtpStatus: Status.LOADING }));
    try {
      const result = await StudentAuthDataSource.verifyOtp(phone, otp);
      if (result.otpVerify) {
        toast.success("OTP verified successfully!");
        setState((prev) => ({
          ...prev,
          verifyOtpStatus: Status.SUCCESS,
          user: result.user,
          isNewUser: result.user == null,
        }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, verifyOtpStatus: Status.INIT }));
        }, 0);
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (err) {
      toast.error(`${err.message}`);
      setState((prev) => ({ ...prev, verifyOtpStatus: Status.ERROR }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, verifyOtpStatus: Status.INIT }));
      }, 0);
    }
  };

  // 🔹 registerProfile
  const registerProfile = async ({ name, email, phone, dob }) => {
    setState((prev) => ({ ...prev, loginStatus: Status.LOADING }));
    try {
      const result = await StudentAuthDataSource.registerUser({ name, email, phone, dob });
      if (result) {
        toast.success("Student profile created successfully!");
        setState((prev) => ({ ...prev, loginStatus: Status.SUCCESS, user: result }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, loginStatus: Status.INIT }));
        }, 0);
      } else {
        throw new Error("Failed to create student profile");
      }
    } catch (err) {
      toast.error(`${err.message}`);
      setState((prev) => ({ ...prev, loginStatus: Status.ERROR }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, loginStatus: Status.INIT }));
      }, 0);
    }
  };

  // 🔹 logout
  const logout = async () => {
    StudentAuthDataSource.clearUserFromStorage();
    setState({
      sendOtpStatus: Status.INIT,
      verifyOtpStatus: Status.INIT,
      loginStatus: Status.INIT,
      isNewUser: false,
      error: null,
      user: null,
    });
    toast.success("Logout successful!");
  };

  return (
    <StudentAuthContext.Provider
      value={{
        state,
        sendOtp,
        verifyOtp,
        registerProfile,
        logout,
        updateLocalProfile
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

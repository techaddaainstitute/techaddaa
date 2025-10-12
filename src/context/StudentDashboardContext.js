import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { Status } from "../tool";
import { StudentDatasource } from "../lib/datasource/StudentDatasource";
import { useStudentAuth } from "./StudentAuthContext";
import { User } from "../lib/model/User";
import StudentEnrollment from "../lib/model/StudentEnrollment";
const StudentDashboardContext = createContext();
export const useStudentDashboard = () => useContext(StudentDashboardContext);

export const StudentDashboardProvider = ({ children }) => {
  const { state: authState } = useStudentAuth();
  const { user } = authState;

  const [state, setState] = useState({
    myCourses: [],
    myFees: null,
    profile: null,
    initStatus: Status.INIT,
    profileStatus: Status.INIT,
    enrollmentsStatus: Status.INIT,
    feesStatus: Status.INIT,
    updateProfileStatus: Status.INIT,
    markPaidStatus: Status.INIT,
  });




  const loadInit = async (userId) => {
    setState((prev) => ({ ...prev, initStatus: Status.LOADING }));

    try {
      const [profileResult, enrollmentsResult, feesResult] = await Promise.all([
        StudentDatasource.getStudentProfile(userId),
        StudentDatasource.getStudentEnrollments(userId),
        StudentDatasource.getFeesData(userId)
      ]);
      if (profileResult.data == null) {
        toast.error("Profile not found Login Again");
        return;
      }
      console.log(profileResult, enrollmentsResult, feesResult, userId);
      const profile = profileResult.data ? User.fromJSON(profileResult.data) : null;
      const enrollments = enrollmentsResult.data
        ? enrollmentsResult.data.map(enrollment => StudentEnrollment.fromDatabaseRow(enrollment))
        : [];

      // Transform enrollments to courses format
      const myCourses = enrollments.map(enrollment => enrollment.toStudentDashboardFormat());

      const myFees = feesResult.data || {
        fees: [],
        summary: {
          total_amount: 0,
          paid_amount: 0,
          pending_amount: 0,
          total_installments: 0,
          paid_installments: 0,
          pending_installments: 0
        }
      };

      setState((prev) => ({
        ...prev,
        profile: profile,
        myCourses,
        myFees,
        initStatus: Status.SUCCESS,
      }));

      // Reset status after a brief moment
      setTimeout(() => {
        setState((prev) => ({ ...prev, initStatus: Status.INIT }));
      }, 0);
    } catch (error) {
      console.error('Error in loadInit:', error);
      setState((prev) => ({ ...prev, initStatus: Status.ERROR }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, initStatus: Status.INIT }));
      }, 0);
    }

  };


  // Helper function to handle empty strings and null values
  const getValidValue = (value, fallback = 'Not provided') => {
    if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
      return fallback;
    }
    return value;
  };









  // ========================= LEGACY FUNCTIONS (for compatibility) =========================

  const fetchProfile = async () => {
    setState((prev) => ({ ...prev, profileStatus: Status.LOADING }));
    try {
      const { data, error } = await StudentDatasource.getStudentProfile(user?.id);
      if (error) throw error;
      setState((prev) => ({ ...prev, profile: data, profileStatus: Status.SUCCESS }));
    } catch (error) {
      console.error("Profile fetch failed:", error);
      toast.error("Failed to load profile");
      setState((prev) => ({ ...prev, profileStatus: Status.ERROR, error }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, profileStatus: Status.INIT }));
      }, 0);
    }
  };

  const updateProfile = async (userId, updates) => {
    setState((prev) => ({ ...prev, updateProfileStatus: Status.LOADING }));
    try {
      const { data, error } = await StudentDatasource.updateStudentProfile(userId, updates);
      if (error) throw error;
      toast.success("Profile updated successfully!");
      setState((prev) => ({
        ...prev,
        profile: data,
        updateProfileStatus: Status.SUCCESS,
      }));
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
      setState((prev) => ({ ...prev, updateProfileStatus: Status.ERROR }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, updateProfileStatus: Status.INIT }));
      }, 0);
    }
  };

  // ========================= ENROLLMENTS =========================

  const fetchEnrollments = async () => {
    setState((prev) => ({ ...prev, enrollmentsStatus: Status.LOADING }));
    try {
      const { data, error } = await StudentDatasource.getStudentEnrollments(user?.id);
      if (error) throw error;
      const enrollments = data ? data.map(enrollment => StudentEnrollment.fromDatabaseRow(enrollment)) : [];
      const myCourses = enrollments.map(enrollment => enrollment.toStudentDashboardFormat());
      setState((prev) => ({
        ...prev,
        myCourses,
        enrollmentsStatus: Status.SUCCESS,
      }));
    } catch (error) {
      console.error("Enrollments fetch failed:", error);
      toast.error("Failed to load enrollments");
      setState((prev) => ({ ...prev, enrollmentsStatus: Status.ERROR }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, enrollmentsStatus: Status.INIT }));
      }, 0);
    }
  };

  const enrollCourse = async (courseId) => {
    setState((prev) => ({ ...prev, enrollmentsStatus: Status.LOADING }));
    try {
      const { data, error } = await StudentDatasource.enrollCourse(user?.id, courseId);
      if (error) throw error;
      toast.success("Course enrolled successfully!");
      // Refresh enrollments
      await fetchEnrollments();
    } catch (error) {
      console.error("Course enrollment failed:", error);
      toast.error("Failed to enroll in course");
      setState((prev) => ({ ...prev, enrollmentsStatus: Status.ERROR }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, enrollmentsStatus: Status.INIT }));
      }, 0);
    }
  };

  const createMyCourse = async (courseId, enrollmentData = {}) => {
    setState((prev) => ({ ...prev, enrollmentsStatus: Status.LOADING }));
    try {
      const { data, error } = await StudentDatasource.enrollCourse(user?.id, courseId, enrollmentData, true);
      if (error) {
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to enroll in course");
        }
        setState((prev) => ({ ...prev, enrollmentsStatus: Status.ERROR }));
        return { success: false, error };
      }

      toast.success("Successfully enrolled in course!");

      // Transform the enrollment data to course format and add to myCourses
      if (data) {
        const enrollment = StudentEnrollment.fromDatabaseRow(data);
        const newCourse = enrollment.toStudentDashboardFormat();

        setState((prev) => ({
          ...prev,
          myCourses: [newCourse, ...prev.myCourses],
          enrollmentsStatus: Status.SUCCESS,
        }));
      }

      return { success: true, data };
    } catch (error) {
      console.error("Course enrollment failed:", error);
      toast.error("Failed to enroll in course");
      setState((prev) => ({ ...prev, enrollmentsStatus: Status.ERROR }));
      return { success: false, error };
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, enrollmentsStatus: Status.INIT }));
      }, 0);
    }
  };

  // ========================= FEES =========================

  const fetchFeesData = async () => {
    setState((prev) => ({ ...prev, feesStatus: Status.LOADING }));
    try {
      const { data, error } = await StudentDatasource.getFeesData(user?.id);
      if (error) throw error;
      const myFees = data || {
        totalFees: 0,
        paidAmount: 0,
        pendingAmount: 0,
        installments: [],
        hasOfflineCourses: false
      };
      setState((prev) => ({ ...prev, myFees, feesStatus: Status.SUCCESS }));
    } catch (error) {
      console.error("Fees fetch failed:", error);
      toast.error("Failed to load fees data");
      setState((prev) => ({ ...prev, feesStatus: Status.ERROR }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, feesStatus: Status.INIT }));
      }, 0);
    }
  };

  const markInstallmentPaid = async (installmentId) => {
    setState((prev) => ({ ...prev, markPaidStatus: Status.LOADING }));
    try {
      // For demo, just locally update myFees state
      const updatedFees = { ...state.myFees };
      updatedFees.installments = updatedFees.installments.map((inst) =>
        inst.id === installmentId
          ? { ...inst, status: "paid", paidDate: new Date().toISOString().split("T")[0] }
          : inst
      );

      updatedFees.paidAmount = updatedFees.installments
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + i.amount, 0);
      updatedFees.pendingAmount = updatedFees.totalFees - updatedFees.paidAmount;

      setState((prev) => ({
        ...prev,
        myFees: updatedFees,
        markPaidStatus: Status.SUCCESS,
      }));

      toast.success("Installment marked as paid!");
    } catch (error) {
      console.error("Failed to mark installment as paid:", error);
      toast.error("Failed to mark installment as paid");
      setState((prev) => ({ ...prev, markPaidStatus: Status.ERROR }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, markPaidStatus: Status.INIT }));
      }, 0);
    }
  };

  // ========================= EXPORT CONTEXT =========================

  return (
    <StudentDashboardContext.Provider
      value={{
        // State object
        state,

        // Data loading functions
        loadInit,

        // Helper functions
        getValidValue,

        // Legacy functions (for compatibility)
        fetchProfile,
        updateProfile,
        fetchEnrollments,
        enrollCourse,
        createMyCourse,
        fetchFeesData,
        markInstallmentPaid,

        // Individual state properties for backward compatibility
        ...state,
      }}
    >
      {children}
    </StudentDashboardContext.Provider>
  );
};

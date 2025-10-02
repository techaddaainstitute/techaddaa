/**
 * StudentUsecase
 * Contains business logic for student dashboard operations
 * Handles interactions between UI and datasource
 */

import StudentDatasource from '../datasource/StudentDatasource';
import { StudentEnrollment } from '../model/StudentEnrollment';
import { Certificate } from '../model/Certificate';
import { User } from '../model/User';
import { toast } from 'react-toastify';

export class StudentUsecase {

  // ==================== DASHBOARD DATA ====================

  /**
   * Get comprehensive dashboard data for a student
   */
  static async getDashboardDataUsecase(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log('🎯 StudentUsecase: Fetching dashboard data for user:', userId);

      // Fetch all required data in parallel
      const [
        profileResult,
        enrollmentsResult,
        certificatesResult,
        statsResult,
        feesResult
      ] = await Promise.all([
        StudentDatasource.getStudentProfile(userId),
        StudentDatasource.getStudentEnrollments(userId),
        StudentDatasource.getStudentCertificates(userId),
        StudentDatasource.getDashboardStats(userId),
        StudentDatasource.getFeesData(userId)
      ]);

      // Check for errors
      if (profileResult.error) {
        console.warn('⚠️ Profile fetch error:', profileResult.error);
      }
      if (enrollmentsResult.error) {
        console.warn('⚠️ Enrollments fetch error:', enrollmentsResult.error);
      }
      if (certificatesResult.error) {
        console.warn('⚠️ Certificates fetch error:', certificatesResult.error);
      }
      if (statsResult.error) {
        console.warn('⚠️ Stats fetch error:', statsResult.error);
      }
      if (feesResult.error) {
        console.warn('⚠️ Fees fetch error:', feesResult.error);
      }

      // Transform data to models
      const profile = profileResult.data ? User.fromJSON(profileResult.data) : null;
      
      const enrollments = enrollmentsResult.data 
        ? enrollmentsResult.data.map(enrollment => StudentEnrollment.fromDatabaseRow(enrollment))
        : [];

      const certificates = certificatesResult.data 
        ? certificatesResult.data.map(cert => Certificate.fromDatabaseRow(cert))
        : [];

      // Transform enrollments to dashboard format
      const userCourses = enrollments.map(enrollment => enrollment.toStudentDashboardFormat());

      // Prepare dashboard data
      const dashboardData = {
        profile,
        userCourses,
        certificates: certificates.map(cert => cert.toStudentDashboardFormat()),
        stats: statsResult.data || {
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalCertificates: 0,
          averageProgress: 0,
          recentActivity: []
        },
        fees: feesResult.data || {
          totalFees: 0,
          paidAmount: 0,
          pendingAmount: 0,
          installments: [],
          hasOfflineCourses: false
        }
      };

      console.log('✅ StudentUsecase: Dashboard data prepared:', {
        profileLoaded: !!profile,
        coursesCount: userCourses.length,
        certificatesCount: certificates.length,
        hasOfflineCourses: dashboardData.fees.hasOfflineCourses
      });

      return {
        success: true,
        data: dashboardData,
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Dashboard data fetch failed:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to load dashboard data'
      };
    }
  }

  // ==================== COURSE OPERATIONS ====================

  /**
   * Update course progress
   */
  static async updateCourseProgressUsecase(userId, courseId, progress) {
    try {
      if (!userId || !courseId) {
        throw new Error('User ID and Course ID are required');
      }

      if (progress < 0 || progress > 100) {
        throw new Error('Progress must be between 0 and 100');
      }

      console.log('📈 StudentUsecase: Updating course progress:', { userId, courseId, progress });

      const result = await StudentDatasource.updateCourseProgress(userId, courseId, {
        progress: progress,
        progress_percentage: progress
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update progress');
      }

      const enrollment = result.data ? StudentEnrollment.fromDatabaseRow(result.data) : null;

      // If course is completed, show success message
      if (progress >= 100) {
        toast.success('🎉 Congratulations! Course completed successfully!');
      } else {
        toast.success('Progress updated successfully!');
      }

      return {
        success: true,
        data: enrollment ? enrollment.toStudentDashboardFormat() : null,
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Progress update failed:', error);
      toast.error(error.message || 'Failed to update progress');
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update progress'
      };
    }
  }

  /**
   * Get course details with enrollment info
   */
  static async getCourseDetailsUsecase(userId, courseId) {
    try {
      if (!userId || !courseId) {
        throw new Error('User ID and Course ID are required');
      }

      const result = await StudentDatasource.getEnrollmentDetails(userId, courseId);

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch course details');
      }

      const enrollment = result.data ? StudentEnrollment.fromDatabaseRow(result.data) : null;

      return {
        success: true,
        data: enrollment ? enrollment.toStudentDashboardFormat() : null,
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Course details fetch failed:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch course details'
      };
    }
  }

  // ==================== CERTIFICATE OPERATIONS ====================

  /**
   * Download certificate
   */
  static async downloadCertificateUsecase(userId, courseId, userProfile) {
    try {
      if (!userId || !courseId) {
        throw new Error('User ID and Course ID are required');
      }

      // Check if certificate exists
      const certResult = await StudentDatasource.getCertificateByCourse(userId, courseId);
      
      if (certResult.error || !certResult.data) {
        throw new Error('Certificate not found. Complete the course first.');
      }

      const certificate = Certificate.fromDatabaseRow(certResult.data);

      if (!certificate.canDownload()) {
        throw new Error('Certificate is not available for download');
      }

      // Log the download
      if (userProfile?.phone_number && userProfile?.date_of_birth) {
        await StudentDatasource.logCertificateDownload(
          userId,
          certificate.id,
          userProfile.phone_number,
          userProfile.date_of_birth
        );
      }

      // Simulate certificate download
      const filename = certificate.getDownloadFilename();
      
      // In a real application, you would generate/fetch the actual PDF
      // For now, we'll simulate the download
      const link = document.createElement('a');
      link.href = certificate.certificate_url || '#';
      link.download = filename;
      link.click();

      toast.success(`Certificate downloaded: ${filename}`);

      return {
        success: true,
        data: {
          filename,
          downloadUrl: certificate.certificate_url
        },
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Certificate download failed:', error);
      toast.error(error.message || 'Failed to download certificate');
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to download certificate'
      };
    }
  }

  /**
   * Get all certificates for a student
   */
  static async getCertificatesUsecase(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await StudentDatasource.getStudentCertificates(userId);

      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch certificates');
      }

      const certificates = result.data 
        ? result.data.map(cert => Certificate.fromDatabaseRow(cert).toStudentDashboardFormat())
        : [];

      return {
        success: true,
        data: certificates,
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Certificates fetch failed:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch certificates'
      };
    }
  }

  // ==================== PROFILE OPERATIONS ====================

  /**
   * Update student profile
   */
  static async updateProfileUsecase(userId, profileData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Validate profile data
      if (profileData.email && !this.validateEmail(profileData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (profileData.phone_number && !this.validatePhoneNumber(profileData.phone_number)) {
        throw new Error('Please enter a valid phone number');
      }

      console.log('👤 StudentUsecase: Updating profile for user:', userId);

      const result = await StudentDatasource.updateStudentProfile(userId, profileData);

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update profile');
      }

      const updatedProfile = result.data ? User.fromJSON(result.data) : null;

      toast.success('Profile updated successfully!');

      return {
        success: true,
        data: updatedProfile,
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Profile update failed:', error);
      toast.error(error.message || 'Failed to update profile');
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  // ==================== FEES OPERATIONS ====================

  /**
   * Get fees data for student
   */
  static async getFeesDataUsecase(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await StudentDatasource.getFeesData(userId);

      if (result.error) {
        console.warn('⚠️ Fees data fetch warning:', result.error);
        // Don't throw error for fees, just return empty data
        return {
          success: true,
          data: {
            totalFees: 0,
            paidAmount: 0,
            pendingAmount: 0,
            installments: [],
            hasOfflineCourses: false
          },
          error: null
        };
      }

      return {
        success: true,
        data: result.data,
        error: null
      };

    } catch (error) {
      console.error('❌ StudentUsecase: Fees data fetch failed:', error);
      return {
        success: false,
        data: {
          totalFees: 0,
          paidAmount: 0,
          pendingAmount: 0,
          installments: [],
          hasOfflineCourses: false
        },
        error: error.message || 'Failed to fetch fees data'
      };
    }
  }

  /**
   * Get next due installment
   */
  static getNextDueInstallmentUsecase(feesData) {
    if (!feesData || !feesData.installments) return null;
    return StudentDatasource.getNextDueInstallment(feesData.installments);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Validate email format
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  /**
   * Format progress for display
   */
  static formatProgress(progress) {
    return Math.round(progress || 0);
  }

  /**
   * Get progress color based on percentage
   */
  static getProgressColor(progress) {
    if (progress < 30) return 'danger';
    if (progress < 70) return 'warning';
    return 'success';
  }

  /**
   * Check if user has completed any courses
   */
  static hasCompletedCourses(userCourses) {
    return userCourses && userCourses.some(course => course.progress >= 100);
  }

  /**
   * Get completion rate
   */
  static getCompletionRate(userCourses) {
    if (!userCourses || userCourses.length === 0) return 0;
    const completed = userCourses.filter(course => course.progress >= 100).length;
    return Math.round((completed / userCourses.length) * 100);
  }
}

export default StudentUsecase;
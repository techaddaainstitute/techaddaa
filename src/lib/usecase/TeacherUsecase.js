import { toast } from 'react-toastify';
import TeacherDatasource from '../datasource/TeacherDatasource';

export class TeacherUsecase {
  static async teacherLoginUsecase(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!TeacherDatasource.validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const result = await TeacherDatasource.teacherLogin(email, password);

      if (!result.success) {
        throw new Error('Teacher login failed');
      }

      localStorage.setItem('teacherUser', JSON.stringify(result.user));
      localStorage.setItem('teacherSessionToken', result.sessionToken);
      localStorage.setItem('teacherSessionExpiry', result.expiresAt);

      toast.success('Teacher login successful!');

      return {
        success: true,
        user: result.user,
        sessionToken: result.sessionToken,
        expiresAt: result.expiresAt
      };
    } catch (error) {
      console.error('TeacherUsecase teacherLoginUsecase error:', error);
      toast.error(error.message || 'Teacher login failed');
      return {
        success: false,
        error: error.message || 'Teacher login failed'
      };
    }
  }

  static async teacherLogoutUsecase() {
    try {
      const sessionToken = localStorage.getItem('teacherSessionToken');
      await TeacherDatasource.teacherLogout(sessionToken);
      this.clearTeacherSession();
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('TeacherUsecase teacherLogoutUsecase error:', error);
      this.clearTeacherSession();
      toast.error(error.message || 'Logout failed');
      return {
        success: false,
        error: error.message || 'Logout failed'
      };
    }
  }

  static isTeacherAuthenticated() {
    const sessionToken = localStorage.getItem('teacherSessionToken');
    const teacherUser = localStorage.getItem('teacherUser');
    const sessionExpiry = localStorage.getItem('teacherSessionExpiry');

    if (!sessionToken || !teacherUser || !sessionExpiry) {
      return false;
    }

    const expiryDate = new Date(sessionExpiry);
    if (Number.isNaN(expiryDate.getTime()) || new Date() >= expiryDate) {
      this.clearTeacherSession();
      return false;
    }

    return true;
  }

  static getStoredTeacherUser() {
    try {
      const teacherUser = localStorage.getItem('teacherUser');
      return teacherUser ? JSON.parse(teacherUser) : null;
    } catch (error) {
      console.error('TeacherUsecase getStoredTeacherUser error:', error);
      return null;
    }
  }

  static clearTeacherSession() {
    localStorage.removeItem('teacherUser');
    localStorage.removeItem('teacherSessionToken');
    localStorage.removeItem('teacherSessionExpiry');
  }

  static async validateTeacherAccess() {
    try {
      if (!this.isTeacherAuthenticated()) {
        return { valid: false, reason: 'No local teacher session' };
      }

      const sessionToken = localStorage.getItem('teacherSessionToken');
      const sessionResult = await TeacherDatasource.validateSession(sessionToken);

      if (!sessionResult.valid) {
        this.clearTeacherSession();
        return { valid: false, reason: 'Invalid teacher session' };
      }

      if (sessionResult.expiresAt) {
        localStorage.setItem('teacherSessionExpiry', sessionResult.expiresAt);
      }
      localStorage.setItem('teacherUser', JSON.stringify(sessionResult.teacher));

      return { valid: true, user: sessionResult.teacher };
    } catch (error) {
      console.error('TeacherUsecase validateTeacherAccess error:', error);
      this.clearTeacherSession();
      return { valid: false, reason: 'Teacher validation error' };
    }
  }
}

export default TeacherUsecase;

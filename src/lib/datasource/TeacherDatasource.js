import { supabase } from '../supabase';

export class TeacherDatasource {
  static generateSessionToken() {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i += 1) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async teacherLogin(email, password) {
    try {
      const { data: teacherData, error: teacherError } = await supabase
        .rpc('verify_teacher_password', {
          p_email: email,
          p_password: password
        });

      if (teacherError) {
        await supabase.rpc('handle_teacher_failed_login', { p_email: email });
        throw new Error('Invalid teacher credentials');
      }

      if (!teacherData || teacherData.length === 0) {
        await supabase.rpc('handle_teacher_failed_login', { p_email: email });
        throw new Error('Invalid teacher credentials');
      }

      const teacher = teacherData[0];

      await supabase.rpc('update_teacher_last_login', { p_teacher_id: teacher.teacher_id });

      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 8);

      const { error: sessionError } = await supabase.rpc('create_teacher_session', {
        p_teacher_id: teacher.teacher_id,
        p_session_token: sessionToken,
        p_expires_at: expiresAt.toISOString(),
        p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      });

      if (sessionError) {
        throw new Error(sessionError.message || 'Failed to create teacher session');
      }

      return {
        success: true,
        user: {
          id: teacher.teacher_id,
          email: teacher.email,
          full_name: teacher.full_name,
          phone_number: teacher.phone_number,
          joining_date: teacher.joining_date,
          salary: teacher.salary,
          designation: teacher.designation,
          address: teacher.address,
          is_active: teacher.is_active,
          last_login: teacher.last_login,
          role: 'teacher'
        },
        sessionToken,
        expiresAt
      };
    } catch (error) {
      console.error('TeacherDatasource teacherLogin error:', error);
      throw error;
    }
  }

  static async validateSession(sessionToken) {
    try {
      const { data, error } = await supabase.rpc('validate_teacher_session', {
        p_session_token: sessionToken
      });

      if (error || !data || data.length === 0) {
        return { valid: false };
      }

      const teacher = data[0];
      return {
        valid: true,
        teacher: {
          id: teacher.teacher_id,
          email: teacher.email,
          full_name: teacher.full_name,
          phone_number: teacher.phone_number,
          joining_date: teacher.joining_date,
          salary: teacher.salary,
          designation: teacher.designation,
          address: teacher.address,
          is_active: teacher.is_active,
          last_login: teacher.last_login,
          role: 'teacher'
        },
        expiresAt: teacher.expires_at
      };
    } catch (error) {
      console.error('TeacherDatasource validateSession error:', error);
      return { valid: false };
    }
  }

  static async teacherLogout(sessionToken) {
    try {
      if (sessionToken) {
        const { error } = await supabase.rpc('delete_teacher_session', {
          p_session_token: sessionToken
        });

        if (error) {
          throw new Error(error.message || 'Failed to logout teacher');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('TeacherDatasource teacherLogout error:', error);
      throw error;
    }
  }
}

export default TeacherDatasource;

import { supabase } from '../supabase';

const CertificateDatasource = {
    normalizePhone(phone = '') {
        return phone.replace(/\D/g, '').slice(-10);
    },

    normalizeDate(date) {
        if (!date) return '';
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toISOString().split('T')[0];
    },

    async findStudentsByPhoneAndDob(phoneNumber, dateOfBirth) {
        const normalizedPhone = this.normalizePhone(phoneNumber);
        const normalizedDob = this.normalizeDate(dateOfBirth);

        if (!normalizedPhone || !normalizedDob) {
            throw new Error('Invalid phone number or date of birth');
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .select('id, full_name, phone_number, date_of_birth')
            .eq('phone_number', normalizedPhone)
            .eq('date_of_birth', normalizedDob)
            .eq('role', 'student');

        if (error) {
            throw new Error(error.message || 'Failed to validate student details');
        }

        return data || [];
    },

    async getCertificatesByPhoneAndDob(phoneNumber, dateOfBirth) {
        const students = await this.findStudentsByPhoneAndDob(phoneNumber, dateOfBirth);

        if (!students.length) {
            return [];
        }

        const studentIds = students.map((student) => student.id);
        const studentNameMap = students.reduce((acc, student) => {
            acc[student.id] = student.full_name || '';
            return acc;
        }, {});

        const { data, error } = await supabase
            .from('certificates')
            .select(`
        id,
        user_id,
        certificate_number,
        issue_date,
        grade,
        instructor_name,
        course_name,
        course_duration,
        completion_date,
        certificate_url,
        is_valid
      `)
            .in('user_id', studentIds)
            .eq('is_valid', true)
            .order('issue_date', { ascending: false });

        if (error) {
            throw new Error(error.message || 'Failed to fetch certificates');
        }

        return (data || []).map((item) => ({
            id: item.id,
            studentName: studentNameMap[item.user_id] || 'Student',
            courseName: item.course_name || 'Course',
            completionDate: item.completion_date || item.issue_date,
            grade: item.grade || 'N/A',
            certificateNumber: item.certificate_number,
            instructor: item.instructor_name || 'Techaddaa',
            duration: item.course_duration || 'N/A',
            certificateUrl: item.certificate_url || '',
            skills: []
        }));
    }
};

export default CertificateDatasource;

/**
 * Certificate Model
 * Defines the structure for student certificate data
 */

export class Certificate {
  constructor({
    id = null,
    user_id = null,
    course_id = null,
    enrollment_id = null,
    certificate_number = '',
    issue_date = null,
    grade = null,
    instructor_name = '',
    course_name = '',
    course_duration = '',
    completion_date = null,
    certificate_url = null,
    is_valid = true
  } = {}) {
    this.id = id;
    this.user_id = user_id;
    this.course_id = course_id;
    this.enrollment_id = enrollment_id;
    this.certificate_number = certificate_number;
    this.issue_date = issue_date;
    this.grade = grade;
    this.instructor_name = instructor_name;
    this.course_name = course_name;
    this.course_duration = course_duration;
    this.completion_date = completion_date;
    this.certificate_url = certificate_url;
    this.is_valid = is_valid;
  }

  // Validation methods
  isValid() {
    return this.user_id && this.course_id && this.certificate_number && this.course_name;
  }

  isActive() {
    return this.is_valid;
  }

  // Getters
  getFormattedIssueDate() {
    if (!this.issue_date) return 'N/A';
    return new Date(this.issue_date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedCompletionDate() {
    if (!this.completion_date) return 'N/A';
    return new Date(this.completion_date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getGradeColor() {
    if (!this.grade) return 'secondary';
    
    const grade = this.grade.toUpperCase();
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B+':
      case 'B':
        return 'primary';
      case 'C+':
      case 'C':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getGradeBadgeVariant() {
    const grade = this.grade?.toUpperCase();
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B+':
      case 'B':
        return 'info';
      case 'C+':
      case 'C':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getDaysIssued() {
    if (!this.issue_date) return 0;
    const issueDate = new Date(this.issue_date);
    const now = new Date();
    return Math.floor((now - issueDate) / (1000 * 60 * 60 * 24));
  }

  // Generate download filename
  getDownloadFilename() {
    const courseName = this.course_name.replace(/[^a-zA-Z0-9]/g, '_');
    const issueYear = this.issue_date ? new Date(this.issue_date).getFullYear() : new Date().getFullYear();
    return `${courseName}_Certificate_${issueYear}.pdf`;
  }

  // Check if certificate can be downloaded
  canDownload() {
    return this.is_valid && this.certificate_number;
  }

  // Convert to format expected by StudentDashboard
  toStudentDashboardFormat() {
    return {
      id: this.id,
      courseId: this.course_id,
      courseName: this.course_name,
      certificateNumber: this.certificate_number,
      issueDate: this.getFormattedIssueDate(),
      completionDate: this.getFormattedCompletionDate(),
      grade: this.grade,
      instructor: this.instructor_name || 'TechAddaa Institute',
      duration: this.course_duration,
      downloadUrl: this.certificate_url,
      isValid: this.is_valid,
      canDownload: this.canDownload(),
      filename: this.getDownloadFilename()
    };
  }

  // Convert to plain object for API calls
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      course_id: this.course_id,
      enrollment_id: this.enrollment_id,
      certificate_number: this.certificate_number,
      issue_date: this.issue_date,
      grade: this.grade,
      instructor_name: this.instructor_name,
      course_name: this.course_name,
      course_duration: this.course_duration,
      completion_date: this.completion_date,
      certificate_url: this.certificate_url,
      is_valid: this.is_valid
    };
  }

  // Create from database row
  static fromDatabaseRow(row) {
    return new Certificate({
      id: row.id,
      user_id: row.user_id,
      course_id: row.course_id,
      enrollment_id: row.enrollment_id,
      certificate_number: row.certificate_number,
      issue_date: row.issue_date,
      grade: row.grade,
      instructor_name: row.instructor_name,
      course_name: row.course_name,
      course_duration: row.course_duration,
      completion_date: row.completion_date,
      certificate_url: row.certificate_url,
      is_valid: row.is_valid
    });
  }

  // Create from JSON
  static fromJSON(data) {
    return new Certificate(data);
  }

  // Create new certificate
  static createNew({
    user_id,
    course_id,
    enrollment_id,
    course_name,
    course_duration,
    grade = 'A',
    instructor_name = 'TechAddaa Institute'
  }) {
    const certificateNumber = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`;
    
    return new Certificate({
      user_id,
      course_id,
      enrollment_id,
      certificate_number: certificateNumber,
      issue_date: new Date().toISOString(),
      grade,
      instructor_name,
      course_name,
      course_duration,
      completion_date: new Date().toISOString(),
      is_valid: true
    });
  }
}

export default Certificate;
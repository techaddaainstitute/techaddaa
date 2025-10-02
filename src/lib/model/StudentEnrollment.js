/**
 * StudentEnrollment Model
 * Defines the structure for student course enrollment data
 */

export class StudentEnrollment {
  constructor({
    id = null,
    user_id = null,
    course_id = null,
    enrollment_mode = 'online',
    price_paid = 0,
    enrollment_date = null,
    completion_date = null,
    progress = 0,
    progress_percentage = 0,
    completed_lessons = 0,
    grade = null,
    status = 'active',
    updated_at = null,
    // Course details (from join)
    course = null
  } = {}) {
    this.id = id;
    this.user_id = user_id;
    this.course_id = course_id;
    this.enrollment_mode = enrollment_mode;
    this.price_paid = price_paid;
    this.enrollment_date = enrollment_date;
    this.completion_date = completion_date;
    this.progress = progress;
    this.progress_percentage = progress_percentage;
    this.completed_lessons = completed_lessons;
    this.grade = grade;
    this.status = status;
    this.updated_at = updated_at;
    this.course = course;
  }

  // Validation methods
  isValid() {
    return this.user_id && this.course_id && this.enrollment_mode;
  }

  isCompleted() {
    return this.status === 'completed' || this.progress >= 100 || this.progress_percentage >= 100;
  }

  isActive() {
    return this.status === 'active';
  }

  isOnlineMode() {
    return this.enrollment_mode === 'online';
  }

  isOfflineMode() {
    return this.enrollment_mode === 'offline';
  }

  // Getters
  getProgressPercentage() {
    return this.progress_percentage || this.progress || 0;
  }

  getFormattedPrice() {
    return `₹${this.price_paid?.toLocaleString() || 0}`;
  }

  getFormattedEnrollmentDate() {
    if (!this.enrollment_date) return 'N/A';
    return new Date(this.enrollment_date).toLocaleDateString('en-IN');
  }

  getFormattedCompletionDate() {
    if (!this.completion_date) return null;
    return new Date(this.completion_date).toLocaleDateString('en-IN');
  }

  getDaysEnrolled() {
    if (!this.enrollment_date) return 0;
    const enrollDate = new Date(this.enrollment_date);
    const now = new Date();
    return Math.floor((now - enrollDate) / (1000 * 60 * 60 * 24));
  }

  getProgressColor() {
    const progress = this.getProgressPercentage();
    if (progress < 30) return 'danger';
    if (progress < 70) return 'warning';
    return 'success';
  }

  // Course-related getters (when course data is joined)
  getCourseName() {
    return this.course?.title || this.course?.courseName || 'Unknown Course';
  }

  getCourseInstructor() {
    return this.course?.user_profiles?.full_name || this.course?.instructor || 'TechAddaa Institute';
  }

  getCourseDuration() {
    return this.course?.duration || 'N/A';
  }

  getCourseLevel() {
    return this.course?.level || 'beginner';
  }

  getCourseCategory() {
    return this.course?.category || 'General';
  }

  // Convert to format expected by StudentDashboard
  toStudentDashboardFormat() {
    return {
      id: this.course_id,
      courseName: this.getCourseName(),
      instructor: this.getCourseInstructor(),
      duration: this.getCourseDuration(),
      level: this.getCourseLevel(),
      category: this.getCourseCategory(),
      mode: this.enrollment_mode,
      progress: this.getProgressPercentage(),
      enrolledDate: this.getFormattedEnrollmentDate(),
      completionDate: this.getFormattedCompletionDate(),
      pricePaid: this.price_paid,
      status: this.status,
      grade: this.grade,
      completedLessons: this.completed_lessons,
      imageUrl: this.course?.image_url || '/images/default-course.jpg'
    };
  }

  // Convert to plain object for API calls
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      course_id: this.course_id,
      enrollment_mode: this.enrollment_mode,
      price_paid: this.price_paid,
      enrollment_date: this.enrollment_date,
      completion_date: this.completion_date,
      progress: this.progress,
      progress_percentage: this.progress_percentage,
      completed_lessons: this.completed_lessons,
      grade: this.grade,
      status: this.status,
      updated_at: this.updated_at
    };
  }

  // Create from database row
  static fromDatabaseRow(row) {
    return new StudentEnrollment({
      id: row.id,
      user_id: row.user_id,
      course_id: row.course_id,
      enrollment_mode: row.enrollment_mode,
      price_paid: row.price_paid,
      enrollment_date: row.enrollment_date,
      completion_date: row.completion_date,
      progress: row.progress,
      progress_percentage: row.progress_percentage,
      completed_lessons: row.completed_lessons,
      grade: row.grade,
      status: row.status,
      updated_at: row.updated_at,
      course: row.courses || row.course
    });
  }

  // Create from JSON
  static fromJSON(data) {
    return new StudentEnrollment(data);
  }

  // Create new enrollment
  static createNew({
    user_id,
    course_id,
    enrollment_mode = 'online',
    price_paid = 0
  }) {
    return new StudentEnrollment({
      user_id,
      course_id,
      enrollment_mode,
      price_paid,
      enrollment_date: new Date().toISOString(),
      status: 'active',
      progress: 0,
      progress_percentage: 0,
      completed_lessons: 0
    });
  }
}

export default StudentEnrollment;
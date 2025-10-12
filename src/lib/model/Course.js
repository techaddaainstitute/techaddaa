/**
 * Course Model
 * Defines the structure and validation for course data
 */

export class Course {
  constructor({
    id = null,
    title = '',
    description = '',
    instructor_id = null,
    price = 0,
    duration = '',
    level = 'beginner',
    category = '',
    image_url = '',
    is_active = true,
    created_at = null,
    updated_at = null,
    // Additional fields from mockCourses for compatibility
    onlinePrice = null,
    offlinePrice = null,
    features = [],
    instructor = '',
    rating = 0,
    students = 0
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.instructor_id = instructor_id;
    this.price = price;
    this.duration = duration;
    this.level = level;
    this.category = category;
    this.image_url = image_url;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    
    // Additional fields for frontend compatibility
    this.onlinePrice = onlinePrice || price || 0;
    this.offlinePrice = offlinePrice || (price ? price * 1.3 : 0); // 30% higher for offline
    this.features = features;
    this.instructor = instructor;
    this.rating = rating;
    this.students = students;
  }

  // Validation methods
  isValid() {
    return this.title.trim().length > 0 && 
           this.price >= 0 && 
           this.isValidLevel() &&
           this.category.trim().length > 0;
  }

  isValidLevel() {
    return ['beginner', 'intermediate', 'advanced'].includes(this.level);
  }

  isActive() {
    return this.is_active === true;
  }

  // Formatting methods
  getFormattedPrice() {
    return `₹${this.price.toLocaleString()}`;
  }

  getFormattedOnlinePrice() {
    return `₹${this.onlinePrice.toLocaleString()}`;
  }

  getFormattedOfflinePrice() {
    return `₹${this.offlinePrice.toLocaleString()}`;
  }

  getDurationInMonths() {
    const match = this.duration.match(/(\d+)\s*months?/i);
    return match ? parseInt(match[1]) : 0;
  }

  // Convert to plain object for API calls
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      instructor_id: this.instructor_id,
      price: this.price,
      duration: this.duration,
      level: this.level,
      category: this.category,
      image_url: this.image_url,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Convert to mockCourse format for frontend compatibility
  toMockCourseFormat() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      duration: this.duration,
      onlinePrice: this.onlinePrice,
      offlinePrice: this.offlinePrice,
      image: this.image_url,
      features: this.features,
      instructor: this.instructor,
      rating: this.rating,
      students: this.students,
      category: this.category
    };
  }

  // Static factory methods
  static fromJSON(data) {
    return new Course(data);
  }

  static fromDatabaseRow(row) {
    return new Course({
      id: row.id,
      title: row.title,
      description: row.description,
      instructor_id: row.instructor_id,
      price: parseFloat(row.price) || 0,
      duration: row.duration,
      level: row.level,
      category: row.category,
      image_url: row.image_url,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      // Set compatible fields
      onlinePrice: parseFloat(row.price) || 0,
      offlinePrice: parseFloat(row.price) * 1.3 || 0,
      features: row.features || [],
      instructor: row.instructor_name || 'TechAdda Instructor',
      rating: row.rating || 4.5,
      students: row.students || 100
    });
  }

  static createNew({
    title,
    description,
    price,
    duration,
    level = 'beginner',
    category,
    image_url = '',
    instructor_id = null
  }) {
    return new Course({
      title,
      description,
      price,
      duration,
      level,
      category,
      image_url,
      instructor_id,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
}

export default Course;
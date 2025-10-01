/**
 * CourseUsecase
 * Contains business logic for course operations
 * Handles interactions between UI and datasource
 */

import CourseDatasource from '../datasource/CourseDatasource';
import { Course } from '../model/Course';
import { toast } from 'react-toastify';

export class CourseUsecase {

  // ==================== COURSE RETRIEVAL ====================

  /**
   * Get all courses with error handling and business logic
   * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
   */
  static async getAllCoursesUsecase() {
    try {
      const result = await CourseDatasource.getAllCourses();
      
      if (result.error) {
        console.error('Error fetching courses:', result.error);
        toast.error('Failed to load courses. Please try again.');
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to fetch courses'
        };
      }

      // Convert database rows to Course models
      const courses = result.data.map(courseData => Course.fromDatabaseRow(courseData));
      
      return {
        success: true,
        data: courses,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getAllCoursesUsecase:', error);
      toast.error('An unexpected error occurred while loading courses.');
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Get featured courses for home page
   * @param {number} limit - Number of courses to return
   * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
   */
  static async getFeaturedCoursesUsecase(limit = 6) {
    try {
      const result = await CourseDatasource.getFeaturedCourses(limit);
      
      if (result.error) {
        console.error('Error fetching featured courses:', result.error);
        // Don't show toast for featured courses as it's not critical
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to fetch featured courses'
        };
      }

      // Convert database rows to Course models
      const courses = result.data.map(courseData => Course.fromDatabaseRow(courseData));
      
      return {
        success: true,
        data: courses,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getFeaturedCoursesUsecase:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Get courses by category with validation
   * @param {string} category - Course category
   * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
   */
  static async getCoursesByCategoryUsecase(category) {
    try {
      // Validate input
      if (!category || category.trim().length === 0) {
        return {
          success: false,
          data: [],
          error: 'Category is required'
        };
      }

      const result = await CourseDatasource.getCoursesByCategory(category.trim());
      
      if (result.error) {
        console.error('Error fetching courses by category:', result.error);
        toast.error(`Failed to load ${category} courses. Please try again.`);
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to fetch courses by category'
        };
      }

      // Convert database rows to Course models
      const courses = result.data.map(courseData => Course.fromDatabaseRow(courseData));
      
      return {
        success: true,
        data: courses,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getCoursesByCategoryUsecase:', error);
      toast.error('An unexpected error occurred while loading courses.');
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Get courses by level with validation
   * @param {string} level - Course level
   * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
   */
  static async getCoursesByLevelUsecase(level) {
    try {
      // Validate input
      const validLevels = ['beginner', 'intermediate', 'advanced'];
      if (!level || !validLevels.includes(level.toLowerCase())) {
        return {
          success: false,
          data: [],
          error: 'Valid level is required (beginner, intermediate, or advanced)'
        };
      }

      const result = await CourseDatasource.getCoursesByLevel(level.toLowerCase());
      
      if (result.error) {
        console.error('Error fetching courses by level:', result.error);
        toast.error(`Failed to load ${level} courses. Please try again.`);
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to fetch courses by level'
        };
      }

      // Convert database rows to Course models
      const courses = result.data.map(courseData => Course.fromDatabaseRow(courseData));
      
      return {
        success: true,
        data: courses,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getCoursesByLevelUsecase:', error);
      toast.error('An unexpected error occurred while loading courses.');
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Get a single course by ID with validation
   * @param {string} courseId - Course UUID
   * @returns {Promise<{success: boolean, data: Course|null, error: string|null}>}
   */
  static async getCourseByIdUsecase(courseId) {
    try {
      // Validate input
      if (!courseId || courseId.trim().length === 0) {
        return {
          success: false,
          data: null,
          error: 'Course ID is required'
        };
      }

      const result = await CourseDatasource.getCourseById(courseId.trim());
      
      if (result.error) {
        console.error('Error fetching course by ID:', result.error);
        if (result.error.code === 'PGRST116') {
          // No rows returned
          return {
            success: false,
            data: null,
            error: 'Course not found'
          };
        }
        toast.error('Failed to load course details. Please try again.');
        return {
          success: false,
          data: null,
          error: result.error.message || 'Failed to fetch course'
        };
      }

      // Convert database row to Course model
      const course = Course.fromDatabaseRow(result.data);
      
      return {
        success: true,
        data: course,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getCourseByIdUsecase:', error);
      toast.error('An unexpected error occurred while loading course details.');
      return {
        success: false,
        data: null,
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Search courses with validation and business logic
   * @param {string} searchTerm - Search term
   * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
   */
  static async searchCoursesUsecase(searchTerm) {
    try {
      // Validate input
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: false,
          data: [],
          error: 'Search term must be at least 2 characters long'
        };
      }

      const result = await CourseDatasource.searchCourses(searchTerm.trim());
      
      if (result.error) {
        console.error('Error searching courses:', result.error);
        toast.error('Failed to search courses. Please try again.');
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to search courses'
        };
      }

      // Convert database rows to Course models
      const courses = result.data.map(courseData => Course.fromDatabaseRow(courseData));
      
      return {
        success: true,
        data: courses,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in searchCoursesUsecase:', error);
      toast.error('An unexpected error occurred while searching courses.');
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Get courses with pagination
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Number of courses per page
   * @returns {Promise<{success: boolean, data: Array, error: string|null, pagination: Object}>}
   */
  static async getCoursesWithPaginationUsecase(page = 1, limit = 10) {
    try {
      // Validate input
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10; // Reasonable limits

      const result = await CourseDatasource.getCoursesWithPagination(page, limit);
      
      if (result.error) {
        console.error('Error fetching courses with pagination:', result.error);
        toast.error('Failed to load courses. Please try again.');
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to fetch courses',
          pagination: null
        };
      }

      // Convert database rows to Course models
      const courses = result.data.map(courseData => Course.fromDatabaseRow(courseData));
      
      // Calculate pagination info
      const totalPages = Math.ceil(result.count / limit);
      const pagination = {
        currentPage: page,
        totalPages,
        totalCourses: result.count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      };
      
      return {
        success: true,
        data: courses,
        error: null,
        pagination
      };
    } catch (error) {
      console.error('Unexpected error in getCoursesWithPaginationUsecase:', error);
      toast.error('An unexpected error occurred while loading courses.');
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred',
        pagination: null
      };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get available categories
   * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
   */
  static async getCategoriesUsecase() {
    try {
      const result = await CourseDatasource.getCategories();
      
      if (result.error) {
        console.error('Error fetching categories:', result.error);
        return {
          success: false,
          data: [],
          error: result.error.message || 'Failed to fetch categories'
        };
      }
      
      return {
        success: true,
        data: result.data,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getCategoriesUsecase:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Get course count by category
   * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
   */
  static async getCourseCountByCategoryUsecase() {
    try {
      const result = await CourseDatasource.getCourseCountByCategory();
      
      if (result.error) {
        console.error('Error fetching course count by category:', result.error);
        return {
          success: false,
          data: {},
          error: result.error.message || 'Failed to fetch course statistics'
        };
      }
      
      return {
        success: true,
        data: result.data,
        error: null
      };
    } catch (error) {
      console.error('Unexpected error in getCourseCountByCategoryUsecase:', error);
      return {
        success: false,
        data: {},
        error: error.message || 'Unexpected error occurred'
      };
    }
  }

  /**
   * Convert courses to mockCourse format for frontend compatibility
   * @param {Array} courses - Array of Course models
   * @returns {Array} Array of courses in mockCourse format
   */
  static convertToMockCourseFormat(courses) {
    return courses.map(course => course.toMockCourseFormat());
  }

  /**
   * Filter courses by multiple criteria
   * @param {Array} courses - Array of Course models
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered courses
   */
  static filterCourses(courses, filters = {}) {
    let filteredCourses = [...courses];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filteredCourses = filteredCourses.filter(course => 
        course.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by level
    if (filters.level && filters.level !== 'all') {
      filteredCourses = filteredCourses.filter(course => 
        course.level.toLowerCase() === filters.level.toLowerCase()
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price >= filters.minPrice
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price <= filters.maxPrice
      );
    }

    // Sort by criteria
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_low':
          filteredCourses.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filteredCourses.sort((a, b) => b.price - a.price);
          break;
        case 'title':
          filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'newest':
          filteredCourses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        default:
          // Keep original order
          break;
      }
    }

    return filteredCourses;
  }
}

export default CourseUsecase;
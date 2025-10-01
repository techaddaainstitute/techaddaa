/**
 * CourseDatasource
 * Handles all course-related database operations
 * Provides methods to interact with Supabase courses table
 */

import { supabase } from '../supabase';

export class CourseDatasource {

  // ==================== COURSE RETRIEVAL ====================

  /**
   * Get all active courses from database
   * @returns {Promise<{data: Array, error: Object|null}>}
   */
  static async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error in getAllCourses:', error);
      return { data: null, error };
    }
  }

  /**
   * Get courses by category
   * @param {string} category - Course category to filter by
   * @returns {Promise<{data: Array, error: Object|null}>}
   */
  static async getCoursesByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses by category:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error in getCoursesByCategory:', error);
      return { data: null, error };
    }
  }

  /**
   * Get courses by level
   * @param {string} level - Course level (beginner, intermediate, advanced)
   * @returns {Promise<{data: Array, error: Object|null}>}
   */
  static async getCoursesByLevel(level) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('level', level)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses by level:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error in getCoursesByLevel:', error);
      return { data: null, error };
    }
  }

  /**
   * Get a single course by ID
   * @param {string} courseId - Course UUID
   * @returns {Promise<{data: Object|null, error: Object|null}>}
   */
  static async getCourseById(courseId) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching course by ID:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error in getCourseById:', error);
      return { data: null, error };
    }
  }

  /**
   * Search courses by title or description
   * @param {string} searchTerm - Search term
   * @returns {Promise<{data: Array, error: Object|null}>}
   */
  static async searchCourses(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching courses:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error in searchCourses:', error);
      return { data: null, error };
    }
  }

  /**
   * Get featured courses (can be based on criteria like popularity, rating, etc.)
   * For now, returns first 6 courses
   * @param {number} limit - Number of featured courses to return
   * @returns {Promise<{data: Array, error: Object|null}>}
   */
  static async getFeaturedCourses(limit = 6) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured courses:', error);
        return { data: null, error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Unexpected error in getFeaturedCourses:', error);
      return { data: null, error };
    }
  }

  /**
   * Get courses with pagination
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Number of courses per page
   * @returns {Promise<{data: Array, error: Object|null, count: number}>}
   */
  static async getCoursesWithPagination(page = 1, limit = 10) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('courses')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching courses with pagination:', error);
        return { data: null, error, count: 0 };
      }

      return { data: data || [], error: null, count: count || 0 };
    } catch (error) {
      console.error('Unexpected error in getCoursesWithPagination:', error);
      return { data: null, error, count: 0 };
    }
  }

  // ==================== COURSE MANAGEMENT ====================

  /**
   * Create a new course
   * @param {Object} courseData - Course data
   * @returns {Promise<{data: Object|null, error: Object|null}>}
   */
  static async createCourse(courseData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) {
        console.error('Error creating course:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error in createCourse:', error);
      return { data: null, error };
    }
  }

  /**
   * Update an existing course
   * @param {string} courseId - Course UUID
   * @param {Object} updateData - Data to update
   * @returns {Promise<{data: Object|null, error: Object|null}>}
   */
  static async updateCourse(courseId, updateData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', courseId)
        .select()
        .single();

      if (error) {
        console.error('Error updating course:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error in updateCourse:', error);
      return { data: null, error };
    }
  }

  /**
   * Soft delete a course (set is_active to false)
   * @param {string} courseId - Course UUID
   * @returns {Promise<{data: Object|null, error: Object|null}>}
   */
  static async deleteCourse(courseId) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId)
        .select()
        .single();

      if (error) {
        console.error('Error deleting course:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error in deleteCourse:', error);
      return { data: null, error };
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get unique categories from all courses
   * @returns {Promise<{data: Array, error: Object|null}>}
   */
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching categories:', error);
        return { data: null, error };
      }

      // Extract unique categories
      const categories = [...new Set(data.map(course => course.category))].filter(Boolean);
      return { data: categories, error: null };
    } catch (error) {
      console.error('Unexpected error in getCategories:', error);
      return { data: null, error };
    }
  }

  /**
   * Get course count by category
   * @returns {Promise<{data: Object, error: Object|null}>}
   */
  static async getCourseCountByCategory() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching course count by category:', error);
        return { data: null, error };
      }

      // Count courses by category
      const categoryCount = data.reduce((acc, course) => {
        const category = course.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      return { data: categoryCount, error: null };
    } catch (error) {
      console.error('Unexpected error in getCourseCountByCategory:', error);
      return { data: null, error };
    }
  }

  /**
   * Validate course data
   * @param {Object} courseData - Course data to validate
   * @returns {Object} Validation result
   */
  static validateCourseData(courseData) {
    const errors = [];

    if (!courseData.title || courseData.title.trim().length === 0) {
      errors.push('Course title is required');
    }

    if (!courseData.description || courseData.description.trim().length === 0) {
      errors.push('Course description is required');
    }

    if (courseData.price === undefined || courseData.price < 0) {
      errors.push('Valid course price is required');
    }

    if (!courseData.duration || courseData.duration.trim().length === 0) {
      errors.push('Course duration is required');
    }

    if (!courseData.level || !['beginner', 'intermediate', 'advanced'].includes(courseData.level)) {
      errors.push('Valid course level is required (beginner, intermediate, or advanced)');
    }

    if (!courseData.category || courseData.category.trim().length === 0) {
      errors.push('Course category is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default CourseDatasource;
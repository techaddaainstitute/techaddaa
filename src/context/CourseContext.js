import React, { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [mockCourses, setMockCourses] = useState([
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Learn modern web development with React, Node.js, and MongoDB",
      price: 15000,
      duration: "6 months",
      level: "Beginner to Advanced",
      image: "/images/course1.jpg",
      features: [
        "HTML, CSS, JavaScript",
        "React.js & Redux",
        "Node.js & Express",
        "MongoDB & Mongoose",
        "Authentication & Security",
        "Deployment & DevOps"
      ],
      instructor: "Tech Addaa Team",
      rating: 4.8,
      students: 1250
    },
    {
      id: 2,
      title: "Data Science & Machine Learning",
      description: "Master data science with Python, pandas, and machine learning algorithms",
      price: 18000,
      duration: "8 months",
      level: "Intermediate",
      image: "/images/course2.jpg",
      features: [
        "Python Programming",
        "Data Analysis with Pandas",
        "Machine Learning Algorithms",
        "Deep Learning with TensorFlow",
        "Data Visualization",
        "Real-world Projects"
      ],
      instructor: "Tech Addaa Team",
      rating: 4.9,
      students: 890
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Build cross-platform mobile apps with React Native and Flutter",
      price: 16000,
      duration: "7 months",
      level: "Intermediate",
      image: "/images/course3.jpg",
      features: [
        "React Native Development",
        "Flutter & Dart",
        "Native iOS & Android",
        "API Integration",
        "App Store Deployment",
        "Performance Optimization"
      ],
      instructor: "Tech Addaa Team",
      rating: 4.7,
      students: 650
    }
  ]);

  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const purchaseCourse = async (courseId, userId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const course = mockCourses.find(c => c.id === courseId);
      if (course && !purchasedCourses.some(pc => pc.courseId === courseId && pc.userId === userId)) {
        const purchaseRecord = {
          id: Date.now(),
          courseId,
          userId,
          course,
          purchaseDate: new Date().toISOString(),
          status: 'active'
        };
        setPurchasedCourses(prev => [...prev, purchaseRecord]);
        return { success: true, purchase: purchaseRecord };
      }
      return { success: false, error: 'Course already purchased or not found' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getUserCourses = (userId) => {
    return purchasedCourses.filter(pc => pc.userId === userId);
  };

  const getCourseById = (courseId) => {
    return mockCourses.find(course => course.id === parseInt(courseId));
  };

  const value = {
    mockCourses,
    purchasedCourses,
    loading,
    purchaseCourse,
    getUserCourses,
    getCourseById
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
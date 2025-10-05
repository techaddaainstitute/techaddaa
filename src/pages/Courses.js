import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaClock, FaSearch, FaFilter, FaLaptop, FaBuilding, FaArrowRight, FaPlay, FaBookOpen, FaCertificate, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CourseUsecase from '../lib/usecase/CourseUsecase';

const Courses = () => {
  const { mockCourses } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { value: 'all', label: 'All Courses', icon: FaGraduationCap },
    { value: 'web', label: 'Web Development', icon: FaLaptop },
    { value: 'mobile', label: 'Mobile Development', icon: FaLaptop },
    { value: 'data', label: 'Data Science', icon: FaBookOpen },
    { value: 'marketing', label: 'Digital Marketing', icon: FaPlay },
    { value: 'design', label: 'UI/UX Design', icon: FaCertificate },
    { value: 'programming', label: 'Programming', icon: FaBookOpen },
    { value: 'cloud', label: 'Cloud Computing', icon: FaBuilding }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-10000', label: 'Under ₹10,000' },
    { value: '10000-20000', label: '₹10,000 - ₹20,000' },
    { value: '20000-30000', label: '₹20,000 - ₹30,000' },
    { value: '30000+', label: 'Above ₹30,000' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const result = await CourseUsecase.getAllCoursesUsecase();
        
        if (result.success) {
          // Convert to mock course format for compatibility
          const mockFormatCourses = CourseUsecase.convertToMockCourseFormat(result.data);
          setCourses(mockFormatCourses);
        } else {
          console.error('Error fetching courses:', result.error);
          // Fallback to mock courses if database fetch fails
          setCourses(mockCourses || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to mock courses if database fetch fails
        setCourses(mockCourses || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [mockCourses]);

  // Extended courses for demonstration - prioritize real data
  const allCourses = useMemo(() => [
    ...(courses.length > 0 ? courses : (mockCourses || [])),
  ], [courses, mockCourses]);

  useEffect(() => {
    let filtered = allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' ||
        course.category === selectedCategory ||
        course.title.toLowerCase().includes(selectedCategory);

      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = course.onlinePrice;
        switch (priceRange) {
          case '0-10000':
            matchesPrice = price < 10000;
            break;
          case '10000-20000':
            matchesPrice = price >= 10000 && price <= 20000;
            break;
          case '20000-30000':
            matchesPrice = price >= 20000 && price <= 30000;
            break;
          case '30000+':
            matchesPrice = price > 30000;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.onlinePrice - b.onlinePrice;
        case 'price-high':
          return b.onlinePrice - a.onlinePrice;
        case 'newest':
          return b.id - a.id;
        case 'popular':
        default:
          return b.students - a.students;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, allCourses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <section className="bg-light py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-3 text-dark">Explore Our Courses</h1>
            <p className="lead mb-4 text-muted">
              Master new skills with our comprehensive technology courses designed by industry experts
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <div className="d-flex align-items-center bg-white rounded-pill px-4 py-2 shadow-sm">
                <FaGraduationCap className="text-primary me-2" />
                <span className="fw-semibold text-dark">{allCourses.length}+ Courses</span>
              </div>
              <div className="d-flex align-items-center bg-white rounded-pill px-4 py-2 shadow-sm">
                <FaUsers className="text-success me-2" />
                <span className="fw-semibold text-dark">10,000+ Students</span>
              </div>
              <div className="d-flex align-items-center bg-white rounded-pill px-4 py-2 shadow-sm">
                <FaStar className="text-warning me-2" />
                <span className="fw-semibold text-dark">4.8 Rating</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>


      {/* Category Navigation */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="fw-bold mb-3 text-dark">Browse by Category</h5>
            <Nav className="flex-nowrap overflow-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Nav.Item key={category.value} className="me-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={selectedCategory === category.value ? "primary" : "outline-light"}
                        className={`d-flex align-items-center px-4 py-2 rounded-pill border-2 ${selectedCategory === category.value
                          ? 'text-white shadow-sm'
                          : 'text-dark border-light bg-light hover-shadow'
                          }`}
                        style={{
                          minWidth: 'fit-content',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <IconComponent className="me-2" size={16} />
                        {category.label}
                      </Button>
                    </motion.div>
                  </Nav.Item>
                );
              })}
            </Nav>
          </motion.div>
        </Container>
      </section>

      {/* Filters Section */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Row className="align-items-center g-3">
              <Col lg={5} className="mb-3 mb-lg-0">
                <div className="position-relative">
                  <InputGroup className="shadow-sm">
                    <InputGroup.Text className="bg-white border-end-0 px-3">
                      <FaSearch className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search for courses, topics, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-start-0 py-2"
                      style={{ fontSize: '0.95rem' }}
                    />
                  </InputGroup>
                </div>
              </Col>

              <Col lg={7}>
                <Row className="g-2 align-items-center">
                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <small className="text-muted fw-semibold mb-1">Category</small>
                      <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border-0 bg-light rounded-2 py-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Col>

                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <small className="text-muted fw-semibold mb-1">Price Range</small>
                      <Form.Select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="border-0 bg-light rounded-2 py-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {priceRanges.map(range => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Col>

                  <Col md={3}>
                    <div className="d-flex flex-column">
                      <small className="text-muted fw-semibold mb-1">Sort By</small>
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border-0 bg-light rounded-2 py-2"
                        style={{ fontSize: '0.9rem' }}
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </Col>

                  <Col md={3}>
                    <div className="d-flex flex-column align-items-center">
                      <small className="text-muted fw-semibold mb-1">Actions</small>
                      <Button
                        variant="outline-primary"
                        className="w-100 rounded-2 py-2"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setPriceRange('all');
                          setSortBy('popular');
                        }}
                        style={{ fontSize: '0.9rem' }}
                      >
                        <FaFilter className="me-1" size={12} />
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Filter Summary */}
            <Row className="mt-3">
              <Col>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    {searchTerm && (
                      <Badge bg="primary" className="px-3 py-2 rounded-pill">
                        Search: "{searchTerm}"
                        <Button
                          variant="link"
                          size="sm"
                          className="text-white p-0 ms-2"
                          onClick={() => setSearchTerm('')}
                          style={{ fontSize: '0.8rem' }}
                        >
                          ×
                        </Button>
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge bg="success" className="px-3 py-2 rounded-pill">
                        {categories.find(cat => cat.value === selectedCategory)?.label}
                        <Button
                          variant="link"
                          size="sm"
                          className="text-white p-0 ms-2"
                          onClick={() => setSelectedCategory('all')}
                          style={{ fontSize: '0.8rem' }}
                        >
                          ×
                        </Button>
                      </Badge>
                    )}
                    {priceRange !== 'all' && (
                      <Badge bg="warning" className="px-3 py-2 rounded-pill">
                        {priceRanges.find(range => range.value === priceRange)?.label}
                        <Button
                          variant="link"
                          size="sm"
                          className="text-dark p-0 ms-2"
                          onClick={() => setPriceRange('all')}
                          style={{ fontSize: '0.8rem' }}
                        >
                          ×
                        </Button>
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted fw-semibold">
                    <small>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found</small>
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Courses Grid */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCourses.length === 0 ? (
              <Row className="justify-content-center">
                <Col lg={6} className="text-center py-5">
                  <motion.div variants={itemVariants}>
                    <div className="bg-white rounded-3 p-5 shadow-sm">
                      <div className="mb-4">
                        <span style={{ fontSize: '4rem', opacity: 0.5 }}>🔍</span>
                      </div>
                      <h4 className="text-dark fw-bold mb-3">No courses found</h4>
                      <p className="text-muted mb-4">Try adjusting your search criteria or browse different categories</p>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setPriceRange('all');
                          setSortBy('popular');
                        }}
                        className="rounded-pill px-4"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </motion.div>
                </Col>
              </Row>
            ) : (
              <>
                <Row className="mb-4">
                  <Col>
                    <motion.div variants={itemVariants}>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="text-muted mb-0 fw-semibold">
                          Showing {filteredCourses.length} of {allCourses.length} courses
                        </p>
                        <div className="d-flex align-items-center text-muted">
                          <small>Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</small>
                        </div>
                      </div>
                    </motion.div>
                  </Col>
                </Row>

                <Row className="g-4">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 6 }).map((_, index) => (
                      <Col xl={4} lg={6} md={6} sm={12} key={`skeleton-${index}`}>
                        <motion.div
                          variants={itemVariants}
                          className="h-100"
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                            <div 
                              className="bg-light d-flex align-items-center justify-content-center"
                              style={{ height: '180px' }}
                            >
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </div>
                            <Card.Body className="p-4">
                              <div className="placeholder-glow">
                                <span className="placeholder col-8 mb-2"></span>
                                <span className="placeholder col-6 mb-3"></span>
                                <span className="placeholder col-4 mb-2"></span>
                                <span className="placeholder col-7"></span>
                              </div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    ))
                  ) : (
                    filteredCourses.map((course, index) => (
                    <Col xl={4} lg={6} md={6} sm={12} key={course.id}>
                      <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to={`/course?id=${course.id}`} 
                  className="text-decoration-none"
                  style={{ cursor: 'pointer' }}
                >
                  <Card className="h-100 border-0 shadow-sm bg-white rounded-3 overflow-hidden" style={{ transition: 'all 0.3s ease' }}>
                          <div className="position-relative overflow-hidden">
                            <Card.Img
                              variant="top"
                              src={course.image}
                              style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="position-absolute top-0 end-0 m-3">
                              <Badge bg="white" text="dark" className="px-3 py-2 rounded-pill shadow-sm">
                                <FaClock className="me-1" size={12} />
                                {course.duration}
                              </Badge>
                            </div>
                            <div className="position-absolute top-0 start-0 m-3">
                              <Badge bg="warning" className="px-3 py-2 rounded-pill shadow-sm">
                                <FaStar className="me-1" size={12} />
                                {course.rating}
                              </Badge>
                            </div>
                            <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/20 to-transparent p-3">
                              <div className="d-flex align-items-center text-white">
                                <FaUsers className="me-1" size={12} />
                                <small className="fw-semibold">{course.students}+ students enrolled</small>
                              </div>
                            </div>
                          </div>

                          <Card.Body className="p-4">
                            <div className="mb-3">
                              <h5 className="fw-bold mb-2 text-dark" style={{ lineHeight: '1.3' }}>
                                {course.title}
                              </h5>
                              <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {course.description}
                              </p>
                            </div>

                            <div className="mb-3">
                              <div className="d-flex flex-wrap gap-1 mb-3">
                                {course.features.slice(0, 4).map((feature, idx) => (
                                  <Badge key={idx} bg="light" text="primary" className="px-2 py-1 rounded-pill" style={{ fontSize: '0.75rem' }}>
                                    {feature}
                                  </Badge>
                                ))}
                                {course.features.length > 4 && (
                                  <Badge bg="light" text="muted" className="px-2 py-1 rounded-pill" style={{ fontSize: '0.75rem' }}>
                                    +{course.features.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="border-top pt-3 mb-3">
                              <div className="row g-2">
                                <div className="col-6">
                                  <div className="text-center p-2 bg-light rounded-2">
                                    <div className="d-flex align-items-center justify-content-center mb-1">
                                      <FaLaptop className="text-primary me-1" size={14} />
                                      <small className="text-muted fw-semibold">Online</small>
                                    </div>
                                    <div className="fw-bold text-primary">₹{course.onlinePrice.toLocaleString()}</div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="text-center p-2 bg-light rounded-2">
                                    <div className="d-flex align-items-center justify-content-center mb-1">
                                      <FaBuilding className="text-success me-1" size={14} />
                                      <small className="text-muted fw-semibold">Offline</small>
                                    </div>
                                    <div className="fw-bold text-success">₹{course.offlinePrice.toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="d-grid gap-2">
                              <Button
                                variant="primary"
                                className="fw-semibold rounded-pill py-2"
                                style={{ transition: 'all 0.3s ease' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaPlay className="me-2" size={12} />
                                Start Learning
                              </Button>
                              <Button
                                variant="outline-primary"
                                className="fw-semibold rounded-pill py-2"
                                style={{ transition: 'all 0.3s ease' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaBookOpen className="me-2" size={12} />
                                View Syllabus
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                        </Link>
                      </motion.div>
                    </Col>
                  ))
                  )}
                </Row>
              </>
            )}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 gradient-primary text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="display-5 fw-bold mb-3">Ready to Start Learning?</h2>
            <p className="lead mb-4">
              Join thousands of students who have transformed their careers with our courses
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                as={Link}
                to="/login"
                variant="light"
                size="lg"
                className="btn-animated px-4"
              >
                Get Started Today
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                className="btn-animated px-4"
              >
                Talk to Counselor
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Courses;
import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaUsers, FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaBookOpen, FaCertificate, FaChevronLeft, FaChevronRight, FaRocket, FaHandshake } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';
import CourseUsecase from '../lib/usecase/CourseUsecase';
import Lottie from 'lottie-react';
import studentAnimationData from '../assets/student-anim.json';

const Home = () => {
  const { mockCourses } = useCourse();
  // const [currentSlide, setCurrentSlide] = useState(0);
  const [currentEventSlide, setCurrentEventSlide] = useState(0);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock events data
  const events = [
    {
      "id": 1,
      "title": "Web Development Workshop",
      "date": "2024-02-15",
      "time": "10:00 AM",
      "location": "Main Campus",
      "description": "Learn the basics of modern web development with hands-on projects.",
      "image": "https://images.unsplash.com/photo-1646579886135-068c73800308?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "type": "Workshop",
      "seats": 50,
      "bookedSeats": 35
    },
    {
      "id": 2,
      "title": "AI & Machine Learning Seminar",
      "date": "2024-02-20",
      "time": "2:00 PM",
      "location": "Online",
      "description": "Explore the future of AI and its applications in various industries.",
      "image": "https://images.unsplash.com/photo-1560523159-fbe43c0b465f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "type": "Seminar",
      "seats": 100,
      "bookedSeats": 78
    },
    {
      "id": 3,
      "title": "Digital Marketing Bootcamp",
      "date": "2024-02-25",
      "time": "9:00 AM",
      "location": "Main Campus",
      "description": "Master digital marketing strategies and tools in this intensive bootcamp.",
      "image": "https://images.unsplash.com/photo-1696041754237-e0c1ffd10138?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "type": "Bootcamp",
      "seats": 30,
      "bookedSeats": 25
    }
  ];

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Fetch featured courses
        const featuredResult = await CourseUsecase.getFeaturedCoursesUsecase(3);
        if (featuredResult.success) {
          // Convert to mockCourse format for compatibility
          const featuredInMockFormat = CourseUsecase.convertToMockCourseFormat(featuredResult.data);
          setFeaturedCourses(featuredInMockFormat);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to mockCourses if database fetch fails
        // setCourses(mockCourses || []);
        setFeaturedCourses((mockCourses || []).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [mockCourses]);


  const heroSlides = [
    {
      title: 'Transform Your Career with Technology',
      subtitle: 'Learn cutting-edge skills from industry experts',
      image: 'https://via.placeholder.com/1200x600',
      cta: 'Explore Courses'
    },
    {
      title: 'Join 1000+ Successful Students',
      subtitle: 'Get certified and land your dream job',
      image: 'https://via.placeholder.com/1200x600',
      cta: 'View Success Stories'
    },
    {
      title: 'Online & Offline Learning Options',
      subtitle: 'Choose the learning mode that suits you best',
      image: 'https://via.placeholder.com/1200x600',
      cta: 'Get Started'
    }
  ];


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
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section position-relative"
        style={{
          height: '80vh',
          minHeight: '600px', // Ensure minimum height on mobile
          backgroundImage: `url('/images/home-speaker.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      >

        <Container className="position-relative h-100 d-flex align-items-center align-items-lg-top">
          <Row className="w-100 mt-lg-5">
            <Col lg={8} md={12} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-white text-center text-lg-start"
              >
                <h1 className="display-6 display-lg-3 fw-bold mb-3 mb-lg-4 text-glow">
                  Transform Your Future with Technology
                </h1>
                <p className="lead mb-3 mb-lg-4 fs-5 fs-lg-4">
                  Join thousands of students mastering cutting-edge technologies through expert-led courses and hands-on projects.
                </p>
                <div className="d-flex gap-2 gap-lg-3 flex-column flex-sm-row justify-content-center justify-content-lg-start">
                  <Button
                    as={Link}
                    to="/courses"
                    size="lg"
                    className="btn-animated gradient-secondary px-3 px-lg-4 py-2 py-lg-3"
                  >
                    <FaPlay className="me-2" />
                    Start Learning
                  </Button>
                  <Button
                    variant="outline-light"
                    size="lg"
                    className="btn-animated px-3 px-lg-4 py-2 py-lg-3"
                  >
                    Watch Demo
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={4} md={12} className="d-flex align-items-center justify-content-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-center"
              >
                <Lottie
                  animationData={studentAnimationData}
                  style={{
                    height: window.innerWidth < 768 ? '250px' : window.innerWidth < 992 ? '300px' : '400px',
                    width: window.innerWidth < 768 ? '250px' : window.innerWidth < 992 ? '300px' : '400px',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                  }}
                  loop={true}
                  autoplay={true}
                />
              </motion.div>
            </Col>
          </Row>

          {/* Statistics Section - Positioned over hero */}
          <div className="position-absolute start-0 end-0" style={{ bottom: window.innerWidth < 768 ? '-80px' : '-80px', zIndex: 1000 }}>
            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-4 shadow-lg p-3 p-lg-4"
              >
                <Row className={window.innerWidth < 768 ? "g-3 justify-content-center" : "g-3 g-lg-4"}>
                  <Col md={3} sm={6} xs={6} className={window.innerWidth < 768 ? "mb-3" : ""}>
                    <motion.div
                      className="text-center h-100"
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <motion.div
                        className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 mb-lg-3"
                        style={{
                          width: window.innerWidth < 768 ? '50px' : '60px',
                          height: window.innerWidth < 768 ? '50px' : '60px'
                        }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 10px 25px rgba(13, 110, 253, 0.3)',
                          transition: { duration: 0.3 }
                        }}
                      >
                        <FaBookOpen className="text-primary" size={window.innerWidth < 768 ? 20 : 24} />
                      </motion.div>
                      <motion.h3
                        className="fw-bold text-dark mb-1"
                        style={{ fontSize: window.innerWidth < 768 ? '1.3rem' : '1.75rem' }}
                        whileHover={{ color: '#0d6efd' }}
                      >
                        {mockCourses.length}+
                      </motion.h3>
                      <p className="text-muted mb-0 fw-semibold" style={{ fontSize: window.innerWidth < 768 ? '0.85rem' : '1rem' }}>
                        Total Courses
                      </p>
                    </motion.div>
                  </Col>

                  <Col md={3} sm={6} xs={6} className={window.innerWidth < 768 ? "mb-3" : ""}>
                    <motion.div
                      className="text-center h-100"
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <motion.div
                        className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 mb-lg-3"
                        style={{
                          width: window.innerWidth < 768 ? '50px' : '60px',
                          height: window.innerWidth < 768 ? '50px' : '60px'
                        }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 10px 25px rgba(25, 135, 84, 0.3)',
                          transition: { duration: 0.3 }
                        }}
                      >
                        <FaUsers className="text-success" size={window.innerWidth < 768 ? 20 : 24} />
                      </motion.div>
                      <motion.h3
                        className="fw-bold text-dark mb-1"
                        style={{ fontSize: window.innerWidth < 768 ? '1.3rem' : '1.75rem' }}
                        whileHover={{ color: '#198754' }}
                      >
                        {mockCourses.reduce((total, course) => total + course.students, 0).toLocaleString()}+
                      </motion.h3>
                      <p className="text-muted mb-0 fw-semibold" style={{ fontSize: window.innerWidth < 768 ? '0.85rem' : '1rem' }}>Students Enrolled</p>
                    </motion.div>
                  </Col>
                  <Col md={3} sm={6} xs={6}>
                    <motion.div
                      className="text-center h-100"
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <motion.div
                        className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 mb-lg-3"
                        style={{
                          width: window.innerWidth < 768 ? '50px' : '60px',
                          height: window.innerWidth < 768 ? '50px' : '60px'
                        }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 10px 25px rgba(255, 193, 7, 0.3)',
                          transition: { duration: 0.3 }
                        }}
                      >
                        <FaStar className="text-warning" size={window.innerWidth < 768 ? 20 : 24} />
                      </motion.div>
                      <motion.h3
                        className="fw-bold text-dark mb-1"
                        style={{ fontSize: window.innerWidth < 768 ? '1.3rem' : '1.75rem' }}
                        whileHover={{ color: '#ffc107' }}
                      >
                        {(mockCourses.reduce((total, course) => total + course.rating, 0) / mockCourses.length).toFixed(1)}
                      </motion.h3>
                      <p className="text-muted mb-0 fw-semibold" style={{ fontSize: window.innerWidth < 768 ? '0.85rem' : '1rem' }}>Average Rating</p>
                    </motion.div>
                  </Col>
                  <Col md={3} sm={6} xs={6}>
                    <motion.div
                      className="text-center h-100"
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <motion.div
                        className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2 mb-lg-3"
                        style={{
                          width: window.innerWidth < 768 ? '50px' : '60px',
                          height: window.innerWidth < 768 ? '50px' : '60px'
                        }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 10px 25px rgba(13, 202, 240, 0.3)',
                          transition: { duration: 0.3 }
                        }}
                      >
                        <FaCertificate className="text-info" size={window.innerWidth < 768 ? 20 : 24} />
                      </motion.div>
                      <motion.h3
                        className="fw-bold text-dark mb-1"
                        style={{ fontSize: window.innerWidth < 768 ? '1.3rem' : '1.75rem' }}
                        whileHover={{ color: '#0dcaf0' }}
                      >
                        100%
                      </motion.h3>
                      <p className="text-muted mb-0 fw-semibold" style={{ fontSize: window.innerWidth < 768 ? '0.85rem' : '1rem' }}>Certification Rate</p>
                    </motion.div>
                  </Col>
                </Row>
              </motion.div>
            </Container>
          </div>
        </Container>
      </section>



      {/* Featured Courses Section */}
      <section className="py-5 bg-light mt-5">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Row className="mb-5">
              <Col lg={8} className="mx-auto text-center">
                <motion.div variants={itemVariants}>
                  <h2 className="display-5 fw-bold mb-3">Featured Courses</h2>
                  <p className="lead text-muted">
                    Discover our most popular courses designed to boost your career
                  </p>
                </motion.div>
              </Col>
            </Row>

            <Row>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <Col lg={4} md={6} key={`skeleton-${index}`} className="mb-4">
                    <motion.div
                      variants={itemVariants}
                      className="h-100"
                    >
                      <Card className="h-100 border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                        <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ height: window.innerWidth < 768 ? '180px' : '200px' }}
                        >
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                        <Card.Body className="p-3 p-lg-4">
                          <div className="placeholder-glow">
                            <span className="placeholder col-8 mb-2"></span>
                            <span className="placeholder col-6 mb-3"></span>
                            <span className="placeholder col-4"></span>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))
              ) : (
                (featuredCourses.length > 0 ? featuredCourses : (mockCourses || []).slice(0, 3)).map((course, index) => (
                  <Col lg={4} md={6} key={course.id} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
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
                              style={{
                                height: window.innerWidth < 768 ? '180px' : '200px',
                                objectFit: 'cover'
                              }}
                            />
                            <div className="position-absolute top-0 end-0 m-2 m-lg-3">
                              <Badge bg="white" text="dark" className="px-2 px-lg-3 py-1 py-lg-2 rounded-pill shadow-sm" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                                <FaClock className="me-1" size={window.innerWidth < 768 ? 10 : 12} />
                                {course.duration}
                              </Badge>
                            </div>
                            <div className="position-absolute top-0 start-0 m-2 m-lg-3">
                              <Badge bg="warning" className="px-2 px-lg-3 py-1 py-lg-2 rounded-pill shadow-sm" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                                <FaStar className="me-1" size={window.innerWidth < 768 ? 10 : 12} />
                                {course.rating}
                              </Badge>
                            </div>
                            <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/20 to-transparent p-2 p-lg-3">
                              <div className="d-flex align-items-center text-white">
                                <FaUsers className="me-1" size={window.innerWidth < 768 ? 10 : 12} />
                                <small className="fw-semibold" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                                  {course.students}+ students enrolled
                                </small>
                              </div>
                            </div>
                          </div>

                          <Card.Body className="p-3 p-lg-4">
                            <div className="mb-3">
                              <h5 className="fw-bold mb-2 text-dark" style={{
                                lineHeight: '1.3',
                                fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem'
                              }}>
                                {course.title}
                              </h5>
                              <p className="text-muted mb-3" style={{
                                fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                                lineHeight: '1.5'
                              }}>
                                {course.description}
                              </p>
                            </div>

                            <div className="mb-3">
                              <div className="d-flex flex-wrap gap-1 mb-3">
                                {course.features.slice(0, window.innerWidth < 768 ? 2 : 3).map((feature, idx) => (
                                  <Badge key={idx} bg="light" text="primary" className="px-2 py-1 rounded-pill" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>
                                    {feature}
                                  </Badge>
                                ))}
                                {course.features.length > (window.innerWidth < 768 ? 2 : 3) && (
                                  <Badge bg="light" text="muted" className="px-2 py-1 rounded-pill" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>
                                    +{course.features.length - (window.innerWidth < 768 ? 2 : 3)}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="border-top pt-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="text-center">
                                  <div className="text-muted small" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>Starting from</div>
                                  <div className="fw-bold text-primary" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>₹{(course.onlinePrice || 0).toLocaleString()}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-muted small" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>Instructor</div>
                                  <div className="fw-semibold text-dark" style={{ fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem' }}>{course.instructor}</div>
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="primary"
                              className="btn-animated w-100 fw-semibold rounded-pill py-2"
                              style={{
                                transition: 'all 0.3s ease',
                                fontSize: window.innerWidth < 768 ? '0.85rem' : '1rem'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaPlay className="me-2" size={window.innerWidth < 768 ? 10 : 12} />
                              Start Learning
                            </Button>
                          </Card.Body>
                        </Card>
                      </Link>
                    </motion.div>
                  </Col>
                ))
              )}
            </Row>

            <Row className="mt-4">
              <Col className="text-center">
                <Button
                  as={Link}
                  to="/courses"
                  variant="outline-primary"
                  size="lg"
                  className="btn-animated px-5"
                >
                  View All Courses
                </Button>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-5">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Row className="mb-5">
              <Col lg={8} className="mx-auto text-center">
                <motion.div variants={itemVariants}>
                  <h2 className="display-5 fw-bold mb-3">Upcoming Events</h2>
                  <p className="lead text-muted">
                    Join our workshops, seminars, and bootcamps to enhance your skills
                  </p>
                </motion.div>
              </Col>
            </Row>

            <Carousel
              indicators={false}
              controls={window.innerWidth >= 768}
              interval={window.innerWidth < 768 ? 3000 : 5000}
              className="events-carousel"
              activeIndex={currentEventSlide}
              onSelect={(selectedIndex) => setCurrentEventSlide(selectedIndex)}
              prevIcon={
                <span className="carousel-control-prev-icon" aria-hidden="true">
                  <FaChevronLeft />
                </span>
              }
              nextIcon={
                <span className="carousel-control-next-icon" aria-hidden="true">
                  <FaChevronRight />
                </span>
              }
            >
              {/* Group events into pairs for desktop, single for mobile */}
              {window.innerWidth < 768 ?
                // Mobile: Show one event per slide
                events.map((event, index) => (
                  <Carousel.Item key={index}>
                    <Row className="justify-content-center">
                      <Col xs={12} className="px-3">
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                          className="h-100"
                        >
                          <Card className="h-100 border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                            <div className="position-relative">
                              <Card.Img
                                variant="top"
                                src={event.image}
                                style={{ height: '160px', objectFit: 'cover' }}
                              />
                              <div className="position-absolute top-0 start-0 m-2">
                                <Badge bg="success" className="px-2 py-1 rounded-pill shadow-sm" style={{ fontSize: '0.7rem' }}>
                                  {event.type}
                                </Badge>
                              </div>
                              <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/20 to-transparent p-2">
                                <div className="d-flex align-items-center text-white">
                                  <FaUsers className="me-1" size={10} />
                                  <small className="fw-semibold" style={{ fontSize: '0.7rem' }}>
                                    {event.bookedSeats}/{event.seats} seats booked
                                  </small>
                                </div>
                              </div>
                            </div>

                            <Card.Body className="p-3">
                              <div className="mb-3">
                                <h5 className="fw-bold mb-2 text-dark" style={{
                                  lineHeight: '1.3',
                                  fontSize: '1.1rem'
                                }}>
                                  {event.title}
                                </h5>
                                <p className="text-muted mb-3" style={{
                                  fontSize: '0.8rem',
                                  lineHeight: '1.4',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {event.description}
                                </p>
                              </div>

                              <div className="event-details">
                                <div className="d-flex flex-column gap-1 mb-2">
                                  <div className="d-flex align-items-center">
                                    <FaCalendarAlt className="text-primary me-2" size={12} />
                                    <span className="small fw-medium" style={{ fontSize: '0.75rem' }}>
                                      {new Date(event.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <FaClock className="text-primary me-2" size={12} />
                                    <span className="small fw-medium" style={{ fontSize: '0.75rem' }}>
                                      {event.time}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <FaMapMarkerAlt className="text-primary me-2" size={12} />
                                    <span className="small fw-medium" style={{ fontSize: '0.75rem' }}>
                                      {event.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    </Row>
                  </Carousel.Item>
                )) :
                // Desktop: Show two events per slide
                Array.from({ length: Math.ceil(events.length / 2) }, (_, slideIndex) => {
                  const startIndex = slideIndex * 2;
                  const slideEvents = events.slice(startIndex, startIndex + 2);

                  return (
                    <Carousel.Item key={slideIndex}>
                      <Row className="justify-content-center">
                        {slideEvents.map((event, eventIndex) => (
                          <Col lg={6} md={6} sm={12} key={event.id} className="mb-4 mb-lg-0">
                            <motion.div
                              variants={itemVariants}
                              whileHover={{ y: -5 }}
                              transition={{ duration: 0.3 }}
                              className="h-100"
                            >
                              <Card className="h-100 border-0 shadow-sm bg-white rounded-3 overflow-hidden">
                                <div className="position-relative">
                                  <Card.Img
                                    variant="top"
                                    src={event.image}
                                    style={{ height: '180px', objectFit: 'cover' }}
                                  />
                                  <div className="position-absolute top-0 start-0 m-3">
                                    <Badge bg="success" className="px-3 py-2 rounded-pill shadow-sm">
                                      {event.type}
                                    </Badge>
                                  </div>
                                  <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/20 to-transparent p-3">
                                    <div className="d-flex align-items-center text-white">
                                      <FaUsers className="me-1" size={12} />
                                      <small className="fw-semibold">{event.bookedSeats}/{event.seats} seats booked</small>
                                    </div>
                                  </div>
                                </div>

                                <Card.Body className="p-4">
                                  <div className="mb-3">
                                    <h5 className="fw-bold mb-2 text-dark" style={{ lineHeight: '1.3' }}>
                                      {event.title}
                                    </h5>
                                    <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                      {event.description}
                                    </p>
                                  </div>

                                  <div className="event-details">
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="d-flex align-items-center me-4">
                                        <FaCalendarAlt className="text-primary me-2" size={14} />
                                        <span className="small fw-medium">{new Date(event.date).toLocaleDateString()}</span>
                                      </div>
                                      <div className="d-flex align-items-center">
                                        <FaClock className="text-primary me-2" size={14} />
                                        <span className="small fw-medium">{event.time}</span>
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <FaMapMarkerAlt className="text-primary me-2" size={14} />
                                      <span className="small fw-medium">{event.location}</span>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </Carousel.Item>
                  );
                })
              }
            </Carousel>

            <Row className="mt-4">
              <Col className="text-center">
                <Button
                  as={Link}
                  to="/events"
                  variant="outline-primary"
                  size="lg"
                  className="btn-animated px-5"
                >
                  View All Events
                </Button>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5 gradient-primary">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-4 fw-bold text-white mb-3">Why Choose TechAdda?</h2>
            <p className="lead text-white-50">
              Join thousands of tech enthusiasts who trust us for their learning journey
            </p>
          </motion.div>

          <Row className="g-4">
            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                className="text-center h-100 p-4 rounded-3"
                style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360, color: '#fbbf24' }}
                  transition={{ duration: 0.6 }}
                >
                  <FaUsers className="text-warning mb-3" size={48} />
                </motion.div>
                <h5 className="text-white mb-3">Expert Community</h5>
                <p className="text-white-50">
                  Connect with industry experts and like-minded developers
                </p>
              </motion.div>
            </Col>

            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                className="text-center h-100 p-4 rounded-3"
                style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360, color: '#fbbf24' }}
                  transition={{ duration: 0.6 }}
                >
                  <FaRocket className="text-warning mb-3" size={48} />
                </motion.div>
                <h5 className="text-white mb-3">Latest Technology</h5>
                <p className="text-white-50">
                  Stay updated with cutting-edge tech trends and innovations
                </p>
              </motion.div>
            </Col>

            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                className="text-center h-100 p-4 rounded-3"
                style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360, color: '#fbbf24' }}
                  transition={{ duration: 0.6 }}
                >
                  <FaCertificate className="text-warning mb-3" size={48} />
                </motion.div>
                <h5 className="text-white mb-3">Certification</h5>
                <p className="text-white-50">
                  Earn recognized certificates to boost your career prospects
                </p>
              </motion.div>
            </Col>

            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                className="text-center h-100 p-4 rounded-3"
                style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360, color: '#fbbf24' }}
                  transition={{ duration: 0.6 }}
                >
                  <FaHandshake className="text-warning mb-3" size={48} />
                </motion.div>
                <h5 className="text-white mb-3">24/7 Support</h5>
                <p className="text-white-50">
                  Get help whenever you need it with our dedicated support team
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
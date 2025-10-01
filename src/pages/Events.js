import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaShare, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Events = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });

  const events = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Learn the fundamentals of modern web development with hands-on projects and expert guidance.',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Techaddaa Institute, Main Campus',
      type: 'Workshop',
      price: 500,
      capacity: 50,
      registered: 35,
      image: 'https://via.placeholder.com/400x250',
      features: ['Hands-on Projects', 'Certificate', 'Lunch Included', 'Expert Mentors'],
      instructor: 'Mr. Sharma',
      level: 'Beginner',
      category: 'Programming'
    },
    {
      id: 2,
      title: 'AI & Machine Learning Seminar',
      description: 'Explore the latest trends in artificial intelligence and machine learning technologies.',
      date: '2024-02-20',
      time: '2:00 PM - 6:00 PM',
      location: 'Online Event',
      type: 'Seminar',
      price: 0,
      capacity: 200,
      registered: 145,
      image: 'https://via.placeholder.com/400x250',
      features: ['Industry Experts', 'Q&A Session', 'Recording Available', 'Networking'],
      instructor: 'Dr. Patel',
      level: 'Intermediate',
      category: 'Technology'
    },
    {
      id: 3,
      title: 'Digital Marketing Bootcamp',
      description: 'Master digital marketing strategies and tools in this intensive bootcamp session.',
      date: '2024-02-25',
      time: '9:00 AM - 5:00 PM',
      location: 'Techaddaa Institute, Conference Hall',
      type: 'Bootcamp',
      price: 1200,
      capacity: 30,
      registered: 22,
      image: 'https://via.placeholder.com/400x250',
      features: ['Live Projects', 'Tools Access', 'Certificate', 'Job Assistance'],
      instructor: 'Ms. Gupta',
      level: 'All Levels',
      category: 'Marketing'
    },
    {
      id: 4,
      title: 'UI/UX Design Masterclass',
      description: 'Learn design thinking and create stunning user interfaces with industry best practices.',
      date: '2024-03-05',
      time: '11:00 AM - 3:00 PM',
      location: 'Techaddaa Institute, Design Lab',
      type: 'Masterclass',
      price: 800,
      capacity: 25,
      registered: 18,
      image: 'https://via.placeholder.com/400x250',
      features: ['Design Tools', 'Portfolio Review', 'Certificate', 'Industry Insights'],
      instructor: 'Mr. Kumar',
      level: 'Intermediate',
      category: 'Design'
    },
    {
      id: 5,
      title: 'Career Guidance Session',
      description: 'Get expert advice on career planning and job opportunities in the tech industry.',
      date: '2024-03-10',
      time: '3:00 PM - 5:00 PM',
      location: 'Online Event',
      type: 'Session',
      price: 0,
      capacity: 100,
      registered: 67,
      image: 'https://via.placeholder.com/400x250',
      features: ['Career Counseling', 'Resume Review', 'Interview Tips', 'Industry Trends'],
      instructor: 'HR Team',
      level: 'All Levels',
      category: 'Career'
    },
    {
      id: 6,
      title: 'Hackathon 2024',
      description: '48-hour coding challenge to build innovative solutions for real-world problems.',
      date: '2024-03-15',
      time: '6:00 PM - 6:00 PM (48 hours)',
      location: 'Techaddaa Institute, Innovation Center',
      type: 'Competition',
      price: 200,
      capacity: 80,
      registered: 45,
      image: 'https://via.placeholder.com/400x250',
      features: ['Team Building', 'Prizes Worth ₹50,000', 'Mentorship', 'Networking'],
      instructor: 'Multiple Mentors',
      level: 'Intermediate',
      category: 'Competition'
    }
  ];

  const handleRegistration = (event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const submitRegistration = () => {
    if (!registrationData.name || !registrationData.email || !registrationData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    // Simulate registration
    toast.success(`Successfully registered for ${selectedEvent.title}!`);
    setShowRegistrationModal(false);
    setRegistrationData({ name: '', email: '', phone: '', organization: '' });
    setSelectedEvent(null);
  };

  const shareEvent = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const getEventStatus = (event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const isUpcoming = eventDate > today;
    const spotsLeft = event.capacity - event.registered;
    
    if (!isUpcoming) return { text: 'Past Event', variant: 'secondary' };
    if (spotsLeft <= 0) return { text: 'Sold Out', variant: 'danger' };
    if (spotsLeft <= 5) return { text: 'Few Spots Left', variant: 'warning' };
    return { text: 'Available', variant: 'success' };
  };

  const EventCard = ({ event, index }) => {
    const status = getEventStatus(event);
    const spotsLeft = event.capacity - event.registered;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="h-100"
      >
        <Card className="h-100 border-0 shadow-sm event-card">
          <div className="position-relative">
            <div 
              className="card-img-top"
              style={{
                height: '200px',
                background: `linear-gradient(135deg, #007bff, #0056b3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="text-center text-white p-3">
                <h5 className="mb-2">{event.title}</h5>
                <div className="d-flex align-items-center justify-content-center">
                  <FaCalendarAlt className="me-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <Badge 
              bg={status.variant} 
              className="position-absolute top-0 end-0 m-2"
            >
              {status.text}
            </Badge>
            
            <Badge 
              bg="dark" 
              className="position-absolute top-0 start-0 m-2"
            >
              {event.type}
            </Badge>
          </div>
          
          <Card.Body className="d-flex flex-column">
            <div className="mb-3">
              <Badge bg="light" text="dark" className="me-2">
                {event.category}
              </Badge>
              <Badge bg="outline-primary">
                {event.level}
              </Badge>
            </div>
            
            <h5 className="card-title mb-2">{event.title}</h5>
            <p className="card-text text-muted mb-3 flex-grow-1">
              {event.description}
            </p>
            
            <div className="event-details mb-3">
              <div className="d-flex align-items-center mb-2">
                <FaClock className="text-primary me-2" />
                <span className="small">{event.time}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaMapMarkerAlt className="text-primary me-2" />
                <span className="small">{event.location}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaUsers className="text-primary me-2" />
                <span className="small">{event.registered}/{event.capacity} registered</span>
              </div>
              <div className="d-flex align-items-center">
                <FaTicketAlt className="text-primary me-2" />
                <span className="small">
                  {event.price === 0 ? 'Free' : `₹${event.price}`}
                </span>
              </div>
            </div>
            
            <div className="progress mb-3" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
              ></div>
            </div>
            
            <div className="features mb-3">
              <div className="d-flex flex-wrap gap-1">
                {event.features.slice(0, 2).map((feature, idx) => (
                  <Badge key={idx} bg="light" text="dark" className="small">
                    {feature}
                  </Badge>
                ))}
                {event.features.length > 2 && (
                  <Badge bg="light" text="dark" className="small">
                    +{event.features.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  className="btn-animated flex-grow-1"
                  onClick={() => handleRegistration(event)}
                  disabled={spotsLeft <= 0 || new Date(event.date) < new Date()}
                >
                  {spotsLeft <= 0 ? 'Sold Out' : 'Register Now'}
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="btn-animated"
                  onClick={() => shareEvent(event)}
                  title="Share Event"
                >
                  <FaShare />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section 
        className="speaker-audience-bg text-white py-5"
        style={{
          backgroundImage: `url('/images/speaker-audience.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '60vh'
        }}
      >
        <Container className="position-relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-3">Upcoming Events</h1>
            <p className="lead mb-4">
              Join our workshops, seminars, and networking events to enhance your skills
            </p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <FaCalendarAlt className="me-2" />
                    {events.filter(e => new Date(e.date) > new Date()).length} Upcoming Events
                  </Badge>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <FaTicketAlt className="me-2" />
                    {events.filter(e => e.price === 0).length} Free Events
                  </Badge>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <FaUsers className="me-2" />
                    {events.reduce((sum, e) => sum + e.registered, 0)} Total Registrations
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Events Grid */}
      <section className="py-5">
        <Container>
          <Row>
            {events.map((event, index) => (
              <Col key={event.id} lg={4} md={6} className="mb-4">
                <EventCard event={event} index={index} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="gradient-secondary text-white py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="mb-3">Want to Host an Event?</h2>
            <p className="lead mb-4">
              Partner with us to organize workshops, seminars, or competitions
            </p>
            <Button variant="light" size="lg" className="btn-animated">
              Contact Us
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Registration Modal */}
      <Modal show={showRegistrationModal} onHide={() => setShowRegistrationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register for {selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Date:</span>
                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Time:</span>
                <span>{selectedEvent.time}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Location:</span>
                <span>{selectedEvent.location}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Price:</span>
                <span className="fw-bold">
                  {selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`}
                </span>
              </div>
              <hr />
            </div>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                value={registrationData.name}
                onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone Number *</Form.Label>
              <Form.Control
                type="tel"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                placeholder="Enter your phone number"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Organization (Optional)</Form.Label>
              <Form.Control
                type="text"
                value={registrationData.organization}
                onChange={(e) => setRegistrationData({...registrationData, organization: e.target.value})}
                placeholder="Enter your organization name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegistrationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitRegistration} className="btn-animated">
            Register Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Events;
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, ListGroup, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPaperPlane, FaSmile, FaFile, FaImage, FaVideo, FaPhone,
  FaSearch, FaEllipsisV, FaCheck, FaCheckDouble, FaClock,
  FaArrowLeft, FaInfoCircle
} from 'react-icons/fa';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useCourse } from '../context/CourseContext';
import { toast } from 'react-toastify';

const Chat = () => {
  const { state } = useStudentAuth();
  const { user } = state;
  const { mockCourses } = useCourse();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock chat data for purchased courses
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user && user.purchasedCourses) {
      // Create chat rooms for purchased courses
      const userChats = user.purchasedCourses.map(courseId => {
        const course = mockCourses.find(c => c.id === courseId);
        return {
          id: courseId,
          name: course?.title || 'Unknown Course',
          instructor: course?.instructor || 'Instructor',
          lastMessage: 'Welcome to the course! Feel free to ask any questions.',
          timestamp: new Date().toISOString(),
          unreadCount: 0,
          online: Math.random() > 0.5,
          avatar: course?.instructor?.charAt(0) || 'I'
        };
      });
      setChats(userChats);

      // Initialize messages for each chat
      const initialMessages = {};
      userChats.forEach(chat => {
        initialMessages[chat.id] = [
          {
            id: 1,
            sender: 'instructor',
            senderName: chat.instructor,
            content: `Welcome to ${chat.name}! I'm ${chat.instructor}, your instructor for this course. Feel free to ask any questions about the course content, assignments, or anything related to your learning journey.`,
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'instructor',
            senderName: chat.instructor,
            content: 'I\'m here to help you succeed in this course. Don\'t hesitate to reach out!',
            timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
            type: 'text',
            status: 'read'
          }
        ];
      });
      setMessages(initialMessages);

      // Select first chat by default
      if (userChats.length > 0) {
        setSelectedChat(userChats[0]);
      }
    }
  }, [user, mockCourses]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'student',
      senderName: user.name,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    // Update last message in chat list
    setChats(prev => prev.map(chat =>
      chat.id === selectedChat.id
        ? { ...chat, lastMessage: message.trim(), timestamp: new Date().toISOString() }
        : chat
    ));

    setMessage('');

    // Simulate instructor response after 2-5 seconds
    setTimeout(() => {
      const responses = [
        "Thanks for your question! Let me help you with that.",
        "That's a great question! Here's what I think...",
        "I understand your concern. Let me explain this concept.",
        "Good observation! You're on the right track.",
        "Let me provide you with some additional resources for this topic.",
        "That's exactly the kind of thinking we want to see!",
        "I'll prepare some examples to clarify this for you.",
        "Feel free to ask if you need more clarification on this topic."
      ];

      const instructorResponse = {
        id: Date.now() + 1,
        sender: 'instructor',
        senderName: selectedChat.instructor,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'read'
      };

      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), instructorResponse]
      }));

      // Update message status to delivered
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        }));
      }, 1000);

      // Update message status to read
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        }));
      }, 2000);

    }, Math.random() * 3000 + 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent':
        return <FaClock className="text-muted" size={12} />;
      case 'delivered':
        return <FaCheck className="text-muted" size={12} />;
      case 'read':
        return <FaCheckDouble className="text-primary" size={12} />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Please login to access chat</h3>
          <p className="text-muted">You need to be logged in to chat with instructors.</p>
        </div>
      </Container>
    );
  }

  if (!user.purchasedCourses || user.purchasedCourses.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>No courses purchased</h3>
          <p className="text-muted">Purchase a course to start chatting with instructors.</p>
          <Button variant="primary" href="/courses">
            Browse Courses
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="chat-page">
      <Container fluid className="h-100">
        <Row className="h-100 g-0">
          {/* Chat List Sidebar */}
          <Col lg={4} className={`chat-sidebar ${selectedChat ? 'd-none d-lg-block' : ''}`}>
            <Card className="h-100 border-0 rounded-0">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Course Chats</h5>
                  <Badge bg="light" text="dark">{chats.length}</Badge>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-3"
                  size="sm"
                />
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {filteredChats.map((chat) => (
                    <ListGroup.Item
                      key={chat.id}
                      action
                      active={selectedChat?.id === chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className="chat-item"
                    >
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                          <div className="avatar-circle">
                            {chat.avatar}
                          </div>
                          {chat.online && (
                            <div className="online-indicator"></div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1 text-truncate">{chat.name}</h6>
                            <small className="text-muted">{formatTime(chat.timestamp)}</small>
                          </div>
                          <p className="mb-1 text-muted text-truncate small">
                            {chat.lastMessage}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">with {chat.instructor}</small>
                            {chat.unreadCount > 0 && (
                              <Badge bg="danger" pill>{chat.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Chat Area */}
          <Col lg={8} className="chat-main">
            {selectedChat ? (
              <Card className="h-100 border-0 rounded-0">
                {/* Chat Header */}
                <Card.Header className="bg-white border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Button
                        variant="link"
                        className="d-lg-none p-0 me-3"
                        onClick={() => setSelectedChat(null)}
                      >
                        <FaArrowLeft />
                      </Button>
                      <div className="position-relative me-3">
                        <div className="avatar-circle">
                          {selectedChat.avatar}
                        </div>
                        {selectedChat.online && (
                          <div className="online-indicator"></div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{selectedChat.name}</h6>
                        <small className="text-muted">
                          {selectedChat.instructor} • {selectedChat.online ? 'Online' : 'Offline'}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        <FaPhone />
                      </Button>
                      <Button variant="outline-primary" size="sm">
                        <FaVideo />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowChatInfo(true)}
                      >
                        <FaInfoCircle />
                      </Button>
                    </div>
                  </div>
                </Card.Header>

                {/* Messages Area */}
                <Card.Body className="messages-container">
                  <div className="messages-list">
                    <AnimatePresence>
                      {(messages[selectedChat.id] || []).map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className={`message ${msg.sender === 'student' ? 'message-sent' : 'message-received'}`}
                        >
                          <div className="message-content">
                            {msg.sender === 'instructor' && (
                              <div className="message-sender">{msg.senderName}</div>
                            )}
                            <div className="message-text">{msg.content}</div>
                            <div className="message-meta">
                              <span className="message-time">{formatTime(msg.timestamp)}</span>
                              {msg.sender === 'student' && (
                                <span className="message-status ms-1">
                                  {getMessageStatus(msg.status)}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </Card.Body>

                {/* Message Input */}
                <Card.Footer className="bg-white border-top">
                  <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                    <div className="d-flex align-items-end gap-2">
                      <Button variant="outline-secondary" size="sm">
                        <FaFile />
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaImage />
                      </Button>
                      <div className="flex-grow-1">
                        <Form.Control
                          as="textarea"
                          rows={1}
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          style={{ resize: 'none', minHeight: '40px' }}
                        />
                      </div>
                      <Button variant="outline-secondary" size="sm">
                        <FaSmile />
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!message.trim()}
                      >
                        <FaPaperPlane />
                      </Button>
                    </div>
                  </Form>
                </Card.Footer>
              </Card>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center">
                  <h4 className="text-muted">Select a chat to start messaging</h4>
                  <p className="text-muted">Choose a course chat from the sidebar to begin conversation with your instructor.</p>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Chat Info Modal */}
      <Modal show={showChatInfo} onHide={() => setShowChatInfo(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Course Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChat && (
            <div>
              <div className="text-center mb-4">
                <div className="avatar-circle mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {selectedChat.avatar}
                </div>
                <h5>{selectedChat.name}</h5>
                <p className="text-muted">Instructor: {selectedChat.instructor}</p>
              </div>

              <div className="course-info">
                <h6>Course Details</h6>
                <ul className="list-unstyled">
                  <li><strong>Status:</strong> <Badge bg="success">Active</Badge></li>
                  <li><strong>Enrolled:</strong> {new Date(user.fees?.joinDate || Date.now()).toLocaleDateString()}</li>
                  <li><strong>Progress:</strong> {user.progress?.[selectedChat.id]?.completed || 0}%</li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChatInfo(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chat;
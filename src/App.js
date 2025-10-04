import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Events from './pages/Events';
import CertificateDownload from './pages/CertificateDownload';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CourseDetails from './pages/CourseDetails';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Chat from './pages/Chat';
import Fees from './pages/Fees';
import Contact from './pages/Contact';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import AdminLogin from './pages/admin/Login';
import AdminDashboardNew from './pages/admin/AdminDashboard';
import AdminChangePassword from './pages/admin/AdminChangePassword';
import OTPVerification from './components/OTPVerification';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { FirebaseProvider } from './context/FirebaseContext';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'aos/dist/aos.css';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course" element={<CourseDetails />} />
          <Route
            path="/checkout"
            element={loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (user ? <Checkout /> : <Navigate to="/login" />)}
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/events" element={<Events />} />
          <Route path="/certificate" element={<CertificateDownload />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (user ? <StudentDashboard /> : <Navigate to="/login" />)}
          />
          <Route
            path="/chat"
            element={loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (user ? <Chat /> : <Navigate to="/login" />)}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboardNew />} />
          <Route path="/admin/change-password" element={<AdminChangePassword />} />
          <Route
            path="/admin"
            element={loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />)}
          />
          <Route
            path="/fees"
            element={loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (user?.role === 'admin' ? <Fees /> : <Navigate to="/" />)}
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </FirebaseProvider>
  );
}

export default App;
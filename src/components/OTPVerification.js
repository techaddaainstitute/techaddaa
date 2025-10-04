import React, { useState, useEffect, useRef } from 'react';
import FirebaseOTPService from '../lib/services/FirebaseService';
import './OTPVerification.css';

const OTPVerification = ({ 
  onVerificationSuccess, 
  onVerificationError,
  phoneNumber: initialPhoneNumber = '',
  showPhoneInput = true,
  autoFocus = true
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const recaptchaRef = useRef(null);
  const phoneInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto focus on phone input when component mounts
  useEffect(() => {
    if (autoFocus && showPhoneInput && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [autoFocus, showPhoneInput]);

  // Auto focus on OTP input when OTP is sent
  useEffect(() => {
    if (isOtpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [isOtpSent]);

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +91 XXXXX XXXXX for Indian numbers
    if (digits.length <= 10) {
      return digits.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim();
    }
    return digits.slice(0, 10).replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
  };

  const sendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Initialize reCAPTCHA
      const recaptchaResult = FirebaseOTPService.initializeRecaptcha('recaptcha-container');
      if (!recaptchaResult.success) {
        setError(recaptchaResult.error);
        setIsLoading(false);
        return;
      }

      // Format phone number for Firebase
      const formattedPhone = `+91${phoneNumber.replace(/\D/g, '')}`;
      
      const result = await FirebaseOTPService.sendOTP(formattedPhone);
      
      if (result.success) {
        setIsOtpSent(true);
        setSuccess('OTP sent successfully! Please check your phone.');
        setCountdown(60); // 60 seconds countdown
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      console.error('Send OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await FirebaseOTPService.verifyOTP(otp);
      
      if (result.success) {
        setSuccess('Phone number verified successfully!');
        if (onVerificationSuccess) {
          onVerificationSuccess(result.user);
        }
      } else {
        setError(result.error);
        if (onVerificationError) {
          onVerificationError(result.error);
        }
      }
    } catch (error) {
      const errorMessage = 'Failed to verify OTP. Please try again.';
      setError(errorMessage);
      if (onVerificationError) {
        onVerificationError(errorMessage);
      }
      console.error('Verify OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setError('');
    setOtp('');

    try {
      const formattedPhone = `+91${phoneNumber.replace(/\D/g, '')}`;
      const result = await FirebaseOTPService.resendOTP(formattedPhone);
      
      if (result.success) {
        setSuccess('OTP resent successfully!');
        setCountdown(60);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setOtp('');
    setIsOtpSent(false);
    setError('');
    setSuccess('');
    setCountdown(0);
    FirebaseOTPService.cleanup();
  };

  return (
    <div className="otp-verification">
      <div className="otp-container">
        <h2 className="otp-title">Phone Verification</h2>
        
        {/* reCAPTCHA container */}
        <div id="recaptcha-container" ref={recaptchaRef}></div>

        {/* Phone Number Input */}
        {showPhoneInput && !isOtpSent && (
          <div className="phone-section">
            <div className="input-group">
              <label htmlFor="phone" className="input-label">
                Mobile Number
              </label>
              <div className="phone-input-wrapper">
                <span className="country-code">+91</span>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  className="phone-input"
                  maxLength="11"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button
              onClick={sendOTP}
              disabled={isLoading || !phoneNumber}
              className="send-otp-btn"
            >
              {isLoading ? (
                <span className="loading-spinner">Sending...</span>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        )}

        {/* OTP Input */}
        {isOtpSent && (
          <div className="otp-section">
            <div className="input-group">
              <label htmlFor="otp" className="input-label">
                Enter OTP
              </label>
              <p className="otp-info">
                OTP sent to +91 {phoneNumber}
              </p>
              <input
                ref={otpInputRef}
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                className="otp-input"
                maxLength="6"
                disabled={isLoading}
              />
            </div>

            <div className="otp-actions">
              <button
                onClick={verifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="verify-otp-btn"
              >
                {isLoading ? (
                  <span className="loading-spinner">Verifying...</span>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="resend-section">
                {countdown > 0 ? (
                  <span className="countdown">
                    Resend OTP in {countdown}s
                  </span>
                ) : (
                  <button
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="resend-btn"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={resetForm}
              className="change-number-btn"
              disabled={isLoading}
            >
              Change Number
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="message error-message">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span className="message-icon">✅</span>
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
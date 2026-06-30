import React, { createContext, useContext, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import AuthUsecase from '../lib/usecase/AuthUsecase';
import CertificateDatasource from '../lib/datasource/CertificateDatasource';

const CertificateContext = createContext();

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
};

export const CertificateProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [verificationData, setVerificationData] = useState({
    phoneNumber: '',
    dateOfBirth: ''
  });

  const sendCertificateOtp = async (phoneNumber, dateOfBirth) => {
    setLoading(true);
    try {
      const students = await CertificateDatasource.findStudentsByPhoneAndDob(phoneNumber, dateOfBirth);
      if (!students.length) {
        throw new Error('No student found with provided phone number and date of birth');
      }

      const otpResult = await AuthUsecase.sendOTPUsecase(phoneNumber);
      if (!otpResult.success) {
        throw new Error(otpResult.message || 'Failed to send OTP');
      }

      setVerificationData({ phoneNumber, dateOfBirth });
      return { success: true, message: otpResult.message };
    } catch (error) {
      const message = error.message || 'Failed to send OTP';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificateOtp = async (otp) => {
    if (!verificationData.phoneNumber || !verificationData.dateOfBirth) {
      const message = 'Please submit your details first';
      toast.error(message);
      return { success: false, message, data: [] };
    }

    setLoading(true);
    try {
      const verifyResult = await AuthUsecase.verifyOTPUsecase(verificationData.phoneNumber, otp);
      if (!verifyResult.success) {
        throw new Error(verifyResult.message || 'OTP verification failed');
      }

      const fetchedCertificates = await CertificateDatasource.getCertificatesByPhoneAndDob(
        verificationData.phoneNumber,
        verificationData.dateOfBirth
      );

      setCertificates(fetchedCertificates);

      if (!fetchedCertificates.length) {
        return {
          success: false,
          message: 'No certificates found for the provided details',
          data: []
        };
      }

      return {
        success: true,
        message: 'OTP verified and certificates fetched successfully',
        data: fetchedCertificates
      };
    } catch (error) {
      const message = error.message || 'OTP verification failed';
      toast.error(message);
      return { success: false, message, data: [] };
    } finally {
      setLoading(false);
    }
  };

  const resetCertificateState = () => {
    setCertificates([]);
    setVerificationData({ phoneNumber: '', dateOfBirth: '' });
  };

  const value = useMemo(() => ({
    loading,
    certificates,
    sendCertificateOtp,
    verifyCertificateOtp,
    resetCertificateState
  }), [loading, certificates]);

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
};

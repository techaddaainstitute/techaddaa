/**
 * AuthResponse Model
 * Standardizes authentication API responses
 */

export class AuthResponse {
  constructor({
    success = false,
    data = null,
    error = null,
    message = '',
    isNewUser = false
  } = {}) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.message = message;
    this.isNewUser = isNewUser;
  }

  static success(data, message = '', isNewUser = false) {
    return new AuthResponse({
      success: true,
      data,
      message,
      isNewUser
    });
  }

  static error(error, message = '') {
    return new AuthResponse({
      success: false,
      error,
      message: message || error?.message || 'An error occurred'
    });
  }
}

export class OTPResponse {
  constructor({
    success = false,
    message = '',
    error = null,
    canResend = false,
    expiresAt = null
  } = {}) {
    this.success = success;
    this.message = message;
    this.error = error;
    this.canResend = canResend;
    this.expiresAt = expiresAt;
  }

  static success(message = 'OTP sent successfully', expiresAt = null) {
    return new OTPResponse({
      success: true,
      message,
      expiresAt
    });
  }

  static error(error, message = '') {
    return new OTPResponse({
      success: false,
      error,
      message: message || error?.message || 'Failed to send OTP',
      canResend: true
    });
  }
}

export default AuthResponse;
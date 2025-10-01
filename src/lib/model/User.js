/**
 * User Model
 * Defines the structure and validation for user data
 */

export class User {
  constructor({
    id = null,
    email = null,
    phone_number = null,
    full_name = '',
    date_of_birth = null,
    role = 'student',
    created_at = null,
    updated_at = null,
    auth_type = 'email' // 'email' or 'phone'
  } = {}) {
    this.id = id;
    this.email = email;
    this.phone_number = phone_number;
    this.full_name = full_name;
    this.date_of_birth = date_of_birth;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.auth_type = auth_type;
  }

  // Validation methods
  isValid() {
    return this.hasValidContact() && this.full_name.trim().length > 0;
  }

  hasValidContact() {
    return this.email || this.phone_number;
  }

  isEmailUser() {
    return this.auth_type === 'email' && this.email;
  }

  isPhoneUser() {
    return this.auth_type === 'phone' && this.phone_number;
  }

  // Convert to plain object for API calls
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      phone_number: this.phone_number,
      full_name: this.full_name,
      date_of_birth: this.date_of_birth,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Create User from API response
  static fromJSON(data) {
    return new User(data);
  }

  // Create User for phone registration
  static createPhoneUser({ phone_number, full_name, date_of_birth, email }) {
    return new User({
      phone_number,
      full_name,
      date_of_birth,
      email,
      auth_type: 'phone',
      role: 'student'
    });
  }

  // Create User for email registration
  static createEmailUser({ email, full_name, id }) {
    return new User({
      id,
      email,
      full_name,
      auth_type: 'email',
      role: 'student'
    });
  }
}

export default User;
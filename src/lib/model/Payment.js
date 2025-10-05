/**
 * Payment Model
 * Defines the structure and validation for payment data
 */

export class Payment {
  constructor({
    id = null,
    user_id = null,
    course_id = null,
    enrollment_id = null,
    amount = 0,
    currency = 'INR',
    payment_status = 'pending',
    payment_method = 'instamojo',
    payment_type = 'course_fee',
    gateway_payment_id = null,
    instamojo_payment_id = null,
    instamojo_payment_request_id = null,
    description = '',
    buyer_name = '',
    email = '',
    phone = '',
    payment_date = null,
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.user_id = user_id;
    this.course_id = course_id;
    this.enrollment_id = enrollment_id;
    this.amount = parseFloat(amount) || 0;
    this.currency = currency;
    this.payment_status = payment_status;
    this.payment_method = payment_method || 'instamojo';
    this.payment_type = payment_type || 'course_fee';
    this.gateway_payment_id = gateway_payment_id;
    this.instamojo_payment_id = instamojo_payment_id;
    this.instamojo_payment_request_id = instamojo_payment_request_id;
    this.description = description;
    this.buyer_name = buyer_name;
    this.email = email;
    this.phone = phone;
    this.payment_date = payment_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.ip_address = ip_address;
    this.user_agent = user_agent;
  }

  // Validation methods
  isValid() {
    return this.user_id && this.amount > 0 && this.payment_method;
  }

  isValidPaymentStatus() {
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'];
    return validStatuses.includes(this.payment_status);
  }

  isValidPaymentMethod() {
    const validMethods = ['instamojo', 'razorpay', 'card', 'upi', 'bank_transfer', 'cash', 'cheque'];
    return this.payment_method && validMethods.includes(this.payment_method);
  }

  isValidPaymentType() {
    const validTypes = ['course_fee', 'installment', 'late_fee', 'refund'];
    return validTypes.includes(this.payment_type);
  }

  isPending() {
    return this.payment_status === 'pending';
  }

  isCompleted() {
    return this.payment_status === 'completed';
  }

  isFailed() {
    return this.payment_status === 'failed';
  }

  isRefunded() {
    return this.payment_status === 'refunded';
  }

  // Formatting methods
  getFormattedAmount() {
    return `₹${this.amount.toLocaleString('en-IN')}`;
  }

  getFormattedPaymentDate() {
    if (!this.payment_date) return 'Not paid';
    return new Date(this.payment_date).toLocaleDateString('en-IN');
  }

  getPaymentMethodText() {
    const methodMap = {
      'instamojo': 'Instamojo',
      'razorpay': 'Razorpay',
      'card': 'Card Payment',
      'upi': 'UPI Payment',
      'bank_transfer': 'Bank Transfer',
      'cash': 'Cash Payment',
      'cheque': 'Cheque Payment'
    };
    return methodMap[this.payment_method] || this.payment_method;
  }

  getPaymentStatusText() {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    return statusMap[this.payment_status] || this.payment_status;
  }



  // Utility methods
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      course_id: this.course_id,
      enrollment_id: this.enrollment_id,
      amount: this.amount,
      currency: this.currency,
      payment_status: this.payment_status,
      payment_method: this.payment_method,
      payment_type: this.payment_type,
      gateway_payment_id: this.gateway_payment_id,
      instamojo_payment_id: this.instamojo_payment_id,
      instamojo_payment_request_id: this.instamojo_payment_request_id,
      description: this.description,
      buyer_name: this.buyer_name,
      email: this.email,
      phone: this.phone,
      payment_date: this.payment_date,
      created_at: this.created_at,
      updated_at: this.updated_at,
      ip_address: this.ip_address,
      user_agent: this.user_agent
    };
  }

  // Static factory methods
  static fromJSON(data) {
    return new Payment(data);
  }

  static fromDatabaseRow(row) {
    return new Payment({
      id: row.id,
      user_id: row.user_id,
      course_id: row.course_id,
      enrollment_id: row.enrollment_id,
      amount: row.amount,
      currency: row.currency,
      payment_status: row.payment_status,
      payment_method: row.payment_method,
      payment_type: row.payment_type,
      gateway_payment_id: row.gateway_payment_id,
      instamojo_payment_id: row.instamojo_payment_id,
      instamojo_payment_request_id: row.instamojo_payment_request_id,
      description: row.description,
      buyer_name: row.buyer_name,
      email: row.email,
      phone: row.phone,
      payment_date: row.payment_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      ip_address: row.ip_address,
      user_agent: row.user_agent
    });
  }

  static createNew({
    user_id,
    course_id,
    enrollment_id = null,
    amount,
    currency = 'INR',
    payment_method = 'instamojo',
    payment_type = 'course_fee',
    gateway_payment_id = null,
    instamojo_payment_id = null,
    instamojo_payment_request_id = null,
    description = '',
    buyer_name = '',
    email = '',
    phone = ''
  }) {
    return new Payment({
      user_id,
      course_id,
      enrollment_id,
      amount,
      currency,
      payment_method,
      payment_type,
      gateway_payment_id,
      instamojo_payment_id,
      instamojo_payment_request_id,
      description,
      buyer_name,
      email,
      phone,
      payment_status: 'pending',
      created_at: new Date().toISOString()
    });
  }
}

export default Payment;
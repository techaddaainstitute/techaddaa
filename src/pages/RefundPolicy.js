import React from 'react';
import './RefundPolicy.css';

const RefundPolicy = () => {
  return (
    <div className="refund-container">
      <div className="refund-content">
        <h1>Refund and Cancellation Policy</h1>
        
        <div className="refund-section">
          <p>
            We strive to provide the best products and services to our customers. However, we understand that there may be circumstances where you need to cancel a transaction or request a refund. Please read our refund and cancellation policy carefully.
          </p>
        </div>

        <div className="refund-section">
          <h2>TRANSACTION CANCELLATION</h2>
          <p>
            Cancellation requests can be made within 24 hours of the transaction. To cancel a transaction, please contact us immediately at{' '}
            <a href="mailto:techaddaainstitute@gmail.com">techaddaainstitute@gmail.com</a> with your order details.
          </p>
          <p>
            Please note that cancellation may not be possible for certain services that have already been initiated or for digital products that have been delivered.
          </p>
        </div>

        <div className="refund-section">
          <h2>REPLACEMENT POLICY</h2>
          <p>
            We offer replacement for defective or damaged products within 7 days of delivery. To request a replacement:
          </p>
          <ul>
            <li>Contact us within 7 days of receiving the product</li>
            <li>Provide clear evidence of the defect or damage (photos/videos)</li>
            <li>Ensure the product is in its original condition and packaging</li>
            <li>Include all original accessories and documentation</li>
          </ul>
          <p>
            Replacement requests will be reviewed on a case-by-case basis. We reserve the right to inspect the product before approving any replacement.
          </p>
        </div>

        <div className="refund-section">
          <h2>RETURN POLICY</h2>
          <p>
            Returns are accepted under the following conditions:
          </p>
          <ul>
            <li>The product must be returned within 14 days of delivery</li>
            <li>The product must be in its original, unused condition</li>
            <li>All original packaging, accessories, and documentation must be included</li>
            <li>The product must not show signs of wear, damage, or alteration</li>
          </ul>
          <p>
            Certain products may not be eligible for return due to hygiene, safety, or other reasons. Please check the product description for specific return eligibility.
          </p>
        </div>

        <div className="refund-section">
          <h2>REFUND REQUESTS</h2>
          <p>
            Refund requests will be considered under the following circumstances:
          </p>
          <ul>
            <li>The product received is significantly different from what was described</li>
            <li>The product is defective and cannot be replaced</li>
            <li>The service was not delivered as promised</li>
            <li>Duplicate charges or billing errors</li>
          </ul>
          
          <h3>Refund Process Timeline</h3>
          <ul>
            <li><strong>Request Submission:</strong> Submit your refund request within 30 days of the transaction</li>
            <li><strong>Review Period:</strong> We will review your request within 5-7 business days</li>
            <li><strong>Approval Notification:</strong> You will be notified of the approval or rejection of your refund</li>
            <li><strong>Processing Time:</strong> Approved refunds will be processed within 7-14 business days</li>
            <li><strong>Credit Timeline:</strong> Refunds will appear in your account within 5-10 business days after processing</li>
          </ul>
        </div>

        <div className="refund-section">
          <h2>CONDITIONS FOR APPROVAL</h2>
          <p>
            Refund and return requests will be approved based on the following criteria:
          </p>
          <ul>
            <li>The request is submitted within the specified timeframe</li>
            <li>All required documentation and evidence are provided</li>
            <li>The product or service meets the eligibility criteria</li>
            <li>The reason for the request is valid and verifiable</li>
          </ul>
          <p>
            We reserve the right to reject requests that do not meet our policy requirements or appear to be fraudulent.
          </p>
        </div>

        <div className="refund-section">
          <h2>SUBMISSION REQUIREMENTS</h2>
          <p>
            When submitting a refund, return, or replacement request, please provide the following information:
          </p>
          <ul>
            <li>Order number or transaction ID</li>
            <li>Date of purchase</li>
            <li>Product or service details</li>
            <li>Reason for the request</li>
            <li>Supporting documentation (photos, videos, receipts)</li>
            <li>Your contact information</li>
          </ul>
          <p>
            Incomplete requests may be delayed or rejected. Please ensure all required information is provided.
          </p>
        </div>

        <div className="refund-section">
          <h2>REQUIRED INFORMATION FOR CLAIMS</h2>
          <p>
            To process your claim efficiently, please include the following details in your request:
          </p>
          <ul>
            <li><strong>Personal Information:</strong> Full name, email address, and phone number</li>
            <li><strong>Transaction Details:</strong> Order ID, payment method, and transaction amount</li>
            <li><strong>Product/Service Information:</strong> Item name, quantity, and delivery date</li>
            <li><strong>Issue Description:</strong> Detailed explanation of the problem</li>
            <li><strong>Preferred Resolution:</strong> Refund, replacement, or store credit</li>
            <li><strong>Supporting Evidence:</strong> Photos, videos, or other relevant documentation</li>
          </ul>
        </div>

        <div className="refund-section">
          <h2>NON-REFUNDABLE ITEMS</h2>
          <p>
            The following items are generally not eligible for refund or return:
          </p>
          <ul>
            <li>Digital products that have been downloaded or accessed</li>
            <li>Personalized or customized items</li>
            <li>Perishable goods</li>
            <li>Services that have been fully rendered</li>
            <li>Items damaged due to misuse or normal wear and tear</li>
          </ul>
        </div>

        <div className="refund-section">
          <h2>SHIPPING COSTS</h2>
          <p>
            Shipping costs for returns are generally the responsibility of the customer unless the return is due to our error or a defective product. In cases where we are at fault, we will provide a prepaid return label.
          </p>
        </div>

        <div className="refund-section">
          <h2>CONTACT INFORMATION</h2>
          <p>
            For any questions regarding refunds, returns, or cancellations, please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:techaddaainstitute@gmail.com">techaddaainstitute@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+917579944452">+91 7579944452</a></li>
            <li><strong>Address:</strong> 2 Giraj Enclave, Andrews Crossing Balkeshwar Road Agra 282005 India</li>
          </ul>
        </div>

        <div className="refund-footer">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          <p>
            This policy is subject to change without notice. Please check this page regularly for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
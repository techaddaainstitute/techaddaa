// src/pages/PaymentCheck.js
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePayment } from "../context/PaymentContext";
import { useStudentDashboard } from "../context/StudentDashboardContext";
import { toast } from 'react-toastify';
import { Loading } from "../widgets/Loading"; // keep if you have it

const PaymentCheck = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    verifyPayment,
    getPaymentDetails,
    paymentState,
    resetPaymentState,
    markPaymentSuccess,  // from step #1
    markPaymentFailure,  // from step #1
  } = usePayment();

  const { createMyCourse } = useStudentDashboard();

  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState({ status: "checking", message: "Verifying payment…" });
  const [details, setDetails] = useState(null);

  // Read Instamojo redirect params
  const paymentId = searchParams.get("payment_id");            // e.g. MOJO5a12X0...
  const paymentStatus = searchParams.get("payment_status");    // "Credit" | "Failed" | "Pending"
  const paymentRequestId = searchParams.get("payment_request_id");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        console.log('=== PAYMENT VERIFICATION DEBUG ===');
        console.log('URL Parameters:', { paymentId, paymentStatus, paymentRequestId });
        console.log('Parameter validation:', {
          paymentRequestId: !!paymentRequestId,
          paymentStatus: !!paymentStatus,
          paymentRequestIdValue: paymentRequestId,
          paymentStatusValue: paymentStatus
        });

        // Check required parameters
        if (!paymentRequestId || !paymentStatus) {
          const errorMsg = `Missing required parameters: paymentRequestId=${paymentRequestId}, paymentStatus=${paymentStatus}`;
          console.error(errorMsg);
          setView({ status: "failed", message: "Missing required payment parameters" });
          setIsLoading(false);
          markPaymentFailure?.(errorMsg);
          return;
        }
        
        console.log('Calling verifyPayment with:', { paymentRequestId, paymentStatus });
        const verify = await verifyPayment(paymentRequestId, paymentStatus);
        console.log('Payment verification result:', verify);

        if (!cancelled) {
          if (verify?.success && verify?.data) {
            // Payment verification successful
            console.log('Payment verification successful!');
            setDetails(verify.data);
            markPaymentSuccess?.({
              payment_id: paymentId,
              payment_request_id: paymentRequestId,
              ...verify.data
            });

            // Handle course enrollment after successful payment
            try {
              const pendingEnrollment = localStorage.getItem('pendingEnrollment');
              if (pendingEnrollment) {
                const enrollmentPayload = JSON.parse(pendingEnrollment);
                console.log('Processing enrollment:', enrollmentPayload);

                if (enrollmentPayload.type === 'newcourse') {
                  const enrollmentResult = await createMyCourse(
                    enrollmentPayload.course_id, 
                    enrollmentPayload.enrollmentData
                  );

                  if (enrollmentResult.success) {
                    toast.success('Successfully enrolled in the course!');
                    localStorage.removeItem('pendingEnrollment'); // Clean up
                    setView({ status: "success", message: "Payment successful and course enrolled!" });
                  } else {
                    console.error('Enrollment failed:', enrollmentResult.error);
                    setView({ status: "success", message: "Payment successful but enrollment failed. Please contact support." });
                  }
                } else {
                  setView({ status: "success", message: "Payment successful" });
                }
              } else {
                setView({ status: "success", message: "Payment successful" });
              }
            } catch (enrollmentError) {
              console.error('Enrollment processing error:', enrollmentError);
              setView({ status: "success", message: "Payment successful but enrollment failed. Please contact support." });
            }
          } else {
            // Payment verification failed or no data
            console.log('Payment verification failed - no success or data');
            markPaymentFailure?.("Payment verification failed");
            setView({ status: "failed", message: "Payment verification failed" });
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        if (!cancelled) {
          markPaymentFailure?.(err?.message || "Verification error");
          setView({ status: "failed", message: err?.message || "Verification error" });
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line 
  }, [paymentId, paymentRequestId, paymentStatus]);

  const onGoHome = () => {
    resetPaymentState();
    navigate("/");
  };

  const onProceed = () => {
    // Clean up any remaining enrollment data and navigate to dashboard
    localStorage.removeItem('pendingEnrollment');
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Payment Check</h1>

      {isLoading ? (
        <div style={{ marginTop: 24 }}>
          {typeof Loading === "function" ? <Loading /> : <p>Verifying payment…</p>}
        </div>
      ) : (
        <>
          <div style={{ margin: "16px 0", padding: 12, borderRadius: 8, border: "1px solid #ddd" }}>
            <p><strong>Status:</strong> {view.status.toUpperCase()}</p>
            <p><strong>Message:</strong> {view.message}</p>
            {paymentId && <p><strong>Payment ID:</strong> {paymentId}</p>}
            {paymentRequestId && <p><strong>Payment Request ID:</strong> {paymentRequestId}</p>}
            {paymentStatus && <p><strong>Payment Status (redirect param):</strong> {paymentStatus}</p>}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {(view.status === "success") && (
              <button onClick={onProceed}>
                Continue
              </button>
            )}
            <button onClick={onGoHome}>Home</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentCheck;

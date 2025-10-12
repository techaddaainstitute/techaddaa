// src/lib/datasource/PaymentDataSource.js
import supabase from "../supabase";

// CRA-style env (also works in Next with NEXT_PUBLIC_* if you add a fallback)
const FUNCTIONS_BASE = 'https://xambfjdpmqksypzqygza.functions.supabase.co';

/**
 * @typedef {"redirect"|"tab"|"modal"} OpenMode
 */

/**
 * @typedef {Object} PaymentInitInput
 * @property {number} amount
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {string} [purpose]
 * @property {string} [redirect_url]
 * @property {boolean} [autoRedirect]  // legacy; true => redirect
 * @property {OpenMode} [openMode]     // preferred
 * @property {Object.<string, any>} [meta]
 */

class PaymentDataSource {
  /**
   * Initiate payment: calls your Supabase Edge Function and opens Instamojo checkout.
   * @param {PaymentInitInput} paymentData
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  static async processPayment(paymentData) {
    try {
      // Validate
      ["amount", "name", "phone", "email"].forEach((k) => {
        if (!paymentData || paymentData[k] == null || paymentData[k] === "") {
          throw new Error(`Missing required field: ${k}`);
        }
      });

      if (!FUNCTIONS_BASE) {
        throw new Error(
          "Supabase Functions URL is not set. Add REACT_APP_SUPABASE_FUNCTIONS_URL to your .env"
        );
      }

      const redirect_url =
        paymentData.redirect_url || `${window.location.origin}/payment-check`;

      // Debug: Log environment variables
      console.log("API Key:", process.env.REACT_APP_INSTAMOJO_API_KEY);
      console.log("Auth Token:", process.env.REACT_APP_INSTAMOJO_AUTH_TOKEN);
      console.log("Functions URL:", FUNCTIONS_BASE);

      const requestBody = {
        amount: 10,
        // amount: paymentData.amount,
        name: paymentData.name,
        email: paymentData.email,
        phone: paymentData.phone,
        purpose: paymentData.purpose || "Order",
        redirect_url,
        INSTAMOJO_API_KEY: process.env.REACT_APP_INSTAMOJO_API_KEY,
        INSTAMOJO_AUTH_TOKEN: process.env.REACT_APP_INSTAMOJO_AUTH_TOKEN,
      };

      console.log("Request body:", requestBody);

      // Call your Edge Function that creates Instamojo payment_request
      const res = await fetch(`${FUNCTIONS_BASE}/instamojo-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ✅ Add a JWT. For public access, you can use the anon key in browser.
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          apikey: process.env.REACT_APP_SUPABASE_ANON_KEY, // optional but fine
        },
        body: JSON.stringify(requestBody),
      });

      const json = await res.json();
      // Instamojo v1.1: { success: true, payment_request: { id, longurl, ... } }
      if (!json || !json.success || !json.payment_request || !json.payment_request.longurl) {
        const msg =
          (json && (json.message || json.error || (json.payment_request && json.payment_request.message))) ||
          "Failed to create Instamojo payment request";
        throw new Error(msg);
      }

      const pr = json.payment_request;

      // Open checkout
      const mode =
        paymentData.openMode != null
          ? paymentData.openMode
          : (paymentData.autoRedirect === false ? "tab" : "redirect");

      await PaymentDataSource.openCheckout(pr.longurl, mode);

      return { success: true, data: pr };
    } catch (err) {
      console.error("processPayment error:", err);
      return { success: false, error: err && err.message ? err.message : "Error" };
    }
  }

  /**
   * Open Instamojo checkout by mode.
   * @param {string} longurl
   * @param {OpenMode} mode
   */
  static async openCheckout(longurl, mode) {
    if (!longurl) throw new Error("Missing checkout URL");

    if (mode === "modal") {
      // Requires: <script src="https://js.instamojo.com/v1/checkout.js"></script> in public/index.html
      const im = (typeof window !== "undefined" && window.Instamojo) || null;
      if (im && typeof im.open === "function") {
        try {
          im.open(longurl);
          return;
        } catch (e) {
          // Fallback
          window.location.href = longurl;
          return;
        }
      }
      // SDK not present → fallback
      window.location.href = longurl;
      return;
    }

    if (mode === "tab") {
      const win = window.open(longurl, "_blank", "noopener,noreferrer");
      if (!win) {
        // Popup blocked → redirect
        window.location.href = longurl;
      }
      return;
    }

    // default: redirect
    window.location.href = longurl;
  }

  /**
   * Verify payment status from your DB using only payment_request_id and payment_status.
   * @param {string} paymentRequestId - Instamojo payment request ID
   * @param {string} paymentStatus - Payment status from Instamojo redirect
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  static async verifyPayment(paymentRequestId, paymentStatus) {
    try {
      if (!paymentRequestId) throw new Error("paymentRequestId is required");
      if (!paymentStatus) throw new Error("paymentStatus is required");

      console.log("Verifying payment with request ID:", paymentRequestId, "and status:", paymentStatus);

      // Find the payment by instamojo_payment_request_id
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("payment_request_id", paymentRequestId)
        .eq("payment_status", 'pending')
        .single();

      if (error) {
        console.error("Payment not found:", error);
        throw error;
      }

      console.log("Found payment record:", data);

      // If payment status is Credit from Instamojo and our DB shows pending, update to completed
      if (paymentStatus === "Credit" && data && data.payment_status === "pending") {
        console.log("Updating payment status from pending to completed for request ID:", paymentRequestId);

        const { data: updatedData, error: updateError } = await supabase
          .from("payments")
          .update({
            payment_status: "completed",
            paid_at: new Date().toISOString(),
            verified_at: new Date().toISOString(),
            verified_source: "instamojo_redirect",
            updated_at: new Date().toISOString()
          })
          .eq("id", data.id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating payment status:", updateError);
          throw updateError;
        }

        console.log("Payment status updated successfully:", updatedData);
        return { success: true, data: updatedData };
      }

      // Return success if payment is already completed or if Credit status matches
      const isSuccessful = data?.payment_status === "completed" || paymentStatus === "Credit";
      return { success: isSuccessful, data };
    } catch (error) {
      console.error("Payment verification error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get payment details from your DB.
   * @param {string} paymentId - Instamojo payment ID (MOJO...)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  static async getPaymentDetails(paymentId) {
    try {
      if (!paymentId) throw new Error("paymentId is required");

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("instamojo_payment_id", paymentId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return { success: false, error: error.message };
    }
  }
}

export default PaymentDataSource;

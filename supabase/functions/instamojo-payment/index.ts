// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentData {
  amount: number;
  purpose: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  webhook?: string;
  allow_repeated_payments?: boolean;
}

interface StoredPaymentData {
  amount: number;
  purpose: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  webhook?: string;
  allow_repeated_payments?: boolean;
}

interface InstamojoPaymentRequest {
  amount: string;
  purpose: string;
  buyer_name: string;
  email: string;
  phone: string;
  redirect_url: string;
  webhook?: string;
  send_email: string;
  allow_repeated_payments: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // Get environment variables
    const INSTAMOJO_API_KEY = Deno.env.get('INSTAMOJO_API_KEY')
    const INSTAMOJO_AUTH_TOKEN = Deno.env.get('INSTAMOJO_AUTH_TOKEN')
    const INSTAMOJO_ENDPOINT = Deno.env.get('INSTAMOJO_ENDPOINT') || 'https://www.instamojo.com/api/1.1/'

    if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN) {
      throw new Error('Missing Instamojo credentials')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method === 'POST') {
      if (path === 'create') {
        // Create payment request
        const paymentData: PaymentData = await req.json()

        // Validate required fields
        if (!paymentData.amount || !paymentData.purpose || !paymentData.buyer_name || 
            !paymentData.email || !paymentData.phone || !paymentData.redirect_url) {
          return new Response(
            JSON.stringify({ error: 'Missing required payment data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate and format phone number for Instamojo
        let formattedPhone = paymentData.phone.toString().replace(/\D/g, '') // Remove non-digits
        
        // Handle different phone number formats
        if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
          // Already has country code
          formattedPhone = '+' + formattedPhone
        } else if (formattedPhone.length === 10) {
          // Add India country code
          formattedPhone = '+91' + formattedPhone
        } else if (formattedPhone.startsWith('0') && formattedPhone.length === 11) {
          // Remove leading 0 and add country code
          formattedPhone = '+91' + formattedPhone.substring(1)
        } else {
          return new Response(
            JSON.stringify({ error: 'Invalid phone number format. Please provide a valid Indian mobile number.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate final phone number format
        if (!/^\+91[6-9]\d{9}$/.test(formattedPhone)) {
          return new Response(
            JSON.stringify({ error: 'Invalid phone number. Please provide a valid Indian mobile number starting with 6, 7, 8, or 9.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Prepare Instamojo request
        const instamojoData: InstamojoPaymentRequest = {
          amount: paymentData.amount.toString(),
          purpose: paymentData.purpose,
          buyer_name: paymentData.buyer_name,
          email: paymentData.email,
          phone: formattedPhone,
          redirect_url: paymentData.redirect_url,
          send_email: "true",
          allow_repeated_payments: paymentData.allow_repeated_payments ? "true" : "false"
        }

        if (paymentData.webhook) {
          instamojoData.webhook = paymentData.webhook
        }

        // Make request to Instamojo
        const response = await fetch(`${INSTAMOJO_ENDPOINT}payment-requests/`, {
          method: 'POST',
          headers: {
            'X-Api-Key': INSTAMOJO_API_KEY,
            'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(instamojoData).toString(),
        })

        const responseText = await response.text()

        if (!response.ok) {
          console.error('Instamojo API error:', responseText)
          return new Response(
            JSON.stringify({ error: 'Payment request failed', details: responseText }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          console.error('Failed to parse Instamojo response:', e)
          return new Response(
            JSON.stringify({ error: 'Invalid response from payment gateway' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (result.success) {
          return new Response(
            JSON.stringify({
              success: true,
              payment_request: result.payment_request,
              payment_url: result.payment_request.longurl
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          return new Response(
            JSON.stringify({ error: 'Payment request failed', details: result }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      } else if (path === 'verify') {
        // Verify payment
        const { payment_request_id, payment_data }: { payment_request_id: string, payment_data: StoredPaymentData } = await req.json()

        if (!payment_request_id) {
          return new Response(
            JSON.stringify({ error: 'Missing payment_request_id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log('Verifying payment:', payment_request_id)

        // Get payment request details from Instamojo
        const response = await fetch(`${INSTAMOJO_ENDPOINT}payment-requests/${payment_request_id}/`, {
          method: 'GET',
          headers: {
            'X-Api-Key': INSTAMOJO_API_KEY,
            'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
          },
        })

        const responseText = await response.text()
        console.log('Instamojo verify response:', responseText)

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: 'Payment verification failed', details: responseText }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          return new Response(
            JSON.stringify({ error: 'Invalid response from payment gateway' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (result.success && result.payment_request) {
          const paymentRequest = result.payment_request
          const isCompleted = paymentRequest.status === 'Completed'
          
          let dbPayment = null
          
          // If payment is successful and we have payment data, create database record
          if (isCompleted && payment_data) {
            // Create payment record with proper field mapping to match actual database schema
            const paymentRecord = {
              user_id: payment_data.user_id,
              course_id: payment_data.course_id,
              enrollment_id: payment_data.enrollment_id,
              amount: payment_data.amount,
              currency: payment_data.currency || 'INR',
              payment_status: 'completed',
              payment_method: payment_data.payment_method || 'instamojo',
              payment_type: payment_data.payment_type || 'course_fee',
              gateway_payment_id: payment_data.gateway_payment_id,
              instamojo_payment_id: paymentRequest.payments?.[0]?.payment_id || null,
              instamojo_payment_request_id: payment_data.instamojo_payment_request_id,
              description: payment_data.description,
              buyer_name: payment_data.buyer_name,
              email: payment_data.buyer_email || payment_data.email, // Use email column that exists in database
              phone: payment_data.buyer_phone || payment_data.phone, // Use phone column that exists in database
              payment_date: new Date().toISOString()
            }

            console.log('Creating payment record in database:', paymentRecord)

            const { data, error } = await supabaseClient
              .from('payments')
              .insert([paymentRecord])
              .select()
              .single()

            if (error) {
              console.error('Database error:', error)
              return new Response(
                JSON.stringify({ error: 'Failed to create payment record', details: error }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }

            dbPayment = data
          }

          return new Response(
            JSON.stringify({
              success: true,
              payment_completed: isCompleted,
              payment_request: paymentRequest,
              payment_record: dbPayment
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          return new Response(
            JSON.stringify({ error: 'Payment verification failed', details: result }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint or method' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  Create payment:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/instamojo-payment/create' \
    --header 'Authorization: Bearer [YOUR_ANON_KEY]' \
    --header 'Content-Type: application/json' \
    --data '{"amount":100,"purpose":"Test payment","buyer_name":"John Doe","email":"john@example.com","phone":"9999999999","redirect_url":"http://localhost:3000/payment-success"}'

  Verify payment:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/instamojo-payment/verify' \
    --header 'Authorization: Bearer [YOUR_ANON_KEY]' \
    --header 'Content-Type: application/json' \
    --data '{"payment_request_id":"[PAYMENT_REQUEST_ID]","payment_data":{...}}'

*/

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/* ------------------------------- CONFIG ---------------------------------- */
// Instamojo TEST credentials (HARDCODED FOR NOW)
const apiKey = "8da015de684179417b6f12e5a13ef07e";
const authToken = "3898a0335f0b5c9a867c8fa67c911d5b";

// Webhook for THIS function
const webhookUrl =
  "https://xambfjdpmqksypzqygza.functions.supabase.co/instamojo-payment/webhook";


const instamojoCreateUrl = "https://www.instamojo.com/api/1.1/payment-requests/";

// Supabase REST (TEST-ONLY: hard-coded; move to secrets for prod)
const SUPABASE_URL = "https://xambfjdpmqksypzqygza.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbWJmamRwbXFrc3lwenF5Z3phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTI0NDg4NiwiZXhwIjoyMDc0ODIwODg2fQ.gjDx2Ykt_vLKXCJCRVBUJfljDBTzb9RRkhGmk9ZxPAg";

/* -------------------------------- CORS ----------------------------------- */
function corsHeaders(origin?: string) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

/* ----------------------- Utils: HMAC for v1.1 webhook --------------------- */
async function hmacHexSHA1(key: string, data: string) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* -------------- Small helper: verbose PostgREST upsert result ------------- */
type DBResult = { ok: boolean; status: number; body: string };
async function upsertPaymentRowVerbose(
  payload: Record<string, unknown>
): Promise<DBResult> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body: body || "" };
  } catch (e) {
    return { ok: false, status: 0, body: (e as Error).message };
  }
}

/* ---------------------- Status normalization (your CHECK) ----------------- */
/** Map Instamojo → your DB statuses:
 * allowed: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
 */
function mapStatusForDB(instamojoStatusRaw?: string | null):
  "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded" {
  const s = (instamojoStatusRaw || "").trim().toLowerCase();
  // Instamojo commonly sends: credit, failed, pending, refunded, cancelled
  if (s === "credit") return "completed";
  if (s === "failed") return "failed";
  if (s === "pending") return "processing"; // webhook says pending => still processing
  if (s === "refunded") return "refunded";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  // fallback to failed if unknown
  return "failed";
}

/* ----------------------------- Handlers ---------------------------------- */
async function handleCreate(req: Request, origin: string) {
  const { amount, name, email, phone, purpose, redirect_url } = await req.json();

  // 1) Create Instamojo payment_request (TEST)
  const prBody = new URLSearchParams({
    purpose: purpose || "Order",
    amount: String(amount ?? ""),
    buyer_name: name ?? "",
    email: email ?? "",
    phone: phone ?? "",
    redirect_url: redirect_url || "http://localhost:3001/payment-check",
    webhook: webhookUrl,
    send_email: "true",
    allow_repeated_payments: "false",
  });

  const prResp = await fetch(instamojoCreateUrl, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "X-Auth-Token": authToken,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: prBody,
  });

  const prJson = await prResp.json();

  // 2) Seed "pending" row -> payments (merge via unique_gateway_payment_id if present)
  let _dbSeed: DBResult | undefined = undefined;
  try {
    const pr = prJson?.payment_request;
    if (pr?.id) {
      _dbSeed = await upsertPaymentRowVerbose({
        // merge keys
        gateway_payment_id: pr.id,
        payment_request_id: pr.id,
        payment_status: "pending", // ✅ matches your CHECK
        amount: pr.amount ? Number(pr.amount) : amount ? Number(amount) : null,
        currency: "INR",
        buyer_name: pr.buyer_name ?? name,
        email: pr.email ?? email,
        phone: pr.phone ?? phone,
        purpose: pr.purpose ?? purpose,
        verified_source: "create",
      });
    }
  } catch { /* ignore */ }

  // 3) Return original Instamojo response + DB seed debug
  return new Response(
    JSON.stringify({ ...prJson, _dbSeed }),
    { status: prResp.status, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
  );
}

async function handleWebhook(req: Request, origin: string) {
  const raw = await req.text();
  const params = new URLSearchParams(raw);

  // MAC verification (v1.1). If you didn’t set INSTAMOJO_SALT, we accept (test only).
  const receivedMac = (params.get("mac") || "").toLowerCase();
  params.delete("mac");
  const keys = Array.from(params.keys()).sort();
  const message = keys.map((k) => params.get(k) ?? "").join("|");

  const salt = "facffdb857c449038792d347cc9ff637";
  let verified = false;
  if (salt) {
    const calcMac = (await hmacHexSHA1(salt, message)).toLowerCase();
    verified = calcMac === receivedMac;
  } else {
    verified = true; // TEST ONLY
  }

  // Extract info
  const payment_id = params.get("payment_id") || ""; // MOJO...
  const payment_request_id = params.get("payment_request_id") || "";
  const statusRaw = params.get("status") || params.get("payment_status") || "";
  const amount = params.get("amount") || params.get("amount_settled") || "";
  const buyer_name = params.get("buyer_name") || "";
  const email = params.get("buyer") || params.get("email") || "";
  const phone = params.get("phone") || "";
  const purpose = params.get("purpose") || "";

  // ✅ Map Instamojo → your allowed statuses
  const dbStatus = mapStatusForDB(statusRaw);
  const paidAt = dbStatus === "completed" ? new Date().toISOString() : null;

  // Merge into pending row via gateway_payment_id (PR id) and set final fields
  const _dbWebhook = await upsertPaymentRowVerbose({
    gateway_payment_id: payment_request_id || undefined, // merges pending
    payment_request_id: payment_request_id || undefined,
    instamojo_payment_id: payment_id || undefined,

    payment_status: dbStatus,                 // ✅ guaranteed valid for your CHECK
    amount: amount ? Number(amount) : undefined,
    currency: "INR",
    buyer_name,
    email,
    phone,
    purpose,
    paid_at: paidAt,
    verified_at: new Date().toISOString(),
    verified_source: "webhook",
    raw_webhook: Object.fromEntries(params.entries()),
  });

  return new Response(
    JSON.stringify({ ok: true, verified, _dbWebhook }),
    { status: verified ? 200 : 400, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
  );
}

/* -------------------------------- Router --------------------------------- */
serve(async (req) => {
  const origin = req.headers.get("Origin") || "*";

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const url = new URL(req.url);
  const pathname = url.pathname || "";

  try {
    if (pathname.endsWith("/webhook")) {
      if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405, headers: { ...corsHeaders(origin), "Content-Type": "application/json" }
        });
      }
      return await handleWebhook(req, origin);
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405, headers: { ...corsHeaders(origin), "Content-Type": "application/json" }
      });
    }
    return await handleCreate(req, origin);
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
    );
  }
});

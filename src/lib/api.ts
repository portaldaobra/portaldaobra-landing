// Public (unauthenticated) API client for the landing site.
//
// `VITE_API_BASE` is the PUBLIC config channel documented in
// src/lib/config.server.ts:15-17 — it is inlined at build time and ships to
// the browser, so it must never carry a secret. The Turnstile *secret* lives
// on the API; only the Turnstile *site key* is public (see src/lib/turnstile.ts).
//
// Every call resolves — network and protocol failures are folded into the
// returned discriminated union so callers never have to catch.

const DEFAULT_API_BASE = "http://localhost:8011/api/v1";

/** Base URL of the Portal da Obra API, without a trailing slash. */
export function getApiBase(): string {
  const configured = import.meta.env.VITE_API_BASE;
  const base =
    typeof configured === "string" && configured.trim() !== ""
      ? configured.trim()
      : DEFAULT_API_BASE;
  return base.replace(/\/+$/, "");
}

export type LeadRoleIntent = "client" | "contractor";

/** Request body of POST /public/leads. Field names are the API's, not the UI's. */
export interface LeadInput {
  email: string;
  name: string;
  phone: string;
  city: string;
  /** 2-letter Brazilian UF. */
  state: string;
  role_intent: LeadRoleIntent;
  description: string;
  turnstile_token: string;
}

/** `data` payload of a 201 response. */
export interface LeadData {
  claim_url: string;
  claim_token: string;
  email: string;
  expires_at: string;
}

/**
 * Stable failure codes. The first three are the API's own error tags; the last
 * two are client-side classifications for failures that never reached a handler.
 */
export type LeadErrorCode =
  | "LEAD_VALIDATION"
  | "LEAD_RATE_LIMITED"
  | "LEAD_CAPTCHA_FAILED"
  | "LEAD_NETWORK"
  | "LEAD_UNEXPECTED";

export type LeadResponse =
  | { ok: true; data: LeadData }
  | { ok: false; code: LeadErrorCode; message: string; status: number };

/** Standard API envelope: { success, data, message, request_id, timestamp } (+ error). */
interface ApiEnvelope {
  success?: boolean;
  data?: unknown;
  message?: string;
  request_id?: string;
  timestamp?: string;
  error?: unknown;
}

const API_ERROR_CODES: LeadErrorCode[] = [
  "LEAD_VALIDATION",
  "LEAD_RATE_LIMITED",
  "LEAD_CAPTCHA_FAILED",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

function parseLeadData(value: unknown): LeadData | null {
  if (!isRecord(value)) return null;
  const claimUrl = str(value.claim_url);
  const claimToken = str(value.claim_token);
  const email = str(value.email);
  const expiresAt = str(value.expires_at);
  if (!claimUrl || !claimToken || !email || !expiresAt) return null;
  return { claim_url: claimUrl, claim_token: claimToken, email, expires_at: expiresAt };
}

/** Pull the stable tag out of the error object, whatever shape the API used. */
function parseErrorCode(envelope: ApiEnvelope | null, status: number): LeadErrorCode {
  const error = envelope?.error;
  let raw: string | undefined;
  if (typeof error === "string") {
    raw = error;
  } else if (isRecord(error)) {
    raw = str(error.errortag) ?? str(error.code) ?? str(error.error_tag);
  }
  const normalized = raw?.trim().toUpperCase();
  const known = API_ERROR_CODES.find((code) => code === normalized);
  if (known) return known;
  if (status === 429) return "LEAD_RATE_LIMITED";
  if (status === 400 || status === 422) return "LEAD_VALIDATION";
  return "LEAD_UNEXPECTED";
}

function parseErrorMessage(envelope: ApiEnvelope | null, status: number): string {
  const error = envelope?.error;
  if (isRecord(error)) {
    const message = str(error.message) ?? str(error.detail);
    if (message) return message;
  }
  return str(envelope?.message) ?? `HTTP ${status}`;
}

async function readEnvelope(response: Response): Promise<ApiEnvelope | null> {
  try {
    const body: unknown = await response.json();
    return isRecord(body) ? (body as ApiEnvelope) : null;
  } catch {
    return null;
  }
}

/**
 * POST /public/leads — capture a prospect and get back the single-use claim
 * link. Never throws: transport failures come back as `LEAD_NETWORK`.
 */
export async function submitLead(input: LeadInput): Promise<LeadResponse> {
  let response: Response;
  try {
    response = await fetch(`${getApiBase()}/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, code: "LEAD_NETWORK", message: "request failed", status: 0 };
  }

  const envelope = await readEnvelope(response);

  if (response.ok) {
    const data = parseLeadData(envelope?.data);
    if (data) return { ok: true, data };
    // 2xx with a body we cannot use is as unusable as a 5xx.
    return {
      ok: false,
      code: "LEAD_UNEXPECTED",
      message: "malformed success payload",
      status: response.status,
    };
  }

  return {
    ok: false,
    code: parseErrorCode(envelope, response.status),
    message: parseErrorMessage(envelope, response.status),
    status: response.status,
  };
}

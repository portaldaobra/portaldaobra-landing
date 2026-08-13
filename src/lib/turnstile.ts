// Cloudflare Turnstile loader.
//
// Only the SITE key is public and lives here (`VITE_TURNSTILE_SITE_KEY`, inlined
// at build time). The secret stays on the API, which is the only place the token
// is verified — a client-side check would be worthless.
//
// When no site key is configured (local dev), callers skip the widget entirely
// and send TURNSTILE_STUB_TOKEN, the single literal the API's stub verifier
// accepts while TURNSTILE_SECRET is unset.

/** The one token the API stub verifier accepts when TURNSTILE_SECRET is empty. */
export const TURNSTILE_STUB_TOKEN = "turnstile-stub-ok";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "timeout-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  action?: string;
}

export interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Configured site key, or null when the widget should be skipped (local dev). */
export function getTurnstileSiteKey(): string | null {
  const key = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : null;
}

let loader: Promise<TurnstileApi> | null = null;
let widgetCount = 0;

function injectScript(): Promise<TurnstileApi> {
  return new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    const settle = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile script loaded without exposing window.turnstile"));
    };

    script.addEventListener("load", settle, { once: true });
    script.addEventListener("error", () => reject(new Error("turnstile script failed to load")), {
      once: true,
    });

    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });
}

/**
 * Load Turnstile, injecting the script tag at most once per document.
 * Pair every call with `releaseTurnstile()` so the tag is torn down with the
 * last widget that needed it.
 */
export function acquireTurnstile(): Promise<TurnstileApi> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("turnstile is browser-only"));
  }
  widgetCount += 1;
  loader = loader ?? injectScript();
  return loader;
}

/** Drop one widget's claim on the script; removes the tag when none are left. */
export function releaseTurnstile(): void {
  widgetCount = Math.max(0, widgetCount - 1);
  if (widgetCount > 0 || typeof document === "undefined") return;
  document.getElementById(SCRIPT_ID)?.remove();
  delete window.turnstile;
  loader = null;
}

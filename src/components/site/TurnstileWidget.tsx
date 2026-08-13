import { useEffect, useRef } from "react";

import { acquireTurnstile, releaseTurnstile } from "@/lib/turnstile";

interface TurnstileWidgetProps {
  siteKey: string;
  /** Called with a fresh token, or with "" when the token is gone (expiry/error). */
  onToken: (token: string) => void;
  onError?: () => void;
  className?: string;
}

/**
 * Explicit-render Turnstile widget. Rendered only when a site key is configured
 * — with no key the form skips the challenge and sends the stub token instead
 * (see src/lib/turnstile.ts).
 */
export function TurnstileWidget({ siteKey, onToken, onError, className }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onToken, onError]);

  useEffect(() => {
    let cancelled = false;
    let widgetId: string | undefined;

    acquireTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          action: "lead-form",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "timeout-callback": () => onTokenRef.current(""),
          "error-callback": () => {
            onTokenRef.current("");
            onErrorRef.current?.();
          },
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.();
      });

    return () => {
      cancelled = true;
      if (widgetId) {
        try {
          window.turnstile?.remove(widgetId);
        } catch {
          // widget already gone — nothing to clean up
        }
      }
      releaseTurnstile();
    };
  }, [siteKey]);

  return <div ref={containerRef} className={className} data-testid="turnstile-widget" />;
}

/**
 * consent-store.js
 * Pure helpers for cookie consent state: localStorage persistence + API sync.
 *
 * Public API:
 *   getAnonymousID()            → UUID v4 (persists in localStorage.anonymous_id)
 *   getConsent()                → { essential: true, analytics: bool|null, marketing: bool|null, version: "1.0.0" }
 *   setConsent(category, granted) → save to localStorage + POST to API + emit 'consent:change'
 *   acceptAll()                 → grant analytics + marketing; one fetch per category
 *   essentialOnly()             → deny analytics + marketing
 */

(function (root) {
  'use strict';

  var CONSENT_KEY   = 'cookie_consent';
  var ANON_ID_KEY   = 'anonymous_id';
  var CONSENT_VERSION = '1.0.0';

  // ---------------------------------------------------------------------------
  // API base URL resolution
  // ---------------------------------------------------------------------------
  function getApiBase() {
    // 1. <meta name="api-base" content="https://...">
    var meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) return meta.content.replace(/\/$/, '');

    // 2. Heuristic: local dev vs prod
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8011';
    }
    return 'https://api.portaldaobra.com.br';
  }

  // ---------------------------------------------------------------------------
  // UUID v4 generation
  // ---------------------------------------------------------------------------
  function generateUUID() {
    // Use crypto.randomUUID() when available (modern browsers)
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }

    // Fallback: RFC 4122 v4 via crypto.getRandomValues or Math.random
    var bytes;
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
    } else {
      bytes = new Uint8Array(16);
      for (var i = 0; i < 16; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    // Set version 4 (bits 12-15 of time_hi_and_version = 0100)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant bits (10xxxxxx)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    var hex = Array.from(bytes).map(function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32)
    ].join('-');
  }

  // ---------------------------------------------------------------------------
  // getAnonymousID
  // ---------------------------------------------------------------------------
  function getAnonymousID() {
    try {
      var existing = localStorage.getItem(ANON_ID_KEY);
      if (existing) return existing;
      var id = generateUUID();
      localStorage.setItem(ANON_ID_KEY, id);
      return id;
    } catch (_) {
      // localStorage not available (private browsing strict mode etc.)
      return generateUUID();
    }
  }

  // ---------------------------------------------------------------------------
  // getConsent
  // Returns { essential: true, analytics: bool|null, marketing: bool|null, version }
  // null means "not yet decided"
  // ---------------------------------------------------------------------------
  function getConsent() {
    var defaults = {
      essential:  true,
      analytics:  null,
      marketing:  null,
      version:    CONSENT_VERSION
    };

    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return defaults;
      var parsed = JSON.parse(raw);
      return {
        essential: true, // always forced true regardless of stored value
        analytics: typeof parsed.analytics === 'boolean' ? parsed.analytics : null,
        marketing: typeof parsed.marketing === 'boolean' ? parsed.marketing : null,
        version:   parsed.version || CONSENT_VERSION
      };
    } catch (_) {
      return defaults;
    }
  }

  // ---------------------------------------------------------------------------
  // _saveLocally — persist consent object to localStorage
  // ---------------------------------------------------------------------------
  function _saveLocally(analytics, marketing) {
    try {
      var record = {
        essential:  true,
        analytics:  analytics,
        marketing:  marketing,
        version:    CONSENT_VERSION,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch (_) {
      // ignore write errors
    }
  }

  // ---------------------------------------------------------------------------
  // _postToAPI — fire-and-forget PUT to /api/v1/consent
  // ---------------------------------------------------------------------------
  function _postToAPI(category, granted) {
    try {
      var anonId = getAnonymousID();
      var apiBase = getApiBase();
      fetch(apiBase + '/api/v1/consent', {
        method: 'PUT',
        headers: {
          'Content-Type':  'application/json',
          'X-Anonymous-Id': anonId
        },
        body: JSON.stringify({ category: category, granted: granted })
      }).catch(function () {
        // Network failure is non-fatal — consent is already saved locally
      });
    } catch (_) {
      // fetch not available or other error
    }
  }

  // ---------------------------------------------------------------------------
  // _emitChange — dispatch 'consent:change' CustomEvent
  // ---------------------------------------------------------------------------
  function _emitChange() {
    try {
      var event = new CustomEvent('consent:change', { detail: getConsent() });
      window.dispatchEvent(event);
    } catch (_) {
      // IE compatibility no-op
    }
  }

  // ---------------------------------------------------------------------------
  // setConsent(category, granted)
  // category: 'analytics' | 'marketing'
  // ---------------------------------------------------------------------------
  function setConsent(category, granted) {
    if (category === 'essential') return; // essential is always on; cannot be changed

    var current = getConsent();
    var analytics = category === 'analytics' ? granted : current.analytics !== null ? current.analytics : false;
    var marketing = category === 'marketing' ? granted : current.marketing !== null ? current.marketing : false;

    _saveLocally(analytics, marketing);
    _postToAPI(category, granted);
    _emitChange();
  }

  // ---------------------------------------------------------------------------
  // acceptAll — grant analytics + marketing in one go
  // ---------------------------------------------------------------------------
  function acceptAll() {
    _saveLocally(true, true);
    _postToAPI('analytics', true);
    _postToAPI('marketing', true);
    _emitChange();
  }

  // ---------------------------------------------------------------------------
  // essentialOnly — deny analytics + marketing
  // ---------------------------------------------------------------------------
  function essentialOnly() {
    _saveLocally(false, false);
    _postToAPI('analytics', false);
    _postToAPI('marketing', false);
    _emitChange();
  }

  // ---------------------------------------------------------------------------
  // Expose on window.consentStore
  // ---------------------------------------------------------------------------
  root.consentStore = {
    getAnonymousID:  getAnonymousID,
    getConsent:      getConsent,
    setConsent:      setConsent,
    acceptAll:       acceptAll,
    essentialOnly:   essentialOnly
  };

}(window));

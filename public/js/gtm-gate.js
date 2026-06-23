// GTM consent-gated loader (D-18.0-3)
// Default-deny analytics_storage; inject GTM only after explicit analytics consent.
(function() {
  'use strict';

  var GTM_ID = 'GTM-PHFRLWGJ';
  var injected = false;

  // 1. Initialize Google Consent Mode v2 with default-deny BEFORE any GTM tag could fire.
  //    This must run synchronously in <head> via inlined snippet — but we also set it here
  //    defensively in case the inline snippet was somehow skipped.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (typeof window.__gtmConsentInitialized === 'undefined') {
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });
    window.__gtmConsentInitialized = true;
  }

  function hasAnalyticsConsent() {
    try {
      var raw = localStorage.getItem('cookie_consent');
      if (!raw) return false;
      var c = JSON.parse(raw);
      return c && c.analytics === true;
    } catch (e) {
      return false; // fail-closed
    }
  }

  function injectGTM() {
    if (injected) return;
    injected = true;

    // Inject the GTM script
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);

    // Update consent to grant analytics_storage
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  }

  function revokeAnalytics() {
    // Cannot un-inject the script tag once loaded, but Consent Mode v2 will respect 'denied' state
    gtag('consent', 'update', { 'analytics_storage': 'denied' });
  }

  // 2. On page load: check current consent. If analytics granted → inject.
  if (hasAnalyticsConsent()) {
    injectGTM();
  }

  // 3. Listen for consent changes from the cookie banner (custom event).
  window.addEventListener('consent:change', function(e) {
    var detail = (e && e.detail) || {};
    if (detail.category === 'analytics') {
      if (detail.granted) {
        injectGTM();
      } else {
        revokeAnalytics();
      }
    }
  });
})();

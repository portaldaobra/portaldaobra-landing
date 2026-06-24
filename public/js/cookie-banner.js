/**
 * cookie-banner.js
 * DOM-based cookie consent banner for Portal da Obra landing pages.
 *
 * Dependencies: consent-store.js (must be loaded first)
 *
 * Behaviour:
 *   - On DOMContentLoaded: checks if consent has been decided. If analytics OR
 *     marketing is still null → show the banner.
 *   - 3 equal-weight CTAs (D-18.0-13): "Accept all" / "Essential only" / "Customize"
 *   - "Customize" expands inline toggles (Essential disabled, Analytics + Marketing)
 *   - Any submit closes the banner
 *   - Bilingual via localStorage.lang ('pt_br' default | 'en')
 *   - Listens for 'reopen-cookie-banner' CustomEvent → re-shows in Customize mode
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // i18n strings
  // ---------------------------------------------------------------------------
  var I18N = {
    pt_br: {
      title:              'Sua privacidade',
      intro:              'Usamos cookies para garantir o funcionamento do site, analisar o uso e personalizar conteúdo. Você pode escolher quais cookies aceitar.',
      accept_all:         'Aceitar tudo',
      essential_only:     'Apenas essenciais',
      customize:          'Personalizar',
      save:               'Salvar preferências',
      essential_name:     'Essenciais',
      essential_desc:     'Necessários para o funcionamento básico do site. Não podem ser desativados.',
      essential_badge:    'Sempre ativo',
      analytics_name:     'Análise',
      analytics_desc:     'Nos ajudam a entender como você usa o site para que possamos melhorá-lo.',
      marketing_name:     'Marketing',
      marketing_desc:     'Usados para exibir anúncios relevantes com base nos seus interesses.',
      aria_close:         'Fechar aviso de cookies',
    },
    en: {
      title:              'Your privacy',
      intro:              'We use cookies to ensure site functionality, analyse usage and personalise content. You can choose which cookies to accept.',
      accept_all:         'Accept all',
      essential_only:     'Essential only',
      customize:          'Customize',
      save:               'Save preferences',
      essential_name:     'Essential',
      essential_desc:     'Required for basic site functionality. Cannot be disabled.',
      essential_badge:    'Always on',
      analytics_name:     'Analytics',
      analytics_desc:     'Help us understand how you use the site so we can improve it.',
      marketing_name:     'Marketing',
      marketing_desc:     'Used to display relevant ads based on your interests.',
      aria_close:         'Close cookie notice',
    }
  };

  function getLang() {
    try {
      var stored = localStorage.getItem('lang');
      if (stored === 'en') return 'en';
    } catch (_) {}
    return 'pt_br';
  }

  function t(key) {
    var lang = getLang();
    var strings = I18N[lang] || I18N['pt_br'];
    return strings[key] || key;
  }

  // ---------------------------------------------------------------------------
  // Banner needs to show?
  // ---------------------------------------------------------------------------
  function bannerNeeded() {
    if (!window.consentStore) return false;
    var c = window.consentStore.getConsent();
    return c.analytics === null || c.marketing === null;
  }

  // ---------------------------------------------------------------------------
  // Build banner HTML
  // ---------------------------------------------------------------------------
  function buildBanner(openCustomize) {
    var consent = window.consentStore ? window.consentStore.getConsent() : { analytics: false, marketing: false };
    var analyticsChecked = consent.analytics === true;
    var marketingChecked = consent.marketing === true;

    var customizeDisplay  = openCustomize ? 'block' : 'none';
    var mainActionsDisplay = openCustomize ? 'none' : 'flex';

    return [
      '<div class="bg-white border-t border-slate-200 shadow-2xl px-4 py-5 sm:px-6 sm:py-6" role="dialog" aria-modal="true" aria-label="' + t('title') + '">',
      '  <div class="max-w-5xl mx-auto">',

      // Title + intro
      '    <div class="mb-4">',
      '      <h2 class="text-base font-semibold text-[#001D4A] font-dm mb-1">' + t('title') + '</h2>',
      '      <p class="text-sm text-slate-600 font-dm font-light leading-relaxed">' + t('intro') + '</p>',
      '    </div>',

      // Main action buttons — 3 equal-weight CTAs (D-18.0-13)
      '    <div id="cb-main-actions" class="gap-3" style="display:' + mainActionsDisplay + '">',
      '      <button id="cb-accept-all"     class="cb-btn flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-[#0047AB] bg-[#0047AB] text-white hover:bg-[#001D4A] hover:border-[#001D4A] transition-colors font-dm">' + t('accept_all') + '</button>',
      '      <button id="cb-essential-only" class="cb-btn flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-[#0047AB] bg-white text-[#0047AB] hover:bg-[#C6D6F0] transition-colors font-dm">' + t('essential_only') + '</button>',
      '      <button id="cb-customize"      class="cb-btn flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-[#0047AB] bg-white text-[#0047AB] hover:bg-[#C6D6F0] transition-colors font-dm">' + t('customize') + '</button>',
      '    </div>',

      // Customize panel (inline expand)
      '    <div id="cb-customize-panel" style="display:' + customizeDisplay + '">',
      '      <div class="mt-4 space-y-3 border border-slate-100 rounded-lg p-4">',

      // Essential row (always-on, disabled)
      '        <div class="flex items-start gap-3">',
      '          <div class="flex-1">',
      '            <p class="text-sm font-medium text-[#001D4A] font-dm">' + t('essential_name') + '</p>',
      '            <p class="text-xs text-slate-500 font-dm font-light mt-0.5">' + t('essential_desc') + '</p>',
      '          </div>',
      '          <span class="mt-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-dm whitespace-nowrap">' + t('essential_badge') + '</span>',
      '        </div>',

      // Analytics row
      '        <div class="flex items-start gap-3">',
      '          <div class="flex-1">',
      '            <label for="cb-toggle-analytics" class="text-sm font-medium text-[#001D4A] font-dm cursor-pointer">' + t('analytics_name') + '</label>',
      '            <p class="text-xs text-slate-500 font-dm font-light mt-0.5">' + t('analytics_desc') + '</p>',
      '          </div>',
      '          <input type="checkbox" id="cb-toggle-analytics" ' + (analyticsChecked ? 'checked' : '') + ' class="mt-1 w-4 h-4 accent-[#0047AB] cursor-pointer" aria-checked="' + analyticsChecked + '">',
      '        </div>',

      // Marketing row
      '        <div class="flex items-start gap-3">',
      '          <div class="flex-1">',
      '            <label for="cb-toggle-marketing" class="text-sm font-medium text-[#001D4A] font-dm cursor-pointer">' + t('marketing_name') + '</label>',
      '            <p class="text-xs text-slate-500 font-dm font-light mt-0.5">' + t('marketing_desc') + '</p>',
      '          </div>',
      '          <input type="checkbox" id="cb-toggle-marketing" ' + (marketingChecked ? 'checked' : '') + ' class="mt-1 w-4 h-4 accent-[#0047AB] cursor-pointer" aria-checked="' + marketingChecked + '">',
      '        </div>',

      '      </div>',

      // Save + back buttons row
      '      <div class="mt-3 flex flex-wrap gap-3">',
      '        <button id="cb-save" class="cb-btn flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-[#0047AB] bg-[#0047AB] text-white hover:bg-[#001D4A] hover:border-[#001D4A] transition-colors font-dm">' + t('save') + '</button>',
      '        <button id="cb-back" class="cb-btn flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border border-[#0047AB] bg-white text-[#0047AB] hover:bg-[#C6D6F0] transition-colors font-dm">← ' + t('essential_only') + '</button>',
      '      </div>',
      '    </div>',

      '  </div>',
      '</div>'
    ].join('\n');
  }

  // ---------------------------------------------------------------------------
  // Show / hide helpers
  // ---------------------------------------------------------------------------
  function showBanner(openCustomize) {
    var container = document.getElementById('cookie-banner');
    if (!container) return;
    container.innerHTML = buildBanner(openCustomize || false);
    container.classList.remove('hidden');
    bindEvents(container);
  }

  function closeBanner() {
    var container = document.getElementById('cookie-banner');
    if (!container) return;
    container.classList.add('hidden');
    container.innerHTML = '';
  }

  // ---------------------------------------------------------------------------
  // Toggle customize panel visibility without rebuilding
  // ---------------------------------------------------------------------------
  function openCustomizePanel(container) {
    var mainActions    = container.querySelector('#cb-main-actions');
    var customizePanel = container.querySelector('#cb-customize-panel');
    if (mainActions)    mainActions.style.display    = 'none';
    if (customizePanel) customizePanel.style.display = 'block';
  }

  // ---------------------------------------------------------------------------
  // Bind event listeners
  // ---------------------------------------------------------------------------
  function bindEvents(container) {
    var btnAcceptAll     = container.querySelector('#cb-accept-all');
    var btnEssentialOnly = container.querySelector('#cb-essential-only');
    var btnCustomize     = container.querySelector('#cb-customize');
    var btnSave          = container.querySelector('#cb-save');
    var btnBack          = container.querySelector('#cb-back');

    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', function () {
        window.consentStore.acceptAll();
        closeBanner();
      });
    }

    if (btnEssentialOnly) {
      btnEssentialOnly.addEventListener('click', function () {
        window.consentStore.essentialOnly();
        closeBanner();
      });
    }

    if (btnCustomize) {
      btnCustomize.addEventListener('click', function () {
        openCustomizePanel(container);
      });
    }

    if (btnSave) {
      btnSave.addEventListener('click', function () {
        var analyticsToggle = container.querySelector('#cb-toggle-analytics');
        var marketingToggle = container.querySelector('#cb-toggle-marketing');
        var analyticsGranted = analyticsToggle ? analyticsToggle.checked : false;
        var marketingGranted = marketingToggle ? marketingToggle.checked : false;
        window.consentStore.setConsent('analytics', analyticsGranted);
        window.consentStore.setConsent('marketing', marketingGranted);
        closeBanner();
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', function () {
        window.consentStore.essentialOnly();
        closeBanner();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Init on DOMContentLoaded
  // ---------------------------------------------------------------------------
  function init() {
    if (!window.consentStore) {
      console.warn('[cookie-banner] consentStore not loaded. Banner disabled.');
      return;
    }

    if (bannerNeeded()) {
      showBanner(false);
    }

    // Listen for 'reopen-cookie-banner' dispatched by "Manage cookies" footer link (Task 8)
    window.addEventListener('reopen-cookie-banner', function () {
      showBanner(true); // open directly in Customize mode
    });

    // If lang changes while banner is open, rebuild with correct text
    window.addEventListener('consent:change', function () {
      // No-op here — banner closes itself on any save/accept action
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired (e.g. defer didn't defer far enough)
    init();
  }

}());

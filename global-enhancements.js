/* ═══════════════════════════════════════════════════════════════
   SULAIMAN AL MATROOD LEGAL CONSULTATIONS — GLOBAL ENHANCEMENTS JS v3
   Injects: scroll progress · back-to-top · float CTAs · mobile sticky
            cookie consent (A4) · GA4 analytics (B1) · Clarity (B3)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     CONFIGURATION — replace placeholder IDs before going live
     ══════════════════════════════════════════════════════════════ */

  /* B1 — Google Analytics 4
     Get your Measurement ID from https://analytics.google.com
     → Admin → Data Streams → Measurement ID (format: G-XXXXXXXXXX) */
  var GA4_ID = 'G-XXXXXXXXXX'; // ← REPLACE WITH YOUR GA4 ID

  /* B3 — Microsoft Clarity
     Get your Project ID from https://clarity.microsoft.com
     → New Project → copy the ID from the install snippet */
  var CLARITY_ID = 'xxxxxxxxxx'; // ← REPLACE WITH YOUR CLARITY ID

  /* A4 — Cookie consent storage key */
  var COOKIE_CONSENT_KEY = 'almatrood_cookie_consent';
  // Stored values: 'accepted' | 'declined' | null (not yet decided)

  /* ══════════════════════════════════════════════════════════════
     B3 — MICROSOFT CLARITY (no consent required in KSA)
     ══════════════════════════════════════════════════════════════ */
  if (CLARITY_ID !== 'xxxxxxxxxx') {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  /* ══════════════════════════════════════════════════════════════
     B1 — GOOGLE ANALYTICS 4 (consent-gated)
     ══════════════════════════════════════════════════════════════ */
  function initGA4() {
    if (GA4_ID === 'G-XXXXXXXXXX') return; // placeholder — skip
    if (typeof window.gtag === 'function') return; // already loaded
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true
    });
  }

  /* GA4 event helper */
  function trackEvent(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params || {});
  }

  /* Track language toggle events */
  function trackLangToggle(lang) {
    trackEvent('language_toggle', { event_category: 'UX', event_label: lang });
  }

  /* Expose for inline onclick handlers */
  window._amTrackLang = trackLangToggle;

  /* Track CTA clicks (WhatsApp, phone, form submit) */
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a');
    if (!target) return;
    var href = target.href || '';
    if (href.indexOf('wa.me') !== -1) {
      trackEvent('whatsapp_click', { event_category: 'CTA', event_label: window.location.pathname });
    } else if (href.indexOf('tel:') === 0) {
      trackEvent('phone_click', { event_category: 'CTA', event_label: window.location.pathname });
    }
  });

  /* Track form submissions */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && form.tagName === 'FORM') {
      trackEvent('form_submit', {
        event_category: 'Conversion',
        event_label: form.id || 'contact_form',
        page: window.location.pathname
      });
    }
  });

  /* Scroll depth tracking: fires at 25%, 50%, 75%, 90% */
  var scrollDepthTargets = [25, 50, 75, 90];
  var depthFired = [];
  window.addEventListener('scroll', function () {
    if (typeof window.gtag !== 'function') return;
    var doc = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    if (height <= 0) return;
    var pct = Math.round(scrolled / height * 100);
    for (var i = 0; i < scrollDepthTargets.length; i++) {
      var d = scrollDepthTargets[i];
      if (pct >= d && depthFired.indexOf(d) === -1) {
        depthFired.push(d);
        trackEvent('scroll_depth', { event_category: 'Engagement', event_label: d + '%', value: d });
      }
    }
  }, { passive: true });

  /* Initialise GA4 now if already consented */
  var _consentNow = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (_consentNow === 'accepted') initGA4();

  /* ══════════════════════════════════════════════════════════════
     A4 — COOKIE CONSENT BANNER
     ══════════════════════════════════════════════════════════════ */
  var cookieBanner = null;

  var cookieLabels = {
    ar: {
      title:   'ملفات تعريف الارتباط',
      desc:    'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل الأداء. بياناتك خاصة ولا تُشارَك مع أطراف ثالثة.',
      accept:  'قبول',
      decline: 'رفض',
      policy:  'سياسة الخصوصية'
    },
    en: {
      title:   'Cookie Notice',
      desc:    'We use cookies to improve your experience and analyze performance. Your data is private and never shared with third parties.',
      accept:  'Accept',
      decline: 'Decline',
      policy:  'Privacy Policy'
    }
  };

  function buildCookieBannerHTML(lang) {
    var l = cookieLabels[lang] || cookieLabels.ar;
    return (
      '<div class="cb-inner">' +
        '<div class="cb-text">' +
          '<svg class="cb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.598 11.064a1.006 1.006 0 00-.854-.172A2.938 2.938 0 0120 11c-1.654 0-3-1.346-3.003-2.937.005-.034.016-.136.017-.17a1 1 0 00-1.254-.986 2.977 2.977 0 01-.727.095c-1.654 0-3-1.346-3-3 0-.248.032-.49.095-.727a1 1 0 00-.986-1.254c-.034.001-.136.012-.17.017C9.369 2.006 7.5 2 7.5 2a9.5 9.5 0 000 19h.043A9.5 9.5 0 0021.598 11.064zM7.5 19a7.5 7.5 0 110-15c.05 0 .099.002.149.004A5 5 0 0012.5 9a4.94 4.94 0 00.64-.042A5 5 0 0018 13.5c.214 0 .426-.014.636-.04A7.476 7.476 0 017.5 19zm2.5-7a1 1 0 11-2 0 1 1 0 012 0zm5 2a1 1 0 11-2 0 1 1 0 012 0zm-6 4a1 1 0 11-2 0 1 1 0 012 0z"/></svg>' +
          '<div>' +
            '<strong class="cb-title">' + l.title + '</strong>' +
            '<p class="cb-desc">' + l.desc + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="cb-actions">' +
          '<button id="cookie-decline" class="cb-btn cb-btn-decline" aria-label="' + l.decline + '">' + l.decline + '</button>' +
          '<button id="cookie-accept"  class="cb-btn cb-btn-accept"  aria-label="' + l.accept  + '">' + l.accept  + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function dismissCookieBanner(value) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    if (cookieBanner) {
      cookieBanner.classList.remove('cb-visible');
      setTimeout(function () {
        if (cookieBanner && cookieBanner.parentNode) cookieBanner.parentNode.removeChild(cookieBanner);
        cookieBanner = null;
      }, 420);
    }
    if (value === 'accepted') initGA4();
  }

  function injectCookieBanner() {
    if (localStorage.getItem(COOKIE_CONSENT_KEY)) return; // already decided
    cookieBanner = document.createElement('div');
    cookieBanner.id = 'cookie-consent-banner';
    cookieBanner.setAttribute('role', 'dialog');
    cookieBanner.setAttribute('aria-live', 'polite');
    cookieBanner.setAttribute('aria-label', 'Cookie consent');
    var lang = localStorage.getItem('almatrood_lang') || 'ar';
    cookieBanner.innerHTML = buildCookieBannerHTML(lang);
    document.body.appendChild(cookieBanner);

    /* Slide in */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { cookieBanner.classList.add('cb-visible'); });
    });

    cookieBanner.querySelector('#cookie-accept').addEventListener('click', function () {
      dismissCookieBanner('accepted');
    });
    cookieBanner.querySelector('#cookie-decline').addEventListener('click', function () {
      dismissCookieBanner('declined');
    });
  }

  /* Show banner after 1.5 s if no decision yet */
  if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
    var _cbTimer = setTimeout(injectCookieBanner, 1500);
    /* Wait for DOM if still loading */
    if (document.readyState === 'loading') {
      clearTimeout(_cbTimer);
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(injectCookieBanner, 1500);
      });
    }
  }

  /* ── 1. INJECT SCROLL PROGRESS BAR ─────────────────────────── */
  var prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);

  /* ── 2. INJECT BACK-TO-TOP BUTTON ──────────────────────────── */
  var btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
  document.body.appendChild(btt);
  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 3. INJECT FLOATING CTA BUTTONS ────────────────────────── */
  var floatCTA = document.createElement('div');
  floatCTA.id = 'float-cta';
  floatCTA.setAttribute('aria-label', 'Quick contact');
  floatCTA.innerHTML =
    '<a href="https://wa.me/9660556623555" target="_blank" rel="noopener noreferrer" class="float-btn float-btn-whatsapp" aria-label="WhatsApp">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '<span class="float-btn-tooltip">تواصل عبر واتساب</span>' +
    '</a>' +
    '<a href="tel:+9660556623555" class="float-btn float-btn-phone" aria-label="Call us">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
      '<span class="float-btn-tooltip">اتصل بنا</span>' +
    '</a>';
  document.body.appendChild(floatCTA);

  /* ── 4. INJECT MOBILE STICKY BAR ────────────────────────────── */
  var sticky = document.createElement('div');
  sticky.id = 'mobile-sticky';
  sticky.setAttribute('aria-label', 'Mobile quick actions');
  sticky.innerHTML =
    '<div class="mobile-sticky-inner">' +
      '<a href="contact.html" class="mobile-sticky-btn mobile-sticky-primary">احجز استشارة مجانية</a>' +
      '<a href="tel:+9660556623555" class="mobile-sticky-btn mobile-sticky-secondary">📞 اتصل بنا</a>' +
    '</div>';
  document.body.appendChild(sticky);

  /* ── 5. SCROLL EVENTS ───────────────────────────────────────── */
  function onScroll() {
    var doc     = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var height   = doc.scrollHeight - doc.clientHeight;
    if (height > 0) prog.style.width = (scrolled / height * 100) + '%';

    if (scrolled > 320) btt.classList.add('visible');
    else                btt.classList.remove('visible');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 6. LANGUAGE SYNC ───────────────────────────────────────── */
  var labels = {
    ar: {
      waTooltip:   'تواصل عبر واتساب',
      phoneTooltip:'اتصل بنا',
      stickyMain:  'احجز استشارة مجانية',
      stickyPhone: '📞 اتصل بنا',
      bttLabel:    'العودة للأعلى'
    },
    en: {
      waTooltip:   'WhatsApp Us',
      phoneTooltip:'Call Us',
      stickyMain:  'Free Consultation',
      stickyPhone: '📞 Call Us',
      bttLabel:    'Back to top'
    }
  };

  function syncLang(lang) {
    var l       = labels[lang] || labels.ar;
    var waEl    = floatCTA.querySelector('.float-btn-whatsapp .float-btn-tooltip');
    var phEl    = floatCTA.querySelector('.float-btn-phone .float-btn-tooltip');
    var btnMain = sticky.querySelector('.mobile-sticky-primary');
    var btnPh   = sticky.querySelector('.mobile-sticky-secondary');
    if (waEl)    waEl.textContent    = l.waTooltip;
    if (phEl)    phEl.textContent    = l.phoneTooltip;
    if (btnMain) btnMain.textContent = l.stickyMain;
    if (btnPh)   btnPh.innerHTML     = l.stickyPhone;
    btt.setAttribute('aria-label',   l.bttLabel);

    /* Update cookie banner language if visible */
    if (cookieBanner) {
      cookieBanner.innerHTML = buildCookieBannerHTML(lang);
      cookieBanner.querySelector('#cookie-accept').addEventListener('click', function () {
        dismissCookieBanner('accepted');
      });
      cookieBanner.querySelector('#cookie-decline').addEventListener('click', function () {
        dismissCookieBanner('declined');
      });
    }

    /* Track language change */
    trackEvent('language_toggle', { event_category: 'UX', event_label: lang });
  }

  /* Watch for <html lang="..."> changes */
  var langObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'lang') {
        syncLang(document.documentElement.getAttribute('lang') || 'ar');
      }
    });
  });
  langObs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  var initLang = localStorage.getItem('almatrood_lang') || 'ar';
  syncLang(initLang);

  /* ── 7. ANIMATED COUNTER for stats (intersection-based) ─────── */
  function animateCounter(el, target, duration) {
    var startTime = null;
    var isPlus    = target.toString().startsWith('+');
    var isPercent = target.toString().endsWith('%');
    var num       = parseInt(target.toString().replace(/[^0-9]/g, ''), 10);
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var current  = Math.floor(eased * num);
      el.textContent = (isPlus ? '+' : '') + current + (isPercent ? '%' : '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var counterDone = false;
  var statsObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !counterDone) {
        counterDone = true;
        document.querySelectorAll('.stat-number').forEach(function (el) {
          animateCounter(el, el.textContent.trim(), 1800);
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObs.observe(heroStats);

})();

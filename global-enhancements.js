/* ═══════════════════════════════════════════════════════════════
   AL MATROOD LAW FIRM — GLOBAL ENHANCEMENTS JS v2
   Injects: scroll progress · back-to-top · float CTAs · mobile sticky
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. INJECT SCROLL PROGRESS BAR ─────────────────────────── */
  const prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);

  /* ── 2. INJECT BACK-TO-TOP BUTTON ──────────────────────────── */
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML =
    '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
  document.body.appendChild(btt);
  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 3. INJECT FLOATING CTA BUTTONS ────────────────────────── */
  const floatCTA = document.createElement('div');
  floatCTA.id = 'float-cta';
  floatCTA.innerHTML =
    '<a href="https://wa.me/966XXXXXXXXX" target="_blank" rel="noopener" class="float-btn float-btn-whatsapp" aria-label="WhatsApp">' +
      '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '<span class="float-btn-tooltip">تواصل عبر واتساب</span>' +
    '</a>' +
    '<a href="tel:+96611XXXXXXX" class="float-btn float-btn-phone" aria-label="Call">' +
      '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
      '<span class="float-btn-tooltip">اتصل بنا</span>' +
    '</a>';
  document.body.appendChild(floatCTA);

  /* ── 4. INJECT MOBILE STICKY BAR ────────────────────────────── */
  const sticky = document.createElement('div');
  sticky.id = 'mobile-sticky';
  sticky.innerHTML =
    '<div class="mobile-sticky-inner">' +
      '<a href="contact.html" class="mobile-sticky-btn mobile-sticky-primary">احجز استشارة مجانية</a>' +
      '<a href="tel:+96611XXXXXXX" class="mobile-sticky-btn mobile-sticky-secondary">📞 اتصل بنا</a>' +
    '</div>';
  document.body.appendChild(sticky);

  /* ── 5. SCROLL EVENTS ───────────────────────────────────────── */
  function onScroll() {
    // Progress bar
    var doc   = document.documentElement;
    var scrolled = doc.scrollTop || document.body.scrollTop;
    var height   = doc.scrollHeight - doc.clientHeight;
    if (height > 0) prog.style.width = (scrolled / height * 100) + '%';

    // Back-to-top visibility
    if (scrolled > 320) btt.classList.add('visible');
    else btt.classList.remove('visible');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init

  /* ── 6. LANGUAGE SYNC ───────────────────────────────────────── */
  var labels = {
    ar: {
      waTooltip:   'تواصل عبر واتساب',
      phoneTooltip:'اتصل بنا',
      stickyMain:  'احجز استشارة مجانية',
      stickyPhone: '📞 اتصل بنا'
    },
    en: {
      waTooltip:   'WhatsApp Us',
      phoneTooltip:'Call Us',
      stickyMain:  'Free Consultation',
      stickyPhone: '📞 Call Us'
    }
  };

  function syncLang(lang) {
    var l = labels[lang] || labels.ar;
    var waEl    = floatCTA.querySelector('.float-btn-whatsapp .float-btn-tooltip');
    var phEl    = floatCTA.querySelector('.float-btn-phone .float-btn-tooltip');
    var btnMain = sticky.querySelector('.mobile-sticky-primary');
    var btnPh   = sticky.querySelector('.mobile-sticky-secondary');
    if (waEl)    waEl.textContent    = l.waTooltip;
    if (phEl)    phEl.textContent    = l.phoneTooltip;
    if (btnMain) btnMain.textContent = l.stickyMain;
    if (btnPh)   btnPh.innerHTML     = l.stickyPhone;
  }

  // Watch for <html lang="..."> attribute changes
  var langObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'lang') {
        syncLang(document.documentElement.getAttribute('lang') || 'ar');
      }
    });
  });
  langObs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // Initial sync
  var initLang = localStorage.getItem('almatrood_lang') || 'ar';
  syncLang(initLang);

  /* ── 7. ANIMATED COUNTER for stats (intersection-based) ─────── */
  function animateCounter(el, target, duration) {
    var start    = 0;
    var startTime = null;
    var isPlus   = target.toString().startsWith('+');
    var isPercent= target.toString().endsWith('%');
    var num      = parseInt(target.toString().replace(/[^0-9]/g, ''), 10);
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
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
        var statNums = document.querySelectorAll('.stat-number');
        statNums.forEach(function (el) {
          var raw = el.textContent.trim();
          animateCounter(el, raw, 1800);
        });
        statsObs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObs.observe(heroStats);

})();

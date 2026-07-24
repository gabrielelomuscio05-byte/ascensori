/* ============================================================
   Vertiqal Systems — main.js
   Comportamenti condivisi: nav, reveal on scroll, contatori
   ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: sfondo su scroll ---------- */
  const nav = document.querySelector('.site-nav');

  function updateNav() {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- Nav: menu mobile ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-blur');

  if (revealEls.length && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Contatori animati ---------- */
  const counters = document.querySelectorAll('[data-count]');

  function formatCount(el, value) {
    return el.dataset.format === 'plain' ? String(value) : value.toLocaleString('it-IT');
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.firstChild.nodeValue = formatCount(el, Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if (prefersReducedMotion) {
      counters.forEach((el) => {
        el.firstChild.nodeValue = formatCount(el, parseInt(el.dataset.count, 10));
      });
    } else {
      const counterObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        }
      }, { threshold: 0.5 });

      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- Anno corrente nel footer ---------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Chiudi tutti (accordion singolo)
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Apri questo se era chiuso
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Scroll-to-top ---------- */
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    function updateScrollTop() {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', updateScrollTop, { passive: true });
    updateScrollTop();

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Cookie banner ---------- */
  const cookieBanner = document.getElementById('cookie-banner');

  if (cookieBanner && !localStorage.getItem('vertiqal-cookie-consent')) {
    // Mostra il banner (ha l'animazione CSS slide-up automatica)
    cookieBanner.style.display = '';

    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    function dismissCookie(choice) {
      localStorage.setItem('vertiqal-cookie-consent', choice);
      cookieBanner.classList.add('is-hidden');
      setTimeout(() => { cookieBanner.remove(); }, 500);
    }

    if (acceptBtn) acceptBtn.addEventListener('click', () => dismissCookie('all'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => dismissCookie('necessary'));
  } else if (cookieBanner) {
    cookieBanner.remove();
  }

  /* ---------- Page loader ---------- */
  const pageLoader = document.getElementById('page-loader');

  if (pageLoader) {
    window.addEventListener('load', () => {
      pageLoader.classList.add('is-loaded');
      setTimeout(() => { pageLoader.remove(); }, 600);
    });

    // Failsafe: nascondi dopo 3 secondi anche se load non scatta
    setTimeout(() => {
      if (pageLoader.parentNode) {
        pageLoader.classList.add('is-loaded');
        setTimeout(() => { if (pageLoader.parentNode) pageLoader.remove(); }, 600);
      }
    }, 3000);
  }
})();

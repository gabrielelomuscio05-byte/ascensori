/* ============================================================
   Vertiqal Systems — form.js
   Validazione client-side del modulo contatti
   ============================================================ */
(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const success = document.getElementById('form-success');
  const submitBtn = form.querySelector('button[type="submit"]');

  const validators = {
    nome: (v) => v.trim().length >= 2 || 'Inserisci il tuo nome.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Inserisci un indirizzo email valido.',
    telefono: (v) => v.trim() === '' || /^[\d\s+().-]{6,}$/.test(v.trim()) || 'Numero di telefono non valido.',
    messaggio: (v) => v.trim().length >= 10 || 'Descrivi la tua richiesta (almeno 10 caratteri).'
  };

  function validateField(input) {
    const rule = validators[input.name];
    if (!rule) return true;

    const result = rule(input.value);
    const errorEl = form.querySelector(`[data-error-for="${input.name}"]`);
    const valid = result === true;

    input.setAttribute('aria-invalid', String(!valid));
    if (errorEl) errorEl.textContent = valid ? '' : result;
    return valid;
  }

  form.addEventListener('blur', (e) => {
    if (e.target.matches('input, textarea')) validateField(e.target);
  }, true);

  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = Array.from(form.querySelectorAll('input, textarea, select'));
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Demo statica: nessun backend. Sostituire con fetch() verso il
    // proprio endpoint (es. Formspree, Netlify Forms, API propria).
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Invia richiesta';
      success.classList.add('is-visible');
      success.focus();
    }, 900);
  });
})();

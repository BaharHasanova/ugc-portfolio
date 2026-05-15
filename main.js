// ── Navbar scroll effect ───────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile menu toggle ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Portfolio filter tabs ──────────────────────────────────────
const tabs  = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.portfolio-card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// ── Number counter animation ───────────────────────────────────
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  const isLarge = target >= 10000;

  const tick = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const current = Math.round(eased * target);
    el.textContent = isLarge
      ? (current / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
      : current;
    if (elapsed < 1) requestAnimationFrame(tick);
    else el.textContent = isLarge
      ? (target / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
      : target;
  };
  requestAnimationFrame(tick);
}

// ── Bar fill animation ─────────────────────────────────────────
function animateBars(container) {
  container.querySelectorAll('.bar-fill').forEach(bar => {
    const w = bar.dataset.width;
    bar.style.width = w + '%';
  });
}

// ── Ring / donut animation ─────────────────────────────────────
function animateRings(container) {
  const circumference = 2 * Math.PI * 15.9; // ~99.9
  container.querySelectorAll('.ring-progress').forEach(ring => {
    const pct = parseFloat(ring.dataset.pct);
    const offset = circumference * (1 - pct / 100);
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    ring.style.strokeDashoffset = circumference;
    setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);
  });
}

// ── Scroll reveal + trigger animations on entry ────────────────
const revealTargets = document.querySelectorAll(
  '#stats, #about, #portfolio, #videos, #stats-infographic, #services, #testimonials, #contact, .portfolio-card, .service-card, .testimonial-card, .video-card, .info-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const triggered = new WeakSet();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...(el.parentElement?.children || [])];
    const delay = siblings.indexOf(el) * 80;
    setTimeout(() => el.classList.add('visible'), delay);

    // Trigger animations once per section
    if (!triggered.has(el)) {
      triggered.add(el);

      // Count-up numbers
      el.querySelectorAll('[data-count]').forEach(animateCount);

      // Bar fills inside this element
      if (el.querySelector('.bar-fill')) animateBars(el);

      // Rings inside this element
      if (el.querySelector('.ring-progress')) animateRings(el);

      // Stats bar counters
      if (el.id === 'stats') {
        el.querySelectorAll('[data-count]').forEach(animateCount);
      }
    }

    observer.unobserve(el);
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// ── Contact form ───────────────────────────────────────────────
const form      = document.getElementById('contact-form');
const note      = document.getElementById('form-note');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  note.textContent = '';

  try {
    const response = await fetch('https://formspree.io/f/xwvydgew', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    if (response.ok) {
      note.textContent = '✦ Message sent! I\'ll be in touch soon.';
      note.style.color = 'var(--pink)';
      form.reset();
    } else {
      note.textContent = '⚠️ Something went wrong. Please email me directly at bahara.ugc@gmail.com';
      note.style.color = '#e57373';
    }
  } catch {
    note.textContent = '⚠️ Network error. Please email me directly at bahara.ugc@gmail.com';
    note.style.color = '#e57373';
  }

  submitBtn.textContent = 'Send Message ✦';
  submitBtn.disabled = false;
});

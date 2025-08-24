/**
 * On The Rock 2025 – Interaction Script
 * Features:
 *  - Countdown
 *  - Scroll reveal
 *  - Back to top
 *  - Smooth active nav highlight (Bootstrap scrollspy)
 *  - Form validation simulation
 *  - Minor performance & accessibility helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initReveal();
  initBackToTop();
  initForm();
});

/* Countdown */
function initCountdown() {
  const targetDate = new Date('2025-10-25T16:00:00+02:00').getTime(); // 16h Accès VIP
  const container = document.getElementById('countdown');
  if (!container) return;

  const units = [
    { key: 'days', label: 'JOURS' },
    { key: 'hours', label: 'HEURES' },
    { key: 'minutes', label: 'MIN' },
    { key: 'seconds', label: 'SEC' },
  ];

  // Create structure
  units.forEach(u => {
    const col = document.createElement('div');
    col.className = 'col-auto';
    col.innerHTML = `
      <div class="count-block">
        <div class="count-number" data-${u.key}>--</div>
        <div class="count-label">${u.label}</div>
      </div>
    `;
    container.appendChild(col);
  });

  const tick = () => {
    const now = Date.now();
    const dist = targetDate - now;

    if (dist <= 0) {
      container.innerHTML = '<div class="col-12 text-center fw-semibold">Ouvert !</div>';
      clearInterval(interval);
      return;
    }

    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
    const h = Math.floor((dist / (1000 * 60 * 60)) % 24);
    const m = Math.floor((dist / (1000 * 60)) % 60);
    const s = Math.floor((dist / 1000) % 60);

    setValue('days', d);
    setValue('hours', h);
    setValue('minutes', m);
    setValue('seconds', s);
  };

  function setValue(unit, value) {
    const el = container.querySelector(`[data-${unit}]`);
    if (!el) return;
    const old = el.textContent;
    const formatted = String(value).padStart(2,'0');
    if (old !== formatted) {
      el.classList.remove('flip');
      void el.offsetWidth; // reflow for animation restart
      el.textContent = formatted;
      el.classList.add('flip');
    }
  }

  const interval = setInterval(tick, 1000);
  tick();
}

/* Add simple CSS for countdown flip (dynamic injection) */
const style = document.createElement('style');
style.textContent = `
.count-number.flip {
  animation: pop .6s cubic-bezier(.16,.8,.3,1);
}
@keyframes pop {
  0% { transform: translateY(6px) scale(.9); opacity:.4; }
  40% { transform: translateY(-3px) scale(1.05); opacity:1; }
  100% { transform: translateY(0) scale(1); }
}
`;
document.head.appendChild(style);

/* Scroll reveal */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll('.section-title, .pricing-card, .model-card, .referral-box, .vip-box, .timeline-card, .feature-item')
    .forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
}

/* Back to top button */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled > 600) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });
}

/* Form logic */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('loadingSpinner');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Bootstrap validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    submitBtn.disabled = true;
    spinner.classList.remove('d-none');
    status.textContent = '';
    status.className = 'small';

    // Simulated async send
    setTimeout(() => {
      spinner.classList.add('d-none');
      submitBtn.disabled = false;
      status.textContent = 'Message envoyé (simulation). Connectez un service backend réel.';
      status.classList.add('success');
      form.reset();
      form.classList.remove('was-validated');
    }, 1300);
  });
}

/* Accessibility: close navbar on link click (mobile) */
document.addEventListener('click', (e) => {
  const nav = document.getElementById('navContent');
  if (nav && nav.classList.contains('show') && e.target.matches('.nav-link')) {
    const bsCollapse = bootstrap.Collapse.getInstance(nav);
    bsCollapse && bsCollapse.hide();
  }
});

/* Performance hint: pause YouTube when tab hidden (optional) */
document.addEventListener('visibilitychange', () => {
  const iframe = document.querySelector('.yt-bg');
  if (!iframe || !iframe.contentWindow) return;
  // Using YouTube player API would be better; here simple approach (will reload on show)
  if (document.hidden) {
    iframe.dataset.src = iframe.src;
    iframe.src = '';
  } else if (iframe.dataset.src && iframe.src === '') {
    iframe.src = iframe.dataset.src;
  }
});
/* ============================================================
   AIAccess — Global JavaScript
   ============================================================ */

// ─── Particle Canvas Background ───────────────────────────────
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = [];
  const COUNT = Math.min(120, Math.floor(W * H / 12000));

  const COLORS = ['rgba(123,47,255,', 'rgba(0,194,255,', 'rgba(255,47,190,'];

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.12;
          ctx.strokeStyle = `rgba(123,47,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      const pulse = Math.sin(frame * p.pulseSpeed + p.pulseOffset);
      const a = p.alpha + pulse * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + pulse * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0, Math.min(1, a)) + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ─── Custom Cursor (Desktop only) ─────────────────────────────
function initCursor() {
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouchDevice) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .glass-card, .nft-card, .team-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    });
  });
}

// ─── Navbar ───────────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── Scroll Reveal ────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}

// ─── Counter Animation ────────────────────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '', prefix = '') {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        animateCounter(el, target, 2000, suffix, prefix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ─── Card Tilt (Desktop only) ─────────────────────────────────
function initCardTilt() {
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouchDevice) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── Mouse Parallax for Hero (Desktop only) ───────────────────
function initParallax() {
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouchDevice) return;

  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 10;
      el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

// ─── Neon Text Flicker ────────────────────────────────────────
function initFlicker() {
  const els = document.querySelectorAll('.flicker');
  els.forEach(el => {
    el.style.animation = 'neon-flicker 6s infinite';
    el.style.animationDelay = Math.random() * 3 + 's';
  });
}

// ─── Smooth Page Transitions ──────────────────────────────────
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

    // If the link targets a hash on the SAME page (e.g. index.html#whitelist), smooth scroll instead of fade
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const [linkPage, linkHash] = href.split('#');
    if (linkHash && (linkPage === currentPage || linkPage === '')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(linkHash);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => window.location.href = href, 300);
    });
  });

  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
}

// ─── Glowing Orbit Ring ───────────────────────────────────────
function initOrbitRing() {
  const hero = document.querySelector('.hero-visual');
  if (!hero) return;

  const ring = document.createElement('div');
  ring.className = 'orbit-ring';
  ring.style.cssText = `
    position: absolute;
    width: 110%;
    height: 110%;
    border-radius: 50%;
    border: 1px solid rgba(123,47,255,0.3);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: spin-slow 12s linear infinite;
    pointer-events: none;
  `;

  const dot2 = document.createElement('div');
  dot2.style.cssText = `
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--cyan);
    border-radius: 50%;
    top: -4px;
    left: 50%;
    margin-left: -4px;
    box-shadow: 0 0 12px var(--cyan), 0 0 24px var(--cyan);
  `;
  ring.appendChild(dot2);
  hero.appendChild(ring);
}

// ─── Init All ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursor();
  initNav();
  initScrollReveal();
  initCounters();
  initCardTilt();
  initParallax();
  initFlicker();
  initPageTransitions();
  initOrbitRing();
});

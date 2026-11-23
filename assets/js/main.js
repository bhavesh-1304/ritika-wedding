/**
 * RITIKA & KAILASHJI PATEL — MARWADI ROYAL WEDDING INVITATION
 * Core Interactive & Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundParticles();
  initOpeningCover();
  initAudioPlayer();
  initWeddingCountdown();
  initScrollAnimations();
});

/* ==========================================================================
   1. BACKGROUND PARTICLES (Subtle Golden Stardust)
   ========================================================================== */
function initBackgroundParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create subtle golden particles
  const particleCount = window.innerWidth < 768 ? 24 : 45;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02 + 0.005,
      pulseDir: 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Pulse opacity
      p.opacity += p.pulse * p.pulseDir;
      if (p.opacity > 0.75) p.pulseDir = -1;
      if (p.opacity < 0.2) p.pulseDir = 1;

      // Wrap around edges
      if (p.y < 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      // Draw particle with golden radial glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(223, 185, 101, ${p.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(250, 230, 186, 0.8)';
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(draw);
  }

  draw();

  // Pause when tab not visible to save battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      draw();
    }
  });
}

/* ==========================================================================
   2. OPENING INVITATION COVER (Royal Sliding Palace Doors as seen in Reel)
   ========================================================================== */
function initOpeningCover() {
  const cover = document.getElementById('invitationCover');
  const openBtn = document.getElementById('openInvitationBtn');
  const mainContent = document.getElementById('mainContent');
  const heroNames = document.querySelector('.hero-names-wrapper');

  if (!openBtn || !cover) return;

  // Auto-open if query parameter ?open=true is passed (for mobile viewport testing & inspection)
  if (window.location.search.includes('open=true')) {
    cover.classList.add('opened');
    mainContent.classList.add('visible');
    if (heroNames) heroNames.classList.add('animated');
    setTimeout(() => {
      document.querySelectorAll('.fade-up-element').forEach(el => el.classList.add('revealed'));
      const ramRamSa = document.querySelector('.ram-ram-sa');
      const finalSub = document.querySelector('.final-sub-blessing');
      if (ramRamSa) ramRamSa.classList.add('show');
      if (finalSub) finalSub.classList.add('show');
    }, 100);
  }

  openBtn.addEventListener('click', () => {
    // Trigger sliding palace gates opening
    cover.classList.add('opened');
    mainContent.classList.add('visible');

    // Trigger hero text BlurText animation with slight delay as gates part
    if (heroNames) {
      setTimeout(() => {
        heroNames.classList.add('animated');
      }, 500);
    }

    // Smoothly initiate authentic folk music after user gesture
    window.playAudioTrack();
  });
}

/* ==========================================================================
   3. BACKGROUND AUDIO PLAYER ("Baisa Ro Roop")
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('weddingAudio');
  const widget = document.getElementById('audioWidget');
  if (!audio || !widget) return;

  let isPlaying = false;

  window.playAudioTrack = function() {
    audio.play().then(() => {
      isPlaying = true;
      widget.classList.add('playing');
    }).catch(err => {
      console.log('Audio autoplay prevented, awaiting direct toggle:', err);
    });
  };

  widget.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      widget.classList.remove('playing');
    } else {
      audio.play().then(() => {
        isPlaying = true;
        widget.classList.add('playing');
      }).catch(err => {
        console.error('Audio play failed:', err);
      });
    }
  });

  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
  });
}

/* ==========================================================================
   4. LIVE WEDDING COUNTDOWN (Accurate Local Device Time)
   ========================================================================== */
function initWeddingCountdown() {
  // Wedding Date: 12 December 2026 00:00:00 (Local visitor timezone)
  // Month is 0-indexed: 11 = December
  const targetDate = new Date(2026, 11, 12, 0, 0, 0);

  const elDays = document.getElementById('countDays');
  const elHours = document.getElementById('countHours');
  const elMinutes = document.getElementById('countMinutes');
  const elSeconds = document.getElementById('countSeconds');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const pad = n => String(n).padStart(2, '0');

    if (elDays && elDays.textContent !== pad(days)) elDays.textContent = pad(days);
    if (elHours && elHours.textContent !== pad(hours)) elHours.textContent = pad(hours);
    if (elMinutes && elMinutes.textContent !== pad(minutes)) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   5. INTERSECTION OBSERVER SCROLL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up-element');
  const ramRamSa = document.querySelector('.ram-ram-sa');
  const finalSub = document.querySelector('.final-sub-blessing');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Final screen Ram Ram Sa observer
  if (ramRamSa) {
    const finalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ramRamSa.classList.add('show');
          if (finalSub) finalSub.classList.add('show');
        }
      });
    }, { threshold: 0.3 });

    finalObserver.observe(ramRamSa);
  }
}

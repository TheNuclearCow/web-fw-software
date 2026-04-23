/* ================================================
   FAIRWATER SOFTWARE — Site Scripts
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Navigation: Scroll Effect =====
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ===== Navigation: Active Link Tracking =====
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const sections = [...navLinks].map(link =>
    document.getElementById(link.dataset.section)
  ).filter(Boolean);

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 150;
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ===== Mobile Navigation Toggle =====
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('is-open');
    navLinksContainer.classList.toggle('is-open');
    document.body.style.overflow =
      navLinksContainer.classList.contains('is-open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinksContainer.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('is-open');
      navLinksContainer.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // ===== Scroll Animations (Intersection Observer) =====
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay * 120);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ===== Animated Stat Counters =====
  const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      el.textContent = Math.round(target * easedProgress);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ===== Smooth Scroll for All Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Contact Form Handler =====
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span>Sending...</span>' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        contactForm.innerHTML = `
          <div class="form__success">
            <div class="form__success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
          </div>
        `;
      } else {
        throw new Error('Server responded with ' + response.status);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<span>Send Message</span>' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      // Remove any previous error message
      const prev = contactForm.querySelector('.form__error-msg');
      if (prev) prev.remove();
      const errorMsg = document.createElement('p');
      errorMsg.className = 'form__error-msg';
      errorMsg.style.cssText = 'color:#e53e3e;font-size:0.88rem;margin-top:0.75rem;text-align:center;grid-column:1/-1;';
      errorMsg.textContent = 'Something went wrong. Please try again or email us directly.';
      contactForm.appendChild(errorMsg);
    }
  });

  // ===== Footer: Current Year =====
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Add spin keyframe for loading indicator =====
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { 100% { transform: rotate(360deg); } }';
  document.head.appendChild(style);
});

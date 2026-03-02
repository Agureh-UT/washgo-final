/**
 * globals.js — Crystal Crown Mobile Detailing & House Cleaning
 * All site-wide JavaScript in a single ES6+ file.
 * Modules: NavToggle | SmoothScroll | ScrollReveal | HeaderScroll |
 *          ActiveNav | Accordion | FormValidation | VehicleSelector
 */

'use strict';

/* ================================================================== */
/* 1. NAV TOGGLE (Hamburger Menu)                                      */
/* ================================================================== */

const initNavToggle = () => {
  const hamburger = document.querySelector('.hamburger');
  const nav       = document.querySelector('.site-nav');
  const backdrop  = document.querySelector('.nav-backdrop');

  if (!hamburger || !nav) return;

  const openNav = () => {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    nav.classList.add('nav-open');
    backdrop?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav-open');
    backdrop?.classList.remove('visible');
    document.body.style.overflow = '';
  };

  const toggleNav = () => {
    nav.classList.contains('nav-open') ? closeNav() : openNav();
  };

  hamburger.addEventListener('click', toggleNav);

  // Close on backdrop click
  backdrop?.addEventListener('click', closeNav);

  // Close when a nav link is clicked (mobile)
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
  });
};


/* ================================================================== */
/* 2. HEADER SCROLL EFFECT                                             */
/* ================================================================== */

const initHeaderScroll = () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on init
};


/* ================================================================== */
/* 3. ACTIVE NAV LINK                                                  */
/* ================================================================== */

const initActiveNav = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();

    // Match current page or root → index.html
    const isHome = (path === '' || path === 'index.html') && (linkPage === 'index.html' || href === '/');
    const isMatch = linkPage === path;

    if (isHome || isMatch) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
};


/* ================================================================== */
/* 4. SMOOTH SCROLL                                                    */
/* ================================================================== */

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72',
        10
      );

      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 20;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
};


/* ================================================================== */
/* 5. INTERSECTION OBSERVER — SCROLL REVEAL                            */
/* ================================================================== */

const initScrollReveal = () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
};


/* ================================================================== */
/* 6. ACCORDION (Services / Packages)                                  */
/* ================================================================== */

const initAccordion = () => {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (!accordionHeaders.length) return;

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling; // .accordion-body
      const isOpen = header.classList.contains('is-open');

      // Close all open ones first (optional behaviour: one open at a time)
      accordionHeaders.forEach(h => {
        h.classList.remove('is-open');
        h.setAttribute('aria-expanded', 'false');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('is-open');
      });

      // If previously closed, open this one
      if (!isOpen) {
        header.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        if (body) body.classList.add('is-open');
      }
    });
  });
};


/* ================================================================== */
/* 7. VEHICLE TYPE SELECTOR                                            */
/* ================================================================== */

const initVehicleSelector = () => {
  const cards = document.querySelectorAll('.vehicle-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Sync with a hidden input if present
      const vehicleInput = document.querySelector('#vehicleType');
      if (vehicleInput) {
        vehicleInput.value = card.dataset.vehicle || card.querySelector('.vehicle-card-label')?.textContent || '';
      }
    });
  });
};


/* ================================================================== */
/* 8. FORM VALIDATION                                                  */
/* ================================================================== */

/**
 * Validates a single form field.
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @param {object} rules — { required, minLength, pattern, label }
 * @returns {string|null} Error message or null if valid
 */
const validateField = (field, rules = {}) => {
  const value = field.value.trim();

  if (rules.required && !value) {
    return `${rules.label || 'This field'} is required.`;
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `${rules.label || 'This field'} must be at least ${rules.minLength} characters.`;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return rules.patternMsg || `${rules.label || 'This field'} is not valid.`;
  }

  return null;
};

/**
 * Applies or clears error state on a form group.
 * @param {HTMLElement} field
 * @param {string|null} error
 */
const setFieldState = (field, error) => {
  const group = field.closest('.form-group');
  const errorEl = group?.querySelector('.form-error-msg');

  if (error) {
    field.classList.add('field-error');
    field.classList.remove('field-success');
    if (errorEl) errorEl.textContent = error;
  } else {
    field.classList.remove('field-error');
    field.classList.add('field-success');
    if (errorEl) errorEl.textContent = '';
  }
};

/**
 * Validates all fields in a form according to a rules map.
 * @param {HTMLFormElement} form
 * @param {object} rulesMap — { fieldName: rules }
 * @returns {boolean} Whether the form is valid
 */
const validateForm = (form, rulesMap) => {
  let isValid = true;
  let firstError = null;

  Object.entries(rulesMap).forEach(([name, rules]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;

    const error = validateField(field, rules);
    setFieldState(field, error);

    if (error) {
      isValid = false;
      if (!firstError) firstError = field;
    }
  });

  // Scroll to first error field
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError.focus();
  }

  return isValid;
};

/**
 * Attaches real-time validation feedback on blur.
 * @param {HTMLFormElement} form
 * @param {object} rulesMap
 */
const attachRealtimeValidation = (form, rulesMap) => {
  Object.entries(rulesMap).forEach(([name, rules]) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (!field) return;
    field.addEventListener('blur', () => setFieldState(field, validateField(field, rules)));
    field.addEventListener('input', () => {
      if (field.classList.contains('field-error')) {
        setFieldState(field, validateField(field, rules));
      }
    });
  });
};


/* ================================================================== */
/* 9. BOOKING FORM                                                     */
/* ================================================================== */

const initBookingForm = () => {
  const form = document.querySelector('#bookingForm');
  if (!form) return;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^[\d\s\+\-\(\)]{7,20}$/;

  const rulesMap = {
    serviceType:      { required: true,  label: 'Service type' },
    vehicleType:      { required: false, label: 'Vehicle type' },
    bookingDate:      { required: true,  label: 'Preferred date' },
    bookingTime:      { required: true,  label: 'Preferred time' },
    customerName:     { required: true,  label: 'Full name', minLength: 2 },
    customerEmail:    { required: true,  label: 'Email address', pattern: EMAIL_PATTERN, patternMsg: 'Please enter a valid email address.' },
    customerPhone:    { required: true,  label: 'Phone number', pattern: PHONE_PATTERN, patternMsg: 'Please enter a valid phone number.' },
    customerAddress:  { required: true,  label: 'Service address', minLength: 5 },
  };

  attachRealtimeValidation(form, rulesMap);

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateForm(form, rulesMap)) return;

    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    // Simulate async submission then redirect
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 800);
  });

  // Conditionally show/hide vehicle type based on service category
  const serviceSelect = form.querySelector('[name="serviceType"]');
  const vehicleGroup  = form.querySelector('#vehicleGroup');

  if (serviceSelect && vehicleGroup) {
    const toggleVehicleField = () => {
      const val = serviceSelect.value;
      const isCarService = val && !val.toLowerCase().startsWith('house') && !val.toLowerCase().startsWith('cleaning');
      vehicleGroup.style.display = isCarService ? '' : 'none';
    };

    serviceSelect.addEventListener('change', toggleVehicleField);
    toggleVehicleField();
  }

  // Set min date to today
  const dateInput = form.querySelector('[name="bookingDate"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
};


/* ================================================================== */
/* 10. CONTACT FORM                                                    */
/* ================================================================== */

const initContactForm = () => {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^[\d\s\+\-\(\)]{7,20}$/;

  const rulesMap = {
    contactName:    { required: true,  label: 'Name', minLength: 2 },
    contactEmail:   { required: true,  label: 'Email', pattern: EMAIL_PATTERN, patternMsg: 'Please enter a valid email address.' },
    contactPhone:   { required: false, label: 'Phone', pattern: PHONE_PATTERN, patternMsg: 'Please enter a valid phone number.' },
    contactMessage: { required: true,  label: 'Message', minLength: 10 },
  };

  attachRealtimeValidation(form, rulesMap);

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateForm(form, rulesMap)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Simulate async and show success
    setTimeout(() => {
      const successEl = form.querySelector('.form-success');
      if (successEl) successEl.classList.add('visible');
      form.reset();
      form.querySelectorAll('.form-control').forEach(f => {
        f.classList.remove('field-success', 'field-error');
      });
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });
};


/* ================================================================== */
/* 11. HERO VIDEO FALLBACK                                             */
/* ================================================================== */

const initHeroVideo = () => {
  const videos = document.querySelectorAll('.hero-video');
  videos.forEach(video => {
    video.addEventListener('error', () => {
      // Hide video and fall back to CSS gradient background
      const wrap = video.closest('.hero-video-wrap');
      if (wrap) wrap.style.display = 'none';
    });
  });
};


/* ================================================================== */
/* 12. HERO SCROLL BUTTON                                              */
/* ================================================================== */

const initHeroScroll = () => {
  const scrollBtn = document.querySelector('.hero-scroll');
  if (!scrollBtn) return;

  scrollBtn.addEventListener('click', () => {
    // Find first non-hero section after the hero
    const hero = document.querySelector('.hero');
    const nextSection = hero?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
};


/* ================================================================== */
/* 13. COUNTER ANIMATION (Stats Bar)                                   */
/* ================================================================== */

const initCounters = () => {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const formatNumber = (n, suffix) => `${n.toLocaleString()}${suffix || ''}`;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = formatNumber(Math.floor(eased * target), suffix);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
};


/* ================================================================== */
/* 14. INIT — DOMContentLoaded                                         */
/* ================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Always-on modules
  initNavToggle();
  initHeaderScroll();
  initActiveNav();
  initSmoothScroll();
  initScrollReveal();
  initHeroVideo();
  initHeroScroll();
  initCounters();

  // Page-conditional modules (safe to call — each guards internally)
  initAccordion();
  initVehicleSelector();
  initBookingForm();
  initContactForm();
});

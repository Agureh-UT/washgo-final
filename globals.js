/**
 * Crystal Crown — globals.js
 * Single JavaScript file for all pages.
 * ES2020+ | No jQuery | No external libraries | No var
 *
 * Modules:
 *  1.  Nav
 *  2.  StickyHeader
 *  3.  ActiveNav
 *  4.  SmoothScroll
 *  5.  BackToTop
 *  6.  ScrollReveal
 *  7.  StatsCounter
 *  8.  Tabs
 *  9.  FAQ
 *  10. BeforeAfter
 *  11. Gallery (Lightbox)
 *  12. GalleryFilter
 *  13. VideoBackground
 *  14. BookingForm
 *  15. PricingCalc
 *  16. PricingView
 *  17. ContactForm
 *  18. WhatsApp
 *  19. CookieBanner
 *  20. Toast
 *  21. ThankYou
 *  22. NotifyForm
 */

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, evt, fn, opts) => el?.addEventListener(evt, fn, opts);

/* ============================================================
   1. NAV — Mobile hamburger menu
   ============================================================ */
const Nav = (() => {
  const init = () => {
    const header  = $('.header');
    const toggle  = $('.nav__toggle');
    const panel   = $('.nav__mobile-panel');
    const backdrop = $('.nav__backdrop');
    if (!toggle) return;

    const open = () => {
      header?.classList.add('nav--open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
    };

    const close = () => {
      header?.classList.remove('nav--open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    };

    const isOpen = () => header?.classList.contains('nav--open');

    on(toggle, 'click', () => (isOpen() ? close() : open()));
    on(backdrop, 'click', close);

    // Close on ESC
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // Close when a mobile link is clicked
    $$('.nav__mobile-link').forEach(link => on(link, 'click', close));
  };
  return { init };
})();

/* ============================================================
   2. STICKY HEADER — scroll shadow
   ============================================================ */
const StickyHeader = (() => {
  const init = () => {
    const header = $('.header');
    if (!header) return;

    const update = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    };

    update();
    on(window, 'scroll', update, { passive: true });
  };
  return { init };
})();

/* ============================================================
   3. ACTIVE NAV — highlight current page
   ============================================================ */
const ActiveNav = (() => {
  const init = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';

    const allLinks = $$('.nav__link, .nav__mobile-link');
    allLinks.forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop() || '';
      const isActive = href === path || (path === '' && href === 'index.html');
      if (isActive) {
        link.classList.add('nav__link--active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };
  return { init };
})();

/* ============================================================
   4. SMOOTH SCROLL — anchor links
   ============================================================ */
const SmoothScroll = (() => {
  const init = () => {
    $$('a[href^="#"]').forEach(link => {
      on(link, 'click', (e) => {
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-height'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  };
  return { init };
})();

/* ============================================================
   5. BACK TO TOP
   ============================================================ */
const BackToTop = (() => {
  const init = () => {
    const btn = $('.back-to-top');
    if (!btn) return;

    on(window, 'scroll', () => {
      btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, { passive: true });

    on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  return { init };
})();

/* ============================================================
   6. SCROLL REVEAL — Intersection Observer fade-in
   ============================================================ */
const ScrollReveal = (() => {
  const init = () => {
    const elements = $$('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  };
  return { init };
})();

/* ============================================================
   7. STATS COUNTER — animated number count-up
   ============================================================ */
const StatsCounter = (() => {
  const animateCounter = (el) => {
    const target  = parseFloat(el.dataset.target ?? el.textContent.replace(/[^\d.]/g, ''));
    const suffix  = el.dataset.suffix ?? el.textContent.replace(/[\d.]/g, '');
    const isFloat = target % 1 !== 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const update = () => {
      current = Math.min(current + increment, target);
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const init = () => {
    const items = $$('.stat-item__number');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    items.forEach(el => observer.observe(el));
  };
  return { init };
})();

/* ============================================================
   8. TABS — service/pricing category tabs
   ============================================================ */
const Tabs = (() => {
  const activateTab = (tabsEl, targetId) => {
    const btns   = $$('.tab-btn', tabsEl);
    const panels = $$('.tab-panel', tabsEl);

    btns.forEach(btn => {
      const active = btn.dataset.tab === targetId;
      btn.classList.toggle('tab-btn--active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    panels.forEach(panel => {
      panel.classList.toggle('tab-panel--active', panel.id === targetId);
    });
  };

  const init = () => {
    $$('[data-tabs]').forEach(tabsEl => {
      const btns = $$('.tab-btn', tabsEl);
      btns.forEach(btn => {
        on(btn, 'click', () => {
          const targetId = btn.dataset.tab;
          if (targetId) activateTab(tabsEl, targetId);
        });
      });

      // Activate first tab by default
      const firstBtn = btns[0];
      if (firstBtn?.dataset.tab) activateTab(tabsEl, firstBtn.dataset.tab);
    });
  };
  return { init };
})();

/* ============================================================
   9. FAQ ACCORDION
   ============================================================ */
const FAQ = (() => {
  const init = () => {
    $$('.faq-question').forEach(btn => {
      on(btn, 'click', () => {
        const item     = btn.closest('.faq-item');
        const isOpen   = item?.classList.contains('faq-item--open');
        const expanded = isOpen ? 'false' : 'true';

        // Optionally close siblings (accordion behavior)
        item?.closest('.faq-items')?.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('faq-item--open');
          i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item?.classList.add('faq-item--open');
          btn.setAttribute('aria-expanded', expanded);
        }
      });
    });
  };
  return { init };
})();

/* ============================================================
   10. BEFORE / AFTER SLIDER
   ============================================================ */
const BeforeAfter = (() => {
  const init = () => {
    const slider = $('.before-after');
    if (!slider) return;

    const after  = $('.before-after__after', slider);
    const handle = $('.before-after__handle', slider);
    if (!after || !handle) return;

    let isDragging = false;
    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      const pct  = Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left    = `${pct}%`;
    };

    // Mouse events
    on(slider, 'mousedown',  () => { isDragging = true; });
    on(document, 'mousemove', (e) => { if (isDragging) setPosition(e.clientX); });
    on(document, 'mouseup',   () => { isDragging = false; });

    // Touch events
    on(slider, 'touchstart', () => { isDragging = true; }, { passive: true });
    on(document, 'touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });
    on(document, 'touchend', () => { isDragging = false; });

    // Initialise at 50%
    setPosition(slider.getBoundingClientRect().left + slider.offsetWidth * 0.5);
  };
  return { init };
})();

/* ============================================================
   11. GALLERY — Lightbox
   ============================================================ */
const Gallery = (() => {
  let items = [];
  let currentIndex = 0;

  const openLightbox = (index) => {
    const lightbox = $('.lightbox');
    if (!lightbox) return;
    currentIndex = index;
    render(lightbox);
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    const lightbox = $('.lightbox');
    lightbox?.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  };

  const navigate = (dir) => {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    render($('.lightbox'));
  };

  const render = (lightbox) => {
    const container = $('.lightbox__media-container', lightbox);
    if (!container) return;
    const item = items[currentIndex];
    if (!item) return;

    container.innerHTML = item.dataset.video
      ? `<video class="lightbox__media" src="${item.dataset.video}" controls autoplay></video>`
      : `<img class="lightbox__media" src="${item.dataset.src ?? item.querySelector('img')?.src ?? ''}"
              alt="${item.dataset.alt ?? ''}" loading="lazy">`;
  };

  const init = () => {
    items = $$('.gallery-item');
    if (!items.length) return;

    items.forEach((item, i) => {
      on(item, 'click', () => openLightbox(i));
    });

    on($('.lightbox__close'), 'click', closeLightbox);
    on($('.lightbox__nav--prev'), 'click', () => navigate(-1));
    on($('.lightbox__nav--next'), 'click', () => navigate(1));

    on(document, 'keydown', (e) => {
      const lb = $('.lightbox');
      if (!lb?.classList.contains('lightbox--open')) return;
      if (e.key === 'Escape')   closeLightbox();
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Close on backdrop click
    on($('.lightbox'), 'click', (e) => {
      if (e.target === e.currentTarget) closeLightbox();
    });
  };
  return { init };
})();

/* ============================================================
   12. GALLERY FILTER
   ============================================================ */
const GalleryFilter = (() => {
  const init = () => {
    const filterBtns = $$('[data-filter]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      on(btn, 'click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('tab-btn--active'));
        btn.classList.add('tab-btn--active');

        $$('.gallery-item').forEach(item => {
          const tags = (item.dataset.tags ?? '').split(',').map(t => t.trim());
          item.style.display = (filter === 'all' || tags.includes(filter)) ? '' : 'none';
        });
      });
    });
  };
  return { init };
})();

/* ============================================================
   13. VIDEO BACKGROUND — ensure autoplay
   ============================================================ */
const VideoBackground = (() => {
  const init = () => {
    $$('.hero__video').forEach(video => {
      video.muted = true;
      const playAttempt = video.play();
      if (playAttempt !== undefined) {
        playAttempt.catch(() => {
          // Autoplay blocked — try on first interaction
          const unblock = () => {
            video.play();
            document.removeEventListener('click', unblock);
            document.removeEventListener('touchstart', unblock);
          };
          on(document, 'click', unblock);
          on(document, 'touchstart', unblock, { passive: true });
        });
      }
    });
  };
  return { init };
})();

/* ============================================================
   14. BOOKING FORM — multi-step with validation & price calc
   ============================================================ */
const BookingForm = (() => {
  const PRICES = {
    car: {
      exterior_wash:     { saloon: [500, 1000],   mid_suv: [700, 1200],   large: [1000, 1500] },
      waxing_polishing:  { saloon: [1200, 2000],  mid_suv: [1500, 2500],  large: [2000, 3000] },
      interior_cleaning: { saloon: [800, 1500],   mid_suv: [1000, 1800],  large: [1500, 2200] },
      steam_cleaning:    { saloon: [1500, 2500],  mid_suv: [2000, 3000],  large: [2500, 3500] },
      engine_bay:        { saloon: [1500, 3000],  mid_suv: [2000, 3500],  large: [2500, 4000] },
      full_detailing:    { saloon: [3500, 5000],  mid_suv: [4500, 6000],  large: [5500, 7500] },
    },
    house: {
      regular_clean: { studio: [1500, 2500], bedroom_1_2: [2500, 4000], bedroom_3: [4000, 6000] },
      deep_clean:    { studio: [3000, 4500], bedroom_1_2: [4500, 6500], bedroom_3: [6500, 9000] },
      move_in_out:   { studio: [3500, 5000], bedroom_1_2: [5000, 7500], bedroom_3: [7500, 11000] },
      office_clean:  { small: [2000, 4000],  medium: [4000, 7000],      large: [7000, 15000] },
    }
  };

  const serviceLabels = {
    car: {
      exterior_wash: 'Exterior Wash', waxing_polishing: 'Waxing & Polishing',
      interior_cleaning: 'Interior Cleaning', steam_cleaning: 'Steam Cleaning',
      engine_bay: 'Engine Bay Cleaning', full_detailing: 'Full Detailing Package'
    },
    house: {
      regular_clean: 'Regular Home Clean', deep_clean: 'Deep Clean',
      move_in_out: 'Move-In / Move-Out', office_clean: 'Office/Commercial'
    }
  };

  const sizeLabels = {
    car:   { saloon: 'Saloon', mid_suv: 'Medium SUV', large: 'Large SUV/Truck' },
    house: { studio: 'Studio/Bedsitter', bedroom_1_2: '1-2 Bedroom', bedroom_3: '3+ Bedroom', small: 'Small Office', medium: 'Medium Office', large: 'Large Office' }
  };

  let currentStep = 0;
  let category = 'car';
  let selectedService = '';
  let selectedSize    = '';

  const updatePrice = () => {
    const estimateEl  = $('.price-estimate__value');
    const labelEl     = $('.price-estimate__service');
    if (!estimateEl) return;

    if (!selectedService || !selectedSize) {
      estimateEl.textContent = 'Ksh —';
      return;
    }

    const range = PRICES[category]?.[selectedService]?.[selectedSize];
    if (!range) { estimateEl.textContent = 'Ksh —'; return; }
    estimateEl.textContent = `Ksh ${range[0].toLocaleString()} – ${range[1].toLocaleString()}`;
    if (labelEl) {
      labelEl.textContent = `${serviceLabels[category]?.[selectedService] ?? ''} — ${sizeLabels[category]?.[selectedSize] ?? ''}`;
    }
  };

  const populateSizeOptions = () => {
    const sizeSelect = $('#booking-size');
    if (!sizeSelect) return;
    const sizes = category === 'car'
      ? [['saloon', 'Saloon Car'], ['mid_suv', 'Medium SUV'], ['large', 'Large SUV / Truck']]
      : category === 'house' && selectedService === 'office_clean'
        ? [['small', 'Small Office (≤5 desks)'], ['medium', 'Medium Office (6-20 desks)'], ['large', 'Large Office (20+ desks)']]
        : [['studio', 'Studio / Bedsitter'], ['bedroom_1_2', '1-2 Bedroom'], ['bedroom_3', '3+ Bedroom']];

    sizeSelect.innerHTML = '<option value="">Select size...</option>';
    sizes.forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      sizeSelect.appendChild(opt);
    });
    selectedSize = '';
    updatePrice();
  };

  const populateServiceOptions = (cat) => {
    const serviceSelect = $('#booking-service');
    if (!serviceSelect) return;
    const services = cat === 'car'
      ? [
          ['exterior_wash',     'Exterior Wash'],
          ['waxing_polishing',  'Waxing & Polishing'],
          ['interior_cleaning', 'Interior Cleaning'],
          ['steam_cleaning',    'Steam Cleaning'],
          ['engine_bay',        'Engine Bay Cleaning'],
          ['full_detailing',    'Full Detailing Package'],
        ]
      : [
          ['regular_clean', 'Regular Home Clean'],
          ['deep_clean',    'Deep Clean'],
          ['move_in_out',   'Move-In / Move-Out'],
          ['office_clean',  'Office / Commercial'],
        ];

    serviceSelect.innerHTML = '<option value="">Select service...</option>';
    services.forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      serviceSelect.appendChild(opt);
    });
    selectedService = '';
    populateSizeOptions();
  };

  const validate = (step) => {
    const panels = $$('.step-panel');
    const panel  = panels[step];
    if (!panel) return true;
    let valid = true;
    $$('[required]', panel).forEach(field => {
      const err = $(`#${field.id}-error`);
      if (!field.value.trim()) {
        field.classList.add('form-input--error');
        if (err) err.textContent = 'This field is required.';
        valid = false;
      } else {
        field.classList.remove('form-input--error');
        if (err) err.textContent = '';
      }
      // Email validation
      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('form-input--error');
        if (err) err.textContent = 'Please enter a valid email address.';
        valid = false;
      }
      // Phone validation
      if (field.type === 'tel' && field.value && !/^\+?[\d\s\-()]{7,15}$/.test(field.value)) {
        field.classList.add('form-input--error');
        if (err) err.textContent = 'Please enter a valid phone number.';
        valid = false;
      }
    });
    return valid;
  };

  const goToStep = (n) => {
    const panels = $$('.step-panel');
    const steps  = $$('.booking-step');
    if (n < 0 || n >= panels.length) return;
    panels.forEach((p, i) => p.classList.toggle('step-panel--active', i === n));
    steps.forEach((s, i) => {
      s.classList.toggle('booking-step--active', i === n);
      s.classList.toggle('booking-step--done', i < n);
    });
    currentStep = n;
    // Populate summary on step 3
    if (n === 2) buildSummary();
  };

  const buildSummary = () => {
    const summary = $('#booking-summary');
    if (!summary) return;
    const categoryLabel = category === 'car' ? 'Car Detailing' : 'House Cleaning';
    const serviceLabel  = serviceLabels[category]?.[selectedService] ?? selectedService;
    const sizeLabel     = sizeLabels[category]?.[selectedSize] ?? selectedSize;
    const priceRange    = PRICES[category]?.[selectedService]?.[selectedSize];
    const priceText     = priceRange
      ? `Ksh ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}`
      : 'To be confirmed';

    summary.innerHTML = `
      <dl class="summary-list">
        <dt>Service Type</dt><dd>${categoryLabel}</dd>
        <dt>Service</dt><dd>${serviceLabel}</dd>
        <dt>Vehicle / Property Size</dt><dd>${sizeLabel}</dd>
        <dt>Date</dt><dd>${$('#booking-date')?.value ?? '—'}</dd>
        <dt>Time</dt><dd>${$('#booking-time')?.value ?? '—'}</dd>
        <dt>Name</dt><dd>${$('#booking-name')?.value ?? '—'}</dd>
        <dt>Phone</dt><dd>${$('#booking-phone')?.value ?? '—'}</dd>
        <dt>Email</dt><dd>${$('#booking-email')?.value ?? '—'}</dd>
        <dt>Location / Address</dt><dd>${$('#booking-address')?.value ?? '—'}</dd>
        <dt>Estimated Price</dt><dd><strong>${priceText}</strong></dd>
      </dl>`;
  };

  const init = () => {
    const form = $('#booking-form');
    if (!form) return;

    // Category selection
    const categorySelect = $('#booking-category');
    on(categorySelect, 'change', (e) => {
      category = e.target.value;
      populateServiceOptions(category);
    });

    // Service selection
    const serviceSelect = $('#booking-service');
    on(serviceSelect, 'change', (e) => {
      selectedService = e.target.value;
      populateSizeOptions();
    });

    // Size selection
    const sizeSelect = $('#booking-size');
    on(sizeSelect, 'change', (e) => {
      selectedSize = e.target.value;
      updatePrice();
    });

    // Initialise with car detailing
    populateServiceOptions('car');

    // Next buttons
    $$('[data-next]').forEach(btn => {
      on(btn, 'click', () => {
        if (validate(currentStep)) goToStep(currentStep + 1);
      });
    });

    // Back buttons
    $$('[data-back]').forEach(btn => {
      on(btn, 'click', () => goToStep(currentStep - 1));
    });

    // Submit
    on(form, 'submit', (e) => {
      e.preventDefault();
      if (!validate(currentStep)) return;
      const submitBtn = $('[type="submit"]', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting…';
      }
      // Simulate submission — replace with real fetch() call
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 1200);
    });

    // Initialise first step
    goToStep(0);
  };
  return { init };
})();

/* ============================================================
   15. PRICING CALCULATOR
   ============================================================ */
const PricingCalc = (() => {
  const PRICES = {
    exterior_wash:     { saloon: [500, 1000],   mid_suv: [700, 1200],   large: [1000, 1500] },
    waxing_polishing:  { saloon: [1200, 2000],  mid_suv: [1500, 2500],  large: [2000, 3000] },
    interior_cleaning: { saloon: [800, 1500],   mid_suv: [1000, 1800],  large: [1500, 2200] },
    steam_cleaning:    { saloon: [1500, 2500],  mid_suv: [2000, 3000],  large: [2500, 3500] },
    engine_bay:        { saloon: [1500, 3000],  mid_suv: [2000, 3500],  large: [2500, 4000] },
    full_detailing:    { saloon: [3500, 5000],  mid_suv: [4500, 6000],  large: [5500, 7500] },
  };

  const update = () => {
    const service = $('#calc-service')?.value;
    const vehicle = $('#calc-vehicle')?.value;
    const result  = $('#calc-result');
    if (!result) return;

    if (!service || !vehicle) {
      result.textContent = 'Select a service and vehicle type to see pricing.';
      result.className = 'price-estimate__value';
      return;
    }

    const range = PRICES[service]?.[vehicle];
    if (!range) {
      result.textContent = 'Price on request';
      return;
    }
    result.textContent = `Ksh ${range[0].toLocaleString()} – ${range[1].toLocaleString()}`;
  };

  const init = () => {
    on($('#calc-service'), 'change', update);
    on($('#calc-vehicle'), 'change', update);
  };
  return { init };
})();

/* ============================================================
   16. PRICING VIEW TOGGLE — cards ↔ table
   ============================================================ */
const PricingView = (() => {
  const init = () => {
    const btns   = $$('[data-view-toggle]');
    if (!btns.length) return;

    btns.forEach(btn => {
      on(btn, 'click', () => {
        const target = btn.dataset.viewToggle;
        btns.forEach(b => b.classList.remove('tab-btn--active'));
        btn.classList.add('tab-btn--active');
        $$('[data-view]').forEach(v => {
          v.classList.toggle('hidden', v.dataset.view !== target);
        });
      });
    });
  };
  return { init };
})();

/* ============================================================
   17. CONTACT FORM
   ============================================================ */
const ContactForm = (() => {
  const validate = (form) => {
    let valid = true;
    $$('[required]', form).forEach(field => {
      const err = $(`#${field.id}-error`);
      if (!field.value.trim()) {
        field.classList.add('form-input--error');
        if (err) err.textContent = 'This field is required.';
        valid = false;
      } else {
        field.classList.remove('form-input--error');
        if (err) err.textContent = '';
      }
      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('form-input--error');
        if (err) err.textContent = 'Please enter a valid email address.';
        valid = false;
      }
    });
    return valid;
  };

  const init = () => {
    const form = $('#contact-form');
    if (!form) return;

    on(form, 'submit', (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const btn = $('[type="submit"]', form);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Sending…';
      }
      // Simulate send
      setTimeout(() => {
        Toast.show('Message sent! We\'ll get back to you within 24 hours.', 'success');
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send Message';
        }
      }, 1000);
    });
  };
  return { init };
})();

/* ============================================================
   18. WHATSAPP WIDGET
   ============================================================ */
const WhatsApp = (() => {
  const init = () => {
    const widget  = $('.whatsapp-widget');
    const toggleBtn = $('.whatsapp-widget__toggle');
    if (!widget || !toggleBtn) return;

    on(toggleBtn, 'click', () => {
      widget.classList.toggle('whatsapp-widget--open');
    });

    // Close when clicking outside
    on(document, 'click', (e) => {
      if (!widget.contains(e.target)) {
        widget.classList.remove('whatsapp-widget--open');
      }
    });
  };
  return { init };
})();

/* ============================================================
   19. COOKIE BANNER
   ============================================================ */
const CookieBanner = (() => {
  const STORAGE_KEY = 'cc_cookie_consent';

  const init = () => {
    const banner  = $('.cookie-banner');
    if (!banner) return;

    const accepted = localStorage.getItem(STORAGE_KEY);
    if (accepted) {
      banner.classList.add('cookie-banner--hidden');
      return;
    }

    on($('.cookie-banner__accept', banner), 'click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      banner.classList.add('cookie-banner--hidden');
    });

    on($('.cookie-banner__decline', banner), 'click', () => {
      localStorage.setItem(STORAGE_KEY, 'declined');
      banner.classList.add('cookie-banner--hidden');
    });
  };
  return { init };
})();

/* ============================================================
   20. TOAST NOTIFICATIONS
   ============================================================ */
const Toast = (() => {
  const ICONS = {
    success: `<svg class="toast__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" style="color:#22c55e"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l4 4L15 6"/></svg>`,
    error:   `<svg class="toast__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" style="color:#ef4444"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6l8 8M14 6l-8 8"/></svg>`,
    info:    `<svg class="toast__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" style="color:#1a6fba"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v5M10 6h.01"/></svg>`,
    warning: `<svg class="toast__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" style="color:#f59e0b"><path stroke-linecap="round" stroke-linejoin="round" d="M10 7v4M10 14h.01M4 17h12l-6-10-6 10z"/></svg>`,
  };

  const getContainer = () => {
    let container = $('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  };

  const show = (message, type = 'info', duration = 4000) => {
    const container = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `${ICONS[type] ?? ICONS.info}<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('toast--visible'));
    });

    setTimeout(() => {
      toast.classList.remove('toast--visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  };

  return { show };
})();

/* ============================================================
   21. THANK YOU PAGE
   ============================================================ */
const ThankYou = (() => {
  const init = () => {
    const refEl       = $('#booking-ref');
    const countdownEl = $('#redirect-countdown');
    if (!refEl && !countdownEl) return;

    if (refEl) {
      refEl.textContent = 'CC-' + Date.now().toString().slice(-6);
    }

    if (countdownEl) {
      let seconds = 60;
      countdownEl.textContent = seconds;
      const interval = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(interval);
          window.location.href = 'index.html';
        }
      }, 1000);
    }
  };
  return { init };
})();

/* ============================================================
   22. NOTIFY FORM (blog coming soon)
   ============================================================ */
const NotifyForm = (() => {
  const init = () => {
    const form = $('#notify-form');
    if (!form) return;

    on(form, 'submit', (e) => {
      e.preventDefault();
      const emailInput = $('input[type="email"]', form);
      const email = emailInput?.value?.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput?.classList.add('form-input--error');
        return;
      }
      emailInput?.classList.remove('form-input--error');
      Toast.show('You\'re on the list! We\'ll notify you when the blog launches.', 'success');
      form.reset();
    });
  };
  return { init };
})();

/* ============================================================
   TESTIMONIALS CAROUSEL (homepage strip)
   ============================================================ */
const Carousel = (() => {
  const init = () => {
    const track = $('.carousel__track');
    if (!track) return;

    const cards    = $$('.carousel__item', track);
    const prevBtn  = $('.carousel__prev');
    const nextBtn  = $('.carousel__next');
    const dotsContainer = $('.carousel__dots');
    if (!cards.length) return;

    let current  = 0;
    let autoplay;

    const getVisible = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768)  return 2;
      return 1;
    };

    const totalPages = () => Math.ceil(cards.length / getVisible());

    const goTo = (n) => {
      current = ((n % totalPages()) + totalPages()) % totalPages();
      const cardWidth = track.clientWidth / getVisible();
      track.style.transform = `translateX(-${current * getVisible() * cardWidth}px)`;
      updateDots();
    };

    const updateDots = () => {
      $$('.carousel__dot', dotsContainer).forEach((dot, i) => {
        dot.classList.toggle('carousel__dot--active', i === current);
      });
    };

    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages(); i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        on(dot, 'click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
      updateDots();
    };

    const startAutoplay = () => {
      autoplay = setInterval(() => goTo(current + 1), 5000);
    };

    const stopAutoplay = () => clearInterval(autoplay);

    buildDots();
    goTo(0);
    startAutoplay();

    on(prevBtn, 'click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
    on(nextBtn, 'click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

    on(window, 'resize', () => { buildDots(); goTo(0); }, { passive: true });
  };
  return { init };
})();

/* ============================================================
   HERO SCROLL INDICATOR
   ============================================================ */
const HeroScroll = (() => {
  const init = () => {
    const indicator = $('.hero__scroll');
    if (!indicator) return;
    on(indicator, 'click', () => {
      const main = $('main section');
      main?.scrollIntoView({ behavior: 'smooth' });
    });
  };
  return { init };
})();

/* ============================================================
   INITIALISE ALL MODULES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  StickyHeader.init();
  ActiveNav.init();
  SmoothScroll.init();
  BackToTop.init();
  ScrollReveal.init();
  StatsCounter.init();
  Tabs.init();
  FAQ.init();
  BeforeAfter.init();
  Gallery.init();
  GalleryFilter.init();
  VideoBackground.init();
  BookingForm.init();
  PricingCalc.init();
  PricingView.init();
  ContactForm.init();
  WhatsApp.init();
  CookieBanner.init();
  ThankYou.init();
  NotifyForm.init();
  Carousel.init();
  HeroScroll.init();
});

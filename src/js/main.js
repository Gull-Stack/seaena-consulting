// Seaena Consulting - Main JavaScript
// Vanilla JS for navigation, mobile menu, FAQ accordions, and scroll effects

(function() {
  'use strict';

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');

      // Prevent body scroll when menu is open
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-toggle')) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Dropdown Menu Toggle (for mobile)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);

        const dropdownMenu = this.nextElementSibling;
        if (dropdownMenu) {
          dropdownMenu.style.display = isExpanded ? 'none' : 'block';
        }
      }
    });
  });

  // Header Scroll Effect
  const header = document.querySelector('.site-header');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other FAQs (optional - remove if you want multiple open)
      faqQuestions.forEach(q => {
        if (q !== this) {
          q.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current FAQ
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form Submission Handler (placeholder - integrate with your backend)
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      console.log('Form submitted:', data);

      // TODO: Integrate with your form handling service
      // For now, show a placeholder message
      alert('Thank you for your interest! We will contact you within 24 hours.');

      // Reset form
      this.reset();

      // Fire GA4 event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
          form_name: 'contact_form'
        });
      }
    });
  }

  // Scroll Depth Tracking (for analytics)
  let scrollMarks = { 25: false, 50: false, 75: false, 100: false };

  function trackScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const scrollPercent = (scrolled / documentHeight) * 100;

    Object.keys(scrollMarks).forEach(mark => {
      if (scrollPercent >= parseInt(mark) && !scrollMarks[mark]) {
        scrollMarks[mark] = true;
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll_depth', {
            percent: mark
          });
        }
      }
    });
  }

  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(trackScrollDepth);
  });

  // Handle window resize for mobile menu
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      mainNav.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      // Reset dropdown displays
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.display = '';
      });
    }
  });

})();

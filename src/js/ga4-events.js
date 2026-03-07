// Seaena Consulting - GA4 Event Tracking
// Tracks phone clicks, email clicks, CTA clicks, and form submissions

(function() {
  'use strict';

  // Helper function to send GA4 events
  function sendGA4Event(eventName, eventParams) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventParams);
    }
  }

  // Track Phone Link Clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      const phoneNumber = this.getAttribute('href').replace('tel:', '');
      sendGA4Event('phone_click', {
        phone_number: phoneNumber,
        link_text: this.textContent.trim()
      });
    });
  });

  // Track Email Link Clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', function() {
      const emailAddress = this.getAttribute('href').replace('mailto:', '');
      sendGA4Event('email_click', {
        email_address: emailAddress,
        link_text: this.textContent.trim()
      });
    });
  });

  // Track CTA Button Clicks
  const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Don't track if it's a form submit button
      if (this.type === 'submit') return;

      sendGA4Event('cta_click', {
        button_text: this.textContent.trim(),
        button_location: getButtonLocation(this),
        destination_url: this.getAttribute('href') || 'unknown'
      });
    });
  });

  // Helper function to identify button location on page
  function getButtonLocation(element) {
    // Check if button is in hero section
    if (element.closest('.hero')) return 'hero';
    if (element.closest('.cta-section')) return 'cta_section';
    if (element.closest('.card')) return 'card';
    if (element.closest('header')) return 'header';
    if (element.closest('footer')) return 'footer';
    return 'content';
  }

  // Track Service Page Views
  const currentPath = window.location.pathname;
  if (currentPath.includes('/services/')) {
    const serviceName = currentPath.split('/services/')[1]?.replace('/', '') || 'unknown';
    sendGA4Event('service_view', {
      service_name: serviceName
    });
  }

  // Track Outbound Link Clicks
  const outboundLinks = document.querySelectorAll('a[href^="http"]');
  outboundLinks.forEach(link => {
    // Only track external links (not same domain)
    if (!link.href.includes(window.location.hostname)) {
      link.addEventListener('click', function() {
        sendGA4Event('outbound_click', {
          destination_url: this.href,
          link_text: this.textContent.trim()
        });
      });
    }
  });

  // Track Social Link Clicks
  const socialLinks = document.querySelectorAll('.social-links a');
  socialLinks.forEach(link => {
    link.addEventListener('click', function() {
      const platform = getSocialPlatform(this.href);
      sendGA4Event('social_click', {
        platform: platform,
        location: 'footer'
      });
    });
  });

  // Helper function to identify social platform
  function getSocialPlatform(url) {
    if (url.includes('linkedin.com')) return 'linkedin';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('instagram.com')) return 'instagram';
    return 'other';
  }

  // Track Case Study Views
  if (currentPath === '/case-studies/') {
    sendGA4Event('page_view_special', {
      page_type: 'case_studies'
    });
  }

  // Track Guide/Content Views
  if (currentPath.includes('/guides/')) {
    const guideName = currentPath.split('/guides/')[1]?.replace('/', '') || 'unknown';
    sendGA4Event('guide_view', {
      guide_name: guideName
    });
  }

  // Track FAQ Interactions
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const questionText = this.textContent.trim().replace(/▼/g, '').trim();
      const isExpanding = this.getAttribute('aria-expanded') !== 'true';

      if (isExpanding) {
        sendGA4Event('faq_interaction', {
          question: questionText.substring(0, 100), // Limit length
          action: 'expand'
        });
      }
    });
  });

  // Track Time on Page (send event after 30 seconds)
  setTimeout(function() {
    sendGA4Event('engaged_user', {
      engagement_time: '30_seconds'
    });
  }, 30000);

  // Track Time on Page (send event after 60 seconds)
  setTimeout(function() {
    sendGA4Event('engaged_user', {
      engagement_time: '60_seconds'
    });
  }, 60000);

})();

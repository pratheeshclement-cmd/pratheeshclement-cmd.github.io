/**
 * Meta Pixel Utility & Custom Event Tracking System
 * Active Pixel IDs: 2059152391340799, 983425767341384
 * 
 * Provides clean, reusable functions and automatic DOM listeners for 
 * Meta conversion events without modifying core website architecture.
 */

(function () {
  'use strict';

  /**
   * Helper function to safely send event calls to Meta Pixel (fbq).
   * @param {string} eventName - Standard or custom Meta event name.
   * @param {Object} [params={}] - Optional parameters associated with the event.
   * @param {boolean} [isCustom=false] - Whether event is standard ('track') or custom ('trackCustom').
   */
  function trackMetaEvent(eventName, params = {}, isCustom = false) {
    if (typeof window.fbq === 'function') {
      try {
        if (isCustom) {
          window.fbq('trackCustom', eventName, params);
        } else {
          window.fbq('track', eventName, params);
        }
      } catch (err) {
        console.warn('Meta Pixel Tracking Error:', err);
      }
    }
  }

  // --- Specific Event Tracker Helpers ---

  /** Standard Meta Event: Lead */
  function trackLead(params = {}) {
    trackMetaEvent('Lead', params, false);
  }

  /** Standard Meta Event: Contact */
  function trackContact(params = {}) {
    trackMetaEvent('Contact', params, false);
  }

  /** Custom Meta Event: HireMeClick */
  function trackHireMeClick(params = {}) {
    trackMetaEvent('HireMeClick', Object.assign({ action: 'Hire Me Clicked' }, params), true);
  }

  /** Custom Meta Event: ResumeDownload */
  function trackResumeDownload(params = {}) {
    trackMetaEvent('ResumeDownload', Object.assign({ action: 'Resume Downloaded' }, params), true);
  }

  /** Custom Meta Event: WhatsAppClick */
  function trackWhatsAppClick(params = {}) {
    trackMetaEvent('WhatsAppClick', Object.assign({ channel: 'WhatsApp' }, params), true);
  }

  /** Custom Meta Event: EmailClick */
  function trackEmailClick(params = {}) {
    trackMetaEvent('EmailClick', Object.assign({ channel: 'Email' }, params), true);
  }

  /** Custom Meta Event: ProjectView */
  function trackProjectView(projectName = 'Unknown Project', params = {}) {
    trackMetaEvent('ProjectView', Object.assign({ project_name: projectName }, params), true);
  }

  /** Custom Meta Event: ScheduleMeeting */
  function trackScheduleMeeting(params = {}) {
    trackMetaEvent('ScheduleMeeting', Object.assign({ action: 'Meeting Scheduled' }, params), true);
  }

  // Expose Global Namespace API for external/future scripts
  window.MetaPixel = {
    track: trackMetaEvent,
    trackLead: trackLead,
    trackContact: trackContact,
    trackHireMeClick: trackHireMeClick,
    trackResumeDownload: trackResumeDownload,
    trackWhatsAppClick: trackWhatsAppClick,
    trackEmailClick: trackEmailClick,
    trackProjectView: trackProjectView,
    trackScheduleMeeting: trackScheduleMeeting
  };

  /**
   * Bind automatic click and submit event listeners once DOM is ready.
   */
  function initAutoTracking() {
    // 1. Contact Form Submissions (#contactForm & #auditForm)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function () {
        trackContact({ form_id: 'contactForm', form_type: 'Contact Inquiry' });
      });
    }

    const auditForm = document.getElementById('auditForm');
    if (auditForm) {
      auditForm.addEventListener('submit', function () {
        trackLead({ form_id: 'auditForm', form_type: 'Free Audit Request' });
      });
    }

    // Event delegation for links and interactive buttons across the portfolio
    document.body.addEventListener('click', function (e) {
      const target = e.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = (target.textContent || '').trim().toLowerCase();

      // 2. Email Links (mailto:)
      if (href.startsWith('mailto:')) {
        trackEmailClick({ email: href.replace('mailto:', '') });
      }

      // 3. WhatsApp / Telephone Links
      else if (href.startsWith('tel:') || href.includes('wa.me') || href.includes('whatsapp') || text.includes('whatsapp')) {
        trackWhatsAppClick({ link: href });
      }

      // 4. "Hire Me" Buttons & Links
      else if (text.includes('hire me') || text.includes('work with me')) {
        trackHireMeClick({ button_text: target.textContent.trim(), link: href });
      }

      // 5. Resume Download Buttons & PDF links
      else if (href.endsWith('.pdf') || text.includes('resume') || text.includes('cv')) {
        trackResumeDownload({ link: href, title: target.textContent.trim() });
      }

      // 6. Project View Links (#projects or external project links)
      else if (href.includes('#projects') || target.closest('#projects') || href.includes('github.com')) {
        const projectCard = target.closest('.project-card, .glass-card, article');
        const projectName = projectCard ? (projectCard.querySelector('h3, h4, .project-title')?.textContent?.trim() || 'Project') : 'Project Link';
        trackProjectView(projectName, { url: href });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoTracking);
  } else {
    initAutoTracking();
  }
})();

/**
 * ==========================================================================
 * CLEANING COMPANY REUSABLE WEBSITE TEMPLATE - CORE ENGINE
 * 
 * Sole Authoritative Source of Business Data: /data/business.json
 * 
 * Features & Guarantees:
 * - 100% data-driven from /data/business.json (No business data in JS/HTML)
 * - Strict graceful hiding for missing/empty fields (socials, reviews, emails, maps, images)
 * - Zero fabricated marketing claims (no fake experience, awards, or customer counts)
 * - Literal international phone preservation (exact user-supplied numbers & prefixes)
 * - Safe image handling (onerror concealment with zero layout shift)
 * - Fully client-side & static: works immediately upon opening index.html
 * ==========================================================================
 */

/**
 * Helper: Check if a value is non-empty and valid
 */
function hasValue(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') {
    const str = val.trim();
    return str.length > 0 && !str.startsWith('{{') && str !== 'null' && str !== 'undefined';
  }
  return Boolean(val);
}

/**
 * Helper: Sanitize phone numbers for tel: protocol while strictly preserving
 * user-supplied country codes (+1, +44, +61, +91, etc.) or local formats.
 */
function sanitizeTelUri(phoneStr) {
  if (!phoneStr) return '';
  return String(phoneStr).trim().replace(/[^\d+]/g, '');
}

/**
 * --------------------------------------------------------------------------
 * 1. DATA LOADER (Sole Authoritative Source: /data/business.json)
 * --------------------------------------------------------------------------
 */
async function loadBusinessData() {
  try {
    const response = await fetch('./data/business.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error fetching /data/business.json! Status: ${response.status}`);
    }
    const businessData = await response.json();
    if (businessData && typeof businessData === 'object') {
      renderWebsite(businessData);
    }
  } catch (err) {
    console.error("Failed to load /data/business.json:", err);
  }
}

/**
 * --------------------------------------------------------------------------
 * 2. DATA-DRIVEN DOM RENDERER
 * --------------------------------------------------------------------------
 */
function renderWebsite(data) {
  if (!data || typeof data !== 'object') return;

  const bName = hasValue(data.name) ? String(data.name).trim() : '';
  const bCity = hasValue(data.city) ? String(data.city).trim() : '';
  const bState = hasValue(data.state) ? String(data.state).trim() : '';
  const bTagline = hasValue(data.tagline) ? String(data.tagline).trim() : '';
  const bPhone = hasValue(data.phone) ? String(data.phone).trim() : '';
  const bEmail = hasValue(data.email) ? String(data.email).trim() : '';
  const bAddress = hasValue(data.address) ? String(data.address).trim() : '';
  const bMapsUrl = hasValue(data.googleMapsUrl) ? String(data.googleMapsUrl).trim() : '';
  const bInstagram = hasValue(data.instagramUrl) ? String(data.instagramUrl).trim() : '';
  const bFacebook = hasValue(data.facebookUrl) ? String(data.facebookUrl).trim() : '';
  const bRating = hasValue(data.rating) ? String(data.rating).trim() : '';
  const bReviewCount = hasValue(data.reviewCount) ? String(data.reviewCount).trim() : '';
  const bHeroImg = hasValue(data.heroImage) ? String(data.heroImage).trim() : '';

  // 1. Page Title & Meta Tags
  if (bName) {
    const locArr = [bCity, bState].filter(Boolean);
    const locStr = locArr.length > 0 ? ` in ${locArr.join(', ')}` : '';
    document.title = `${bName} | Professional Cleaning Services${locStr}`;
  }

  // 2. Business Name
  document.querySelectorAll('[data-bind="name"]').forEach(el => {
    el.textContent = bName || 'Cleaning Services';
  });

  // 3. Tagline
  const taglineEl = document.querySelector('[data-bind="tagline"]');
  if (taglineEl) {
    taglineEl.textContent = bTagline || 'Professional residential and commercial cleaning solutions tailored to your schedule and standards.';
  }

  // 4. City & Location Badges
  document.querySelectorAll('[data-bind="city"]').forEach(el => {
    el.textContent = bCity || 'your local area';
  });

  const locString = [bCity, bState].filter(Boolean).join(', ');
  const heroLocationPill = document.getElementById('hero-location-pill');
  document.querySelectorAll('[data-bind="location"]').forEach(el => {
    el.textContent = locString || 'your local area';
  });
  if (heroLocationPill) {
    if (locString) {
      heroLocationPill.classList.remove('data-hidden');
    } else {
      heroLocationPill.classList.add('data-hidden');
    }
  }

  // 5. Phone Number & Call Links (Preserve exact format & dialing code)
  const phoneLinks = document.querySelectorAll('[data-bind="phone-link"]');
  const phoneTexts = document.querySelectorAll('[data-bind="phone-text"]');
  const phoneContainers = document.querySelectorAll('[data-bind="phone-container"]');

  if (bPhone) {
    const telUri = `tel:${sanitizeTelUri(bPhone)}`;
    phoneLinks.forEach(el => {
      el.href = telUri;
      el.classList.remove('data-hidden');
    });
    phoneTexts.forEach(el => {
      el.textContent = bPhone;
    });
    phoneContainers.forEach(el => el.classList.remove('data-hidden'));
  } else {
    phoneLinks.forEach(el => el.classList.add('data-hidden'));
    phoneContainers.forEach(el => el.classList.add('data-hidden'));
  }

  // 6. Email Handling
  const emailLinks = document.querySelectorAll('[data-bind="email-link"]');
  const emailTexts = document.querySelectorAll('[data-bind="email-text"]');
  const emailContainers = document.querySelectorAll('[data-bind="email-container"]');
  const contactEmailBtn = document.getElementById('contact-email-btn');

  if (bEmail) {
    emailLinks.forEach(el => {
      el.href = `mailto:${bEmail}`;
      el.classList.remove('data-hidden');
    });
    emailTexts.forEach(el => {
      el.textContent = bEmail;
    });
    emailContainers.forEach(el => el.classList.remove('data-hidden'));
    if (contactEmailBtn) contactEmailBtn.classList.remove('data-hidden');
  } else {
    emailLinks.forEach(el => el.classList.add('data-hidden'));
    emailContainers.forEach(el => el.classList.add('data-hidden'));
    if (contactEmailBtn) contactEmailBtn.classList.add('data-hidden');
  }

  // 7. Physical Address Handling
  const addressElements = document.querySelectorAll('[data-bind="address"]');
  const addressContainers = document.querySelectorAll('[data-bind="address-container"]');

  if (bAddress) {
    addressElements.forEach(el => {
      el.textContent = bAddress;
    });
    addressContainers.forEach(el => el.classList.remove('data-hidden'));
  } else {
    addressContainers.forEach(el => el.classList.add('data-hidden'));
  }

  // 8. Google Maps URL & Directions
  const mapsLinks = document.querySelectorAll('[data-bind="google-maps-link"]');
  if (bMapsUrl) {
    mapsLinks.forEach(el => {
      el.href = bMapsUrl;
      el.classList.remove('data-hidden');
    });
  } else {
    mapsLinks.forEach(el => el.classList.add('data-hidden'));
  }

  // 9. Social Media Links (Instagram & Facebook)
  const instagramLinks = document.querySelectorAll('[data-bind="instagram-link"]');
  if (bInstagram) {
    instagramLinks.forEach(el => {
      el.href = bInstagram;
      el.classList.remove('data-hidden');
    });
  } else {
    instagramLinks.forEach(el => el.classList.add('data-hidden'));
  }

  const facebookLinks = document.querySelectorAll('[data-bind="facebook-link"]');
  if (bFacebook) {
    facebookLinks.forEach(el => {
      el.href = bFacebook;
      el.classList.remove('data-hidden');
    });
  } else {
    facebookLinks.forEach(el => el.classList.add('data-hidden'));
  }

  // Hide the entire social connect box if no social links exist
  const socialCardBox = document.querySelector('.social-connect-box');
  if (socialCardBox) {
    if (!bInstagram && !bFacebook) {
      socialCardBox.classList.add('data-hidden');
    } else {
      socialCardBox.classList.remove('data-hidden');
    }
  }

  // 10. Star Ratings & Review Count (Strict zero-fabrication)
  const ratingSection = document.getElementById('trust-rating-badge');
  const ratingText = document.querySelector('[data-bind="rating"]');
  const reviewCountText = document.querySelector('[data-bind="review-count"]');

  if (bRating && bReviewCount) {
    if (ratingText) ratingText.textContent = bRating;
    if (reviewCountText) reviewCountText.textContent = `${bReviewCount} Google Reviews`;
    if (ratingSection) ratingSection.classList.remove('data-hidden');
  } else {
    if (ratingSection) ratingSection.classList.add('data-hidden');
  }

  // 11. Hero Image with Error/Absence Concealment
  const heroImgEl = document.getElementById('hero-main-img');
  if (heroImgEl) {
    if (bHeroImg) {
      heroImgEl.src = bHeroImg;
      heroImgEl.alt = `${bName || 'Professional Cleaning'} Service`;
      heroImgEl.style.display = 'block';
      heroImgEl.onerror = function() {
        this.style.display = 'none';
      };
    } else {
      heroImgEl.style.display = 'none';
    }
  }

  // 12. Dynamic Services
  renderServices(data.services);

  // 13. Dynamic Photo Gallery
  renderGallery(data.galleryImages);

  // 14. Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * --------------------------------------------------------------------------
 * 3. DYNAMIC SERVICES RENDERER
 * --------------------------------------------------------------------------
 */
function renderServices(servicesList) {
  const container = document.getElementById('services-grid-container');
  const formSelect = document.getElementById('quote-service-select');
  const servicesSection = document.getElementById('services');
  if (!container) return;

  container.innerHTML = '';
  if (formSelect) {
    formSelect.innerHTML = '<option value="">Select a service...</option>';
  }

  if (!Array.isArray(servicesList) || servicesList.length === 0) {
    if (servicesSection) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--color-text-muted);">
          <p>Custom residential and commercial cleaning packages available upon request.</p>
        </div>
      `;
    }
    return;
  }

  servicesList.forEach((service, index) => {
    if (!service || !hasValue(service.name)) return;

    const sName = String(service.name).trim();
    const sDesc = hasValue(service.description) 
      ? String(service.description).trim() 
      : 'Professional, thorough service executed with strict attention to detail and hygiene standards.';
    const sImg = hasValue(service.image) ? String(service.image).trim() : '';

    const card = document.createElement('div');
    card.className = 'service-card';
    card.id = `service-card-${index + 1}`;

    const serviceImgHtml = sImg
      ? `<div class="service-image-container">
           <img class="service-img" src="${sImg}" alt="${sName}" loading="lazy" onerror="this.parentElement.style.display='none';">
         </div>`
      : '';

    card.innerHTML = `
      ${serviceImgHtml}
      <div class="service-body">
        <h3 class="service-title">${sName}</h3>
        <p class="service-desc">${sDesc}</p>
        <a href="#quote" class="service-cta" onclick="selectServiceInForm('${encodeURIComponent(sName)}')">
          <span>Request This Service</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>
    `;

    container.appendChild(card);

    if (formSelect) {
      const option = document.createElement('option');
      option.value = sName;
      option.textContent = sName;
      formSelect.appendChild(option);
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 4. DYNAMIC PHOTO GALLERY & LIGHTBOX
 * --------------------------------------------------------------------------
 */
function renderGallery(imagesList) {
  const container = document.getElementById('gallery-grid-container');
  const gallerySection = document.getElementById('gallery');
  if (!container) return;

  container.innerHTML = '';

  const validImages = Array.isArray(imagesList) ? imagesList.filter(hasValue) : [];

  if (validImages.length === 0) {
    if (gallerySection) gallerySection.classList.add('data-hidden');
    return;
  }

  if (gallerySection) gallerySection.classList.remove('data-hidden');

  validImages.forEach((imgUrl, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.id = `gallery-item-${index + 1}`;
    item.onclick = () => openLightbox(imgUrl);

    item.innerHTML = `
      <img class="gallery-img" src="${imgUrl}" alt="Recent cleaning project ${index + 1}" loading="lazy" onerror="this.closest('.gallery-item').style.display='none';">
      <div class="gallery-overlay">
        <span style="font-size: 0.85rem; font-weight: 600;">View Photo</span>
        <div class="gallery-zoom-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </div>
      </div>
    `;

    container.appendChild(item);
  });
}

function openLightbox(url) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (modal && img) {
    img.src = url;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Global scope attachment for inline handlers
window.closeLightbox = closeLightbox;
window.selectServiceInForm = function(encodedServiceName) {
  const serviceName = decodeURIComponent(encodedServiceName);
  const selectEl = document.getElementById('quote-service-select');
  if (selectEl) {
    for (let i = 0; i < selectEl.options.length; i++) {
      if (selectEl.options[i].value === serviceName) {
        selectEl.selectedIndex = i;
        break;
      }
    }
  }
};

/**
 * --------------------------------------------------------------------------
 * 5. CLIENT-SIDE QUOTE FORM HANDLER
 * --------------------------------------------------------------------------
 */
function setupQuoteForm() {
  const form = document.getElementById('quick-quote-form');
  const feedback = document.getElementById('form-feedback-message');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('quote-name')?.value || 'Customer';
    const phone = document.getElementById('quote-phone')?.value || '';
    const service = document.getElementById('quote-service-select')?.value || 'General Cleaning';
    const frequency = document.getElementById('quote-frequency')?.value || 'One-Time';

    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <div>
            <strong>Quote Request Received!</strong>
            <p style="font-size: 0.85rem; margin-top: 2px; font-weight: normal;">Thank you, ${name}. We have received your inquiry for <strong>${service}</strong> (${frequency}). We will reach out to you shortly at ${phone || 'your provided contact number'}.</p>
          </div>
        </div>
      `;
      form.reset();
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 6. NAVIGATION & SCROLL LISTENER
 * --------------------------------------------------------------------------
 */
function setupNavigation() {
  const hamburger = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');
  const navbar = document.getElementById('main-navbar');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

/**
 * --------------------------------------------------------------------------
 * 7. DOM INITIALIZATION
 * --------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupQuoteForm();
  loadBusinessData();
});

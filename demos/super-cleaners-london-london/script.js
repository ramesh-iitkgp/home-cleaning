/**
 * ============================================================================
 * AGENCY-GRADE HOME CLEANING WEBSITE TEMPLATE ENGINE
 * Authoritative data-driven rendering, interactive before/after slider,
 * photo gallery lightbox, dynamic SEO & multi-business profile switcher.
 * ============================================================================
 */

(function () {
  'use strict';

  // State
  let currentBusinessData = null;
  let currentBeforeAfterIndex = 0;
  let currentGalleryIndex = 0;
  let galleryImageUrls = [];

  /**
   * ==========================================================================
   * CURATED HIGH-RESOLUTION GENERIC / DEFAULT ASSETS
   * Safe, verified Unsplash cleaning photos used whenever customer photos
   * or logos are not provided or fail to load.
   * ==========================================================================
   */
  const GENERIC_ASSETS = {
    // Hero: Bright, sunlit, impeccably clean living interior with sparkling shine
    hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    
    // Service category-specific defaults
    serviceDefaults: {
      regular: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      deep: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      tenancy: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      commercial: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
      kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      bathroom: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
      carpet: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
      general: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
    },

    // Gallery: 6 diverse, high-standard spotless cleaning results
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', // Sparkling Living
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', // Polished Kitchen
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80', // Luxury Bathroom
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80', // Spotless Bedroom/Lounge
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80', // Corporate Commercial
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'  // Detailed Hardwood Restoration
    ]
  };

  /**
   * ==========================================================================
   * 4 FIXED SPECIFIC TRANSFORMATIONS (PROVEN TRANSFORMATIONS SECTION)
   * Permanent, curated, high-impact transformations with authentic before (dirty/shabby)
   * and after (spotless/perfect) photos. Not subject to customer placeholder overrides.
   * ==========================================================================
   */
  const FIXED_TRANSFORMATIONS = [
    {
      id: 'kitchen',
      badge: 'Kitchen Restoration',
      title: "Kitchen Degreasing & Stovetop Restoration",
      description: "Removal of heavy grease splatter, burnt stovetop carbon, stained backsplash tile, and messy clutter.",
      before: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=80",
      after: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      beforeStats: "Heavy grease, clutter & grime",
      afterStats: "100% Degreased & showroom shine"
    },
    {
      id: 'bathroom',
      badge: 'Bathroom Descaling',
      title: "Bathroom Limescale & Tile Grout Descaling",
      description: "Deep chemical-free acid descaling of stubborn limescale, soap scum, dull fixtures, and discolored grout.",
      before: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
      after: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
      beforeStats: "Limescale, scum & dull tiles",
      afterStats: "Mirror polished & disinfected"
    },
    {
      id: 'living',
      badge: 'Floor & Room Polish',
      title: "Living Room Declutter & Deep Floor Polish",
      description: "Complete dust extraction, hardwood rejuvenation, carpet vacuuming, streak removal, and tidy organization.",
      before: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      beforeStats: "Dust, scattered items & scuffs",
      afterStats: "Pristine, gleaming & fresh"
    },
    {
      id: 'appliance',
      badge: 'Oven & Appliance Grime',
      title: "Appliance & Oven Carbon Grime Removal",
      description: "Intensive degreasing and polishing of baked-on food residue, oven racks, and glass to showroom standards.",
      before: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80",
      after: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80",
      beforeStats: "Baked carbon & burnt spills",
      afterStats: "Streak-free mirror finish"
    }
  ];

  /**
   * Helper: Build direct WhatsApp click-to-chat URL
   */
  function getWhatsAppUrl(data) {
    if (!data) return '';
    const phoneSource = (data.whatsapp || data.phone || '').trim();
    const cleanDigits = phoneSource.replace(/[^0-9]/g, '');
    if (!cleanDigits) return '';
    const msg = encodeURIComponent(`Hello ${data.name || 'Cleaning Team'}, I would like to inquire about your cleaning services.`);
    return `https://wa.me/${cleanDigits}?text=${msg}`;
  }

  /**
   * Helper: Match service name to appropriate default photo
   */
  function getServiceFallbackImage(serviceName, index) {
    if (!serviceName) return GENERIC_ASSETS.serviceDefaults.general;
    const lower = serviceName.toLowerCase();
    if (lower.includes('kitchen') || lower.includes('oven') || lower.includes('appliance')) {
      return GENERIC_ASSETS.serviceDefaults.kitchen;
    }
    if (lower.includes('bath') || lower.includes('grout') || lower.includes('tile')) {
      return GENERIC_ASSETS.serviceDefaults.bathroom;
    }
    if (lower.includes('regular') || lower.includes('maid') || lower.includes('routine') || lower.includes('domestic')) {
      return GENERIC_ASSETS.serviceDefaults.regular;
    }
    if (lower.includes('deep') || lower.includes('intensive') || lower.includes('spring')) {
      return GENERIC_ASSETS.serviceDefaults.deep;
    }
    if (lower.includes('tenancy') || lower.includes('move') || lower.includes('turnover') || lower.includes('lease')) {
      return GENERIC_ASSETS.serviceDefaults.tenancy;
    }
    if (lower.includes('office') || lower.includes('commercial') || lower.includes('business') || lower.includes('janitorial')) {
      return GENERIC_ASSETS.serviceDefaults.commercial;
    }
    if (lower.includes('carpet') || lower.includes('rug') || lower.includes('upholstery')) {
      return GENERIC_ASSETS.serviceDefaults.carpet;
    }
    const galleryFallbacks = GENERIC_ASSETS.gallery;
    return galleryFallbacks[index % galleryFallbacks.length] || GENERIC_ASSETS.serviceDefaults.general;
  }

  // Logos, icons and profile images are never eligible for photographic placements.
  function imageKey(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return `${parsed.origin}${parsed.pathname}`.toLowerCase();
    } catch (_) {
      return String(url || '').trim().toLowerCase();
    }
  }

  function isLikelyPhotoUrl(url, logoUrl = '') {
    if (typeof url !== 'string' || !url.trim()) return false;
    if (imageKey(url) === imageKey(logoUrl)) return false;
    return !/(logo|favicon|icon|avatar|profile|transparent|\.svg(?:$|[?#]))/i.test(url);
  }

  function uniquePhotoUrls(urls, logoUrl = '') {
    const seen = new Set();
    return (Array.isArray(urls) ? urls : []).filter(url => {
      if (!isLikelyPhotoUrl(url, logoUrl)) return false;
      const key = imageKey(url);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function setImageWithFallback(img, candidates, fallback, onExhausted, minimumSize) {
    const queue = [...new Set(candidates.filter(Boolean))];
    let index = 0;
    const next = () => {
      if (index < queue.length) {
        img.src = queue[index++];
      } else if (fallback && imageKey(img.src) !== imageKey(fallback)) {
        img.src = fallback;
      } else {
        img.removeAttribute('src');
        img.closest('.gallery-item, .service-card, .hero-visual-box')?.classList.add('image-unavailable');
        if (typeof onExhausted === 'function') onExhausted();
      }
    };
    img.onerror = next;
    img.onload = () => {
      if (minimumSize && (img.naturalWidth < minimumSize.width || img.naturalHeight < minimumSize.height)) {
        next();
      }
    };
    next();
  }

  /**
   * Safe data accessor supporting both snake_case and camelCase
   */
  function normalizeData(raw) {
    if (!raw) return {};
    return {
      name: raw.business_name || raw.name || 'Professional Cleaning Services',
      tagline: raw.tagline || 'High Standard Residential & Commercial Cleaning You Can Trust',
      category: raw.category || 'Home & Commercial Cleaning',
      city: raw.city || '',
      state: raw.state || '',
      country: raw.country || '',
      address: raw.address || '',
      phone: raw.phone || '',
      whatsapp: (raw.whatsapp || raw.whats_app || raw.phone || '').trim(),
      email: raw.email || '',
      openingHours: raw.opening_hours || raw.openingHours || '',
      rating: raw.rating ? String(raw.rating) : '',
      reviewCount: raw.review_count || raw.reviewCount ? String(raw.review_count || raw.reviewCount) : '',
      logoUrl: (raw.logo_url || raw.logoUrl || '').trim(),
      heroImage: (raw.hero_image || raw.heroImage || '').trim(),
      googleMapsUrl: raw.google_maps_url || raw.googleMapsUrl || '',
      serviceAreas: Array.isArray(raw.service_areas) ? raw.service_areas : (Array.isArray(raw.serviceAreas) ? raw.serviceAreas : []),
      social: raw.social || {
        instagram: raw.instagramUrl || '',
        facebook: raw.facebookUrl || '',
        tiktok: raw.tiktokUrl || ''
      },
      beforeAfterPairs: Array.isArray(raw.before_after_pairs)
        ? raw.before_after_pairs
        : (Array.isArray(raw.beforeAfterPairs) ? raw.beforeAfterPairs : []),
      services: Array.isArray(raw.services) ? raw.services : [],
      businessImages: Array.isArray(raw.business_images) && raw.business_images.length > 0
        ? raw.business_images 
        : (Array.isArray(raw.galleryImages) && raw.galleryImages.length > 0 ? raw.galleryImages : []),
      reviews: Array.isArray(raw.reviews) ? raw.reviews : []
    };
  }

  /**
   * Main initialization
   */
  async function init() {
    setupMobileNav();
    setupDemoSwitcher();
    setupQuoteForm();
    setupLightboxEvents();
    
    // Load authoritative data from data/business.json (relative path for subdirectories)
    try {
      const response = await fetch('./data/business.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const rawData = await response.json();
      renderWebsite(rawData);
    } catch (err) {
      console.warn('Could not fetch ./data/business.json, using baseline profile:', err);
      renderWebsite(DEMO_PRESETS['london']);
    }
  }

  /**
   * Master Render Function
   */
  function renderWebsite(rawData) {
    const data = normalizeData(rawData);
    currentBusinessData = data;

    // 1. Dynamic SEO & Meta Tags
    updateSEO(data);

    // 2. Navigation & Brand Logo (Customer logo if provided, otherwise generic logo)
    renderHeader(data);

    // 3. Hero Section (Customer hero photo if provided, otherwise default hero photo)
    renderHero(data);

    // 4. Trust / Social Proof Bar
    renderTrustBar(data);

    // 5. Before & After Cleaning Section (Ugly Before vs Perfect After)
    renderBeforeAfterSection(data);

    // 6. Services Grid (Customer service photos if provided, otherwise categorized defaults)
    renderServices(data);

    // 7. Why Choose Business Name
    renderWhyChoose(data);

    // 8. Photo Gallery (Customer photos if provided, otherwise curated defaults)
    renderGallery(data);

    // 9. Reviews / Testimonials
    renderReviews(data);

    // 10. Service Areas
    renderServiceAreas(data);

    // 11. Quote / Contact Card
    renderContact(data);

    // 12. Final CTA Section
    renderFinalCTA(data);

    // 13. Footer
    renderFooter(data);

    // 14. Mobile Sticky Bar
    renderMobileStickyBar(data);
  }

  /**
   * 1. Dynamic SEO & Meta
   */
  function updateSEO(data) {
    const pageTitle = data.city 
      ? `${data.name} | Professional Cleaning Services in ${data.city}`
      : `${data.name} | Professional Cleaning Services`;
    
    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    const description = `${data.tagline}. Trusted ${data.category.toLowerCase()} in ${data.city || 'your area'}. Get a free quote today.`;
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', isLikelyPhotoUrl(data.heroImage, data.logoUrl) ? data.heroImage : (uniquePhotoUrls(data.businessImages, data.logoUrl)[0] || GENERIC_ASSETS.hero));

    // Dynamic Schema.org JSON-LD LocalBusiness / CleaningService
    let schemaScript = document.getElementById('schema-json-ld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-json-ld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "CleaningService",
      "name": data.name,
      "description": data.tagline,
      "telephone": data.phone || undefined,
      "email": data.email || undefined,
      "address": data.address ? {
        "@type": "PostalAddress",
        "streetAddress": data.address,
        "addressLocality": data.city,
        "addressCountry": data.country
      } : undefined
    };
    schemaScript.textContent = JSON.stringify(schemaObj, null, 2);
  }

  /**
   * Helper: Generate Generic Logo Badge SVG
   */
  function getGenericLogoBadgeHTML() {
    return `
      <div class="brand-fallback-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M19 17v4"/>
          <path d="M3 5h4"/>
          <path d="M17 19h4"/>
        </svg>
      </div>
    `;
  }

  /**
   * 2. Header & Logo
   * Requirement: If customer has logo -> load in placeholder; otherwise generic logo maintained.
   */
  function renderHeader(data) {
    const brandNameEls = document.querySelectorAll('[data-bind="name"]');
    brandNameEls.forEach(el => el.textContent = data.name);

    const logoContainer = document.getElementById('nav-logo-container');
    const brandFallback = document.getElementById('nav-brand-fallback');
    const brandSubtext = document.getElementById('nav-brand-subtext');

    if (brandSubtext) {
      brandSubtext.textContent = data.city ? `Cleaning • ${data.city}` : 'Cleaning Services';
    }

    if (logoContainer && brandFallback) {
      if (data.logoUrl && data.logoUrl !== '') {
        // Customer has a custom logo
        logoContainer.style.display = 'block';
        logoContainer.innerHTML = `
          <img src="${data.logoUrl}" 
               alt="${data.name} Logo" 
               class="brand-logo-img" 
               onerror="this.style.display='none'; document.getElementById('nav-brand-fallback').style.display='flex';" />
        `;
        brandFallback.style.display = 'none';
      } else {
        // Maintain generic logo
        logoContainer.innerHTML = '';
        logoContainer.style.display = 'none';
        brandFallback.style.display = 'flex';
      }
    }

    // Phone Call CTA in Header
    const navPhoneBtn = document.getElementById('nav-phone-btn');
    const navPhoneText = document.getElementById('nav-phone-text');
    if (navPhoneBtn) {
      if (data.phone && data.phone.trim() !== '') {
        navPhoneBtn.classList.remove('data-hidden');
        navPhoneBtn.href = `tel:${data.phone.replace(/\s+/g, '')}`;
        if (navPhoneText) navPhoneText.textContent = data.phone;
      } else {
        navPhoneBtn.classList.add('data-hidden');
      }
    }

    // WhatsApp CTA in Header
    const navWhatsAppBtn = document.getElementById('nav-whatsapp-btn');
    const waUrl = getWhatsAppUrl(data);
    if (navWhatsAppBtn) {
      if (waUrl) {
        navWhatsAppBtn.classList.remove('data-hidden');
        navWhatsAppBtn.href = waUrl;
      } else {
        navWhatsAppBtn.classList.add('data-hidden');
      }
    }
  }

  /**
   * 3. Hero Section
   * Requirement: Customer's photo if provided, otherwise generic/default photo.
   */
  function renderHero(data) {
    const heroTitleName = document.getElementById('hero-brand-name');
    if (heroTitleName) heroTitleName.textContent = data.name;

    const heroCitySubtitle = document.getElementById('hero-city-subtitle');
    if (heroCitySubtitle) {
      heroCitySubtitle.textContent = data.city 
        ? `in ${data.city}` 
        : '';
    }

    const heroTagline = document.getElementById('hero-tagline');
    if (heroTagline) heroTagline.textContent = data.tagline;

    // Location Pill
    const heroLocationPill = document.getElementById('hero-location-pill');
    const heroLocationText = document.getElementById('hero-location-text');
    if (heroLocationPill && heroLocationText) {
      if (data.city && data.city.trim() !== '') {
        heroLocationPill.classList.remove('data-hidden');
        heroLocationText.textContent = `Serving ${data.city} & Nearby Areas`;
      } else {
        heroLocationPill.classList.add('data-hidden');
      }
    }

    // Rating Pill in Hero
    const heroRatingPill = document.getElementById('hero-rating-pill');
    const heroRatingScore = document.getElementById('hero-rating-score');
    if (heroRatingPill && heroRatingScore) {
      if (data.rating && data.rating.trim() !== '') {
        heroRatingPill.classList.remove('data-hidden');
        heroRatingScore.textContent = `${data.rating} ★ Top Rated Cleaners`;
      } else {
        heroRatingPill.classList.add('data-hidden');
      }
    }

    // Hero Call CTA Button
    const heroCallBtn = document.getElementById('hero-call-btn');
    const heroCallText = document.getElementById('hero-call-text');
    if (heroCallBtn) {
      if (data.phone && data.phone.trim() !== '') {
        heroCallBtn.classList.remove('data-hidden');
        heroCallBtn.href = `tel:${data.phone.replace(/\s+/g, '')}`;
        if (heroCallText) heroCallText.textContent = `Call ${data.phone}`;
      } else {
        heroCallBtn.classList.add('data-hidden');
      }
    }

    // Hero image priority: valid customer hero, then customer gallery, then category fallback.
    const heroImg = document.getElementById('hero-main-img');
    if (heroImg) {
      heroImg.alt = `${data.name} Professional Cleaning`;
      const customerPhotos = uniquePhotoUrls(data.businessImages, data.logoUrl);
      const candidates = [
        ...(isLikelyPhotoUrl(data.heroImage, data.logoUrl) ? [data.heroImage] : []),
        ...customerPhotos
      ];
      setImageWithFallback(heroImg, candidates, GENERIC_ASSETS.hero, null, { width: 480, height: 320 });
    }
  }

  /**
   * 4. Trust / Social Proof Bar
   */
  function renderTrustBar(data) {
    const trustRatingScore = document.getElementById('trust-rating-score');
    const trustReviewCount = document.getElementById('trust-review-count');
    const trustServingCity = document.getElementById('trust-serving-city');
    const trustMapsBtn = document.getElementById('trust-maps-btn');

    if (trustRatingScore && trustReviewCount) {
      if (data.rating && data.rating.trim() !== '') {
        trustRatingScore.textContent = data.rating;
        trustReviewCount.textContent = data.reviewCount 
          ? `Based on ${data.reviewCount} verified reviews`
          : 'Verified Client Rating';
      } else {
        document.getElementById('trust-rating-box')?.classList.add('data-hidden');
      }
    }

    if (trustServingCity) {
      trustServingCity.textContent = data.city || 'your area';
    }

    if (trustMapsBtn) {
      if (data.googleMapsUrl && data.googleMapsUrl.trim() !== '') {
        trustMapsBtn.classList.remove('data-hidden');
        trustMapsBtn.href = data.googleMapsUrl;
      } else {
        trustMapsBtn.classList.add('data-hidden');
      }
    }
  }

  /**
   * 5. Before & After Cleaning Section
   * Requirement: All 4 sections have fixed, specific meaningful pictures (dirty before vs perfect after).
   */
  function renderBeforeAfterSection(data) {
    const baSection = document.getElementById('before-after-section');
    const baTabsContainer = document.getElementById('ba-tabs-container');
    const baSliderInput = document.getElementById('ba-slider-input');
    const baViewport = document.getElementById('ba-viewport');
    const baBeforeWrapper = document.getElementById('ba-before-wrapper');
    const baHandle = document.getElementById('ba-handle');

    const pairs = (data.beforeAfterPairs || []).filter(pair =>
      isLikelyPhotoUrl(pair?.before, data.logoUrl) && isLikelyPhotoUrl(pair?.after, data.logoUrl)
    );

    if (!pairs.length) {
      if (baSection) baSection.classList.add('data-hidden');
      return;
    }
    if (baSection) baSection.classList.remove('data-hidden');
    currentBeforeAfterIndex = 0;

    // Render Tab Switchers with distinctive icons
    if (baTabsContainer) {
      const tabIcons = {
        'kitchen': '🍳',
        'bathroom': '🚿',
        'living': '🛋️',
        'appliance': '♨️'
      };

      baTabsContainer.innerHTML = pairs.map((pair, idx) => `
        <button type="button" class="ba-tab-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <span style="font-size: 1.1em; margin-right: 4px;">${tabIcons[pair.id] || '✨'}</span>
          <span>${pair.badge || pair.title}</span>
        </button>
      `).join('');

      baTabsContainer.querySelectorAll('.ba-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          switchBeforeAfterItem(idx, pairs);
        });
      });
    }

    // Load First Transformation
    updateBeforeAfterDisplay(pairs[0], 0);

    // Setup Slider Dragging
    if (baSliderInput && baBeforeWrapper && baHandle) {
      baSliderInput.value = 50;
      updateSliderPosition(50);

      baSliderInput.addEventListener('input', (e) => {
        updateSliderPosition(e.target.value);
      });
    }

    // Support direct touch/click on viewport
    if (baViewport && baSliderInput) {
      let isDragging = false;

      const handlePointerMove = (e) => {
        if (!isDragging && e.type !== 'click') return;
        const rect = baViewport.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        baSliderInput.value = percent;
        updateSliderPosition(percent);
      };

      baViewport.addEventListener('mousedown', (e) => {
        isDragging = true;
        handlePointerMove(e);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging) handlePointerMove(e);
      });

      baViewport.addEventListener('touchstart', (e) => {
        isDragging = true;
        handlePointerMove(e);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });

      window.addEventListener('touchmove', (e) => {
        if (isDragging) handlePointerMove(e);
      }, { passive: true });
    }
  }

  function switchBeforeAfterItem(idx, pairs) {
    currentBeforeAfterIndex = idx;
    document.querySelectorAll('.ba-tab-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });
    updateBeforeAfterDisplay(pairs[idx], idx);
  }

  function updateBeforeAfterDisplay(pair, idx) {
    if (!pair) return;
    const baSection = document.getElementById('before-after-section');
    const baBeforeImg = document.getElementById('ba-before-img');
    const baAfterImg = document.getElementById('ba-after-img');
    const baTitle = document.getElementById('ba-item-title');
    const baDesc = document.getElementById('ba-item-desc');
    const baBeforeStats = document.getElementById('ba-before-stats');
    const baAfterStats = document.getElementById('ba-after-stats');

    if (baBeforeImg) {
      baBeforeImg.alt = `Dirty messy uncleaned state of ${pair.title}`;
      baBeforeImg.src = pair.before;
      baBeforeImg.onerror = () => baSection?.classList.add('data-hidden');
    }

    if (baAfterImg) {
      baAfterImg.alt = `Spotless gleaming pristine state of ${pair.title}`;
      baAfterImg.src = pair.after;
      baAfterImg.onerror = () => baSection?.classList.add('data-hidden');
    }

    if (baTitle) baTitle.textContent = pair.title || 'Cleaning Transformation';
    if (baDesc) baDesc.textContent = pair.description || 'Thorough degreasing, sanitization, and restorative surface perfection.';

    if (baBeforeStats) {
      baBeforeStats.textContent = pair.beforeStats || 'Heavy grease, dust, clutter & stubborn stains';
    }
    if (baAfterStats) {
      baAfterStats.textContent = pair.afterStats || '100% Spotless, disinfected & showroom shine';
    }
  }

  function updateSliderPosition(val) {
    const baBeforeWrapper = document.getElementById('ba-before-wrapper');
    const baHandle = document.getElementById('ba-handle');
    if (baBeforeWrapper) baBeforeWrapper.style.width = `${val}%`;
    if (baHandle) baHandle.style.left = `${val}%`;
  }

  /**
   * 6. Services Grid
   * Requirement: Customer's photo if provided, otherwise generic default photo.
   */
  function renderServices(data) {
    const container = document.getElementById('services-grid-container');
    const servicesNameHeading = document.getElementById('services-brand-heading');
    if (servicesNameHeading) servicesNameHeading.textContent = data.name;

    if (!container) return;

    if (!data.services || data.services.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Custom cleaning packages available upon request.</p>`;
      return;
    }

    container.innerHTML = data.services.map((service, index) => {
      // If customer has a photo, use it; otherwise get category-matching generic fallback
      const defaultImg = getServiceFallbackImage(service.name, index);
      const customerPhotos = uniquePhotoUrls(data.businessImages, data.logoUrl);
      const serviceImage = isLikelyPhotoUrl(service.image, data.logoUrl) ? service.image : '';
      const imgSrc = serviceImage || customerPhotos[index % customerPhotos.length] || defaultImg;

      return `
        <div class="service-card" id="service-card-${index}">
          <div class="service-img-wrapper">
            <img src="${imgSrc}" 
                 alt="${service.name}" 
                 class="service-img" 
                 loading="lazy" 
                 data-fallback="${defaultImg}" />
          </div>
          <div class="service-card-body">
            <h3 class="service-title">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            <a href="#quote" class="service-cta-link" onclick="selectServiceInForm('${service.name.replace(/'/g, "\\'")}')">
              <span>Request this service</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.service-img').forEach((img, index) => {
      const servicePhotos = uniquePhotoUrls(data.businessImages, data.logoUrl);
      setImageWithFallback(img, [img.src, ...servicePhotos.filter(url => imageKey(url) !== imageKey(img.src))], img.dataset.fallback || getServiceFallbackImage('', index));
    });

    // Populate Quote Form Service Select
    const quoteServiceSelect = document.getElementById('quote-service-select');
    if (quoteServiceSelect) {
      quoteServiceSelect.innerHTML = '<option value="">Select a service type...</option>' + 
        data.services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }
  }

  /**
   * 7. Why Choose [Business Name]
   */
  function renderWhyChoose(data) {
    const whyBrandHeading = document.getElementById('why-brand-heading');
    if (whyBrandHeading) whyBrandHeading.textContent = data.name;

    const cityPlaceholders = document.querySelectorAll('[data-bind="city"]');
    cityPlaceholders.forEach(el => el.textContent = data.city || 'your local community');
  }

  /**
   * 8. Photo Gallery & Lightbox
   * Requirement: Customer's photos if provided, otherwise generic default photos.
   */
  function renderGallery(data) {
    const container = document.getElementById('gallery-grid-container');
    const galleryBrandName = document.getElementById('gallery-brand-name');
    if (galleryBrandName) galleryBrandName.textContent = data.name;

    if (!container) return;

    // Prefer the customer's usable photos. Generic imagery appears only when none exist.
    const customerImages = uniquePhotoUrls(data.businessImages, data.logoUrl);
    const images = customerImages.length ? customerImages.slice(0, 12) : GENERIC_ASSETS.gallery;

    galleryImageUrls = images;

    container.innerHTML = images.map((imgUrl, idx) => {
      const fallbackUrl = GENERIC_ASSETS.gallery[idx % GENERIC_ASSETS.gallery.length];
      return `
        <div class="gallery-item" onclick="openLightbox(${idx})">
          <img src="${imgUrl}" 
               alt="Spotless cleaning results by ${data.name}" 
               loading="lazy" 
               data-fallback="${fallbackUrl}" />
          <div class="gallery-overlay">
            <span style="font-weight: 700; font-size: 0.85rem;">${data.name} Spotless Quality</span>
            <div class="gallery-zoom-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.gallery-item img').forEach((img, idx) => {
      const alternatives = images.filter(url => imageKey(url) !== imageKey(img.src));
      setImageWithFallback(img, [img.src, ...alternatives], img.dataset.fallback, () => {
        const item = img.closest('.gallery-item');
        item?.remove();
        galleryImageUrls = [...container.querySelectorAll('.gallery-item img')].map(node => node.currentSrc || node.src).filter(Boolean);
      });
    });
  }

  /**
   * 9. Reviews / Testimonials
   */
  function renderReviews(data) {
    const reviewsSection = document.getElementById('reviews-section');
    const reviewsContainer = document.getElementById('reviews-grid-container');
    const reviewsBrandHeading = document.getElementById('reviews-brand-heading');

    if (reviewsBrandHeading) reviewsBrandHeading.textContent = data.name;

    if (!data.reviews || data.reviews.length === 0) {
      if (reviewsSection) reviewsSection.classList.add('data-hidden');
      return;
    }

    if (reviewsSection) reviewsSection.classList.remove('data-hidden');

    if (reviewsContainer) {
      reviewsContainer.innerHTML = data.reviews.map(rev => `
        <div class="review-card">
          <div class="review-stars">
            ${Array.from({ length: rev.rating || 5 }).map(() => `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            `).join('')}
          </div>
          <p class="review-text">"${rev.text}"</p>
          <div class="review-author-row">
            <span class="review-author-name">${rev.author || 'Verified Client'}</span>
            <span class="review-badge">${rev.source || 'Review'}${rev.date ? ` · ${rev.date}` : ''}</span>
          </div>
        </div>
      `).join('');
    }
  }

  /**
   * 10. Service Areas
   */
  function renderServiceAreas(data) {
    const bar = document.getElementById('service-areas-bar');
    const container = document.getElementById('service-areas-pills');
    const title = document.getElementById('service-areas-heading');

    if (!data.serviceAreas || data.serviceAreas.length === 0) {
      if (bar) bar.classList.add('data-hidden');
      return;
    }

    if (bar) bar.classList.remove('data-hidden');
    if (title) title.textContent = `Areas We Serve in ${data.city || 'Your Region'}`;

    if (container) {
      container.innerHTML = data.serviceAreas.map(area => `
        <span class="service-area-pill">${area}</span>
      `).join('');
    }
  }

  /**
   * 11. Contact & Socials
   */
  function renderContact(data) {
    // Phone
    const phoneContainer = document.getElementById('contact-phone-container');
    const phoneVal = document.getElementById('contact-phone-val');
    const phoneLink = document.getElementById('contact-phone-link');
    if (data.phone && data.phone.trim() !== '') {
      if (phoneContainer) phoneContainer.classList.remove('data-hidden');
      if (phoneVal) phoneVal.textContent = data.phone;
      if (phoneLink) phoneLink.href = `tel:${data.phone.replace(/\s+/g, '')}`;
    } else {
      if (phoneContainer) phoneContainer.classList.add('data-hidden');
    }

    // WhatsApp
    const whatsappContainer = document.getElementById('contact-whatsapp-container');
    const whatsappLink = document.getElementById('contact-whatsapp-link');
    const waUrl = getWhatsAppUrl(data);
    if (whatsappContainer) {
      if (waUrl) {
        whatsappContainer.classList.remove('data-hidden');
        if (whatsappLink) whatsappLink.href = waUrl;
      } else {
        whatsappContainer.classList.add('data-hidden');
      }
    }

    // Email
    const emailContainer = document.getElementById('contact-email-container');
    const emailVal = document.getElementById('contact-email-val');
    const emailLink = document.getElementById('contact-email-link');
    if (data.email && data.email.trim() !== '') {
      if (emailContainer) emailContainer.classList.remove('data-hidden');
      if (emailVal) emailVal.textContent = data.email;
      if (emailLink) emailLink.href = `mailto:${data.email}`;
    } else {
      if (emailContainer) emailContainer.classList.add('data-hidden');
    }

    // Address
    const addrContainer = document.getElementById('contact-address-container');
    const addrVal = document.getElementById('contact-address-val');
    if (data.address && data.address.trim() !== '') {
      if (addrContainer) addrContainer.classList.remove('data-hidden');
      if (addrVal) addrVal.textContent = data.address;
    } else {
      if (addrContainer) addrContainer.classList.add('data-hidden');
    }

    // Opening Hours
    const hoursContainer = document.getElementById('contact-hours-container');
    const hoursVal = document.getElementById('contact-hours-val');
    if (data.openingHours && data.openingHours.trim() !== '') {
      if (hoursContainer) hoursContainer.classList.remove('data-hidden');
      if (hoursVal) hoursVal.textContent = data.openingHours;
    } else {
      if (hoursContainer) hoursContainer.classList.add('data-hidden');
    }

    // Socials
    const socialInstagram = document.getElementById('contact-social-instagram');
    const socialFacebook = document.getElementById('contact-social-facebook');
    const socialTiktok = document.getElementById('contact-social-tiktok');
    const socialMaps = document.getElementById('contact-social-maps');

    if (socialInstagram) {
      if (data.social.instagram) {
        socialInstagram.classList.remove('data-hidden');
        socialInstagram.href = data.social.instagram;
      } else {
        socialInstagram.classList.add('data-hidden');
      }
    }

    if (socialFacebook) {
      if (data.social.facebook) {
        socialFacebook.classList.remove('data-hidden');
        socialFacebook.href = data.social.facebook;
      } else {
        socialFacebook.classList.add('data-hidden');
      }
    }

    if (socialTiktok) {
      if (data.social.tiktok) {
        socialTiktok.classList.remove('data-hidden');
        socialTiktok.href = data.social.tiktok;
      } else {
        socialTiktok.classList.add('data-hidden');
      }
    }

    if (socialMaps) {
      if (data.googleMapsUrl) {
        socialMaps.classList.remove('data-hidden');
        socialMaps.href = data.googleMapsUrl;
      } else {
        socialMaps.classList.add('data-hidden');
      }
    }
  }

  /**
   * 12. Final CTA Section
   */
  function renderFinalCTA(data) {
    const ctaBrandName = document.getElementById('final-cta-brand-name');
    if (ctaBrandName) ctaBrandName.textContent = data.name;

    const ctaCallBtn = document.getElementById('final-cta-call-btn');
    const ctaCallText = document.getElementById('final-cta-call-text');
    if (ctaCallBtn) {
      if (data.phone && data.phone.trim() !== '') {
        ctaCallBtn.classList.remove('data-hidden');
        ctaCallBtn.href = `tel:${data.phone.replace(/\s+/g, '')}`;
        if (ctaCallText) ctaCallText.textContent = `Call ${data.name}`;
      } else {
        ctaCallBtn.classList.add('data-hidden');
      }
    }
  }

  /**
   * 13. Footer
   */
  function renderFooter(data) {
    const footerBrandName = document.getElementById('footer-brand-name');
    if (footerBrandName) footerBrandName.textContent = data.name;

    const footerTagline = document.getElementById('footer-tagline');
    if (footerTagline) footerTagline.textContent = data.tagline;

    const footerCity = document.getElementById('footer-city-text');
    if (footerCity) footerCity.textContent = data.city || 'your area';

    // Footer Logo Handling
    const footerLogoContainer = document.getElementById('footer-logo-container');
    const footerFallbackBadge = document.getElementById('footer-brand-fallback');
    if (footerLogoContainer && footerFallbackBadge) {
      if (data.logoUrl && data.logoUrl !== '') {
        footerLogoContainer.style.display = 'block';
        footerLogoContainer.innerHTML = `
          <img src="${data.logoUrl}" 
               alt="${data.name} Logo" 
               class="brand-logo-img footer-logo-img" 
               onerror="this.style.display='none'; document.getElementById('footer-brand-fallback').style.display='flex';" />
        `;
        footerFallbackBadge.style.display = 'none';
      } else {
        footerLogoContainer.innerHTML = '';
        footerLogoContainer.style.display = 'none';
        footerFallbackBadge.style.display = 'flex';
      }
    }

    const footerPhone = document.getElementById('footer-phone-link');
    if (footerPhone) {
      if (data.phone) {
        footerPhone.href = `tel:${data.phone.replace(/\s+/g, '')}`;
        footerPhone.textContent = data.phone;
        document.getElementById('footer-phone-container')?.classList.remove('data-hidden');
      } else {
        document.getElementById('footer-phone-container')?.classList.add('data-hidden');
      }
    }

    const footerEmail = document.getElementById('footer-email-link');
    if (footerEmail) {
      if (data.email) {
        footerEmail.href = `mailto:${data.email}`;
        footerEmail.textContent = data.email;
        document.getElementById('footer-email-container')?.classList.remove('data-hidden');
      } else {
        document.getElementById('footer-email-container')?.classList.add('data-hidden');
      }
    }

    const footerAddr = document.getElementById('footer-address-val');
    if (footerAddr) {
      if (data.address) {
        footerAddr.textContent = data.address;
        document.getElementById('footer-address-container')?.classList.remove('data-hidden');
      } else {
        document.getElementById('footer-address-container')?.classList.add('data-hidden');
      }
    }

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  }

  /**
   * 14. Mobile Sticky Bottom Action Bar
   */
  function renderMobileStickyBar(data) {
    const callBtn = document.getElementById('mobile-sticky-call-btn');
    if (callBtn) {
      if (data.phone && data.phone.trim() !== '') {
        callBtn.classList.remove('data-hidden');
        callBtn.href = `tel:${data.phone.replace(/\s+/g, '')}`;
      } else {
        callBtn.classList.add('data-hidden');
      }
    }
  }

  /**
   * Helper: Select service in quote form from service cards
   */
  window.selectServiceInForm = function (serviceName) {
    const select = document.getElementById('quote-service-select');
    if (select) {
      select.value = serviceName;
    }
  };

  /**
   * Setup Mobile Hamburger Navigation
   */
  function setupMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      drawer.classList.toggle('open', !isOpen);
      menuBtn.classList.toggle('active', !isOpen);
      menuBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * Setup Quote Form Interaction
   */
  function setupQuoteForm() {
    const form = document.getElementById('quote-booking-form');
    const feedback = document.getElementById('quote-form-feedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('quote-name');
      const name = nameInput ? nameInput.value : 'Customer';

      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = `
          <strong>Thank you, ${name}!</strong> Your cleaning quote request has been received. 
          The team at <strong>${currentBusinessData?.name || 'our office'}</strong> will contact you promptly with tailored pricing.
        `;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    });
  }

  /**
   * Lightbox handlers
   */
  window.openLightbox = function (index) {
    currentGalleryIndex = index;
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img && galleryImageUrls[index]) {
      img.src = galleryImageUrls[index];
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function () {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.navigateLightbox = function (dir) {
    if (!galleryImageUrls || galleryImageUrls.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + dir + galleryImageUrls.length) % galleryImageUrls.length;
    const img = document.getElementById('lightbox-img');
    if (img) {
      img.src = galleryImageUrls[currentGalleryIndex];
    }
  };

  function setupLightboxEvents() {
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('lightbox-modal');
      if (modal && modal.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      }
    });
  }

  /**
   * DEMO BUSINESS PRESETS (Tests custom logo vs generic logo & custom photos vs defaults)
   */
  const DEMO_PRESETS = {
    'london': {
      "business_name": "Super Cleaners London",
      "tagline": "Premium Residential & Commercial Cleaning Services in London",
      "category": "Residential & Commercial Cleaning",
      "phone": "+44 20 7946 0912",
      "email": "contact@supercleanerslondon.co.uk",
      "address": "45 Baker Street, Marylebone, London W1U 8ED",
      "city": "London",
      "state": "Greater London",
      "country": "United Kingdom",
      "opening_hours": "Mon - Sat: 8:00 AM - 7:00 PM",
      "rating": "4.9",
      "review_count": "148",
      "google_maps_url": "https://maps.google.com/?q=London+UK",
      "logo_url": "", // No customer logo -> Generic logo maintained
      "hero_image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
      "service_areas": ["Marylebone", "Westminster", "Kensington", "Camden", "Islington", "Mayfair", "Battersea"],
      "social": {
        "instagram": "https://instagram.com/supercleanerslondon",
        "facebook": "https://facebook.com/supercleanerslondon"
      },
      "before_after_pairs": [
        {
          "title": "Kitchen Degreasing & Deep Sanitization",
          "description": "Removal of heavy grease buildup, stovetop carbon, stained backsplash, and clutter.",
          "before": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=80",
          "after": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
        },
        {
          "title": "Bathroom Limescale & Tile Grout Descaling",
          "description": "Deep chemical-free acid descaling of stubborn limescale, soap scum, and discolored grout.",
          "before": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
          "after": "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80"
        }
      ],
      "services": [
        { "name": "Regular Home Cleaning", "description": "Routine housekeeping tailored on weekly or bi-weekly schedules.", "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" },
        { "name": "Intensive Deep Cleaning", "description": "Detailed top-to-bottom scrub reaching behind appliances and deep corners.", "image": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80" },
        { "name": "End of Tenancy Cleaning", "description": "Guaranteed deposit-standard handover cleaning for tenants & estate agents.", "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
        { "name": "Office & Commercial Cleaning", "description": "High-standard janitorial maintenance for professional workspaces.", "image": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80" }
      ],
      "business_images": [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      ],
      "reviews": [
        { "author": "Victoria Sterling", "rating": 5, "text": "Super Cleaners London did an exceptional job on our 4-bedroom flat in Marylebone.", "source": "Google Review" },
        { "author": "James Harrington", "rating": 5, "text": "We booked their deep clean before listing our apartment. Flawless attention to detail.", "source": "Google Review" }
      ]
    },
    'manchester': {
      "business_name": "Manchester House Cleaning Services",
      "tagline": "Trusted Housekeeping & Domestic Cleaners in Greater Manchester",
      "category": "Domestic House Cleaning",
      "phone": "+44 161 496 0834",
      "email": "hello@manchestercleaning.co.uk",
      "address": "12 Deansgate, Manchester M3 2BW",
      "city": "Manchester",
      "state": "Greater Manchester",
      "country": "United Kingdom",
      "opening_hours": "Mon - Fri: 7:30 AM - 6:30 PM",
      "rating": "4.8",
      "review_count": "96",
      "google_maps_url": "https://maps.google.com/?q=Manchester+UK",
      "logo_url": "", // No customer logo -> Generic logo maintained
      "hero_image": "", // Empty hero photo -> Generic hero fallback photo loaded
      "service_areas": ["Deansgate", "Salford", "Didsbury", "Chorlton", "Altrincham", "Stockport"],
      "social": {
        "facebook": "https://facebook.com/manchesterhouseclean"
      },
      "before_after_pairs": [
        {
          "title": "Family Home Deep Floor Scrub",
          "description": "Restoring high-traffic hardwood and tile floors to spotless condition.",
          "before": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
          "after": "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80"
        }
      ],
      "services": [
        { "name": "Weekly Maid Service", "description": "Reliable weekly domestic housekeeping for busy families.", "image": "" }, // Empty -> Category fallback loaded
        { "name": "Deep Appliance & Kitchen Scrub", "description": "Oven, fridge, cabinets, and extractor hood degreasing.", "image": "" },
        { "name": "Post-Renovation Cleaning", "description": "Complete fine dust elimination after home building works.", "image": "" }
      ],
      "business_images": [], // Empty -> Curated generic gallery loaded
      "reviews": [
        { "author": "Liam Gallagher", "rating": 5, "text": "Manchester House Cleaning has been taking care of our home in Didsbury for months. Top class!", "source": "Google Review" }
      ]
    },
    'chicago': {
      "business_name": "Chicago Clean Home",
      "tagline": "Eco-Friendly Apartment & Residential Cleaning in Chicagoland",
      "category": "Eco-Friendly Cleaning",
      "phone": "+1 (312) 555-0199",
      "email": "service@chicagocleanhome.com",
      "address": "333 N Michigan Ave, Chicago, IL 60601",
      "city": "Chicago",
      "state": "Illinois",
      "country": "USA",
      "opening_hours": "Mon - Sun: 8:00 AM - 8:00 PM",
      "rating": "4.95",
      "review_count": "210",
      "google_maps_url": "https://maps.google.com/?q=Chicago+IL",
      // Customer has a custom logo loaded in placeholder
      "logo_url": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='40' viewBox='0 0 160 40'><rect width='160' height='40' rx='8' fill='%23059669'/><text x='14' y='25' fill='white' font-family='sans-serif' font-weight='800' font-size='14'>CHICAGO CLEAN</text></svg>",
      "hero_image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "service_areas": ["The Loop", "Lincoln Park", "Wicker Park", "Lakeview", "River North", "West Loop"],
      "social": {
        "instagram": "https://instagram.com/chicagocleanhome",
        "facebook": "https://facebook.com/chicagocleanhome"
      },
      "before_after_pairs": [
        {
          "title": "Apartment Move-Out Turnover",
          "description": "Full detailed scrub ensuring complete safety deposit return.",
          "before": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
          "after": "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80"
        }
      ],
      "services": [
        { "name": "Eco-Friendly House Cleaning", "description": "Non-toxic, pet-safe, plant-based cleaning solutions.", "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
        { "name": "Apartment & Condo Turnover", "description": "Specialized fast turnarounds for high-rise condos and leases.", "image": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80" },
        { "name": "Deep Sanitization Scrub", "description": "HEPA-filter vacuuming, tile steaming, and antimicrobial wipedowns.", "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" }
      ],
      "business_images": [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80"
      ],
      "reviews": [
        { "author": "Marcus Brody", "rating": 5, "text": "Chicago Clean Home is the best cleaning service we've used in River North. Flawless every single time.", "source": "Google Review" }
      ]
    }
  };

  /**
   * Setup Demo Business Switcher
   */
  function setupDemoSwitcher() {
    const btn = document.getElementById('demo-switcher-btn');
    const modal = document.getElementById('demo-switcher-modal');
    const closeBtn = document.getElementById('demo-modal-close');

    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
      modal.classList.add('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    document.querySelectorAll('.demo-preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-preset');
        document.querySelectorAll('.demo-preset-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        modal.classList.remove('open');

        if (key === 'live') {
          fetch('./data/business.json', { cache: 'no-cache' })
            .then(res => res.json())
            .then(data => renderWebsite(data))
            .catch(() => renderWebsite(DEMO_PRESETS['london']));
        } else if (DEMO_PRESETS[key]) {
          renderWebsite(DEMO_PRESETS[key]);
        }
      });
    });
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

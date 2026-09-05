// WebKartX Home Cleaning (PristinePro) Dynamic Engine
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/business.json");
    if (!res.ok) throw new Error("Could not load business.json");
    const data = await res.json();
    renderBusinessDataClean(data);
  } catch (err) {
    console.warn("Using default Cleaning data:", err);
  }

  // Initialize Interactive Estimate Calculator
  initCleaningCalculator();

  // Initialize Single Viewport Before & After Slider
  initBeforeAfterSlider();

  // Handle Demo Form Submission
  const demoForm = document.getElementById("clean-quote-form");
  if (demoForm) {
    demoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modal = document.getElementById("demo-modal-clean");
      if (modal) {
        modal.style.display = "flex";
      } else {
        alert("Demo Estimate Requested! In your live production website, inquiries are automatically routed to your business inbox.");
      }
      demoForm.reset();
    });
  }
});

function renderBusinessDataClean(data) {
  if (!data) return;

  const bName = data.business_name || data.canonical_name || "Sparkle & Shine Cleaning";
  const city = data.city || "Dallas";
  const phone = (data.phone || data.whatsapp || "").trim();
  const cleanPhone = phone.replace(/\D/g, "");
  const email = (data.email || "").trim();
  const address = data.address || `${city}, TX`;
  const hours = data.opening_hours || "Mon - Sat: 8:00 AM - 7:00 PM | Instant Quotes & Booking";

  // Document Title
  document.title = `${bName} | Precision Residential & Commercial Cleaning in ${city}`;

  // Brand Name
  document.querySelectorAll(".brand-name-text").forEach((el) => (el.textContent = bName));

  // Tagline & Hero Description
  const taglineEl = document.getElementById("hero-title-clean");
  if (taglineEl) {
    taglineEl.textContent = data.tagline
      ? data.tagline
      : `Precision Residential & Commercial Cleaning in ${city.toUpperCase()}`;
  }

  const heroDescEl = document.getElementById("hero-desc-clean");
  if (heroDescEl) {
    heroDescEl.textContent = `Professional deep cleaning, recurring housekeeping, and sanitized turnover cleaning for homes and offices across ${city} and surrounding communities.`;
  }

  // City Elements
  document.querySelectorAll(".dynamic-city").forEach((el) => (el.textContent = city));

  // Phone Binding
  if (phone && cleanPhone.length >= 7) {
    document.querySelectorAll(".dynamic-phone-text").forEach((el) => (el.textContent = phone));
    document.querySelectorAll(".dynamic-phone-link").forEach((el) => {
      el.href = `tel:${cleanPhone}`;
    });
    document.querySelectorAll(".dynamic-call-btn-text").forEach((el) => {
      el.textContent = `Call ${phone}`;
    });
  } else {
    document.querySelectorAll(".dynamic-phone-text").forEach((el) => (el.textContent = "Direct Inquiries Online"));
    document.querySelectorAll(".dynamic-phone-link").forEach((el) => {
      el.href = "#quote-clean";
    });
    document.querySelectorAll(".dynamic-call-btn-text").forEach((el) => {
      el.textContent = "Request a Quote";
    });
  }

  // Email Binding
  const emailLinkEl = document.getElementById("footer-email-link-clean");
  const emailTextEl = document.getElementById("footer-email-text-clean");
  if (email) {
    if (emailTextEl) emailTextEl.textContent = email;
    if (emailLinkEl) emailLinkEl.href = `mailto:${email}`;
  } else if (emailTextEl && emailLinkEl) {
    emailTextEl.textContent = "Inquire via Online Form";
    emailLinkEl.href = "#quote-clean";
  }

  // Address & Hours
  const addrEl = document.getElementById("footer-address-clean");
  if (addrEl) addrEl.textContent = address;

  const hoursEl = document.getElementById("footer-hours-clean");
  if (hoursEl) hoursEl.textContent = hours;

  // Services Grid
  if (data.services && data.services.length > 0) {
    const servicesContainer = document.getElementById("services-clean-container");
    if (servicesContainer) {
      servicesContainer.innerHTML = "";
      data.services.forEach((s) => {
        const card = document.createElement("div");
        card.className = "service-v2-card";
        const imgUrl = s.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";
        const badge = s.badge || "Quality Assured";
        const desc = s.description || "Professional cleaning and sanitization tailored to your space.";
        const ctaHref = (phone && cleanPhone.length >= 7) ? `tel:${cleanPhone}` : "#quote-clean";
        const ctaText = (phone && cleanPhone.length >= 7) ? "Call for Service" : "Request Service";

        card.innerHTML = `
          <div class="card-img-wrapper">
            <img src="${imgUrl}" alt="${s.name}" loading="lazy">
            <span class="card-badge-floating">${badge}</span>
          </div>
          <div class="service-v2-body">
            <h3>${s.name}</h3>
            <p>${desc}</p>
            <a href="${ctaHref}" class="btn-v2 btn-glow-emerald" style="align-self: flex-start; padding: 8px 18px; font-size: 0.85rem;">
              ${ctaText}
            </a>
          </div>
        `;
        servicesContainer.appendChild(card);
      });
    }
  }

  // Service Areas Tags
  const areasContainer = document.getElementById("areas-clean-container");
  if (areasContainer) {
    areasContainer.innerHTML = "";
    if (data.service_areas && data.service_areas.length > 0 && !(data.service_areas.length === 1 && data.service_areas[0] === city)) {
      data.service_areas.forEach((area) => {
        const tag = document.createElement("div");
        tag.className = "area-tag-v2";
        tag.textContent = area;
        areasContainer.appendChild(tag);
      });
    } else {
      const defaultAreas = [
        `${city}`,
        `${city} Metro Area`,
        `Greater ${city} Region`,
        "Surrounding Communities",
        "Residential Dispatch Hub",
        "Commercial Service Zone"
      ];
      defaultAreas.forEach((area) => {
        const tag = document.createElement("div");
        tag.className = "area-tag-v2";
        tag.textContent = area;
        areasContainer.appendChild(tag);
      });
    }
  }

  // Reviews
  if (data.reviews && data.reviews.length > 0) {
    const reviewsContainer = document.getElementById("reviews-clean-container");
    if (reviewsContainer) {
      reviewsContainer.innerHTML = "";
      data.reviews.forEach((r) => {
        const card = document.createElement("div");
        card.className = "review-v2-card";
        const avatar = r.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80";
        card.innerHTML = `
          <div>
            <div class="review-stars">★★★★★</div>
            <div class="review-quote">"${r.text}"</div>
          </div>
          <div class="client-meta">
            <img src="${avatar}" alt="${r.author}" class="client-avatar" loading="lazy">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${r.author}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">${r.role || "Verified Client"}</div>
            </div>
          </div>
        `;
        reviewsContainer.appendChild(card);
      });
    }
  }
}

// Interactive Cleaning Estimate Calculator
function initCleaningCalculator() {
  const serviceSelect = document.getElementById("clean-service-type");
  const sizeSelect = document.getElementById("clean-property-size");
  const priceDisplay = document.getElementById("clean-price-val");

  if (!serviceSelect || !sizeSelect || !priceDisplay) return;

  function calculate() {
    const service = serviceSelect.value;
    const size = sizeSelect.value;

    let baseRange = "$120 – $180";
    if (service === "deep") {
      baseRange = size === "large" ? "$280 – $450" : "$180 – $280";
    } else if (service === "recurring") {
      baseRange = size === "large" ? "$160 – $240" : "$110 – $170";
    } else if (service === "move") {
      baseRange = size === "large" ? "$320 – $520" : "$220 – $340";
    } else if (service === "carpet") {
      baseRange = size === "large" ? "$180 – $320" : "$120 – $190";
    }

    priceDisplay.textContent = baseRange;
  }

  serviceSelect.addEventListener("change", calculate);
  sizeSelect.addEventListener("change", calculate);
}

// Single Viewport Before & After Slider Engine
function initBeforeAfterSlider() {
  const rangeInput = document.getElementById("ba-range-input");
  const beforeLayer = document.getElementById("ba-before-layer");
  const divider = document.getElementById("ba-divider");
  const beforeImg = document.getElementById("ba-before-img");
  const afterImg = document.getElementById("ba-after-img");
  const viewport = document.getElementById("ba-viewport");
  const sceneTitle = document.getElementById("ba-scene-title");
  const sceneDesc = document.getElementById("ba-scene-desc");

  if (!rangeInput || !beforeLayer || !divider || !beforeImg || !afterImg || !viewport) return;

  function syncImageWidth() {
    const viewportWidth = viewport.offsetWidth;
    if (viewportWidth > 0) {
      beforeImg.style.width = viewportWidth + "px";
    }
  }

  window.addEventListener("resize", syncImageWidth);
  syncImageWidth();

  rangeInput.addEventListener("input", (e) => {
    const val = e.target.value;
    beforeLayer.style.width = val + "%";
    divider.style.left = val + "%";
  });

  // Scene Switcher Data (1:1 Matching High-Res Before & After Assets)
  const scenes = {
    kitchen: {
      after: "assets/kitchen_after.jpg",
      before: "assets/kitchen_before.jpg",
      title: "Master Kitchen Deep Clean &amp; Degreasing",
      desc: "Heavy grease splatters, stove grime, and cloudy surfaces restored to a sanitized, mirror-finish sheen."
    },
    bathroom: {
      after: "assets/bathroom_after.jpg",
      before: "assets/bathroom_before.jpg",
      title: "Luxury Bathroom &amp; Shower Descaling",
      desc: "Heavy soap scum, tile cloudiness, and hard-water deposits eliminated with hospital-grade sanitization."
    },
    living: {
      after: "assets/living_after.jpg",
      before: "assets/living_before.jpg",
      title: "Move-Out Living Room &amp; Hardwood Turnover",
      desc: "Heavy dust, scuffed baseboards, and dull surfaces restored to spotless, inspection-ready perfection."
    },
    carpet: {
      after: "assets/carpet_after.jpg",
      before: "assets/carpet_before.jpg",
      title: "Deep Fiber Carpet &amp; Fabric Steam Extraction",
      desc: "Ground-in traffic stains and pet odors lifted with high-temperature industrial steam extraction."
    }
  };

  document.querySelectorAll(".ba-scene-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ba-scene-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const sceneKey = btn.dataset.scene;
      const data = scenes[sceneKey];
      if (data) {
        afterImg.src = data.after;
        beforeImg.src = data.before;
        if (sceneTitle) sceneTitle.textContent = data.title;
        if (sceneDesc) sceneDesc.textContent = data.desc;

        // Reset divider to middle
        rangeInput.value = 50;
        beforeLayer.style.width = "50%";
        divider.style.left = "50%";
        syncImageWidth();
      }
    });
  });
}

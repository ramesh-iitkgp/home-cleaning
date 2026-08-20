# Agency-Grade Home Cleaning Website Template

A modern, high-converting, personalized website template engineered specifically for automated lead generation and white-label client deployment in the residential and commercial cleaning industry.

Built with **HTML5, CSS3, and Vanilla JavaScript**, this template is **100% data-driven** and strictly adheres to subdirectory deployment rules (e.g., `https://yourdomain.com/demos/super-cleaners-london/`).

---

## Core Template Files

```text
├── index.html                  # Accessible, semantic HTML markup with dynamic [data-bind] hooks
├── style.css                   # Modern CSS design system (Deep Slate Navy & Sparkling Ocean Blue)
├── script.js                   # Universal data engine, before/after slider, gallery lightbox, SEO
├── data/
│   └── business.json           # SOLE authoritative source of customer-specific business information
└── README.md                   # Automation documentation and integration guide
```

---

## Key Features & Conversion Architecture

1. **Hyper-Personalized Brand Exposure**:
   - The business name is positioned prominently throughout the navigation, hero section, "Services from [Business]", "Why Choose [Business]", "Our Work Gallery", and the final CTA.
   - Supports custom `logo_url` or generates a bespoke vector brand mark automatically.

2. **Interactive "Before & After" Comparison Slider**:
   - Touch/mouse drag-enabled split-image comparison slider to showcase cleaning transformations.
   - Dynamic tab switching between multiple project pairs (Kitchens, Bathrooms, Living Spaces, Floors).

3. **Dynamic Services Grid & Instant Quote Calculator**:
   - Renders service cards dynamically from `services` array in `business.json`.
   - Clicking "Request this service" auto-selects the service in the estimate calculator below.

4. **Interactive Work Gallery with Lightbox**:
   - Grid masonry layout with fullscreen lightbox modal, keyboard navigation (`ESC`, arrow keys), and backdrop dismiss.

5. **Verified Reviews & Star Rating Social Proof**:
   - Dynamically renders real Google/Trustpilot reviews with star ratings and author badges.
   - Gracefully hides rating containers if rating data is omitted without leaving empty gaps or broken layouts.

6. **Subdirectory & Static Hosting Ready**:
   - All assets (`./style.css`, `./script.js`, `./data/business.json`) use relative paths to guarantee flawless execution in GitHub Pages, S3, Netlify, Cloudflare Pages, or custom subfolders.

7. **Zero-Defect Graceful Degradation**:
   - If optional fields (logo, Instagram, TikTok, Facebook, email, maps link, reviews, before/after pairs) are omitted, their corresponding UI elements hide automatically without visual glitches.

---

## Universal Data Schema (`/data/business.json`)

The template accepts both `snake_case` and `camelCase` keys:

```json
{
  "_comment": "SOLE authoritative source of truth for the website.",
  "business_name": "Super Cleaners London",
  "tagline": "Premium Residential & Commercial Cleaning Services in London",
  "category": "Residential & Commercial Cleaning",
  "phone": "+44 20 7946 0912",
  "email": "contact@supercleanerslondon.co.uk",
  "address": "45 Baker Street, Marylebone, London W1U 8ED",
  "city": "London",
  "state": "Greater London",
  "country": "United Kingdom",
  "opening_hours": "Mon - Sat: 8:00 AM - 7:00 PM | Sun: 9:00 AM - 4:00 PM",
  "rating": "4.9",
  "review_count": "148",
  "google_maps_url": "https://maps.google.com/?q=London+UK",
  "logo_url": "",
  "hero_image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
  "service_areas": [
    "Marylebone",
    "Westminster",
    "Kensington & Chelsea",
    "Camden",
    "Islington",
    "Mayfair",
    "Battersea",
    "Fulham"
  ],
  "social": {
    "instagram": "https://instagram.com/supercleanerslondon",
    "facebook": "https://facebook.com/supercleanerslondon",
    "tiktok": ""
  },
  "before_after_pairs": [
    {
      "title": "Kitchen Deep Clean & Degreasing",
      "description": "Thorough extraction of grease, range hood polishing, and tile descaling.",
      "before": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      "after": "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1000&q=80"
    }
  ],
  "services": [
    {
      "name": "Regular Home Cleaning",
      "description": "Tailored routine housekeeping on a weekly or bi-weekly schedule for a consistently spotless home.",
      "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
    }
  ],
  "business_images": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80"
  ],
  "reviews": [
    {
      "author": "Victoria Sterling",
      "rating": 5,
      "text": "Super Cleaners London did an exceptional job on our 4-bedroom flat in Marylebone.",
      "source": "Google Review"
    }
  ]
}
```

---

## Automated Python Deployment Example

```python
import json
import shutil
import os

def deploy_cleaning_lead_website(lead_data: dict, template_root: str, target_dir: str):
    """
    Deploys a fully personalized cleaning site demo by copying template files
    and generating the data/business.json file.
    """
    os.makedirs(os.path.join(target_dir, 'data'), exist_ok=True)
    
    # 1. Copy core template assets
    for static_file in ['index.html', 'style.css', 'script.js']:
        shutil.copy2(os.path.join(template_root, static_file), os.path.join(target_dir, static_file))
        
    # 2. Write personalized business.json
    json_path = os.path.join(target_dir, 'data', 'business.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(lead_data, f, indent=2, ensure_ascii=False)
        
    print(f"Personalized demo created at: {target_dir}")
```

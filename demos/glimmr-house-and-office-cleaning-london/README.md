# Reusable Cleaning Company Website Template

A production-ready, high-converting, modern website template engineered specifically for residential and commercial cleaning businesses.

This template is built with pure **HTML5, CSS3, and Vanilla JavaScript** and is designed to be **100% data-driven**. It allows programmatic personalization (e.g., via Python lead-generation automation, Google Maps scraping pipelines, CRM exports, or manual edits) simply by updating a single file: `/data/business.json`.

---

## Core Template Files

The entire website is contained within these static files:

```text
├── index.html                  # Accessible, semantic HTML markup with dynamic [data-bind] hooks
├── style.css                   # Modern CSS design system (Slate Navy & Sparkling Teal)
├── script.js                   # Authoritative data loading engine, dynamic DOM renderer & lightbox
├── data/
│   └── business.json           # SOLE authoritative source of customer-specific business information
└── README.md                   # Automation documentation and integration guide
```

---

## Architectural Highlights & Guarantees

1. **100% Data-Driven Architecture**:
   - `/data/business.json` is the **only source of business data**.
   - No business data is duplicated in HTML or JavaScript.
   - Changing `/data/business.json` completely updates the business name, tagline, city/state, phone, email, address, maps link, socials, ratings/reviews, hero image, services, and photo gallery.

2. **Zero Fabricated Claims**:
   - No hardcoded years of experience, fake customer counts, invented awards, or unverified claims.
   - All marketing copy is safe, generic, and professional.

3. **Strict Graceful Degradation & Zero Broken Elements**:
   - If `instagramUrl` or `facebookUrl` is empty (`""`), the social icons/buttons and container hide completely.
   - If `email` is empty (`""`), all email buttons and containers hide completely.
   - If `googleMapsUrl` is empty (`""`), map links and direction buttons hide completely.
   - If `rating` or `reviewCount` is empty (`""`), the star rating badge is hidden with zero layout shift.
   - If `heroImage` or any `galleryImages` URL is missing or fails to load, it is hidden smoothly with no broken image icons.

4. **Literal International Phone Number Support**:
   - Phone numbers are preserved and formatted as provided in `business.json` without assuming any default country code.

5. **No Build Step Required**:
   - Works immediately by opening `index.html` in any modern web browser or deploying to GitHub Pages, Netlify, Cloudflare Pages, Vercel, AWS S3, or traditional cPanel hosts.

---

## The Business Data Schema (`/data/business.json`)

To personalize the website for any cleaning company, update `/data/business.json` with this structure:

```json
{
  "_comment": "SAMPLE BUSINESS DATA: This file is the single source of truth for the website.",
  "name": "Sparkle Home Cleaning",
  "tagline": "Professional Cleaning Services You Can Trust",
  "category": "Residential & Commercial Cleaning",
  "phone": "+15551234567",
  "email": "hello@sparklecleaning.example",
  "address": "123 Main Street",
  "city": "Dallas",
  "state": "Texas",
  "country": "USA",
  "rating": "4.8",
  "reviewCount": "127",
  "googleMapsUrl": "https://maps.google.com/?q=Dallas+TX",
  "instagramUrl": "",
  "facebookUrl": "",
  "heroImage": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
  "galleryImages": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80"
  ],
  "services": [
    {
      "name": "Residential Cleaning",
      "description": "Professional cleaning services for homes, apartments, and living spaces.",
      "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
    },
    {
      "name": "Deep Cleaning",
      "description": "Detailed cleaning for a fresh and spotless space covering hard-to-reach areas.",
      "image": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80"
    },
    {
      "name": "Move-In / Move-Out Cleaning",
      "description": "Comprehensive turnover cleaning ensuring spaces are pristine for new occupants.",
      "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      "name": "Commercial Cleaning",
      "description": "Customized cleaning solutions for offices, workspaces, and commercial facilities.",
      "image": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80"
    }
  ]
}
```

---

## Python Lead-Generation Automation Workflow

The workflow to generate and deploy personalized customer websites automatically:

```text
Google Maps / Lead Scraper
            ↓
   Business information
            ↓
     Business photos
            ↓
  /data/business.json
            ↓
  Website Template (HTML/CSS/JS)
            ↓
  Personalized Live Website
```

### Python Script Example

```python
import json
import shutil
import os

def generate_personalized_cleaning_site(lead_data: dict, template_dir: str, output_dir: str):
    """
    Copies the base template and writes the personalized business.json.
    NO HTML, CSS, or JS changes are required!
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Copy static template files
    for item in ['index.html', 'style.css', 'script.js']:
        src_file = os.path.join(template_dir, item)
        dst_file = os.path.join(output_dir, item)
        shutil.copy2(src_file, dst_file)
        
    os.makedirs(os.path.join(output_dir, 'data'), exist_ok=True)
    
    # Format business payload
    business_payload = {
        "name": lead_data.get("name", "Professional Cleaning Services"),
        "tagline": lead_data.get("tagline", "High Standard Residential & Commercial Cleaning"),
        "category": lead_data.get("category", "Cleaning Services"),
        "phone": lead_data.get("phone", ""),
        "email": lead_data.get("email", ""),
        "address": lead_data.get("address", ""),
        "city": lead_data.get("city", ""),
        "state": lead_data.get("state", ""),
        "country": lead_data.get("country", ""),
        "rating": str(lead_data.get("rating", "")),
        "reviewCount": str(lead_data.get("review_count", "")),
        "googleMapsUrl": lead_data.get("google_maps_url", ""),
        "instagramUrl": lead_data.get("instagram_url", ""),
        "facebookUrl": lead_data.get("facebook_url", ""),
        "heroImage": lead_data.get("hero_image", ""),
        "galleryImages": lead_data.get("photos", []),
        "services": lead_data.get("services", [])
    }
    
    # Write data/business.json
    target_json_path = os.path.join(output_dir, 'data', 'business.json')
    with open(target_json_path, 'w', encoding='utf-8') as f:
        json.dump(business_payload, f, indent=2, ensure_ascii=False)
        
    print(f"[✓] Website successfully generated for: {business_payload['name']}")
```

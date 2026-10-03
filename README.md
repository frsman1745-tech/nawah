# نواة / Nawah — Digital Development Agency Website

Awwwards-caliber multi-page website for Nawah, a Syrian digital development agency. Built with vanilla JS, GSAP, Lenis, and a custom Canvas particle system.

---

## Quick Start

Open any HTML file directly in a browser:

- `index.html` — Homepage
- `portfolio.html` — Portfolio / Our Work
- `about.html` — About Us
- `store.html` — Store (digital services & bundles)

No build tools or server required. For best performance, serve with a local server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

---

## Store Page (`store.html`)

A bilingual catalog of 48 ready-made digital services and bundles. It reuses the site's navbar, footer, light/dark theme, custom cursor and canvas hero, and is fully AR/EN (RTL/LTR).

### Data — `assets/js/store-data.js`

Edit this file to add or change products. It defines two globals:

- `window.NAWAH_CATEGORIES` — ordered list of `{ key, ar, en }` categories.
- `window.NAWAH_PRODUCTS` — array of products:

```js
{
  id: "qr", cat: "identity", price: 29, old: 59,   // old optional
  badge: { ar: "الأكثر طلباً", en: "Best Seller" }, // or null
  img: "assets/images/products/p-qr.svg",
  title: { ar: "…", en: "…" },
  short: { ar: "…", en: "…" },
  desc:  { ar: "…", en: "…" },
  feats: { ar: ["…"], en: ["…"] }
}
```

Every product `id` must be unique — it is used as the DOM id (`#item-<id>`) and as a deep link (`store.html#<id>` scrolls to and highlights the product). Product images live in `assets/images/products/`.

### Behavior — `assets/js/store.js`

- Live search + category chips (rebuilt automatically on language change)
- Interactive product details modal: theme toggle (light/dark) + device frame (desktop/phone), full description, feature list, and a direct WhatsApp order link
- No cart — each card has a single **Details** button, and ordering goes straight to WhatsApp from the modal
- Reduced-motion support and deep-link highlighting

### WhatsApp number

Update the `WA` constant in `assets/js/store.js` (currently `963998950904`).

### Store text (i18n)

All store UI strings use `data-i18n` keys under `store.*` plus `meta.store.title` / `meta.store.desc`, and the search field uses `data-i18n-placeholder="store.search"` — all in `assets/js/i18n.js`.

---

## How to Add Images

All image placeholders are marked with `<!-- 📸 TODO: ... -->` comments.

### Team Photos

1. Save images to `assets/images/team/` (recommended: 400×400px square, JPG or PNG)
2. In each HTML file, find the team card and replace the placeholder div:

```html
<!-- Replace this: -->
<div class="team-card__photo-placeholder">
  <span aria-hidden="true">AR</span>
</div>

<!-- With: -->
<img src="assets/images/team/abdulrahman.jpg" alt="Abdulrahman Al-Ladhiqani">
```

### Client Logos

1. Save logos to `assets/images/clients/` (recommended: 200×200px PNG with transparent background)
2. In `index.html`, find the `.client-logo-circle` divs and replace:

```html
<!-- Replace: -->
<span class="placeholder-text">Coming Soon</span>

<!-- With: -->
<img src="assets/images/clients/client-1.png" alt="Client Name">
```

### Portfolio Screenshots

1. Save screenshots to `assets/images/portfolio/`
2. For the featured project (Pizza Khanum):
   - Mobile: 390×844px PNG
   - Desktop: 1440×900px PNG
3. For project cards: 800×500px

### Logo

Create an SVG logo and save as `assets/images/logo.svg`. Then find `<!-- 📸 TODO: Replace with Nawah SVG logo -->` comments and add:

```html
<img src="assets/images/logo.svg" alt="Nawah" height="32">
```

---

## How to Add Team Members

1. Copy a `.team-card` block (around line ~300 in index.html)
2. Paste it inside `.team__grid`
3. Update the translation keys in `assets/js/i18n.js`:

```js
"team.member.4.name": "New Name",
"team.member.4.role": "New Role",
```

4. Add `data-i18n` attributes to the new card elements
5. Add the photo file to `assets/images/team/`

---

## How to Add Testimonials

1. In `index.html`, find the testimonials section
2. There are 2 pre-written testimonial templates (commented out) — uncomment them
3. Or copy the START CARD / END CARD block and paste after it
4. Add translation keys in `assets/js/i18n.js`:

```js
"testimonials.2.quote": "The text...",
"testimonials.2.name": "Client Name",
"testimonials.2.role": "Client Role",
```

---

## How to Add Portfolio Projects

1. In `portfolio.html`, find a `.project-card` block
2. Copy and paste it inside `.projects-grid`
3. Add translation keys in `assets/js/i18n.js`:

```js
"portfolio.project3.title": "Project Name",
"portfolio.project3.desc": "Project description",
```

---

## How to Update Contact Links

**WhatsApp:** Update `+963998950904` in:
- `index.html` (3 occurrences)
- `portfolio.html` (2 occurrences)
- `about.html` (2 occurrences)

**Instagram:** Update `https://www.instagram.com/` in all footer sections.

**Store WhatsApp:** Update the `WA` constant in `assets/js/store.js`.

---

## Customization Guide

### Colors

Edit CSS custom properties in `assets/css/main.css`:

```css
:root {
  --color-navy:  #0E1C3D;
  --color-gold:  #C9A84C;
  --color-ivory: #F5F3EE;
  /* ... */
}
```

### Fonts

Google Fonts links are in the `<head>` of each HTML file. Change them there and update the `font-family` in `main.css`.

### Animations

Key animation parameters are in `assets/js/app.js`. Adjust durations, staggers, and easings.

### Content / Copy

All text content is managed through `assets/js/i18n.js`. Find the key and edit the translation strings.

---

## Project Structure

```
nawah/
├── index.html              ← Homepage
├── portfolio.html          ← Our Work page
├── about.html              ← About Us page
├── store.html              ← Store (services & bundles)
├── README.md               ← This file
├── opencode.json           ← opencode config
├── .opencode/agent/        ← opencode agent definitions
├── assets/
│   ├── css/
│   │   ├── main.css        ← Core styles, variables, components, responsive
│   │   └── store.css       ← Store page styles
│   ├── js/
│   │   ├── i18n.js         ← Translation system (AR/EN)
│   │   ├── app.js          ← Theme, cursor, navbar, hero canvas, animations
│   │   ├── store-data.js   ← Store catalog (categories + 48 products)
│   │   └── store.js        ← Store logic (search, filters, details modal, WhatsApp order)
│   └── images/
│       └── products/       ← Product images (SVG)
```

---

## Features

- **Bilingual** — Full Arabic (RTL) and English support with auto-detection
- **Dark/Light mode** — Auto-detected from system preference, manually toggleable, persisted
- **Canvas particle system** — Animated hexagon particles with mouse interaction
- **GSAP animations** — Cinematic hero entrance, scroll-triggered reveals, parallax
- **Lenis smooth scrolling** — Buttery smooth scroll experience
- **Custom cursor** — Magnetic hover effects on interactive elements
- **Glassmorphism** — Frosted glass cards with gold accents
- **Store catalog** — 48 bilingual products with live search, category filters, a details modal, and one-tap WhatsApp ordering (no cart)
- **Responsive** — Mobile-first, works on all screen sizes
- **Accessible** — Semantic HTML, ARIA labels, reduced motion support
- **SEO** — Schema.org structured data, Open Graph tags, canonical URLs

---

## Libraries Used (CDN)

- [GSAP](https://gsap.com/) — Animation framework (ScrollTrigger + SplitText)
- [Lenis](https://lenis.studiofreight.com/) — Smooth scrolling

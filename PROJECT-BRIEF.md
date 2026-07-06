# برومت مشروع نواة — التوثيق الكامل

> **آخر تحديث:** 5 يوليو 2026  
> **النسخة:** 1.0  
> **النطاق:** https://nawah.dev  
> **المنصة:** Vercel (static hosting, HTML/CSS/JS خالص)

---

## 1. هيكلية الملفات (File Structure)

```
/
├── index.html              ← الصفحة الرئيسية (Homepage)
├── about.html              ← من نحن (About Us)
├── portfolio.html          ← أعمالنا (Portfolio)
├── vercel.json             ← إعدادات نشر Vercel (rewrites + headers)
├── README.md               ← دليل الاستخدام السريع
├── PROJECT-BRIEF.md        ← هذا الملف
│
├── assets/
│   ├── css/
│   │   ├── main.css        ← core styles, variables, reset, RTL
│   │   ├── components.css  ← reusable components (cursor, cards, social, etc.)
│   │   ├── animations.css  ← keyframes + GSAP-ready CSS classes
│   │   └── responsive.css  ← breakpoints 1024 / 768 / 480 / 380
│   │
│   ├── js/
│   │   ├── i18n.js         ← ترجمة EN/AR بالكامل
│   │   ├── main.js         ← theme, cursor, navbar, mobile menu, FAQ, Lenis
│   │   ├── hero.js         ← نظام جزيئات الهيكس على Canvas
│   │   ├── animations.js   ← GSAP timelines + ScrollTrigger
│   │   ├── counter.js      ← عداد متحرك (IntersectionObserver + ScrollTrigger)
│   │   └── footer.js       ← تأثير Spotlight خلف الفوتر
│   │
│   └── images/
│       └── cursor/
│           ├── core.png    ← 262 KB — قلب المؤشر
│           ├── orbit-1.png ← 552 KB — الحلقة الداخلية
│           └── orbit-2.png ← 922 KB — الحلقة الخارجية
│
│   (ملاحظة: مجلدات team/ clients/ portfolio/ images غير موجودة بعد)
│
└── (ملف .gitignore)
```

---

## 2. نظام الألوان (Theme System)

### Light Mode (افتراضي)
| المتغير | القيمة | الاستخدام |
|---------|--------|-----------|
| `--color-navy` | `#0E1C3D` | النصوص الأساسية |
| `--color-gold` | `#C9A84C` | الأكcent (الذهب) |
| `--color-ivory` | `#F5F3EE` | الخلفية الأساسية |
| `--color-onyx` | `#1A1A1A` | الخلفية الداكنة |
| `--color-steel` | `#8A8F9B` | النصوص الثانوية |
| `--bg-primary` | `var(--color-ivory)` | خلفية الصفحة |
| `--bg-secondary` | `#ECEAE4` | خلفية العناصر الثانوية |
| `--bg-card` | `rgba(255,255,255,0.7)` | خلفية الكروت الشفافة |
| `--text-primary` | `var(--color-navy)` | النص الرئيسي |
| `--text-secondary` | `var(--color-steel)` | النص الثانوي |
| `--accent` | `var(--color-gold)` | اللون المميز |
| `--border-subtle` | `rgba(14,28,61,0.08)` | حدود خفيفة |
| `--border-gold` | `rgba(201,168,76,0.3)` | حدود ذهبية |
| `--glass-bg` | `rgba(255,255,255,0.05)` | خلفية الزجاج (glassmorphism) |
| `--glass-border` | `rgba(201,168,76,0.15)` | إطار الزجاج |

### Dark Mode (data-theme="dark")
| المتغير | القيمة |
|---------|--------|
| `--bg-primary` | `#1A1A1A` |
| `--bg-secondary` | `#111111` |
| `--bg-card` | `rgba(14,28,61,0.4)` |
| `--text-primary` | `#F0EEE9` |
| `--text-secondary` | `#8A8F9B` |
| `--nav-bg` | `rgba(26,26,26,0.8)` |

يتم التبديل بـ:
- زر `#theme-toggle` في النافبار
- كشف تلقائي من `prefers-color-scheme`
- حفظ في `localStorage('nawah-theme')`

---

## 3. نظام المسافات والخطوط (Spacing & Typography)

### Mobile (أقل من 768px)
```
--text-xs:  0.75rem  (12px)
--text-sm:  0.875rem (14px)
--text-base: 1rem    (16px)
--text-lg:   1.0625rem (~17px)
--text-xl:   1.375rem (22px)
--text-2xl:  1.625rem (26px)
--text-hero: 2rem     (32px)

--space-xs:  0.375rem (6px)
--space-sm:  0.625rem (10px)
--space-md:  1rem     (16px)
--space-lg:  1.5rem   (24px)
--space-xl:  2rem     (32px)
--space-2xl: 2.5rem   (40px)
--space-3xl: 3.5rem   (56px)

--section-padding: var(--space-2xl) var(--space-md)
--max-width: 1280px
```

### Tablet (768px+)
```
--text-base: 1rem     (16px)
--text-xl:   1.5rem   (24px)
--text-hero: 2.5rem   (40px)
--space-lg:  2rem     (32px)
--space-2xl: 3rem     (48px)
--space-3xl: 4.5rem   (72px)
--section-padding: var(--space-3xl) var(--space-lg)
```

### Desktop (1025px+)
```
--text-lg:   1.25rem  (20px)
--text-xl:   1.75rem  (28px)
--text-2xl:  2.5rem   (40px)
--text-hero: 3.5rem   (56px)
--space-2xl: 4rem     (64px)
--space-3xl: 6rem     (96px)
```

### Large Desktop (1440px+)
```
--text-hero: 5rem     (80px)
--space-3xl: 8rem     (128px)
```

### Fonts المستخدمة
- **Inter** (400, 500, 600, 700) — للنص الإنجليزي
- **Almarai** (400, 700) — للنص العربي
- التحميل من Google Fonts بـ `display=swap`

### Headings
```
h1 → var(--text-hero)
h2 → var(--text-2xl)
h3 → var(--text-xl)
h4 → var(--text-lg)
h5 → var(--text-base)
font-weight: 700 (لجميع الـ headings)
```

---

## 4. المكونات الرئيسية بالصفحات

### 4.1 الصفحة الرئيسية (index.html)

#### Navbar (`<header.navbar>`)
- ثابت في الأعلى (fixed)
- يصبح scrolled (blur bg) بعد 80px سكرول
- الشعار: "نواة"
- اللينكات: Home, Services, Portfolio, About, Contact
- الأزرار: Language Toggle (EN/AR) + Theme Toggle (🌙/☀️) + Hamburger
- على الموبايل (<768px): `display: none` لللينكات، يظهر الهامبرغر

#### Mobile Menu (`<div.nav-overlay>`)
- Full-screen overlay مع fade transition
- أنيميشن GSAP للينكات عند الفتح (stagger 0.08s)
- overflow: hidden على body عند الفتح
- الإغلاق بالضغط على أي لينك أو على الهامبرغر

#### Hero Section
- Canvas خلفية (جزيئات هيكس متحركة)
- `hero__headline`: عنوان رئيسي مع SplitText JS أنيميشن
- `hero__subtitle`: نص فرعي
- `hero__ctas`: 3 أزرار (Primary, Outline, Text)
- `hero__scroll-indicator`: سهم متحرك للأسفل

#### About Brief Section
- `section__eyebrow`: "About Us" (letter-spacing + uppercase)
- `section__title`: "Nawah — Where It All Begins"
- `about-brief__link`: Read More مع سهم → (يتحرك عند hover)
- `hexagon-decor`: عناصر هيكس زخرفية عائمة

#### Stats Section
- عدادان: "1+ Completed Project" و "1+ Happy Client"
- `counter-number` مع `data-target` و `data-suffix`
- يتم تفعيل العداد عند الدخول للمقطع (ScrollTrigger أو IntersectionObserver)

#### Services Section
- 3 Service Cards في `services__grid` (3 أعمدة ديسكتوب، عمود واحد موبايل)
- كل كارد يحتوي: أيقونة هيكس، عنوان، وصف، لينك "Learn More"
- الخدمات: Web Development, Mobile Apps, Software & Business Systems

#### Features Section ("Why Nawah?")
- 8 ميزات في `features__list`
- كل ميزة: أيقونة هيكس + عنوان + وصف
- التنسيق: سفلي و نصي (odd: slide-left, even: slide-right)
- على الموبايل: vertical centering مع `--slide-x: 0`

#### Clients Section
- شريط تمرير لا نهائي (marquee) باستخدام CSS animation
- `clients__track` مكرر (مجموعتين identical ل seamless loop)
- دوائر "Coming Soon" مكان شعارات العملاء

#### Team Section
- 3 Team Cards (عبدالرحمن، أمير، اللجين)
- كل كارد: صورة دائرية، اسم، منصب
- 3D tilt effect عند hover (`rotateX(2deg) rotateY(2deg)`)

#### Testimonials Section
- كارد واحد نشط (عبدالرحمن)، 2 كاردات جاهزة (معلقّة)
- تقييم 5 نجوم (★), اقتباس, اسم العميل, منصبه

#### FAQ Section
- 7 أسئلة مع accordion
- `gsap.fromTo` لفتح/غلق الإجابة بـ maxHeight animation
- أيقونة + (تدور 45° عند الفتح)

#### Footer
- Grid 3 أعمدة: Brand, Quick Links, Contact
- زرار WhatsApp, لينك Instagram
- Footer Glow: تأثير ضوء يتبع الماوس (CSS radial-gradient مع JS)
- Bottom bar: © 2025 + Privacy Policy

### 4.2 صفحة About (about.html)

#### Page Hero
- Canvas خلفية (نفس نظام الجزيئات)
- عنوان + عنوان فرعي

#### Our Story
- قصة الشركة مع `section__eyebrow`

#### Vision & Mission
- بطاقتان جنباً لجنب (glass cards)
- Vision مع أيقونة 🔭, Mission مع أيقونة 🎯

#### Values
- 4 Value Cards في `values-grid` (4 أعمدة ديسكتوب، 2 tablet، 1 موبايل)
- القيم: Excellence, Innovation, Reliability, Partnership

#### Future Goals
- قائمة بالخمسة أهداف
- `dir="rtl"` override للـ padding في العربية

#### Team Section (مكرر)
- نفس team cards من الصفحة الرئيسية

### 4.3 صفحة Portfolio (portfolio.html)

#### Page Hero
- Canvas خلفية + عنوان + عنوان فرعي

#### Featured Project: Pizza Khanum
- `featured-project__demo` مع grid عمودين (mockup + info)
- Mobile mockup (200px) + Desktop mockup (flex: 1)
- Theme Toggle داخل الموقع (Light/Dark)
- Tags: HTML5, CSS3, JavaScript, Responsive
- "Visit Website" link (pizzakhanum.vercel.app)

#### More Projects Grid
- 6 Project Cards (3 أعمدة، 2 tablet، 1 موبايل)
- كل كارد: صورة placeholders + عنوان + وصف
- كلها حالياً "Coming Soon"

---

## 5. نظام الكيرسر (Custom Cursor)

### CSS (components.css)
```css
.cursor__outer → orbit-2.png (48×48) — z-index 99997
.cursor__mid   → orbit-1.png (30×30) — z-index 99998
.cursor__core  → core.png    (14×14) — z-index 99999
.cursor__label → "View" text, فونت 11px, uppercase, letter-spacing
```

### JS (main.js - cursor object)
- لا يعمل تحت 768px (`window.innerWidth <= 768`)
- 3 دوائر تتبع الماوس بتأخير (lag): core (0.25), mid (0.10), outer (0.07)
- spin orbits عكس بعض (spinAngle1, spinAngle2)
- click burst تأثير نبض + توهج
- hover effect: `orbitIntensity`,- `cursor--hover` class
- text mode: `cursor--text` + label "Click"
- ripple effect: hexagon عند النقر

### تحسينات الأداء
- الصور الأصلية محفوظة (1.7MB إجمالي)
- لا يعمل على الموبايل (مخفي بـ CSS + JS)
- `will-change: transform` للتحسين

---

## 6. نظام Canvas (جزيئات الهيكس)

### الفئة: `HexagonParticleSystem` (hero.js)

#### الخصائص
- `isMobile`: `window.innerWidth < 768` (يُحدد عند الإنشاء)
- الموبايل: max 20 ذرة (بدل 60), opacity أقل, size أصغر, بدون drawConnections
- الماوس: throttled بـ requestAnimationFrame (بدون frame skip)
- resize: throttled بـ rAF

#### الجزيئات
- لكل ذرة: x, y, size, rotation, rotSpeed, vx, vy, baseVx, baseVy, opacity, color (#C9A84C أو #0E1C3D), floatSpeed, floatOffsets
- حركة عائمة (sin/cos time-based)
- mouse repulsion: تبتعد الذرات عن الماوس

#### التوصيلات (Connections)
- فقط على الديسكتوب (>=768px)
- maxDist = min(250, height*0.6)
- alpha يعتمد على المسافة
- خطوط رفيعة (0.5px) ذهبية اللون

---

## 7. الترجمة (i18n)

### الملف: i18n.js

#### اللغات: AR (العربية) + EN (الإنجليزية)
- الكشف: localStorage أولاً، ثم navigator.language، ثم EN افتراضي
- التبديل: زر `#lang-toggle` في النافبار
- آلية العمل: `data-i18n="translation.key"` على كل عنصر نصي
- `setLanguage(lang)`: تغيير dir (rtl/ltr), lang (ar/en), تعبئة كل الـ data-i18n
- تحديث meta tags و page title أيضاً
- يُرسل event `languageChanged` لتحديث السكريبتات الأخرى

#### هيكلة الترجمات
```
translations = {
  ar: { "nav.home": "الرئيسية", ... },
  en: { "nav.home": "Home", ... }
}
```

#### عدد الترجمات: ~80 زوج لكل لغة (إجمالي 160+ ترجمة)

---

## 8. الأنيميشن (GSAP)

### الملف: animations.js

#### Hero Entrance (تسلسل زمني)
1. `0.3s` → Canvas يظهر
2. `0.6s` → Navbar ينزل من فوق
3. `0.9s` → Headline ينقسم SplitText (words stagger 0.06s)
4. `1.4s` → Subtitle يظهر
5. `1.7s` → CTAs يظهرون (stagger 0.12s)
6. `2.0s` → Scroll indicator يظهر

#### Scroll Reveals (ScrollTrigger)
- `section__heading`: clip-path inset
- `service-card`: stagger 0.15s
- `features__item`: odd ← left, even → right
- `team-card`: scale in + stagger
- `project-card`: stagger 0.12s
- `value-card`: stagger 0.1s
- `featured-project__mockups / __info`: fade up

#### Parallax
- hero__canvas يتحرك y بنسبة 15% أبطأ من السكرول

#### Reduced Motion
- كل الأنيميشن تتوقف إذا `prefers-reduced-motion: reduce`

---

## 9. السكرول السلس (Lenis)

### التهيئة (main.js - initLenis)
```
duration: 1.2
easing: (t) => min(1, 1.001 - pow(2, -10*t))
wheelMultiplier: 0.8
touchMultiplier: 0.8 (مخفض)
```

### متى يعمل؟ فقط إذا:
- Lenis محمّل
- GSAP محمّل
- ScrollTrigger محمّل
- `window.innerWidth >= 768`

### التكامل
- `lenis.on('scroll', ScrollTrigger.update)`
- `gsap.ticker.add(time => lenis.raf(time * 1000))`
- `gsap.ticker.lagSmoothing(0)`

---

## 10. الـ Breakpoints

| الحجم | الاستخدام |
|-------|-----------|
| ≤380px | أصغر الشاشات — تقليص إضافي (padding, font, hero) |
| ≤480px | موبايل عادي — section padding أقل, card padding أقل |
| ≤768px | موبايل كبير/تابلت صغير — grid عمود واحد, cursor يختفي |
| ≤1024px | تابلت — grid عمودين, footer عمودين |
| ≥768px | زيادة الـ spacing/text variables |
| ≥1025px | ديسكتوب — حجم خطوط ومسافات أكبر |
| ≥1440px | شاشات كبيرة — hero 5rem, space-3xl 8rem |

---

## 11. المكونات المعاد استخدامها (Components)

| المكون | الوصف | الملف |
|--------|-------|-------|
| `.glass-card` | كارد زجاجي شفاف مع backdrop-filter blur | main.css:1005 |
| `.btn--primary` | زر ذهبي ممتلئ | main.css:916 |
| `.btn--outline` | زر بإطار ذهبي مع hover effect تعبئة | main.css:927 |
| `.btn--text` | زر نصي مع سهم متحرك | main.css:955 |
| `.btn--whatsapp` | زر واتساب أخضر | main.css:991 |
| `.tag-pill` | وسوم دائرية صغيرة | components.css:95 |
| `.live-link` | لينك مع نقطة خضراء نابضة | components.css:114 |
| `.social-link` | أيقونة社交 دائرية | components.css:143 |
| `.section-divider` | خط فاصل ذهبي مع هيكس | components.css:71 |
| `.section-watermark` | هيكس خلفية شفاف كبير | components.css:183 |
| `.hamburger-line` | خطوط هامبرغر مع animate لـ X | components.css:213 |
| `.page-transition` | ترانزيشن بين الصفحات (هيكس دوّار) | components.css:236 |
| `.hexagon-decor` | هيكس زخرفي صغير | main.css:182 |
| `.service-card` | كارد خدمة مع أيقونة هيكس | main.css:1024 |
| `.team-card` | كارد فريق مع صورة دائرية + 3D tilt | main.css:1083 |
| `.testimonial-card` | كارد شهادة عميل | main.css:671 |
| `.project-card` | كارد مشروع مع صورة | main.css:1295 |
| `.value-card` | كارد قيمة مع أيقونة | main.css:1406 |

---

## 12. الـ 3rd Party Libraries

| المكتبة | الإصدار | الاستخدام | مصدر CDN |
|---------|---------|-----------|----------|
| GSAP | 3.12.5 | كل الأنيميشن | cdnjs |
| ScrollTrigger | 3.12.5 | scroll-based reveals | cdnjs (جزء من GSAP) |
| SplitText | 3.12.5 | تقسيم headline لكلمات | cdnjs |
| Lenis | 1.1.13 | سكرول سلس | unpkg |

كلها محملة بـ `defer` في نهاية الـ body.

---

## 13. الـ SEO

- `application/ld+json` — LocalBusiness schema (name, phone, address, language)
- Open Graph: og:title, og:description, og:image, og:type, og:url
- canonical URLs لكل صفحة
- Vercel headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`
- Vercel rewrites: `/portfolio` → `/portfolio.html`, `/about` → `/about.html`

---

## 14. TODO (مهام مستقبلية)

### صور
- [ ] إضافة SVG logo بدلاً من "نواة" النص
- [ ] إضافة صور الفريق (400×400px, JPG/PNG)
- [ ] إضافة شعارات العملاء (200×200px, PNG خلفية شفافة)
- [ ] إضافة صور Portfolio (390×844 للموبايل، 1440×900 للديسكتوب)
- [ ] تحسين صور الكيرسر (ضغط lossless لتقليل 1.7MB)
- [ ] تحسين OG image (assets/images/og-image.jpg)

### محتوى
- [ ] تفعيل testimonial #2 و #3 الموجودين (معلقين حالياً)
- [ ] تعبئة مشاريع الـ Portfolio
- [ ] تحديث لينك Instagram
- [ ] إعداد صفحة Privacy Policy

### تقنية
- [ ] تحسين lazy loading للصور (loading="lazy")
- [ ] إضافة preload لأهم الأصول (critical CSS, hero font)
- [ ] تدقيق الـ HTML validation
- [ ] إضافة sitemap.xml
- [ ] إضافة robots.txt

---

## 15. ملاحظات الأداء الحالية

### تم بالفعل
- ✅ `defer` على جميع السكربتات
- ✅ Lenis لا يعمل تحت 768px
- ✅ Canvas: موبايل 20 ذرة كحد أقصى + بدون توصيلات
- ✅ Mouse events throttled بـ rAF في Canvas
- ✅ تم حذف Plus Jakarta Sans (غير مستخدم)
- ✅ تحسين تباعد الجوال وإضافة RTL fixes

### لا يزال بحاجة للتحسين
- صور الكيرسر 1.7MB (بناءً على طلب المستخدم، تم الإبقاء على الصور الأصلية)
- لا يوجد lazy loading للصور المستقبلية
- render-blocking CSS (أولوية منخفضة — معتاد في static sites)

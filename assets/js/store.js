/* ==========================================================================
   Nawah Store — vanilla JS (bundles first, grouped & ranked catalog)
   Bilingual: reads documentElement.lang and re-renders on `languageChanged`.
   No cart: orders are sent from the details modal via WhatsApp.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PRODUCTS = window.NAWAH_PRODUCTS || [];
  const CATEGORIES = window.NAWAH_CATEGORIES || [];
  const CAT = {};
  CATEGORIES.forEach((c) => { CAT[c.key] = c; });

  const WA = "963998950904";

  const lang = () => (root.getAttribute("lang") === "ar" ? "ar" : "en");
  const tt = (key, fallback) => {
    try {
      const v = translations && translations[lang()] && translations[lang()][key];
      return v || fallback || "";
    } catch (e) { return fallback || ""; }
  };
  const L = (field) => (field && (field[lang()] || field.en || field.ar)) || "";
  const catLabel = (key) => (CAT[key] ? CAT[key][lang()] : key);

  /* Preview media (image links) — loaded from assets/data/store-media.json.
     Values left as the temporary "h" placeholder fall back to the product SVG. */
  let MEDIA = {};
  const mediaFor = (p) => {
    const m = MEDIA && MEDIA[p.id];
    if (m && (m.groups || m.images || m.single)) return m;
    return (MEDIA && MEDIA._default) || null;
  };
  const cardImg = (p) => {
    const m = MEDIA && MEDIA[p.id];
    return m && m.card && m.card !== "h" ? m.card : p.img;
  };

  const money = (n, cur) => {
    if (n === null || n === undefined || n === 0) return "";
    if (cur === "SYP") return n.toLocaleString("en-US") + " " + (lang() === "ar" ? "ل.س" : "SYP");
    return "$" + n;
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* -------------------------------------------------------------------------
     Reduced categories: 5 groups (instead of 11) + a separate bundles track.
     The product data itself is left untouched; grouping is resolved here.
     ------------------------------------------------------------------------- */
  const GROUP_OF = {
    qr: "identity", menu: "identity", catalog: "identity",
    app: "identity", brand: "identity", "add-photo": "identity",

    invoice: "systems", booking: "systems", loyalty: "systems", pos: "systems",
    store: "systems", stock: "systems", esign: "systems", care: "systems",
    zatca: "systems", pay: "systems", api: "systems", erp: "systems",
    delivery: "systems", membership: "systems", "add-hosting": "systems",
    "add-tables": "systems",

    bot: "growth", social: "growth", ads: "growth", campaign: "growth",
    cro: "growth", video: "growth", market: "growth", "add-seo": "growth",

    hr: "management", crm: "management", dash: "management", queue: "management",
    clinic: "management", school: "management", estate: "management",
    "add-training": "management",

    "sm-lighting": "smart", "sm-camera": "smart", "sm-lock": "smart",
    "sm-ac": "smart", "sm-curtain": "smart", "sm-voice": "smart",
    "sm-monitor": "smart",

    "pack-start": "bundles", "pack-growth": "bundles",
    "pack-pro": "bundles", "pack-smart": "bundles"
  };

  const GROUPS = {
    identity:   { ar: "الهوية والمحتوى", en: "Identity & Content" },
    systems:    { ar: "الأنظمة والمبيعات", en: "Systems & Sales" },
    growth:     { ar: "التسويق والنمو", en: "Marketing & Growth" },
    management: { ar: "الإدارة والقطاعات", en: "Management & Sectors" },
    smart:      { ar: "المنزل الذكي", en: "Smart Home" }
  };
  const GROUP_ORDER = ["identity", "systems", "growth", "management", "smart"];
  const groupOf = (p) => GROUP_OF[p.id] || p.group || "";
  const gLabel = (g) => (GROUPS[g] ? GROUPS[g][lang()] : g);

  /* Sellability ranking — best sellers first. Bundles keep their own order. */
  const RANK = [
    "qr", "menu", "catalog", "invoice", "booking", "loyalty",
    "pack-start", "pack-growth", "pos", "store", "hr", "esign", "zatca",
    "bot", "social", "ads", "campaign", "video", "market", "membership", "queue",
    "clinic", "school", "estate", "app", "brand", "pack-pro", "pack-smart",
    "sm-lighting", "sm-camera", "sm-lock", "sm-ac", "sm-curtain", "sm-voice",
    "sm-monitor", "add-hosting", "add-seo", "add-training", "add-photo",
    "add-tables", "pay", "care", "dash", "crm", "stock", "api"
  ];
  const rankOf = (p) => { const i = RANK.indexOf(p.id); return i < 0 ? 999 : i; };
  const byRank = (a, b) => rankOf(a) - rankOf(b);

  const SERVICES = PRODUCTS.filter((p) => groupOf(p) !== "bundles").sort(byRank);

  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-11"/></svg>';
  const ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  /* -------------------------------------------------------------------------
     Scroll reveal (progressive enhancement)
     ------------------------------------------------------------------------- */
  let io = null;
  function observeReveal(node) {
    if (reduced || !("IntersectionObserver" in window)) { node.classList.remove("reveal"); return; }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.classList.add("in");
          const done = () => el.classList.remove("reveal", "in");
          el.addEventListener("animationend", done, { once: true });
          setTimeout(done, 1500);
          io.unobserve(el);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    }
    io.observe(node);
  }
  function revealAll(scope) {
    $$(".reveal", scope || document).forEach(observeReveal);
  }

  /* -------------------------------------------------------------------------
     Filters + search + grid
     ------------------------------------------------------------------------- */
  const grid = $("#grid");
  const packsGrid = $("#packsGrid");
  const chips = $("#chips");
  const q = $("#q");
  const meta = $("#storeMeta");
  let activeCat = "all";
  let query = "";

  function groupList() {
    const present = [];
    SERVICES.forEach((p) => { const g = groupOf(p); if (g && present.indexOf(g) < 0) present.push(g); });
    return GROUP_ORDER.filter((g) => present.indexOf(g) > -1);
  }

  function buildChips() {
    const items = [{ key: "all", label: tt("store.all", "All") }]
      .concat(groupList().map((g) => ({ key: g, label: gLabel(g) })));
    chips.innerHTML = items.map((c) =>
      '<button class="chip" type="button" data-cat="' + c.key + '" aria-pressed="' +
      (c.key === activeCat) + '">' + esc(c.label) + "</button>").join("");
  }

  function match(p) {
    if (activeCat !== "all" && groupOf(p) !== activeCat) return false;
    if (!query) return true;
    const hay = [L(p.title), L(p.short), L(p.desc), (L(p.feats) || []).join(" "),
      catLabel(p.cat), gLabel(groupOf(p))].join(" ").toLowerCase();
    return hay.indexOf(query) > -1;
  }

  function cardHTML(p, i) {
    const badge = L(p.badge);
    const price = p.contact
      ? '<span class="price price--contact"><b>' + esc(tt("store.contact", "Contact Us")) + "</b></span>"
      : '<span class="price"><b>' + money(p.price, p.cur) + "</b>" +
          (p.old ? "<del>" + money(p.old, p.cur) + "</del>" : "") + "</span>";
    return (
      '<article class="glass-card product-card reveal" style="--d:' + Math.min(i, 9) * 45 + 'ms" ' +
        'id="item-' + p.id + '" data-id="' + p.id + '" tabindex="0">' +
        '<div class="product-card__media">' +
          '<img class="product-card__img" src="' + cardImg(p) + '" alt="' + esc(L(p.title)) +
            '" width="800" height="600" loading="lazy" decoding="async">' +
          '<span class="product-card__cat">' + esc(gLabel(groupOf(p))) + "</span>" +
          (badge ? '<span class="product-card__badge">' + esc(badge) + "</span>" : "") +
        "</div>" +
        '<div class="product-card__body">' +
          '<h3 class="product-card__title">' + esc(L(p.title)) + "</h3>" +
          '<p class="product-card__desc">' + esc(L(p.short)) + "</p>" +
          '<div class="product-card__foot">' +
            price +
            '<span class="product-card__actions">' +
              '<button class="pbtn pbtn--solid" type="button" data-view="' + p.id + '" ' +
                'aria-label="' + esc(tt("store.details", "Details")) + " " + esc(L(p.title)) + '">' +
                esc(tt("store.details", "Details")) + "</button>" +
            "</span>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* -------------------------------------------------------------------------
     Bundles (packs) — rendered first, above the catalog
     ------------------------------------------------------------------------- */
  function waURL(p) {
    const url = location.origin + location.pathname + "#" + p.id;
    const isBundle = groupOf(p) === "bundles";
    const catName = isBundle ? (lang() === "ar" ? "باقة" : "Bundle") : catLabel(p.cat);
    const priceLine = p.contact
      ? (lang() === "ar" ? "السعر: تواصل معنا" : "Price: Contact us")
      : (lang() === "ar" ? "السعر: " : "Price: ") + money(p.price, p.cur) +
        (p.old ? (lang() === "ar" ? " (بدلاً من " + money(p.old, p.cur) + ")" : " (was " + money(p.old, p.cur) + ")") : "");
    const msg = lang() === "ar"
      ? [
          "مرحباً نواة، أريد طلب هذه الخدمة من الموقع:",
          "",
          "• " + L(p.title),
          "التصنيف: " + catName,
          priceLine,
          "",
          "الرابط: " + url,
          "",
          "أرجو التواصل معي لتأكيد التفاصيل."
        ].join("\n")
      : [
          "Hello Nawah, I'd like to order this service from the website:",
          "",
          "• " + L(p.title),
          "Category: " + catName,
          priceLine,
          "",
          "Link: " + url,
          "",
          "Please get in touch to confirm the details."
        ].join("\n");
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
  }

  function packHTML(p, i) {
    const smart = p.id === "pack-smart";
    const feats = (L(p.feats) || []).slice(0, smart ? 6 : 4);
    const list = '<ul class="pack__list">' +
      feats.map((f) => "<li>" + ICON_CHECK + "<span>" + esc(f) + "</span></li>").join("") + "</ul>";
    const badge = L(p.badge) ? '<span class="pack__badge">' + esc(L(p.badge)) + "</span>" : "";
    const price =
      '<p class="pack__price">' + money(p.price) + " <small>" +
      (p.old ? (lang() === "ar" ? "بدل " + money(p.old) : "was " + money(p.old))
             : (lang() === "ar" ? "لمرة واحدة" : "one-time")) + "</small></p>";
    const cta =
      '<div class="pack__cta">' +
        '<a class="btn btn--whatsapp btn--order btn--sm" href="' + waURL(p) + '" target="_blank" rel="noopener noreferrer">' +
          esc(tt("store.modal.whatsapp", "Order Now")) + "</a>" +
        '<button class="btn btn--outline btn--sm" type="button" data-view="' + p.id + '">' +
          esc(tt("store.pack.details", "Details")) + "</button>" +
      "</div>";
    const delay = ' style="--d:' + i * 90 + 'ms"';

    if (smart) {
      return (
        '<article class="pack pack--smart reveal" id="item-' + p.id + '" data-id="' + p.id + '"' + delay + ">" +
          '<div class="pack--smart__media">' +
            '<img src="' + cardImg(p) + '" alt="' + esc(L(p.title)) + '" width="900" height="700" loading="lazy" decoding="async">' +
          "</div>" +
          '<div class="pack--smart__body">' + badge +
            "<h4>" + esc(L(p.title)) + "</h4>" + price +
            '<p class="pack__desc">' + esc(L(p.short)) + "</p>" + list + cta +
          "</div>" +
        "</article>"
      );
    }

    return (
      '<article class="pack reveal" id="item-' + p.id + '" data-id="' + p.id + '"' + delay + ">" +
        badge + "<h4>" + esc(L(p.title)) + "</h4>" + price +
        '<p class="pack__desc">' + esc(L(p.short)) + "</p>" + list + cta +
      "</article>"
    );
  }

  function renderPacks() {
    if (!packsGrid) return;
    packsGrid.innerHTML = PRODUCTS.filter((p) => groupOf(p) === "bundles")
      .sort(byRank).map(packHTML).join("");
    revealAll(packsGrid);
  }

  /* -------------------------------------------------------------------------
     Catalog render
     ------------------------------------------------------------------------- */
  function focusHash(list) {
    let hash = location.hash.replace("#", "");
    if (!hash) return;
    const p = byId(hash);
    if (!p) return;
    const target = document.getElementById("item-" + hash);
    if (!target) return;
    target.classList.remove("reveal");
    target.classList.add("is-target");
    setTimeout(() => {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      setTimeout(() => target.classList.remove("is-target"), 2600);
    }, 90);
  }

  function render() {
    const list = SERVICES.filter(match);
    if (!list.length) {
      grid.innerHTML =
        '<div class="store__empty">' + ICON_SEARCH +
          "<h3>" + esc(tt("store.empty.title", "No results")) + "</h3>" +
          "<p>" + esc(tt("store.empty.desc", "")) + "</p></div>";
    } else {
      grid.innerHTML = list.map(cardHTML).join("");
      revealAll(grid);
    }
    meta.textContent = list.length + " " + tt("store.results", "services available");
    focusHash(list);
  }

  chips.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    activeCat = b.dataset.cat;
    $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    render();
  });

  let qt;
  q.addEventListener("input", () => {
    clearTimeout(qt);
    qt = setTimeout(() => { query = q.value.trim().toLowerCase(); render(); }, 140);
  });

  /* -------------------------------------------------------------------------
     Details modal + interactive preview
     ------------------------------------------------------------------------- */
  const modal = $("#modal");
  const mDevice = $("#mDevice");
  let current = null;

  /* Interactive preview — builds its button groups from the media config so
     each service can expose its own buttons (light/dark, desktop/phone,
     AR/EN, real-life, video, domain/email, …). The image for the current
     selection is looked up in the JSON `images` map. */
  function renderPreview(p) {
    const controls = $("#pvControls");
    const cfg = mediaFor(p);
    const base = cardImg(p);
    controls.innerHTML = "";
    mDevice.dataset.theme = "light";
    mDevice.dataset.frame = "desktop";

    if (!cfg || ((!cfg.groups || !cfg.groups.length) && !cfg.images)) {
      $("#mImg").src = base;
      return;
    }

    const state = {};
    const key = () => (cfg.groups || []).map((g) => state[g.key]).join("__");
    const pick = () => {
      const src = (cfg.images || {})[key()];
      if (src && src !== "h") return src;
      if (cfg.single && cfg.single !== "h") return cfg.single;
      return base;
    };

    controls.innerHTML = (cfg.groups || []).map((g) =>
      '<div class="seg" data-group="' + esc(g.key) + '">' +
        g.options.map((o) =>
          '<button type="button" data-opt="' + esc(o.key) + '"' +
          (o.default ? ' class="active"' : "") + ">" +
          esc(lang() === "ar" ? (o.ar || o.en) : (o.en || o.ar)) + "</button>").join("") +
      "</div>").join("");

    (cfg.groups || []).forEach((g) => {
      const def = g.options.find((o) => o.default) || g.options[0];
      state[g.key] = def.key;
    });

    const apply = () => {
      $("#mImg").src = pick();
      const frame = state.frame || state.view;
      mDevice.dataset.frame = frame === "phone" ? "phone" : "desktop";
      if (state.theme) mDevice.dataset.theme = state.theme;
    };
    apply();

    controls.onclick = (e) => {
      const b = e.target.closest("[data-opt]");
      if (!b) return;
      const seg = b.closest(".seg");
      state[seg.dataset.group] = b.dataset.opt;
      $$("[data-opt]", seg).forEach((x) => x.classList.toggle("active", x === b));
      apply();
    };
  }

  function fillModal(p) {
    $("#mImg").src = cardImg(p);
    $("#mImg").alt = L(p.title);
    $("#mCat").textContent = groupOf(p) === "bundles"
      ? (lang() === "ar" ? "باقة" : "Bundle")
      : catLabel(p.cat);
    $("#mTitle").textContent = L(p.title);
    $("#mDesc").textContent = L(p.desc);
    $("#mPrice").textContent = p.contact ? tt("store.contact", "Contact Us") : money(p.price, p.cur);
    $("#mOld").textContent = !p.contact && p.old ? money(p.old, p.cur) : "";

    const extra = $("#mExtra");
    if (p.extra && p.extra.price) {
      extra.style.display = "";
      extra.innerHTML = '<span>' + esc(L(p.extra.label) || "") + ": </span><b>" +
        money(p.extra.price, p.cur) + "</b>" +
        (p.extra.old ? ' <del>' + money(p.extra.old, p.cur) + "</del>" : "");
    } else {
      extra.style.display = "none";
      extra.innerHTML = "";
    }

    const req = $("#mReq");
    if (p.req) {
      req.style.display = "";
      req.innerHTML = "<b>" + esc(tt("store.req", "Requirements:")) + "</b> " + esc(L(p.req));
    } else {
      req.style.display = "none";
      req.innerHTML = "";
    }

    $("#mList").innerHTML = (L(p.feats) || [])
      .map((f) => "<li>" + ICON_CHECK + "<span>" + esc(f) + "</span></li>").join("");

    const w = $("#mWhats");
    if (p.soon) {
      w.textContent = tt("store.soon", "Coming Soon");
      w.removeAttribute("href");
      w.setAttribute("aria-disabled", "true");
      w.classList.add("is-disabled");
    } else {
      w.textContent = tt("store.modal.whatsapp", "Order Now");
      w.href = waURL(p);
      w.removeAttribute("aria-disabled");
      w.classList.remove("is-disabled");
    }

    renderPreview(p);
  }

  function openModal(id) {
    const p = byId(id);
    if (!p) return;
    current = id;
    fillModal(p);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    current = null;
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  $("#mX").addEventListener("click", closeModal);

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* Card + pack clicks (event delegation) */
  document.addEventListener("click", (e) => {
    if (e.target.closest("a[href]")) return;
    const v = e.target.closest("[data-view]");
    if (v) { openModal(v.dataset.view); return; }
    const card = e.target.closest(".product-card[data-id], .pack[data-id]");
    if (card) openModal(card.dataset.id);
  });

  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("product-card")) {
      e.preventDefault();
      openModal(e.target.dataset.id);
    }
  });

  /* Custom cursor hover state on dynamic cards */
  grid.addEventListener("mouseover", (e) => {
    if (e.target.closest(".product-card")) document.body.classList.add("cursor--hover");
  });
  grid.addEventListener("mouseout", (e) => {
    if (e.target.closest(".product-card")) document.body.classList.remove("cursor--hover");
  });

  /* -------------------------------------------------------------------------
     Language switch + boot
     ------------------------------------------------------------------------- */
  document.addEventListener("languageChanged", () => {
    buildChips();
    renderPacks();
    render();
    if (current) {
      const p = byId(current);
      if (p) fillModal(p);
    }
  });

  buildChips();
  renderPacks();
  render();
  revealAll(document);

  /* Load the editable image-link map, then refresh if it arrives after paint */
  fetch("assets/data/store-media.json")
    .then((r) => (r.ok ? r.json() : {}))
    .then((json) => {
      MEDIA = json || {};
      renderPacks();
      render();
      if (modal.classList.contains("open") && current) {
        const p = byId(current);
        if (p) fillModal(p);
      }
    })
    .catch(() => { MEDIA = {}; });
})();

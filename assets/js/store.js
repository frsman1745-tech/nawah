/* ==========================================================================
   نــواة | المتجر — منطق خفيف بدون مكتبات (فلترة، بحث، معاينة تفاعلية)
   Nawah Store — vanilla JS: filtering, search, interactive product details.
   بدون سلة: الطلب مباشر من نافذة التفاصيل عبر واتساب.
   Bilingual: reads documentElement.lang and re-renders on `languageChanged`.
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

  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const money = (n) => "$" + n;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-11"/></svg>';
  const ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  /* =========================================================
     الفلاتر + البحث + الشبكة
     ========================================================= */
  const grid = $("#grid");
  const chips = $("#chips");
  const q = $("#q");
  const meta = $("#storeMeta");
  let activeCat = "all";
  let query = "";

  function usedCats() {
    const used = new Set(PRODUCTS.map((p) => p.cat));
    return CATEGORIES.filter((c) => used.has(c.key));
  }

  function buildChips() {
    const cats = [{ key: "all", label: tt("store.all", "All") }]
      .concat(usedCats().map((c) => ({ key: c.key, label: c[lang()] })));
    chips.innerHTML = cats.map((c) =>
      '<button class="chip" type="button" data-cat="' + c.key + '" aria-pressed="' +
      (c.key === activeCat) + '">' + esc(c.label) + "</button>").join("");
  }

  function match(p) {
    if (activeCat !== "all" && p.cat !== activeCat) return false;
    if (!query) return true;
    const hay = [L(p.title), L(p.short), L(p.desc), (L(p.feats) || []).join(" "), catLabel(p.cat)]
      .join(" ").toLowerCase();
    return hay.indexOf(query) > -1;
  }

  function cardHTML(p) {
    const badge = L(p.badge);
    return (
      '<article class="glass-card product-card" id="item-' + p.id + '" data-id="' + p.id + '" tabindex="0">' +
        '<div class="product-card__media">' +
          '<img class="product-card__img" src="' + p.img + '" alt="' + esc(L(p.title)) +
            '" width="800" height="600" loading="lazy" decoding="async">' +
          '<span class="product-card__cat">' + esc(catLabel(p.cat)) + "</span>" +
          (badge ? '<span class="product-card__badge">' + esc(badge) + "</span>" : "") +
        "</div>" +
        '<div class="product-card__body">' +
          '<h3 class="product-card__title">' + esc(L(p.title)) + "</h3>" +
          '<p class="product-card__desc">' + esc(L(p.short)) + "</p>" +
          '<ul class="product-card__feats">' +
            (L(p.feats) || []).slice(0, 3).map((f) => "<li>" + esc(f) + "</li>").join("") +
          "</ul>" +
          '<div class="product-card__foot">' +
            '<span class="price"><b>' + money(p.price) + "</b>" +
              (p.old ? "<del>" + money(p.old) + "</del>" : "") + "</span>" +
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

  function render() {
    const list = PRODUCTS.filter(match);
    if (!list.length) {
      grid.innerHTML =
        '<div class="store__empty">' + ICON_SEARCH +
          "<h3>" + esc(tt("store.empty.title", "No results")) + "</h3>" +
          "<p>" + esc(tt("store.empty.desc", "")) + "</p></div>";
    } else {
      grid.innerHTML = list.map(cardHTML).join("");
    }
    meta.textContent = list.length + " " + tt("store.results", "services available");

    let hash = location.hash.replace("#", "");
    if (hash && byId(hash)) {
      const target = document.getElementById("item-" + hash);
      if (target) {
        target.classList.add("is-target");
        setTimeout(() => {
          target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
          setTimeout(() => target.classList.remove("is-target"), 2600);
        }, 120);
      }
    }
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

  /* =========================================================
     نافذة التفاصيل + المعاينة التفاعلية
     ========================================================= */
  const modal = $("#modal");
  const mDevice = $("#mDevice");
  let current = null;

  function fillModal(p) {
    $("#mImg").src = p.img;
    $("#mImg").alt = L(p.title);
    $("#mCat").textContent = catLabel(p.cat);
    $("#mTitle").textContent = L(p.title);
    $("#mDesc").textContent = L(p.desc);
    $("#mPrice").textContent = money(p.price);
    $("#mOld").textContent = p.old ? money(p.old) : "";
    $("#mList").innerHTML = (L(p.feats) || [])
      .map((f) => "<li>" + ICON_CHECK + "<span>" + esc(f) + "</span></li>").join("");
    updateWhats(p);
  }

  /* رسالة واتساب جاهزة للطلب — تُبنى من المنتج المفتوح حالياً */
  function updateWhats(p) {
    const url = location.origin + location.pathname + "#" + p.id;
    const msg = lang() === "ar"
      ? [
          "مرحباً نواة، أريد طلب هذه الخدمة من الموقع:",
          "",
          "• " + L(p.title),
          "التصنيف: " + catLabel(p.cat),
          "السعر: " + money(p.price) + (p.old ? " (بدلاً من " + money(p.old) + ")" : ""),
          "",
          "الرابط: " + url,
          "",
          "أرجو التواصل معي لتأكيد التفاصيل."
        ].join("\n")
      : [
          "Hello Nawah, I'd like to order this service from the website:",
          "",
          "• " + L(p.title),
          "Category: " + catLabel(p.cat),
          "Price: " + money(p.price) + (p.old ? " (was " + money(p.old) + ")" : ""),
          "",
          "Link: " + url,
          "",
          "Please get in touch to confirm the details."
        ].join("\n");
    $("#mWhats").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
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

  $("#pvTheme").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pv-theme]");
    if (!b) return;
    $$("[data-pv-theme]", $("#pvTheme")).forEach((x) => x.classList.toggle("active", x === b));
    mDevice.dataset.theme = b.dataset.pvTheme;
  });
  $("#pvFrame").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pv-frame]");
    if (!b) return;
    $$("[data-pv-frame]", $("#pvFrame")).forEach((x) => x.classList.toggle("active", x === b));
    mDevice.dataset.frame = b.dataset.pvFrame;
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* نقرات الشبكة (تفويض الأحداث) */
  grid.addEventListener("click", (e) => {
    const v = e.target.closest("[data-view]");
    const card = e.target.closest(".product-card");
    if (v) { openModal(v.dataset.view); return; }
    if (card) openModal(card.dataset.id);
  });

  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("product-card")) {
      e.preventDefault();
      openModal(e.target.dataset.id);
    }
  });

  /* تأثير الكيرسور المخصص على البطاقات الديناميكية */
  grid.addEventListener("mouseover", (e) => {
    if (e.target.closest(".product-card")) document.body.classList.add("cursor--hover");
  });
  grid.addEventListener("mouseout", (e) => {
    if (e.target.closest(".product-card")) document.body.classList.remove("cursor--hover");
  });

  /* =========================================================
     تبديل اللغة + التشغيل
     ========================================================= */
  document.addEventListener("languageChanged", () => {
    buildChips();
    render();
    if (current) {
      const p = byId(current);
      if (p) fillModal(p);
    }
  });

  buildChips();
  render();
})();

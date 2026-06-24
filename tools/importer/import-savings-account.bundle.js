/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-savings-account.js
  var import_savings_account_exports = {};
  __export(import_savings_account_exports, {
    default: () => import_savings_account_default
  });

  // tools/importer/parsers/hero-carousel.js
  function parse(element, { document }) {
    let items = Array.from(element.querySelectorAll(".owl-item:not(.cloned) .hero-carousel-item, .owl-item:not(.cloned) .hero-slider"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(".hero-carousel-item, .hero-slider"));
    }
    const seen = /* @__PURE__ */ new Set();
    const buildImg = (srcset) => {
      if (!srcset) return null;
      const img = document.createElement("img");
      img.src = srcset.split(",")[0].trim().split(/\s+/)[0];
      return img;
    };
    const getColor = (el) => {
      if (!el) return "";
      const attr = el.getAttribute("font-color");
      if (attr) return attr.trim();
      const style = el.getAttribute("style") || "";
      const m = style.match(/color:\s*([^;]+)/i);
      return m ? m[1].trim() : "";
    };
    const cells = [];
    items.forEach((item) => {
      const picture = item.querySelector("picture");
      let desktopCell = "";
      let mobileCell = "";
      if (picture) {
        const desktopSource = picture.querySelector('source[media*="min-width"]');
        const mobileSource = picture.querySelector('source[media*="max-width"]');
        const img = picture.querySelector("img");
        const imgSrc = img ? img.getAttribute("src") || img.getAttribute("data-src") : null;
        const desktopSrcset = desktopSource ? desktopSource.getAttribute("srcset") || desktopSource.getAttribute("data-srcset") : null;
        const mobileSrcset = mobileSource ? mobileSource.getAttribute("srcset") || mobileSource.getAttribute("data-srcset") : null;
        const desktopImg = buildImg(desktopSrcset) || (imgSrc ? buildImg(imgSrc) : null);
        const mobileImg = buildImg(mobileSrcset);
        if (desktopImg) {
          const alt = img ? img.getAttribute("alt") || "" : "";
          desktopImg.alt = alt;
          desktopCell = desktopImg;
        }
        if (mobileImg) {
          mobileImg.alt = desktopImg ? desktopImg.alt : "";
          mobileCell = mobileImg;
        }
      }
      const titleEl = item.querySelector(".hero-banner-title, h1, h2, h3");
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      const titleColor = getColor(titleEl);
      const descEl = item.querySelector(".hero-banner-desc");
      let subtitle = "";
      if (descEl) {
        subtitle = descEl.textContent.replace(/\s+/g, " ").trim();
      }
      const subtitleColor = getColor(descEl);
      const ctaEl = item.querySelector(".btn-box a, a.btn-primary, a.btn");
      let ctaLabel = "";
      let ctaHref = "";
      if (ctaEl) {
        ctaLabel = ctaEl.textContent.replace(/\s+/g, " ").trim();
        ctaHref = ctaEl.getAttribute("data-desktoplink") || ctaEl.getAttribute("href") || "";
      }
      if (!desktopCell && !mobileCell && !title && !subtitle && !ctaLabel) return;
      const signature = `${desktopCell && desktopCell.src || mobileCell && mobileCell.src || ""}|${title}|${ctaHref}`;
      if (seen.has(signature)) return;
      seen.add(signature);
      cells.push([
        desktopCell,
        mobileCell,
        title,
        titleColor,
        subtitle,
        subtitleColor,
        ctaLabel,
        ctaHref
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/info-carousel.js
  function parse2(element, { document }) {
    const cleanHref = (a) => {
      if (!a) return "";
      const href = a.getAttribute("href") || "";
      if (!href || /^javascript:/i.test(href.trim()) || href.trim() === "#") return "";
      return href;
    };
    const text = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const buildIcon = (img) => {
      if (!img) return "";
      const src = img.getAttribute("src") || img.getAttribute("data-src");
      if (!src) return "";
      const out = document.createElement("img");
      out.src = src;
      out.alt = img.getAttribute("alt") || "";
      return out;
    };
    const collectCards = () => {
      let nodes = Array.from(element.querySelectorAll(".offer"));
      if (nodes.length) {
        return nodes.map((node) => ({
          title: text(node.querySelector(".ohidden h4, h4, h3")),
          subtitle: text(node.querySelector(".details-box, p")),
          icon: node.querySelector(".icon-box img, img"),
          href: cleanHref(node.querySelector("a"))
        }));
      }
      nodes = Array.from(element.querySelectorAll(".owl-item:not(.cloned) a.iconsider-large-a"));
      if (!nodes.length) nodes = Array.from(element.querySelectorAll("a.iconsider-large-a"));
      if (nodes.length) {
        return nodes.map((node) => ({
          title: text(node.querySelector(".iconsider-title")),
          subtitle: text(node.querySelector(".iconsider-dec")),
          icon: node.querySelector(".iconsider-large-img img, img"),
          href: cleanHref(node)
        }));
      }
      nodes = Array.from(element.querySelectorAll(".owl-item:not(.cloned) .offer-card-box"));
      if (!nodes.length) nodes = Array.from(element.querySelectorAll(".offer-card-box"));
      if (nodes.length) {
        return nodes.map((node) => {
          const link = node.querySelector('a.em-link[href]:not([href^="javascript"]), a[href]:not([href^="javascript"])');
          return {
            title: text(node.querySelector(".em-title, h4, h3")),
            subtitle: text(node.querySelector(".info-box, .share-comp-desc")),
            icon: node.querySelector(".em-img, img"),
            href: cleanHref(link)
          };
        });
      }
      return [];
    };
    const cards = collectCards();
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    cards.forEach((card) => {
      const iconCell = buildIcon(card.icon);
      if (!card.title && !card.subtitle && !iconCell) return;
      const sig = `${card.title}|${card.subtitle}|${iconCell && iconCell.src || ""}|${card.href}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      cells.push([card.title, card.subtitle, iconCell, card.href]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "info-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-account.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(':scope > .main-card, :scope > [class*="main-card"]'));
    const sourceCards = cards.length ? cards : Array.from(element.querySelectorAll(".sa-card"));
    const cells = [];
    sourceCards.forEach((card) => {
      const sa = card.querySelector(".sa-card") || card;
      const imgEl = sa.querySelector(".sa-tile-img.hidden-xs") || sa.querySelector(".sa-img-container img") || sa.querySelector("img");
      let imageCell = "";
      if (imgEl) {
        const img = document.createElement("img");
        img.src = imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || "";
        img.alt = imgEl.getAttribute("alt") || "";
        const imgDiv = document.createElement("div");
        imgDiv.append(img);
        imageCell = imgDiv;
      }
      const body = document.createElement("div");
      const titleEl = sa.querySelector(".sa-msg-title");
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
        body.append(h);
      }
      const offerTitle = sa.querySelector(".sa-offer-title");
      const offerDesc = sa.querySelector(".sa-offer-desc");
      if (offerTitle || offerDesc) {
        const offer = document.createElement("p");
        const parts = [];
        if (offerTitle && offerTitle.textContent.trim()) parts.push(offerTitle.textContent.trim());
        if (offerDesc && offerDesc.textContent.trim()) parts.push(offerDesc.textContent.trim());
        offer.innerHTML = `<strong>${parts.join(" - ")}</strong>`;
        if (parts.length) body.append(offer);
      }
      const bullets = sa.querySelector(".sa-card-bullets ul");
      if (bullets) {
        const ul = document.createElement("ul");
        Array.from(bullets.querySelectorAll(":scope > li")).forEach((li) => {
          const item = document.createElement("li");
          item.innerHTML = li.innerHTML.replace(/\s+/g, " ").trim();
          ul.append(item);
        });
        if (ul.children.length) body.append(ul);
      }
      const ctaEls = Array.from(sa.querySelectorAll(".sa-btn-section a, a.sa-red-btn, a.sa-transparent-btn"));
      const ctaSeen = /* @__PURE__ */ new Set();
      ctaEls.forEach((cta) => {
        const href = cta.getAttribute("href") || cta.getAttribute("data-des-link") || cta.getAttribute("data-mob-link") || "";
        if (!href || /^javascript:/i.test(href)) return;
        const label = cta.textContent.replace(/\s+/g, " ").trim();
        if (!label) return;
        const key = `${label}|${href}`;
        if (ctaSeen.has(key)) return;
        ctaSeen.add(key);
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        p.append(a);
        body.append(p);
      });
      if (!imageCell && !body.children.length) return;
      cells.push([imageCell, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-account", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/knowledge-hub.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".mf-card, .multiplelinkblock .mf-card"));
    const text = (el) => el ? el.textContent.replace(/\s+/g, " ").replace(/^[•\s]+/, "").trim() : "";
    const buildImg = (imgEl, alt) => {
      if (!imgEl) return "";
      const src = imgEl.getAttribute("src") || imgEl.getAttribute("data-src");
      if (!src) return "";
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt || imgEl.getAttribute("alt") || "";
      return img;
    };
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    let viewAllHref = "";
    let storiesViewAll = "";
    cards.forEach((card) => {
      const header = text(card.querySelector(".mf-header"));
      const items = Array.from(card.querySelectorAll(".mf-list-item"));
      items.forEach((item) => {
        const link = item.querySelector(".mf-list-item-text a[href], a[href]:not(.red-arrow)") || item.querySelector("a[href]");
        const title = link ? text(link) : text(item.querySelector(".mf-list-item-text"));
        const href = link ? link.getAttribute("href") || "" : "";
        const imageCell = buildImg(item.querySelector("img.mf-list-icon, img"), title);
        if (!title) return;
        const sig = `${header}|${title}|${href}`;
        if (seen.has(sig)) return;
        seen.add(sig);
        cells.push([header, title, imageCell, href]);
      });
      const cta = card.querySelector(".link-box a[href]");
      if (cta) {
        const ctaHref = cta.getAttribute("href") || "";
        const isStories = /story|stories/i.test(ctaHref) || /view all stories/i.test(cta.textContent);
        if (isStories && !storiesViewAll) storiesViewAll = ctaHref;
        if (!viewAllHref) viewAllHref = ctaHref;
      }
    });
    const finalViewAll = storiesViewAll || viewAllHref;
    if (finalViewAll) {
      cells.push(["", "", "", finalViewAll]);
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "knowledge-hub", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const wrapper = element.querySelector(".ctnt-wrapper") || element;
    const headings = Array.from(wrapper.querySelectorAll("h2.target, .target"));
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    headings.forEach((h) => {
      const strong = h.querySelector("strong");
      const question = (strong ? strong.textContent : h.textContent).replace(/\s+/g, " ").trim();
      if (!question) return;
      let sib = h.nextElementSibling;
      while (sib && !sib.classList.contains("toggle-ctnt")) sib = sib.nextElementSibling;
      const titleCell = document.createElement("p");
      titleCell.textContent = question;
      const contentCell = document.createElement("div");
      if (sib) {
        const source = sib.querySelector(".cmp-text") || sib;
        Array.from(source.children).forEach((child) => {
          if (child.tagName === "P" && !child.textContent.replace(/ /g, " ").trim() && !child.querySelector("a, img")) {
            return;
          }
          contentCell.append(child.cloneNode(true));
        });
        if (!contentCell.children.length) {
          const text = source.textContent.replace(/\s+/g, " ").trim();
          if (text) {
            const p = document.createElement("p");
            p.textContent = text;
            contentCell.append(p);
          }
        }
      }
      const sig = question;
      if (seen.has(sig)) return;
      seen.add(sig);
      cells.push([titleCell, contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/highlight-grid.js
  function parse6(element, { document }) {
    let cards = Array.from(element.querySelectorAll('.video .details-box, .details-box[data-type="video"]'));
    if (!cards.length) cards = Array.from(element.querySelectorAll(".hp-main-box"));
    const text = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const buildImg = (imgEl, alt) => {
      if (!imgEl) return "";
      let src = imgEl.getAttribute("src") || imgEl.getAttribute("data-originalsrc");
      if (!src) {
        const srcset = imgEl.getAttribute("srcset") || imgEl.getAttribute("data-srcset");
        if (srcset) src = srcset.split(",")[0].trim().split(/\s+/)[0];
      }
      if (!src) return "";
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt || imgEl.getAttribute("alt") || "";
      return img;
    };
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    cards.forEach((card) => {
      const titleEl = card.querySelector(".info-title, .video-title-large, .em-title");
      const title = text(titleEl);
      const linkEl = card.querySelector('a.em-link[href], a.track-videos[href], a[href*="youtube"], a[href*="youtu.be"]');
      const videoHref = linkEl ? linkEl.getAttribute("href") || "" : "";
      const imgEl = card.querySelector("img.em-img, .img-card img, img");
      const imageCell = buildImg(imgEl, title);
      const bodyEl = card.querySelector(".info-box .text, .info-box .comp-desc, .info-box");
      let bodyCell = "";
      if (bodyEl) {
        const wrap = document.createElement("div");
        const paras = Array.from(bodyEl.querySelectorAll("p"));
        if (paras.length) {
          paras.forEach((p) => {
            if (p.textContent.replace(/ /g, " ").trim()) {
              const np = document.createElement("p");
              np.innerHTML = p.innerHTML;
              wrap.append(np);
            }
          });
        } else if (text(bodyEl)) {
          const np = document.createElement("p");
          np.textContent = text(bodyEl);
          wrap.append(np);
        }
        if (wrap.children.length) bodyCell = wrap;
      }
      if (!title && !imageCell && !videoHref) return;
      const sig = `${title}|${imageCell && imageCell.src || ""}|${videoHref}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      const row = [title, imageCell, bodyCell];
      row.push(videoHref || "");
      cells.push(row);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "highlight-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/feature-cards.js
  function parse7(element, { document }) {
    let cards = Array.from(element.querySelectorAll(".featurecards .hp-main-box"));
    if (!cards.length) cards = Array.from(element.querySelectorAll(".hp-main-box"));
    const text = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const buildImg = (imgEl) => {
      if (!imgEl) return "";
      let src = imgEl.getAttribute("src") || imgEl.getAttribute("data-originalsrc");
      if (!src) {
        const srcset = imgEl.getAttribute("srcset") || imgEl.getAttribute("data-srcset");
        if (srcset) src = srcset.split(",")[0].trim().split(/\s+/)[0];
      }
      if (!src) return "";
      const img = document.createElement("img");
      img.src = src;
      img.alt = imgEl.getAttribute("alt") || "";
      return img;
    };
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    cards.forEach((card) => {
      const desktopCell = buildImg(card.querySelector("img.em-img, .em-img, img"));
      const mobileCell = "";
      const title1 = "";
      const title2 = text(card.querySelector(".info-title, .em-sub-title"));
      const title3 = text(card.querySelector(".info-box, .em-desc, .share-comp-desc"));
      const ctaEl = card.querySelector("a.em-cta, .link-box a, a.em-link[href]");
      let ctaLabel = "";
      let ctaHref = "";
      if (ctaEl) {
        ctaLabel = text(ctaEl) || "Know more";
        ctaHref = ctaEl.getAttribute("href") || "";
        if (/^javascript:/i.test(ctaHref)) ctaHref = "";
      }
      if (!ctaHref) {
        const overlay = card.querySelector("a.em-link[href], a.link-card[href]");
        if (overlay) ctaHref = overlay.getAttribute("href") || "";
      }
      if (!desktopCell && !title2 && !title3) return;
      const sig = `${desktopCell && desktopCell.src || ""}|${title2}|${ctaHref}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      cells.push([
        desktopCell,
        mobileCell,
        title1,
        title2,
        title3,
        ctaLabel,
        ctaHref
      ]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "feature-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-testimonial.js
  function parse8(element, { document }) {
    let cards = Array.from(element.querySelectorAll(".owl-item:not(.cloned) .hp-main-box"));
    if (!cards.length) cards = Array.from(element.querySelectorAll(".hp-main-box"));
    if (!cards.length) cards = Array.from(element.querySelectorAll(".featurecards"));
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    cards.forEach((card) => {
      const body = document.createElement("div");
      const nameEl = card.querySelector(".em-title, h4, h3");
      const name = nameEl ? nameEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (name) {
        const h = document.createElement("h4");
        h.textContent = name;
        body.append(h);
      }
      let rating = card.getAttribute("data-ratingvalue");
      if (!rating) {
        const filled = card.querySelectorAll(".rating .fa-star, .rating i.fa-star");
        if (filled.length) rating = String(filled.length);
      }
      if (rating) {
        const r = document.createElement("p");
        const num = parseInt(rating, 10);
        r.textContent = Number.isNaN(num) ? rating : "\u2605".repeat(num);
        body.append(r);
      }
      const quoteEl = card.querySelector(".desc, .info-box p, .share-comp-desc p");
      const quote = quoteEl ? quoteEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (quote) {
        const p = document.createElement("p");
        p.textContent = quote;
        body.append(p);
      }
      const dateEl = card.querySelector(".ohidden");
      const date = dateEl ? dateEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (date) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = date;
        p.append(em);
        body.append(p);
      }
      if (!body.children.length) return;
      const sig = `${name}|${quote}|${date}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      cells.push([body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/kotak-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#notification_widget",
        ".header-info-box"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".modal"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.header-container",
        "header",
        "nav.mobile-header",
        "footer.footer",
        "footer",
        ".back-to-top"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#unica-icon",
        "#startTime",
        ".productCategory",
        ".productParentPage"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/kotak-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolved = sections.map((section) => {
      let el = null;
      try {
        el = element.querySelector(section.selector);
      } catch (e) {
        el = null;
      }
      return { section, el };
    });
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) continue;
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (el.nextSibling) {
          el.parentElement.insertBefore(block, el.nextSibling);
        } else {
          el.parentElement.appendChild(block);
        }
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        el.parentElement.insertBefore(hr, el);
      }
    }
  }

  // tools/importer/import-savings-account.js
  var parsers = {
    "hero-carousel": parse,
    "info-carousel": parse2,
    "cards-account": parse3,
    "knowledge-hub": parse4,
    "accordion-faq": parse5,
    "highlight-grid": parse6,
    "feature-cards": parse7,
    "cards-testimonial": parse8
  };
  var PAGE_TEMPLATE = {
    name: "savings-account",
    description: "Kotak savings account product page with hero slider, offers, account variants, features, and FAQs",
    urls: [
      "https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html"
    ],
    blocks: [
      {
        name: "hero-carousel",
        instances: [
          "section.sa-hero-slider"
        ]
      },
      {
        name: "info-carousel",
        instances: [
          "div.iwantto.section div.what-we-offer.insurance-wantTo > div.white-bg-wrapper > div.row",
          "body > div.amp-page > div.wrapper.section:nth-of-type(1) div.iconslider.section",
          "body > div.amp-page > div.newoffers.section div.owl-carousel.common-slider"
        ]
      },
      {
        name: "cards-account",
        instances: [
          "div.iparys_inherited div.row.sa-card-container.af-card-container"
        ]
      },
      {
        name: "knowledge-hub",
        instances: [
          "body > div.amp-page > div.wrapper.section:nth-of-type(5) div.columncontrol.section"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "body > div.amp-page > div.wrapper.section:nth-of-type(7) div.card-rate-box.option2.prod-accordion"
        ]
      },
      {
        name: "highlight-grid",
        instances: [
          "body > div.amp-page > div.wrapper.section:nth-of-type(8) div.columncontrol.section"
        ]
      },
      {
        name: "feature-cards",
        instances: [
          "body > div.amp-page > div.wrapper.section:nth-of-type(9) div.columncontrol.section"
        ]
      },
      {
        name: "cards-testimonial",
        instances: [
          "body > div.amp-page > div.wrapper.section:nth-of-type(10) div.testimonial.section"
        ]
      }
    ],
    sections: [
      { id: "rc4", name: "breadcrumb", selector: "body > div:nth-of-type(5)", style: null, blocks: [], defaultContent: ["body > div:nth-of-type(5)"] },
      { id: "rc5", name: "hero", selector: "body > div:nth-of-type(6) > div.heroslider.section", style: null, blocks: ["hero-carousel"], defaultContent: [] },
      { id: "rc8", name: "intro", selector: "body > div:nth-of-type(7) > div.wrapper.section:nth-of-type(1)", style: null, blocks: [], defaultContent: ["body > div:nth-of-type(7) > div.wrapper.section:nth-of-type(1)"] },
      { id: "rc9", name: "why-choose", selector: "body > div:nth-of-type(7) > div.wrapper.section:nth-of-type(2)", style: null, blocks: ["info-carousel"], defaultContent: [] },
      { id: "rc11", name: "account-variants", selector: "body > div:nth-of-type(7) > div.iparys_inherited", style: null, blocks: ["cards-account"], defaultContent: [] },
      { id: "rc12", name: "legacy-accounts", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(1)", style: "light-grey", blocks: ["info-carousel"], defaultContent: [] },
      { id: "rc13", name: "rates-compare", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(2)", style: null, blocks: [], defaultContent: ["body > div.amp-page > div.wrapper.section:nth-of-type(2)"] },
      { id: "rc14", name: "offers", selector: "body > div.amp-page > div.newoffers.section", style: null, blocks: ["info-carousel"], defaultContent: [] },
      { id: "rc15", name: "how-to-open", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(4)", style: null, blocks: [], defaultContent: ["body > div.amp-page > div.wrapper.section:nth-of-type(4)"] },
      { id: "rc16", name: "knowledge", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(5)", style: "light-grey", blocks: ["knowledge-hub"], defaultContent: [] },
      { id: "rc17", name: "cta-banner", selector: "body > div.amp-page > div.callBack.section", style: null, blocks: [], defaultContent: ["body > div.amp-page > div.callBack.section"] },
      { id: "rc18", name: "faq", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(7)", style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc19", name: "related-videos", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(8)", style: null, blocks: ["highlight-grid"], defaultContent: [] },
      { id: "rc20", name: "related-products", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(9)", style: null, blocks: ["feature-cards"], defaultContent: [] },
      { id: "rc21", name: "testimonials", selector: "body > div.amp-page > div.wrapper.section:nth-of-type(10)", style: "light-grey", blocks: ["cards-testimonial"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_savings_account_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_savings_account_exports);
})();

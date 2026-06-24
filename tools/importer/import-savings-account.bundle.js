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
  function resolveSourceUrl(sourceEl) {
    if (!sourceEl) return "";
    const raw = sourceEl.getAttribute("srcset") || sourceEl.getAttribute("data-srcset") || "";
    return raw.split(",")[0].trim().split(/\s+/)[0] || "";
  }
  function parse(element, { document }) {
    let slideEls = Array.from(element.querySelectorAll(".owl-item:not(.cloned) .hero-carousel-item"));
    if (!slideEls.length) {
      slideEls = Array.from(element.querySelectorAll(".hero-carousel-item, .hero-slider"));
    }
    const cells = [];
    slideEls.forEach((slide) => {
      const picture = slide.querySelector("picture");
      let desktopUrl = "";
      let mobileUrl = "";
      let alt = "";
      if (picture) {
        desktopUrl = resolveSourceUrl(picture.querySelector('source[media*="min-width"]'));
        mobileUrl = resolveSourceUrl(picture.querySelector('source[media*="max-width"]'));
        const imgEl = picture.querySelector("img");
        if (imgEl) {
          alt = imgEl.getAttribute("alt") || "";
          if (!desktopUrl) {
            desktopUrl = imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || "";
          }
        }
      }
      if (!mobileUrl) mobileUrl = desktopUrl;
      let desktopImg = "";
      if (desktopUrl) {
        desktopImg = document.createElement("img");
        desktopImg.src = desktopUrl;
        desktopImg.alt = alt;
      }
      let mobileImg = "";
      if (mobileUrl) {
        mobileImg = document.createElement("img");
        mobileImg.src = mobileUrl;
        mobileImg.alt = alt;
      }
      const titleEl = slide.querySelector(".hero-banner-title");
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      const titleColor = titleEl ? titleEl.getAttribute("font-color") || titleEl.style && titleEl.style.color || "" : "";
      const descEl = slide.querySelector(".hero-banner-desc");
      let subtitle = "";
      let subtitleColor = "";
      if (descEl) {
        const text = descEl.textContent.replace(/ /g, " ").replace(/\s+/g, " ").trim();
        if (text) {
          subtitle = text;
          subtitleColor = descEl.getAttribute("font-color") || descEl.style && descEl.style.color || "";
        }
      }
      const ctaEl = slide.querySelector(".btn-box a, a.btn-primary");
      const ctaLabel = ctaEl ? ctaEl.textContent.replace(/\s+/g, " ").trim() : "";
      const ctaHref = ctaEl ? ctaEl.getAttribute("data-desktoplink") || ctaEl.getAttribute("href") || "" : "";
      if (!desktopImg && !mobileImg) return;
      cells.push([
        desktopImg ? [desktopImg] : [""],
        // 0 desktop image
        mobileImg ? [mobileImg] : [""],
        // 1 mobile image
        title,
        // 2 title
        titleColor,
        // 3 title color
        subtitle,
        // 4 subtitle
        subtitleColor,
        // 5 subtitle color
        ctaLabel,
        // 6 CTA label
        ctaHref
        // 7 CTA href
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
  function makeIcon(document, imgEl, alt) {
    if (!imgEl) return "";
    const src = imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || (imgEl.getAttribute("data-srcset") || "").split(",")[0].trim().split(/\s+/)[0] || "";
    if (!src) return "";
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || imgEl.getAttribute("alt") || "";
    return img;
  }
  function cleanHref(href) {
    if (!href) return "";
    if (href.startsWith("javascript:") || href === "#") return "";
    return href;
  }
  function parse2(element, { document }) {
    const cells = [];
    const offers = Array.from(element.querySelectorAll(".offer"));
    const legacy = Array.from(element.querySelectorAll("a.iconsider-large-a"));
    const offerCards = Array.from(element.querySelectorAll(".offer-card-box"));
    if (offers.length) {
      offers.forEach((card) => {
        const titleEl = card.querySelector("h4, .ohidden h4, .info-title");
        const title = titleEl ? titleEl.textContent.trim() : "";
        const subEl = card.querySelector("p.details-box, .details-box");
        const subtitle = subEl ? subEl.textContent.trim() : "";
        const icon = makeIcon(document, card.querySelector(".icon-box img, img"), title);
        const linkEl = card.querySelector("a[href]");
        const href = linkEl ? cleanHref(linkEl.getAttribute("href")) : "";
        if (title || subtitle || icon) {
          cells.push([title, subtitle, icon ? [icon] : [""], href]);
        }
      });
    } else if (legacy.length) {
      legacy.forEach((card) => {
        const titleEl = card.querySelector(".iconsider-title");
        const title = titleEl ? titleEl.textContent.trim() : "";
        const subEl = card.querySelector(".iconsider-dec");
        const subtitle = subEl ? subEl.textContent.trim() : "";
        const icon = makeIcon(document, card.querySelector(".iconsider-large-img img, img"), title);
        const href = cleanHref(card.getAttribute("href"));
        if (title || subtitle || icon) {
          cells.push([title, subtitle, icon ? [icon] : [""], href]);
        }
      });
    } else if (offerCards.length) {
      offerCards.forEach((card) => {
        const titleEl = card.querySelector("h4.em-title, .em-title");
        const title = titleEl ? titleEl.textContent.trim() : "";
        const subEl = card.querySelector(".em-desc .info-box, .em-desc p, .share-comp-desc");
        const subtitle = subEl ? subEl.textContent.trim() : "";
        const icon = makeIcon(document, card.querySelector("figure img, img.em-img, img"), title);
        const ctaEl = card.querySelector("a.em-cta[href], a.em-link[href]");
        const href = ctaEl ? cleanHref(ctaEl.getAttribute("href")) : "";
        if (title || subtitle || icon) {
          cells.push([title, subtitle, icon ? [icon] : [""], href]);
        }
      });
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "info-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-account.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > .main-card, .main-card"));
    const cells = [];
    cards.forEach((card) => {
      const inner = card.querySelector(".sa-card") || card;
      const img = inner.querySelector("img.sa-tile-img.hidden-xs") || inner.querySelector("img.sa-tile-img") || inner.querySelector(".sa-img-container img") || inner.querySelector("img");
      const imageCell = img ? [img] : [""];
      const contentCell = [];
      const titleP = inner.querySelector(".sa-msg-title");
      if (titleP && titleP.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = titleP.textContent.trim();
        contentCell.push(h);
      }
      const offer = inner.querySelector(".sa-offer-strip");
      if (offer) {
        const offerTitle = offer.querySelector(".sa-offer-title");
        const offerDesc = offer.querySelector(".sa-offer-desc");
        if (offerTitle && offerTitle.textContent.trim()) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = offerTitle.textContent.trim();
          p.append(strong);
          if (offerDesc && offerDesc.textContent.trim()) {
            p.append(document.createTextNode(" " + offerDesc.textContent.trim()));
          }
          contentCell.push(p);
        }
      }
      const bullets = inner.querySelector(".sa-card-bullets ul");
      if (bullets) contentCell.push(bullets);
      const ctas = Array.from(inner.querySelectorAll(".sa-btn-section a[href]"));
      ctas.forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (href && !href.startsWith("javascript:")) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = a.textContent.trim();
          const p = document.createElement("p");
          p.append(link);
          contentCell.push(p);
        }
      });
      if (contentCell.length || img) {
        cells.push([imageCell, contentCell.length ? contentCell : [""]]);
      }
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
    const cards = Array.from(element.querySelectorAll(".mf-card"));
    const cells = [];
    cards.forEach((card) => {
      const headerEl = card.querySelector(".mf-header");
      const header = headerEl ? headerEl.textContent.trim() : "";
      const items = Array.from(card.querySelectorAll("ul.mf-list > li.mf-list-item, .mf-list .mf-list-item"));
      items.forEach((li) => {
        const imgEl = li.querySelector("img.mf-list-icon, img");
        let imageNode = "";
        if (imgEl && imgEl.getAttribute("src")) {
          const img = document.createElement("img");
          img.src = imgEl.getAttribute("src");
          img.alt = "";
          imageNode = img;
        }
        const anchor = li.querySelector(".mf-list-item-text a[href], a[href]:not(.red-arrow)") || li.querySelector("a[href]");
        let href = anchor ? anchor.getAttribute("href") || "" : "";
        if (href === "#") href = "";
        let title = anchor ? anchor.textContent.trim() : "";
        if (!title) {
          const textSpan = Array.from(li.querySelectorAll(".mf-list-item-text")).map((s) => s.textContent.trim()).find((t) => t);
          title = textSpan || "";
        }
        title = title.replace(/^[••\s]+/, "").trim();
        if (title || imageNode || href) {
          cells.push([header, title, imageNode ? [imageNode] : [""], href]);
        }
      });
      const viewAll = card.querySelector(".link-box a[href]");
      if (viewAll) {
        const href = viewAll.getAttribute("href") || "";
        if (href && href !== "#") {
          cells.push(["", "", "", href]);
        }
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "knowledge-hub", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const titles = Array.from(element.querySelectorAll(":scope .ctnt-wrapper > h2.target, :scope > h2.target, h2.target"));
    const cells = [];
    titles.forEach((titleEl) => {
      const strong = titleEl.querySelector("strong");
      const titleText = (strong ? strong.textContent : titleEl.textContent).trim();
      let panel = titleEl.nextElementSibling;
      while (panel && !panel.classList.contains("toggle-ctnt")) {
        panel = panel.nextElementSibling;
      }
      let contentEl = null;
      if (panel) {
        contentEl = panel.querySelector(".cmp-text");
        if (!contentEl) {
          contentEl = panel;
        }
      }
      const titleCell = document.createElement("p");
      titleCell.textContent = titleText;
      const contentCell = [];
      if (contentEl) {
        const richNodes = Array.from(contentEl.children).filter(
          (n) => n.textContent.trim() || n.querySelector("img, a")
        );
        if (richNodes.length) {
          contentCell.push(...richNodes);
        } else {
          contentCell.push(contentEl);
        }
      }
      if (titleText && contentCell.length) {
        cells.push([titleCell, contentCell]);
      }
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
    const items = Array.from(element.querySelectorAll(".track-video-section, .video.section .hp-main-box"));
    const cardEls = items.filter((el) => el.classList.contains("track-video-section") ? true : !el.querySelector(".track-video-section"));
    const cells = [];
    cardEls.forEach((card) => {
      const titleEl = card.querySelector(".video-title-large, .info-title");
      const title = titleEl ? titleEl.textContent.trim() : "";
      const link = card.querySelector("a.em-link[href], a.track-videos[href], .img-card a[href]");
      const videoHref = link ? link.getAttribute("href") || "" : "";
      const imgEl = card.querySelector("img.em-img, .img-card img, img");
      let imageNode = "";
      if (imgEl) {
        const realSrc = imgEl.getAttribute("src") || (imgEl.getAttribute("data-srcset") || "").split(",")[0].trim().split(/\s+/)[0] || imgEl.getAttribute("data-src") || "";
        if (realSrc) {
          const img = document.createElement("img");
          img.src = realSrc;
          img.alt = imgEl.getAttribute("alt") || title;
          imageNode = img;
        }
      }
      const descEl = card.querySelector(".comp-desc, .info-box .text");
      let bodyNode = "";
      if (descEl) {
        const meaningful = Array.from(descEl.children).filter((n) => n.textContent.trim());
        if (meaningful.length) {
          bodyNode = meaningful;
        } else if (descEl.textContent.trim()) {
          bodyNode = descEl;
        }
      }
      if (!title && !imageNode && !videoHref) return;
      cells.push([
        title,
        // 0 title
        imageNode ? [imageNode] : [""],
        // 1 image
        bodyNode && bodyNode.length ? bodyNode : bodyNode || "",
        // 2 body text
        videoHref
        // 3 video link
      ]);
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
    const cards = Array.from(element.querySelectorAll(".featurecards .hp-main-box, .featurecards"));
    const cardEls = cards.filter((el) => el.classList.contains("hp-main-box") ? true : !el.querySelector(".hp-main-box"));
    const cells = [];
    cardEls.forEach((card) => {
      const imgEl = card.querySelector("img.em-img, img");
      let imageNode = "";
      if (imgEl) {
        const realSrc = imgEl.getAttribute("data-originalsrc") || imgEl.getAttribute("src") || (imgEl.getAttribute("data-srcset") || "").split(",")[0].trim().split(/\s+/)[0] || "";
        if (realSrc) {
          const img = document.createElement("img");
          img.src = realSrc;
          img.alt = imgEl.getAttribute("alt") || "";
          imageNode = img;
        }
      }
      const titleEl = card.querySelector(".info-title, .em-sub-title");
      const title2 = titleEl ? titleEl.textContent.trim() : "";
      const descEl = card.querySelector(".em-desc p, .info-box p, .em-desc");
      const title3 = descEl ? descEl.textContent.trim() : "";
      const ctaEl = card.querySelector("a.em-cta");
      const ctaLabel = ctaEl ? ctaEl.textContent.trim() : "";
      const ctaHref = ctaEl ? ctaEl.getAttribute("href") || "" : "";
      if (!imageNode && !title2 && !title3) return;
      cells.push([
        imageNode ? [imageNode] : [""],
        // 0 desktop image
        imageNode ? [imageNode.cloneNode(true)] : [""],
        // 1 mobile image (same source)
        "",
        // 2 title1 / eyebrow (not present in source)
        title2,
        // 3 title2 / heading
        title3,
        // 4 title3 / description
        ctaLabel,
        // 5 CTA label
        ctaHref
        // 6 CTA href
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
    const slides = Array.from(element.querySelectorAll(".featurecards"));
    const cells = [];
    slides.forEach((slide) => {
      const contentCell = [];
      const nameEl = slide.querySelector("h4.em-title, .em-title");
      if (nameEl && nameEl.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = nameEl.textContent.trim();
        contentCell.push(h);
      }
      const ratingList = slide.querySelector("ul.rating");
      if (ratingList) {
        const starCount = ratingList.querySelectorAll("i.fa-star").length;
        if (starCount) {
          const p = document.createElement("p");
          p.textContent = "\u2605".repeat(starCount);
          contentCell.push(p);
        }
      }
      const quote = slide.querySelector("p.desc, .em-desc p");
      if (quote && quote.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = quote.textContent.trim();
        contentCell.push(p);
      }
      const date = slide.querySelector("p.ohidden");
      if (date && date.textContent.trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = date.textContent.trim();
        p.append(em);
        contentCell.push(p);
      }
      if (contentCell.length) cells.push([contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table.js
  function parse9(element, { document }) {
    const sourceTable = element.matches("table") ? element : element.querySelector("table");
    if (!sourceTable) return;
    const cells = [["Table (bordered)"]];
    [...sourceTable.rows].forEach((row) => {
      const rowCells = [...row.cells].map((cell) => {
        const div = document.createElement("div");
        div.innerHTML = cell.innerHTML;
        return div;
      });
      cells.push(rowCells);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "Table (bordered)", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/kotak-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#notification_widget",
        ".header-info-box",
        '[id^="modal-widget-"]',
        ".notificationWidgetId",
        ".modal",
        ".overlay",
        "#search-modal",
        ".search-modal-popup",
        ".back-to-top"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".header-logo",
        ".header-menulogo-container",
        ".header-menu",
        ".header-login-container",
        ".header-login",
        ".login-btn-ul",
        ".header-divider",
        ".dropup.group-site-dropdown",
        ".mobile-header-container",
        ".headerfooter-container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer",
        ".experiencefragment.section",
        ".secondaryfooter.section",
        ".sec-footer-container",
        ".copyright-box"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "iframe",
        "link",
        "style",
        "script",
        "input",
        "audio"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-analytics");
        el.removeAttribute("data-gtm");
      });
    }
  }

  // tools/importer/transformers/kotak-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const root = element;
    const resolveSectionEl = (section) => {
      const tryOne = (sel) => {
        if (!sel) return null;
        try {
          return element.querySelector(sel) || doc.querySelector(sel);
        } catch (e) {
          return null;
        }
      };
      let el = tryOne(section.selector);
      if (!el && Array.isArray(section.defaultContent)) {
        for (const sel of section.defaultContent) {
          el = tryOne(sel);
          if (el) break;
        }
      }
      return el;
    };
    const topLevelAncestor = (el) => {
      let node = el;
      while (node && node.parentNode && node.parentNode !== root) {
        node = node.parentNode;
      }
      return node && node.parentNode === root ? node : null;
    };
    const resolved = [];
    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      const sectionEl = resolveSectionEl(section);
      if (sectionEl && root.contains(sectionEl)) {
        resolved.push({ section, el: sectionEl });
      }
    }
    if (resolved.length < 2) return;
    const wrappersToCheck = /* @__PURE__ */ new Set();
    resolved.forEach(({ el }) => {
      const top = topLevelAncestor(el);
      if (top && top !== el) wrappersToCheck.add(top);
    });
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { el } = resolved[i];
      const top = topLevelAncestor(el);
      if (!top) continue;
      if (top === el) continue;
      root.insertBefore(el, top);
    }
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        root.insertBefore(metadataBlock, el.nextSibling);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        root.insertBefore(hr, el);
      }
    }
    wrappersToCheck.forEach((wrapper) => {
      if (!wrapper.parentNode) return;
      const hasElementChild = wrapper.querySelector("*");
      const hasText = wrapper.textContent && wrapper.textContent.trim().length > 0;
      if (!hasElementChild && !hasText) {
        wrapper.remove();
      }
    });
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
    "cards-testimonial": parse8,
    table: parse9
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
      },
      {
        name: "table",
        instances: [
          "body > div.amp-page > div.wrapper.section:nth-of-type(2) table.table-bordered",
          "body > div.amp-page > div.wrapper.section:nth-of-type(4) table.table-bordered"
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

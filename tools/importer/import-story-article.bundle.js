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

  // tools/importer/import-story-article.js
  var import_story_article_exports = {};
  __export(import_story_article_exports, {
    default: () => import_story_article_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const title = element.querySelector(
      "h1.hero-banner-title, .hero-banner-title, h1"
    );
    let bgImage = element.querySelector("picture");
    if (!bgImage) {
      bgImage = element.querySelector("img.hs-image, img");
    }
    if (!title && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (title) {
      const h1 = document.createElement("h1");
      h1.textContent = title.textContent.trim();
      contentCell.push(h1);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const articleBody = element.querySelector(
      ".col-md-8 .article-ctnt, .col-md-8 .commentsrte, .col-md-8"
    );
    const leftCell = [];
    if (articleBody) {
      const wanted = articleBody.querySelectorAll(
        ":scope .article-ctnt-div, :scope h1, :scope h2, :scope h3, :scope h4, :scope h5, :scope h6, :scope > p, :scope p, :scope > ol, :scope ol, :scope > ul, :scope ul"
      );
      const seen = /* @__PURE__ */ new Set();
      wanted.forEach((node) => {
        if ([...seen].some((s) => s.contains(node))) return;
        const tag = node.tagName ? node.tagName.toLowerCase() : "";
        const cls = node.className || "";
        if (/link-box|modal|rating|comments|share|error-msg|thumbs|like|dislike/i.test(cls)) return;
        if (node.closest && node.closest('.modal, .link-box, [id*="rating"], [id*="popup"], [class*="popup"], .get-help-popup, .em')) return;
        const text = node.textContent.replace(/ /g, " ").trim();
        if (["h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul"].includes(tag)) {
          leftCell.push(node);
          seen.add(node);
        } else if (text) {
          leftCell.push(node);
          seen.add(node);
        }
      });
    }
    const sidebarCard = element.querySelector(
      ".col-md-4 .mf-card, .col-md-4 .multiplelinkblock, .col-md-4"
    );
    const rightCell = [];
    if (sidebarCard) {
      const header = sidebarCard.querySelector(".mf-header, p.mf-header, h2, h3, h4");
      if (header && header.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = header.textContent.trim();
        rightCell.push(h3);
      }
      const listItems = Array.from(sidebarCard.querySelectorAll("li.mf-list-item, .mf-list > li"));
      if (listItems.length) {
        const ul = document.createElement("ul");
        listItems.forEach((li) => {
          const link = li.querySelector("a[href]:not(.red-arrow)") || li.querySelector("a[href]");
          const label = li.querySelector(".mf-list-item-text");
          if (link && (link.getAttribute("href") || "").trim()) {
            const newLi = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.getAttribute("href");
            a.textContent = (label ? label.textContent : link.textContent).trim();
            newLi.append(a);
            ul.append(newLi);
          }
        });
        if (ul.children.length) rightCell.push(ul);
      }
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (rightCell.length === 0) rightCell.push("");
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse3(element, { document }) {
    const heading = element.querySelector("h4");
    const items = Array.from(
      element.querySelectorAll(".search-result-box")
    ).filter((box) => box.querySelector("h3.faq-question, .faq-question"));
    const cells = [];
    items.forEach((box) => {
      const question = box.querySelector("h3.faq-question, .faq-question");
      if (!question) return;
      const titleEl = document.createElement("p");
      titleEl.textContent = question.textContent.trim();
      const contentEls = [];
      Array.from(box.querySelectorAll(":scope > p")).forEach((p) => {
        const text = p.textContent.replace(/ /g, " ").trim();
        if (text) {
          const para = document.createElement("p");
          para.innerHTML = p.innerHTML;
          contentEls.push(para);
        }
      });
      if (contentEls.length === 0) contentEls.push("");
      cells.push([titleEl, contentEls]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    if (heading && heading.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      element.replaceWith(h2, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/knowledge-hub.js
  function parse4(element, { document }) {
    const heading = element.querySelector(".keep-reading-div, h2, h3");
    const cards = Array.from(element.querySelectorAll(".col-md-4.em, .col-md-4"));
    const cells = [];
    cards.forEach((card) => {
      const titleEl = card.querySelector(".em-title, .hp-card-box .em-title");
      const imgEl = card.querySelector("img.em-img, img");
      const linkEl = card.querySelector("a.em-cta, a.em-link, a[href]");
      const title = titleEl ? titleEl.textContent.trim() : "";
      const href = linkEl ? (linkEl.getAttribute("href") || "").trim() : "";
      if (!title && !imgEl) return;
      const eyebrowCell = "";
      const titleCell = document.createElement("p");
      titleCell.textContent = title;
      let imageCell = "";
      if (imgEl) {
        const realSrc = imgEl.getAttribute("data-src") || imgEl.getAttribute("data-original") || imgEl.getAttribute("data-lazy") || imgEl.getAttribute("data-srcset") || imgEl.getAttribute("src");
        const currentSrc = imgEl.getAttribute("src") || "";
        const isPlaceholder = !currentSrc || /^data:image/.test(currentSrc) || /(blank|placeholder|spacer|lazy)/i.test(currentSrc);
        if (realSrc && (isPlaceholder || !currentSrc)) {
          imgEl.setAttribute("src", realSrc.split(" ")[0]);
        }
        imageCell = imgEl;
      }
      let linkCell = "";
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = title || href;
        linkCell = a;
      }
      cells.push([eyebrowCell, titleCell, imageCell, linkCell]);
    });
    const loadMore = element.querySelector(".btn-box a[href], a.btn[href]");
    if (loadMore && (loadMore.getAttribute("href") || "").trim()) {
      const a = document.createElement("a");
      a.href = loadMore.getAttribute("href");
      a.textContent = loadMore.textContent.trim() || "View all";
      cells.push(["", "", "", a]);
    }
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "knowledge-hub", cells });
    if (heading && heading.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      element.replaceWith(h2, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/kotak-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var CONTENT_MARKERS = [
    ".heroslider",
    ".articles-details",
    ".faq",
    ".keepreading"
  ];
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "link",
        "meta",
        "input",
        "iframe",
        "noscript",
        "style",
        "script"
      ]);
      Array.from(element.children).forEach((child) => {
        const isContent = CONTENT_MARKERS.some(
          (sel) => child.matches(sel) || child.querySelector(sel)
        );
        if (!isContent) {
          child.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "link",
        "meta",
        "input",
        "iframe",
        "noscript",
        "style",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/kotak-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const document = element.ownerDocument;
    let sections;
    if (payload && payload.template && Array.isArray(payload.template.sections)) {
      sections = payload.template.sections.map((s) => ({
        block: Array.isArray(s.blocks) && s.blocks.length ? s.blocks[0] : null,
        style: s.style || null
      }));
    } else {
      sections = [
        { block: "hero", style: null },
        { block: "columns", style: null },
        { block: "accordion", style: "light-grey" },
        { block: "knowledge-hub", style: "light-grey" }
      ];
    }
    const tables = Array.from(element.querySelectorAll("table"));
    const normalize = (s) => (s || "").toLowerCase().replace(/\(.*\)/, "").replace(/[\s-]+/g, "").trim();
    const headerKey = (table) => {
      const firstRow = table.querySelector("tr");
      return firstRow ? normalize(firstRow.textContent) : "";
    };
    const bundles = [];
    sections.forEach(({ block, style }) => {
      if (!block) return;
      const table = tables.find((t) => headerKey(t) === normalize(block));
      if (!table) return;
      const nodes = [];
      let prev = table.previousElementSibling;
      const leadingHeadings = [];
      while (prev && /^H[1-6]$/.test(prev.tagName)) {
        leadingHeadings.unshift(prev);
        prev = prev.previousElementSibling;
      }
      nodes.push(...leadingHeadings, table);
      bundles.push({ nodes, style });
    });
    if (!bundles.length) return;
    bundles.forEach(({ nodes }) => nodes.forEach((n) => n.remove()));
    Array.from(element.children).forEach((child) => child.remove());
    bundles.forEach(({ nodes, style }, idx) => {
      if (idx > 0) {
        element.append(document.createElement("hr"));
      }
      nodes.forEach((n) => element.append(n));
      if (style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style }
        });
        element.append(metaBlock);
      }
    });
  }

  // tools/importer/import-story-article.js
  var PAGE_TEMPLATE = {
    name: "story-article",
    description: "Stories-in-focus article page: hero banner with title, article body with sidebar related-links, FAQ accordion, and a Read Next cards section.",
    urls: [
      "https://www.kotak.bank.in/en/stories-in-focus/nri/how-to-invest-in-gold-as-an-nri.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["div.heroslider.section"]
      },
      {
        name: "columns",
        instances: ["section.articles-details > div.container > div.row"]
      },
      {
        name: "accordion",
        instances: ["div.faq.section"]
      },
      {
        name: "knowledge-hub",
        instances: ["div.keepreading.section"]
      }
    ],
    sections: [
      {
        id: "rc5",
        name: "Hero Banner",
        selector: "div.heroslider.section",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "rc7c1",
        name: "Article Body + Related Information Sidebar",
        selector: "section.articles-details > div.container > div.row",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "rc7c2",
        name: "Frequently Asked Questions (FAQ Accordion)",
        selector: "div.faq.section",
        style: "light-grey",
        blocks: ["accordion"],
        defaultContent: []
      },
      {
        id: "rc7c3",
        name: "Read Next (Article Cards)",
        selector: "div.keepreading.section",
        style: "light-grey",
        blocks: ["knowledge-hub"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    hero: parse,
    columns: parse2,
    accordion: parse3,
    "knowledge-hub": parse4
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
  var import_story_article_default = {
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
  return __toCommonJS(import_story_article_exports);
})();

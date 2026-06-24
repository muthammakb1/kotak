/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kotak section breaks + section metadata.
 *
 * Driven entirely by payload.template.sections (from page-templates.json).
 * For the savings-account template there are 15 sections (rc4..rc21). EDS needs:
 *   - a section break (<hr>) before every section except the first, and
 *   - a Section Metadata block as the LAST node of every section that declares
 *     a `style`.
 *
 * Styled sections in this template (style "light-grey"):
 *   - rc12 legacy-accounts (body > div.amp-page > div.wrapper.section:nth-of-type(1))
 *   - rc16 knowledge        (body > div.amp-page > div.wrapper.section:nth-of-type(5))
 *   - rc21 testimonials     (body > div.amp-page > div.wrapper.section:nth-of-type(10))
 *
 * ── WHY THE OLD APPROACH BROKE ───────────────────────────────────────────────
 * The content root handed to this transformer is `document.body` (see
 * import-savings-account.js: `const main = document.body`). html2md only emits a
 * markdown thematic break (`---`) for <hr> elements that are DIRECT CHILDREN of
 * that root. The resolved section elements, however, are deeply nested:
 *   - rc8/rc9/rc11 all live inside the SAME body child `div:nth-of-type(6/7)`
 *   - rc12..rc21 (incl. all 3 styled sections) all live inside the SAME body
 *     child `div.amp-page` (verified in cleaned.html: amp-page has exactly the
 *     10 rc12..rc21 wrappers as its children).
 * Inserting <hr> via `sectionEl.parentNode.insertBefore(hr, sectionEl)` placed
 * the <hr> INSIDE those wrappers — one+ levels below the root — so html2md
 * dropped every <hr>. The Section Metadata tables survived (tables always do)
 * but, with no surrounding section breaks, scripts.js never split sections, so
 * they rendered as literal "style / light-grey" text and the light-grey
 * backgrounds never applied.
 *
 * ── THE FIX: PROMOTE SECTIONS TO THE CONTENT ROOT ───────────────────────────
 * For each template section we resolve its element, then walk UP to its
 * top-level ancestor (the direct child of `main`). Because many sections share a
 * single top-level wrapper, we HOIST each resolved section element so it becomes
 * a direct child of `main`, in document order. Once every section is a top-level
 * sibling, the <hr> breaks and trailing Section Metadata blocks we insert are
 * ALSO top-level siblings and therefore survive markdown conversion. Emptied
 * wrappers (e.g. div.amp-page) are removed afterwards. The 3 styled sections
 * each end up with a real top-level <hr> before them and a Section Metadata
 * block as their last node.
 *
 * Selectors come from template.sections[*].selector / defaultContent, validated
 * during page analysis against migration-work/cleaned.html.
 *
 * NOTE: this transformer only inserts/relocates STRUCTURAL section markers and
 * hoists whole section subtrees intact. It does NOT convert any content into
 * blocks; default-content sections (rc13 "rates-compare", rc15 "how-to-open")
 * keep their native tables / headings / paragraphs / lists untouched — they are
 * moved as a single node, never restructured.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // The content root for markdown serialization. Section breaks (<hr>) and
  // Section Metadata blocks only survive if they are direct children of this
  // node (see import-savings-account.js -> `const main = document.body`).
  const root = element;

  // Resolve the first matching DOM node for a section, searching within the
  // content root (element) first and falling back to the document. Tolerates
  // sections whose primary selector failed by trying defaultContent hints.
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

  // Walk up from `el` to the direct child of the content root that contains it.
  // Returns null if `el` is not inside the root.
  const topLevelAncestor = (el) => {
    let node = el;
    while (node && node.parentNode && node.parentNode !== root) {
      node = node.parentNode;
    }
    return node && node.parentNode === root ? node : null;
  };

  // 1) Resolve every section element in template (document) order.
  const resolved = [];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const sectionEl = resolveSectionEl(section);
    if (sectionEl && root.contains(sectionEl)) {
      resolved.push({ section, el: sectionEl });
    }
  }
  if (resolved.length < 2) return;

  // Remember the wrappers we'll empty out so we can remove them at the end.
  const wrappersToCheck = new Set();
  resolved.forEach(({ el }) => {
    const top = topLevelAncestor(el);
    // If the section element is itself the top-level child, nothing wraps it.
    // Otherwise its top-level ancestor is an intermediate wrapper we will empty.
    if (top && top !== el) wrappersToCheck.add(top);
  });

  // 2) Promote (hoist) each resolved section element to be a direct child of
  //    the content root, preserving document order. We insert each section
  //    element right before its current top-level ancestor; processing in
  //    REVERSE keeps the relative order of sections that share one wrapper
  //    (each is placed just before the wrapper, and later [earlier-in-doc]
  //    sections are inserted before the already-placed ones).
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { el } = resolved[i];
    const top = topLevelAncestor(el);
    if (!top) continue; // not under root anymore (defensive)
    if (top === el) continue; // already a top-level sibling
    // Move the whole section subtree up to sit just before its wrapper.
    root.insertBefore(el, top);
  }

  // 3) Now every resolved section element is a direct child of `root` and they
  //    appear in document order. Insert structural markers at the top level:
  //    - <hr> before every section except the first
  //    - Section Metadata as the LAST node of each styled section (i.e. inserted
  //      immediately after the section element, before the next section's <hr>)
  //    Process in REVERSE so insertions don't shift not-yet-processed anchors.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];

    // Section Metadata block as the last node of this (styled) section. Placed
    // right after the section element so it lands before the NEXT section's
    // <hr>, keeping it associated with the correct section.
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      root.insertBefore(metadataBlock, el.nextSibling);
    }

    // Section break (<hr>) before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      root.insertBefore(hr, el);
    }
  }

  // 4) Remove now-empty wrappers (e.g. div.amp-page, body > div:nth-of-type(6/7))
  //    whose section children were hoisted out. Only remove if they contain no
  //    remaining element content, so we never drop unexpected leftover content.
  wrappersToCheck.forEach((wrapper) => {
    if (!wrapper.parentNode) return;
    const hasElementChild = wrapper.querySelector('*');
    const hasText = wrapper.textContent && wrapper.textContent.trim().length > 0;
    if (!hasElementChild && !hasText) {
      wrapper.remove();
    }
  });
}

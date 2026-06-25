/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kotak site-wide cleanup.
 *
 * Removes non-authorable site chrome so that only the article content
 * (hero, columns, accordion/FAQ, knowledge-hub/Read Next) survives the import.
 *
 * Header, footer and navigation are explicitly OUT of scope for this migration.
 *
 * The live Kotak DOM wraps its header, mega-menu, mobile nav, breadcrumb,
 * sticky bottom bar, search/disclaimer modals and promo bar in a mix of
 * semantic tags (<header>, <nav>, <footer>) AND classless/utility <div>
 * wrappers that are siblings of the article content. Blocklisting individual
 * chrome selectors is brittle (it missed the classless wrappers on the live
 * page), so cleanup uses a content-allowlist strategy: keep only the
 * body-level children that contain article content, and drop everything else.
 *
 * IMPORTANT: the allowlist prune runs in beforeTransform — BEFORE the block
 * parsers run. Parsers replace their source elements (e.g. div.heroslider.section)
 * with WebImporter block tables, which no longer match the source class
 * markers, so pruning afterwards would wrongly drop a parsed block's wrapper.
 * Pruning first leaves every content wrapper intact for the parsers.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Source-DOM markers identifying the article content sections.
const CONTENT_MARKERS = [
  '.heroslider', '.articles-details', '.faq', '.keepreading',
];

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Strip non-content tags up front.
    WebImporter.DOMUtils.remove(element, [
      'link', 'meta', 'input', 'iframe', 'noscript', 'style', 'script',
    ]);

    // Content-allowlist prune: remove any direct body-level child that does
    // not contain article content. This reliably drops the header, mega-menu,
    // mobile nav, breadcrumb, sticky bottom bar, search modal, disclaimer
    // modal, fade overlay, promo bar and footer regardless of their (often
    // classless) wrapper markup. Runs before parsers so source markers exist.
    Array.from(element.children).forEach((child) => {
      const isContent = CONTENT_MARKERS.some(
        (sel) => child.matches(sel) || child.querySelector(sel),
      );
      if (!isContent) {
        child.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Final safety strip of any non-content tags introduced during parsing.
    WebImporter.DOMUtils.remove(element, [
      'link', 'meta', 'input', 'iframe', 'noscript', 'style', 'script',
    ]);
  }
}

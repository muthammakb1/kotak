/* eslint-disable */
/* global WebImporter */
/**
 * Parser for `hero` (base block: hero).
 * Source: https://www.kotak.bank.in/en/stories-in-focus/nri/how-to-invest-in-gold-as-an-nri.html
 * Generated for the Kotak "story-article" template (DA project).
 *
 * Block model (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image (optional) — full-bleed banner asset
 *   Row 3: title (Heading) + optional subheading / CTA
 *
 * Source structure (div.heroslider.section):
 *   - Title:  h1.hero-banner-title  ("How to Invest in Gold as an NRI")
 *   - Image:  picture > img.hs-image (desktop banner; mobile variant is injected
 *             client-side and is not present in the static HTML).
 */
export default function parse(element, { document }) {
  // --- Title (mandatory heading) ---
  const title = element.querySelector(
    'h1.hero-banner-title, .hero-banner-title, h1',
  );

  // --- Background image ---
  // Prefer the full <picture> so any captured <source> variants are preserved;
  // fall back to the bare <img> if no picture wrapper exists.
  let bgImage = element.querySelector('picture');
  if (!bgImage) {
    bgImage = element.querySelector('img.hs-image, img');
  }

  // Empty-block guard: if neither a title nor an image is present, leave the
  // original content in place rather than emitting an empty hero block.
  if (!title && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2 — background image (only when present).
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3 — title / text content (single cell holding all content elements).
  const contentCell = [];
  if (title) {
    // Normalise the overlay heading to a clean h1 to drop framework classes.
    const h1 = document.createElement('h1');
    h1.textContent = title.textContent.trim();
    contentCell.push(h1);
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}

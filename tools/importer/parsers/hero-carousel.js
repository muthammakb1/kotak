/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-carousel.
 * Base block: hero (custom carousel variant).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The hero-carousel block (blocks/hero-carousel/hero-carousel.js) reads each slide row
 * with 8 cells, in this exact order:
 *   0 desktop image, 1 mobile image, 2 title, 3 title color,
 *   4 subtitle, 5 subtitle color, 6 CTA label, 7 redirection link.
 *
 * Source markup is an owl-carousel; ".owl-item.cloned" entries are duplicates and
 * must be skipped. Each unique slide lives in ".hero-carousel-item" / ".hero-slider".
 */
export default function parse(element, { document }) {
  // Collect slide items, preferring non-cloned owl items to avoid duplicates.
  let items = Array.from(element.querySelectorAll('.owl-item:not(.cloned) .hero-carousel-item, .owl-item:not(.cloned) .hero-slider'));

  // Fallback: if owl-item wrappers are absent (e.g. clean authored DOM), use the slides directly.
  if (!items.length) {
    items = Array.from(element.querySelectorAll('.hero-carousel-item, .hero-slider'));
  }

  // Deduplicate by a stable signature (image src + title text) in case selectors overlap.
  const seen = new Set();

  const buildImg = (srcset) => {
    if (!srcset) return null;
    const img = document.createElement('img');
    // srcset may contain a comma-separated list; take the first candidate URL.
    img.src = srcset.split(',')[0].trim().split(/\s+/)[0];
    return img;
  };

  const getColor = (el) => {
    if (!el) return '';
    const attr = el.getAttribute('font-color');
    if (attr) return attr.trim();
    const style = el.getAttribute('style') || '';
    const m = style.match(/color:\s*([^;]+)/i);
    return m ? m[1].trim() : '';
  };

  const cells = [];

  items.forEach((item) => {
    // --- Images: prefer source srcset/data-srcset, fall back to <img>. ---
    const picture = item.querySelector('picture');
    let desktopCell = '';
    let mobileCell = '';
    if (picture) {
      const desktopSource = picture.querySelector('source[media*="min-width"]');
      const mobileSource = picture.querySelector('source[media*="max-width"]');
      const img = picture.querySelector('img');
      const imgSrc = img ? (img.getAttribute('src') || img.getAttribute('data-src')) : null;

      const desktopSrcset = desktopSource
        ? (desktopSource.getAttribute('srcset') || desktopSource.getAttribute('data-srcset'))
        : null;
      const mobileSrcset = mobileSource
        ? (mobileSource.getAttribute('srcset') || mobileSource.getAttribute('data-srcset'))
        : null;

      const desktopImg = buildImg(desktopSrcset) || (imgSrc ? buildImg(imgSrc) : null);
      const mobileImg = buildImg(mobileSrcset);
      if (desktopImg) {
        const alt = img ? (img.getAttribute('alt') || '') : '';
        desktopImg.alt = alt;
        desktopCell = desktopImg;
      }
      if (mobileImg) {
        mobileImg.alt = desktopImg ? desktopImg.alt : '';
        mobileCell = mobileImg;
      }
    }

    // --- Title ---
    const titleEl = item.querySelector('.hero-banner-title, h1, h2, h3');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const titleColor = getColor(titleEl);

    // --- Subtitle / description ---
    const descEl = item.querySelector('.hero-banner-desc');
    let subtitle = '';
    if (descEl) {
      subtitle = descEl.textContent.replace(/\s+/g, ' ').trim();
    }
    const subtitleColor = getColor(descEl);

    // --- CTA ---
    const ctaEl = item.querySelector('.btn-box a, a.btn-primary, a.btn');
    let ctaLabel = '';
    let ctaHref = '';
    if (ctaEl) {
      ctaLabel = ctaEl.textContent.replace(/\s+/g, ' ').trim();
      ctaHref = ctaEl.getAttribute('data-desktoplink')
        || ctaEl.getAttribute('href')
        || '';
    }

    // Skip slides with no meaningful content (e.g. empty placeholder banners).
    if (!desktopCell && !mobileCell && !title && !subtitle && !ctaLabel) return;

    const signature = `${(desktopCell && desktopCell.src) || (mobileCell && mobileCell.src) || ''}|${title}|${ctaHref}`;
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
      ctaHref,
    ]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-carousel', cells });
  element.replaceWith(block);
}

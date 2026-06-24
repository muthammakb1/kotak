/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-carousel. Base block: hero (carousel variant, custom Kotak block).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block contract (from blocks/hero-carousel/hero-carousel.js readSlide()):
 *   8 cells per slide, in authoring order:
 *     0 desktop image, 1 mobile image, 2 title, 3 title color,
 *     4 subtitle, 5 subtitle color, 6 CTA label, 7 CTA href.
 *
 * Source HTML: an owl-carousel of .hero-carousel-item slides. The carousel
 * inserts duplicate .owl-item.cloned slides for looping — these MUST be
 * excluded. Each real slide contains:
 *   - h2.hero-banner-title (with font-color attr / inline color) → title
 *   - .hero-banner-desc → subtitle (skip slides whose desc is just &nbsp;)
 *   - .btn-box a → CTA (label + data-desktoplink / href)
 *   - <picture> with <source media="(min-width:750px)"> desktop and
 *     <source media="(max-width:749px)"> mobile; URLs in srcset/data-srcset.
 */
function resolveSourceUrl(sourceEl) {
  if (!sourceEl) return '';
  const raw = sourceEl.getAttribute('srcset') || sourceEl.getAttribute('data-srcset') || '';
  return raw.split(',')[0].trim().split(/\s+/)[0] || '';
}

export default function parse(element, { document }) {
  // Only real (non-cloned) carousel slides. Fall back to all hero items if the
  // owl-item wrappers are absent.
  let slideEls = Array.from(element.querySelectorAll('.owl-item:not(.cloned) .hero-carousel-item'));
  if (!slideEls.length) {
    slideEls = Array.from(element.querySelectorAll('.hero-carousel-item, .hero-slider'));
  }

  const cells = [];

  slideEls.forEach((slide) => {
    // --- Images ---
    const picture = slide.querySelector('picture');
    let desktopUrl = '';
    let mobileUrl = '';
    let alt = '';
    if (picture) {
      desktopUrl = resolveSourceUrl(picture.querySelector('source[media*="min-width"]'));
      mobileUrl = resolveSourceUrl(picture.querySelector('source[media*="max-width"]'));
      const imgEl = picture.querySelector('img');
      if (imgEl) {
        alt = imgEl.getAttribute('alt') || '';
        if (!desktopUrl) {
          desktopUrl = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
        }
      }
    }
    if (!mobileUrl) mobileUrl = desktopUrl;

    let desktopImg = '';
    if (desktopUrl) {
      desktopImg = document.createElement('img');
      desktopImg.src = desktopUrl;
      desktopImg.alt = alt;
    }
    let mobileImg = '';
    if (mobileUrl) {
      mobileImg = document.createElement('img');
      mobileImg.src = mobileUrl;
      mobileImg.alt = alt;
    }

    // --- Title + color ---
    const titleEl = slide.querySelector('.hero-banner-title');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const titleColor = titleEl
      ? (titleEl.getAttribute('font-color') || (titleEl.style && titleEl.style.color) || '')
      : '';

    // --- Subtitle + color (ignore decorative empty &nbsp; descriptions) ---
    const descEl = slide.querySelector('.hero-banner-desc');
    let subtitle = '';
    let subtitleColor = '';
    if (descEl) {
      const text = descEl.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
      if (text) {
        subtitle = text;
        subtitleColor = descEl.getAttribute('font-color') || (descEl.style && descEl.style.color) || '';
      }
    }

    // --- CTA ---
    const ctaEl = slide.querySelector('.btn-box a, a.btn-primary');
    const ctaLabel = ctaEl ? ctaEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const ctaHref = ctaEl
      ? (ctaEl.getAttribute('data-desktoplink') || ctaEl.getAttribute('href') || '')
      : '';

    // Slide must have an image to be a valid hero slide.
    if (!desktopImg && !mobileImg) return;

    cells.push([
      desktopImg ? [desktopImg] : [''], // 0 desktop image
      mobileImg ? [mobileImg] : [''], // 1 mobile image
      title, // 2 title
      titleColor, // 3 title color
      subtitle, // 4 subtitle
      subtitleColor, // 5 subtitle color
      ctaLabel, // 6 CTA label
      ctaHref, // 7 CTA href
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

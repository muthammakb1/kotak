import { createOptimizedPicture } from '../../scripts/aem.js';

const ARROW_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
  <path d="M10 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

/**
 * Read one card's cells in authoring order:
 * 0 desktop image, 1 mobile image, 2 title 1, 3 title 2, 4 title 3,
 * 5 CTA label, 6 redirection link
 */
function readCard(row) {
  const cells = [...row.children];
  const img = (cell) => (cell ? cell.querySelector('img') : null);
  const text = (cell) => (cell ? cell.textContent.trim() : '');
  const link = (cell) => {
    if (!cell) return '';
    const a = cell.querySelector('a');
    return a ? a.getAttribute('href') : cell.textContent.trim();
  };
  return {
    desktopImg: img(cells[0]),
    mobileImg: img(cells[1]),
    title1: text(cells[2]),
    title2: text(cells[3]),
    title3: text(cells[4]),
    ctaLabel: text(cells[5]),
    ctaHref: link(cells[6]),
  };
}

/** Build a <picture> that swaps desktop/mobile sources at the 600px breakpoint. */
function buildResponsivePicture(desktopImg, mobileImg, alt) {
  const desktopSrc = desktopImg ? desktopImg.getAttribute('src') : null;
  const mobileSrc = mobileImg ? mobileImg.getAttribute('src') : desktopSrc;
  if (!desktopSrc && !mobileSrc) return null;

  const picture = document.createElement('picture');
  if (mobileSrc) {
    const source = document.createElement('source');
    source.media = '(max-width: 599px)';
    source.srcset = mobileSrc;
    picture.append(source);
  }
  const img = document.createElement('img');
  img.src = desktopSrc || mobileSrc;
  img.alt = alt || '';
  img.loading = 'lazy';
  picture.append(img);
  return picture;
}

function buildCard(card) {
  const item = document.createElement('div');
  item.className = 'feature-card';

  const alt = card.title2 || card.title1;
  const picture = buildResponsivePicture(card.desktopImg, card.mobileImg, alt);
  if (picture) {
    const media = document.createElement('div');
    media.className = 'feature-card-media';
    media.append(picture);
    item.append(media);
  }

  const body = document.createElement('div');
  body.className = 'feature-card-body';

  if (card.title1) {
    const t1 = document.createElement('p');
    t1.className = 'feature-card-eyebrow';
    t1.textContent = card.title1;
    body.append(t1);
  }
  if (card.title2) {
    const t2 = document.createElement('h3');
    t2.className = 'feature-card-title';
    t2.textContent = card.title2;
    body.append(t2);
  }
  if (card.title3) {
    const t3 = document.createElement('p');
    t3.className = 'feature-card-desc';
    t3.textContent = card.title3;
    body.append(t3);
  }
  if (card.ctaLabel && card.ctaHref) {
    const cta = document.createElement('a');
    cta.className = 'feature-card-cta';
    cta.href = card.ctaHref;
    cta.innerHTML = `<span>${card.ctaLabel}</span>${ARROW_SVG}`;
    body.append(cta);
  }

  item.append(body);
  return item;
}

/**
 * A config row carries a key/value pair (e.g. "background | #ececed") instead of
 * card content: first cell is text-only (no image) and a second cell holds the value.
 */
function isConfigRow(row) {
  const cells = [...row.children];
  if (cells.length < 2) return false;
  if (cells[0].querySelector('img')) return false;
  const key = cells[0].textContent.trim().toLowerCase();
  return key === 'background';
}

export default function decorate(block) {
  const rows = [...block.children];

  // apply authored metadata (e.g. background color) so each page can override it.
  // background goes on the section so it spans full width as a band.
  const section = block.closest('.section');
  rows.filter(isConfigRow).forEach((row) => {
    const cells = [...row.children];
    const key = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();
    if (key === 'background' && value && section) {
      section.style.background = value;
      section.classList.add('feature-cards-has-bg');
    }
  });

  const cards = rows
    .filter((row) => !isConfigRow(row))
    .map(readCard)
    .filter((c) => c.desktopImg || c.mobileImg || c.title2);

  block.textContent = '';
  const grid = document.createElement('div');
  grid.className = 'feature-cards-grid';
  cards.forEach((card) => grid.append(buildCard(card)));
  block.append(grid);

  // optimize images while preserving the mobile source
  block.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    const mobileSource = picture.querySelector('source[media="(max-width: 599px)"]');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    picture.replaceWith(optimized);
    if (mobileSource) optimized.prepend(mobileSource);
  });
}

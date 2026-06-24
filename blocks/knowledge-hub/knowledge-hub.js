import { createOptimizedPicture } from '../../scripts/aem.js';

const ARROW_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
  <path d="M10 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

function cellLink(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  return a ? a.getAttribute('href') : cell.textContent.trim();
}

/**
 * Read one row's cells in authoring order:
 * 0 eyebrow, 1 title, 2 image, 3 redirection link
 */
function readRow(row) {
  const cells = [...row.children];
  return {
    eyebrow: cells[0] ? cells[0].textContent.trim() : '',
    title: cells[1] ? cells[1].textContent.trim() : '',
    image: cells[2] ? cells[2].querySelector('img') : null,
    href: cellLink(cells[3]),
  };
}

function buildFeatured(item) {
  const a = document.createElement('a');
  a.className = 'knowledge-hub-featured';
  if (item.href) a.href = item.href;

  if (item.image) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = item.image.getAttribute('src');
    img.alt = item.title || '';
    img.loading = 'lazy';
    picture.append(img);
    a.append(picture);
  }

  const overlay = document.createElement('div');
  overlay.className = 'knowledge-hub-featured-overlay';
  if (item.eyebrow) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'knowledge-hub-eyebrow';
    eyebrow.textContent = item.eyebrow;
    overlay.append(eyebrow);
  }
  if (item.title) {
    const h = document.createElement('h3');
    h.className = 'knowledge-hub-featured-title';
    h.textContent = item.title;
    overlay.append(h);
  }
  const readMore = document.createElement('span');
  readMore.className = 'knowledge-hub-readmore';
  readMore.innerHTML = `<span>Read more</span>${ARROW_SVG}`;
  overlay.append(readMore);

  a.append(overlay);
  return a;
}

function buildStoryItem(item) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.className = 'knowledge-hub-story';
  if (item.href) a.href = item.href;

  if (item.image) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = item.image.getAttribute('src');
    img.alt = '';
    img.loading = 'lazy';
    picture.append(img);
    a.append(picture);
  }
  const text = document.createElement('span');
  text.className = 'knowledge-hub-story-text';
  text.textContent = item.title;
  a.append(text);

  li.append(a);
  return li;
}

/** A config row carries "background | <value>" instead of story content. */
function isConfigRow(row) {
  const cells = [...row.children];
  if (cells.length < 2 || cells[0].querySelector('img')) return false;
  return cells[0].textContent.trim().toLowerCase() === 'background';
}

/** Apply an authored background to the section so it spans full width as a band. */
function applyBackground(block, rawRows) {
  const section = block.closest('.section');
  rawRows.filter(isConfigRow).forEach((row) => {
    const value = [...row.children][1].textContent.trim();
    if (value && section) {
      section.style.background = value;
      section.classList.add('has-section-bg');
    }
  });
}

export default function decorate(block) {
  const rawRows = [...block.children];
  applyBackground(block, rawRows);
  const rows = rawRows.filter((row) => !isConfigRow(row)).map(readRow);
  // first row with an image = featured; rows with image + title = stories;
  // a row with only a link (no image, no title) = "view all"
  const featured = rows.find((r) => r.image && r.title);
  const featuredIndex = rows.indexOf(featured);
  const stories = rows.filter((r, i) => i !== featuredIndex && r.image && r.title);
  const viewAll = rows.find((r) => !r.image && !r.title && r.href);

  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'knowledge-hub-grid';

  if (featured) grid.append(buildFeatured(featured));

  const aside = document.createElement('div');
  aside.className = 'knowledge-hub-aside';
  const asideTitle = document.createElement('p');
  asideTitle.className = 'knowledge-hub-aside-title';
  asideTitle.textContent = featured && featured.eyebrow ? featured.eyebrow : 'Stories in focus';
  aside.append(asideTitle);

  const list = document.createElement('ul');
  list.className = 'knowledge-hub-list';
  stories.forEach((s) => list.append(buildStoryItem(s)));
  aside.append(list);

  if (viewAll) {
    const link = document.createElement('a');
    link.className = 'knowledge-hub-viewall';
    link.href = viewAll.href;
    link.innerHTML = `<span>View all stories</span>${ARROW_SVG}`;
    aside.append(link);
  }

  grid.append(aside);
  block.append(grid);

  // optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const isFeatured = !!img.closest('.knowledge-hub-featured');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: isFeatured ? '1000' : '150' }]);
    img.closest('picture').replaceWith(optimized);
  });
}

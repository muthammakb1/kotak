import { createOptimizedPicture } from '../../scripts/aem.js';

const PLAY_SVG = `<svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">
  <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
  <path d="M45 24 27 14v20" fill="#fff"></path>
</svg>`;

/** Direct-child link of a cell, whether bare or wrapped in a paragraph. */
function cellLink(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  return a ? a.getAttribute('href') : cell.textContent.trim();
}

/**
 * Read one card's cells in authoring order:
 * 0 title, 1 image, 2 body text, 3 video link (optional)
 */
function readCard(row) {
  const cells = [...row.children];
  return {
    title: cells[0] ? cells[0].textContent.trim() : '',
    image: cells[1] ? cells[1].querySelector('img') : null,
    bodyCell: cells[2] || null,
    videoHref: cellLink(cells[3]),
  };
}

/** Extract the YouTube video id from a watch/embed/short URL. */
function youTubeId(url) {
  try {
    const u = new URL(url, window.location.href);
    const m = u.pathname.match(/\/embed\/([^/?]+)/);
    if (m) return m[1];
    if (u.hostname === 'youtu.be') return u.pathname.replace(/^\//, '');
    const v = u.searchParams.get('v');
    return v || '';
  } catch (e) {
    return '';
  }
}

/** Convert a YouTube watch/embed URL into an embeddable autoplay URL. */
function toEmbedUrl(url) {
  const id = youTubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
  return url;
}

/** Build a thumbnail URL for a YouTube video id. */
function youTubeThumb(id) {
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

/** Open the YouTube video in a centered modal overlay. */
function openVideoModal(embedUrl, title) {
  const overlay = document.createElement('div');
  overlay.className = 'highlight-grid-modal';

  const dialog = document.createElement('div');
  dialog.className = 'highlight-grid-modal-dialog';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'highlight-grid-modal-close';
  close.setAttribute('aria-label', 'Close video');
  close.innerHTML = '&times;';

  const frameWrap = document.createElement('div');
  frameWrap.className = 'highlight-grid-modal-frame';
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.title = title || 'Video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  frameWrap.append(iframe);

  dialog.append(close, frameWrap);
  overlay.append(dialog);

  const controller = new AbortController();
  const removeModal = () => {
    overlay.remove();
    controller.abort();
  };
  close.addEventListener('click', removeModal, { signal: controller.signal });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) removeModal();
  }, { signal: controller.signal });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') removeModal();
  }, { signal: controller.signal });

  document.body.append(overlay);
}

function buildVideoCard(card) {
  const item = document.createElement('div');
  item.className = 'highlight-grid-card highlight-grid-video';

  if (card.title) {
    const h = document.createElement('p');
    h.className = 'highlight-grid-title';
    h.textContent = card.title;
    item.append(h);
  }

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'highlight-grid-video-trigger';
  trigger.setAttribute('aria-label', card.title || 'Play video');

  const id = youTubeId(card.videoHref);
  const thumbSrc = (card.image && card.image.getAttribute('src')) || youTubeThumb(id);
  if (thumbSrc) {
    const media = document.createElement('div');
    media.className = 'highlight-grid-media';
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = thumbSrc;
    img.alt = card.title || '';
    img.loading = 'lazy';
    picture.append(img);
    media.append(picture);
    trigger.append(media);
  }
  trigger.insertAdjacentHTML('beforeend', `<span class="highlight-grid-play">${PLAY_SVG}</span>`);

  const embedUrl = toEmbedUrl(card.videoHref);
  trigger.addEventListener('click', () => openVideoModal(embedUrl, card.title));

  item.append(trigger);
  return item;
}

function buildContentCard(card) {
  const item = document.createElement('div');
  item.className = 'highlight-grid-card highlight-grid-content';

  if (card.title) {
    const h = document.createElement('h2');
    h.className = 'highlight-grid-title';
    h.textContent = card.title;
    item.append(h);
  }
  if (card.image) {
    const media = document.createElement('div');
    media.className = 'highlight-grid-media';
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = card.image.getAttribute('src');
    img.alt = card.title || '';
    img.loading = 'lazy';
    picture.append(img);
    media.append(picture);
    item.append(media);
  }
  if (card.bodyCell && card.bodyCell.textContent.trim()) {
    const body = document.createElement('div');
    body.className = 'highlight-grid-body';
    body.append(...card.bodyCell.childNodes);
    item.append(body);
  }
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  const cards = rows.map(readCard).filter((c) => c.image || c.title || c.videoHref);

  block.textContent = '';
  const grid = document.createElement('div');
  grid.className = 'highlight-grid-wrapper';
  cards.forEach((card) => {
    grid.append(card.videoHref ? buildVideoCard(card) : buildContentCard(card));
  });
  block.append(grid);

  // optimize same-origin thumbnail images (external YouTube thumbs stay as-is)
  block.querySelectorAll('picture > img').forEach((img) => {
    try {
      const u = new URL(img.src, window.location.href);
      if (u.origin !== window.location.origin) return;
    } catch (e) {
      return;
    }
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}

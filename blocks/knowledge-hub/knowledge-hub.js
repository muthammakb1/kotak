import { createOptimizedPicture } from '../../scripts/aem.js';

const ARROW_SVG = `<svg class="knowledge-hub-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
  <path d="M10 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

/** Direct-child link of a cell, whether bare or wrapped in a paragraph. */
function cellLink(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  return a ? a.getAttribute('href') : '';
}

/**
 * Read one row's cells in authoring order:
 * 0 card header, 1 link title, 2 image (optional), 3 redirection link
 */
function readRow(row) {
  const cells = [...row.children];
  return {
    header: cells[0] ? cells[0].textContent.trim() : '',
    title: cells[1] ? cells[1].textContent.trim() : '',
    image: cells[2] ? cells[2].querySelector('img') : null,
    href: cellLink(cells[3]) || (cells[3] ? cells[3].textContent.trim() : ''),
  };
}

function buildListItem(item) {
  const li = document.createElement('li');
  li.className = 'knowledge-hub-item';

  if (item.image) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = item.image.getAttribute('src');
    img.alt = '';
    img.loading = 'lazy';
    picture.append(img);
    li.append(picture);
  }

  const text = document.createElement('span');
  text.className = 'knowledge-hub-item-text';
  if (item.href) {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.title;
    text.append(a);
  } else {
    text.textContent = item.title;
  }
  li.append(text);
  return li;
}

function buildCard(card) {
  const col = document.createElement('div');
  col.className = 'knowledge-hub-col';

  const inner = document.createElement('div');
  inner.className = 'knowledge-hub-card';

  if (card.header) {
    const header = document.createElement('p');
    header.className = 'knowledge-hub-header';
    header.textContent = card.header;
    inner.append(header);
  }

  if (card.items.length) {
    const list = document.createElement('ul');
    list.className = 'knowledge-hub-list';
    card.items.forEach((it) => list.append(buildListItem(it)));
    inner.append(list);
  }

  if (card.cta) {
    const cta = document.createElement('a');
    cta.className = 'knowledge-hub-cta';
    cta.href = card.cta;
    cta.innerHTML = `<span>${card.ctaLabel}</span>${ARROW_SVG}`;
    inner.append(cta);
  }

  col.append(inner);
  return col;
}

export default function decorate(block) {
  const rows = [...block.children].map(readRow);

  // Group rows into cards keyed by header text. Rows with no title/image but a
  // href act as the card's "view all" CTA for the most recent header.
  const ctaLabelFor = (header) => {
    const h = (header || '').toLowerCase();
    if (h.includes('service request')) return 'View Service Requests';
    if (h.includes('helpcenter') || h.includes('help center')) return 'View All Topics';
    if (h.includes('learn') || h.includes('stor')) return 'View all stories';
    return 'View all';
  };

  const cards = [];
  let current = null;
  rows.forEach((r) => {
    if (r.title) {
      if (!current || current.header !== r.header) {
        current = {
          header: r.header, items: [], cta: '', ctaLabel: ctaLabelFor(r.header),
        };
        cards.push(current);
      }
      current.items.push(r);
    } else if (r.href) {
      // CTA row -- attach to the current card if present.
      if (current) current.cta = r.href;
    }
  });

  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'knowledge-hub-grid';
  cards.forEach((c) => grid.append(buildCard(c)));
  block.append(grid);

  // optimize thumbnail images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }]);
    img.closest('picture').replaceWith(optimized);
  });
}

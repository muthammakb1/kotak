import { createOptimizedPicture } from '../../scripts/aem.js';

const CHEVRON_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
  <path d="M8 10l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

const ARROW_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
  <path d="M10 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

/**
 * Read one panel row's cells in authoring order:
 * 0 panel title, 1 icon, 2 group subheading, 3 rates (paragraphs: "value" + <a>label</a>)
 * A row with only a link (no title, no icon) is the "See all rates" footer link.
 */
function readRow(row) {
  const cells = [...row.children];
  const title = cells[0] ? cells[0].textContent.trim() : '';
  const icon = cells[1] ? cells[1].querySelector('img') : null;
  const subheading = cells[2] ? cells[2].textContent.trim() : '';
  const ratesCell = cells[3] || null;
  return {
    title, icon, subheading, ratesCell,
  };
}

/** Parse a rates cell: each <p> = leading value text + an <a> (label + href). */
function parseRates(cell) {
  if (!cell) return [];
  const rates = [];
  cell.querySelectorAll('p').forEach((p) => {
    const a = p.querySelector('a');
    if (!a) return;
    // value = the paragraph text minus the link text
    const value = p.textContent.replace(a.textContent, '').trim();
    rates.push({ value, label: a.textContent.trim(), href: a.getAttribute('href') });
  });
  return rates;
}

function buildPanel(panel, index) {
  const item = document.createElement('div');
  item.className = 'rates-charges-panel';

  const header = document.createElement('button');
  header.type = 'button';
  header.className = 'rates-charges-header';
  header.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');

  const iconWrap = document.createElement('span');
  iconWrap.className = 'rates-charges-icon';
  if (panel.icon) {
    const img = document.createElement('img');
    img.src = panel.icon.getAttribute('src');
    img.alt = '';
    img.loading = 'lazy';
    iconWrap.append(img);
  }
  const label = document.createElement('span');
  label.className = 'rates-charges-label';
  label.textContent = panel.title;
  const chevron = document.createElement('span');
  chevron.className = 'rates-charges-chevron';
  chevron.innerHTML = CHEVRON_SVG;
  header.append(iconWrap, label, chevron);

  const body = document.createElement('div');
  body.className = 'rates-charges-body';
  if (index !== 0) body.hidden = true;

  if (panel.subheading) {
    const sub = document.createElement('p');
    sub.className = 'rates-charges-subheading';
    sub.textContent = panel.subheading;
    body.append(sub);
  }

  const rates = parseRates(panel.ratesCell);
  rates.forEach((rate) => {
    const r = document.createElement('a');
    r.className = 'rates-charges-rate';
    if (rate.href) r.href = rate.href;
    r.innerHTML = `<span class="rates-charges-rate-label">${rate.label}</span><span class="rates-charges-rate-value">${rate.value}</span>`;
    body.append(r);
  });

  header.addEventListener('click', () => {
    const open = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', open ? 'false' : 'true');
    body.hidden = open;
  });

  item.append(header, body);
  return item;
}

export default function decorate(block) {
  const rows = [...block.children].map(readRow);
  // "See all rates": a row with only a link inside the rates cell (no title/icon)
  const seeAll = rows.find((r) => !r.title && !r.icon && r.ratesCell && r.ratesCell.querySelector('a'));
  // title bar: a row with a title but no icon and no rate links
  const titleRow = rows.find((r) => r.title && !r.icon
    && !(r.ratesCell && r.ratesCell.querySelector('a')));
  const panels = rows.filter((r) => r.title && r.icon && r !== titleRow);

  block.textContent = '';

  if (titleRow) {
    const heading = document.createElement('div');
    heading.className = 'rates-charges-heading';
    heading.textContent = titleRow.title;
    block.append(heading);
  }

  const list = document.createElement('div');
  list.className = 'rates-charges-list';
  panels.forEach((panel, i) => list.append(buildPanel(panel, i)));
  block.append(list);

  if (seeAll) {
    const a = seeAll.ratesCell.querySelector('a');
    const link = document.createElement('a');
    link.className = 'rates-charges-seeall';
    link.href = a.getAttribute('href');
    link.innerHTML = `<span>${a.textContent.trim() || 'See all rates'}</span>${ARROW_SVG}`;
    block.append(link);
  }

  block.querySelectorAll('.rates-charges-icon img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
    img.replaceWith(optimized);
  });
}

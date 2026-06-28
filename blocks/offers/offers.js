/**
 * Authoring rows: one row per item.
 *   <icon-key> | <label> | <link>
 * icon-key is one of: track, gift, card
 */
const ICONS = {
  track: '<rect x="5" y="3" width="14" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><polyline points="8 16 10 18 13 15"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><rect x="4" y="12" width="16" height="9" rx="1"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M12 8S10 3 7.5 4 9.5 8 12 8Z"/><path d="M12 8s2-5 4.5-4-1.5 4-4.5 4Z"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="9" cy="14" r="2"/><circle cx="13" cy="14" r="2"/><line x1="6" y1="9" x2="13" y2="9"/>',
};

function iconSvg(key) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[key] || ICONS.gift;
  return svg;
}

export default function decorate(block) {
  const rows = [...block.children];

  const list = document.createElement('div');
  list.className = 'offers-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const iconImg = iconCell ? iconCell.querySelector('img') : null;
    const iconKey = iconCell ? iconCell.textContent.trim().toLowerCase() : '';
    const label = cells[1] ? cells[1].textContent.trim() : '';
    const linkCell = cells[2];
    let href = '';
    if (linkCell) {
      const a = linkCell.querySelector('a');
      href = a ? a.getAttribute('href') : linkCell.textContent.trim();
    }
    if (!label) return;

    // anchor when there's a destination, otherwise a plain item
    const item = document.createElement(href ? 'a' : 'div');
    item.className = 'offers-item';
    if (href) item.href = href;

    const icon = document.createElement('span');
    icon.className = 'offers-icon';
    if (iconImg) {
      const img = document.createElement('img');
      img.src = iconImg.getAttribute('src');
      img.alt = '';
      img.loading = 'lazy';
      icon.append(img);
    } else {
      icon.append(iconSvg(iconKey));
    }

    const text = document.createElement('span');
    text.className = 'offers-label';
    text.textContent = label;

    item.append(icon, text);

    // chevron only for items that link somewhere
    if (href) {
      const chevron = document.createElement('span');
      chevron.className = 'offers-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';
      item.append(chevron);
    }

    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}

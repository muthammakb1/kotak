/**
 * Authoring: groups of rows.
 *   card | <header>
 *   link | <icon image> | <label> | <href>
 * Each `card` row starts a new column; following `link` rows belong to it.
 */
function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'resource-grid-grid';

  let current = null;
  let list = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const kind = text(cells[0]).toLowerCase();

    if (kind === 'card') {
      current = document.createElement('div');
      current.className = 'resource-grid-card';
      const header = document.createElement('p');
      header.className = 'resource-grid-header';
      header.textContent = text(cells[1]);
      list = document.createElement('ul');
      list.className = 'resource-grid-list';
      current.append(header, list);
      grid.append(current);
      return;
    }

    if (kind === 'link' && list) {
      const img = cells[1] ? cells[1].querySelector('img') : null;
      const iconSrc = img ? img.getAttribute('src') : '';
      const label = text(cells[2]);
      const linkCell = cells[3];
      let href = '#';
      if (linkCell) {
        const a = linkCell.querySelector('a');
        href = a ? a.getAttribute('href') : linkCell.textContent.trim() || '#';
      }
      if (!label) return;

      const li = document.createElement('li');
      li.className = 'resource-grid-item';

      const link = document.createElement('a');
      link.className = 'resource-grid-link';
      link.href = href;

      if (iconSrc) {
        const icon = document.createElement('img');
        icon.className = 'resource-grid-icon';
        icon.src = iconSrc;
        icon.alt = '';
        icon.loading = 'lazy';
        link.append(icon);
      } else {
        link.classList.add('resource-grid-link-noicon');
      }

      const span = document.createElement('span');
      span.className = 'resource-grid-text';
      span.textContent = label;
      link.append(span);

      // trailing red arrow; CSS decides whether it shows for icon-less links
      const arrow = document.createElement('span');
      arrow.className = 'resource-grid-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><polyline points="11 9 14 12 11 15" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      link.append(arrow);

      li.append(link);
      list.append(li);
    }

    if (kind === 'cta' && current) {
      const label = text(cells[1]);
      const linkCell = cells[2];
      let href = '#';
      if (linkCell) {
        const a = linkCell.querySelector('a');
        href = a ? a.getAttribute('href') : linkCell.textContent.trim() || '#';
      }
      if (!label) return;
      const cta = document.createElement('a');
      cta.className = 'resource-grid-cta';
      cta.href = href;
      cta.innerHTML = `<span>${label}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>`;
      current.append(cta);
    }
  });

  block.append(grid);
}

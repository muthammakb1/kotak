/**
 * Authoring: one row per contact item.
 *   <icon image> | <title> | <description> | <cta label> | <cta href>
 * The CTA cells are optional (e.g. "Write to us" has no link).
 */
function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'contact-help-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'contact-help-item';

    const head = document.createElement('div');
    head.className = 'contact-help-head';

    const pic = cells[0] ? cells[0].querySelector('picture, img') : null;
    if (pic) {
      const icon = document.createElement('span');
      icon.className = 'contact-help-icon';
      icon.append(pic.tagName === 'PICTURE' ? pic : pic.closest('picture') || pic);
      head.append(icon);
    }

    const title = document.createElement('h3');
    title.className = 'contact-help-title';
    title.textContent = text(cells[1]);
    head.append(title);
    item.append(head);

    if (cells[2] && cells[2].textContent.trim()) {
      const desc = document.createElement('p');
      desc.className = 'contact-help-desc';
      desc.textContent = text(cells[2]);
      item.append(desc);
    }

    const ctaLabel = text(cells[3]);
    const linkCell = cells[4];
    let href = '';
    if (linkCell) {
      const a = linkCell.querySelector('a');
      href = a ? a.getAttribute('href') : text(linkCell);
    }
    if (ctaLabel && href) {
      const cta = document.createElement('a');
      cta.className = 'contact-help-cta';
      cta.href = href;
      cta.innerHTML = `<span>${ctaLabel}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="11 9 14 12 11 15" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      item.append(cta);
    }

    grid.append(item);
  });

  block.append(grid);
}

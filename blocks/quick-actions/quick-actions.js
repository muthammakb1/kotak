/**
 * Authoring rows (first cell is a keyword):
 *   intro  | <heading>
 *   action | <icon-key> | <label>
 *
 * icon-key is one of: plus, card, loans, clock, transfer, compare, location, alert
 */
const ICONS = {
  plus: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  card: '<rect x="3" y="6" width="18" height="13" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>',
  loans: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="17" x2="12" y2="17"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/>',
  transfer: '<polyline points="7 8 4 11 7 14"/><line x1="4" y1="11" x2="20" y2="11"/><polyline points="17 10 20 13 17 16"/><line x1="20" y1="13" x2="4" y2="13"/>',
  compare: '<line x1="7" y1="20" x2="7" y2="12"/><line x1="12" y1="20" x2="12" y2="5"/><line x1="17" y1="20" x2="17" y2="9"/>',
  location: '<path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16"/>',
};

function readRows(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      key: cells[0] ? cells[0].textContent.trim().toLowerCase() : '',
      a: cells[1] ? cells[1].textContent.trim() : '',
      b: cells[2] ? cells[2].textContent.trim() : '',
    };
  });
}

function iconSvg(key) {
  const paths = ICONS[key] || ICONS.plus;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = paths;
  return svg;
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const actions = rows.filter((r) => r.key === 'action');

  block.textContent = '';

  if (intro) {
    const heading = document.createElement('h2');
    heading.className = 'quick-actions-heading';
    heading.textContent = intro.a;
    block.append(heading);
  }

  if (actions.length) {
    const grid = document.createElement('div');
    grid.className = 'quick-actions-grid';
    actions.forEach((action) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'quick-actions-tile';
      if (action.a === 'alert') tile.classList.add('quick-actions-tile-alert');

      const icon = document.createElement('span');
      icon.className = 'quick-actions-icon';
      icon.append(iconSvg(action.a));

      const label = document.createElement('span');
      label.className = 'quick-actions-label';
      label.textContent = action.b;

      tile.append(icon, label);
      grid.append(tile);
    });
    block.append(grid);
  }
}

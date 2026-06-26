/**
 * Authoring rows (first cell is a keyword):
 *   intro | <heading text>
 *   card  | <icon image> | <title> | <description>
 *
 * Renders a centred heading above a 4-up grid of icon cards.
 */
function readRows(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      key: cells[0] ? cells[0].textContent.trim().toLowerCase() : '',
      cells: cells.slice(1),
    };
  });
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const cards = rows.filter((r) => r.key === 'card');

  block.textContent = '';

  if (intro) {
    const heading = document.createElement('h2');
    heading.className = 'why-choose-heading';
    heading.textContent = intro.cells[0] ? intro.cells[0].textContent.trim() : '';
    block.append(heading);
  }

  const grid = document.createElement('div');
  grid.className = 'why-choose-grid';

  cards.forEach((c) => {
    const [iconCell, titleCell, descCell] = c.cells;
    const card = document.createElement('div');
    card.className = 'why-choose-card';

    const pic = iconCell ? iconCell.querySelector('picture, img') : null;
    if (pic) {
      const icon = document.createElement('div');
      icon.className = 'why-choose-icon';
      icon.append(pic.tagName === 'PICTURE' ? pic : pic.closest('picture') || pic);
      card.append(icon);
    }

    if (titleCell) {
      const h = document.createElement('h3');
      h.className = 'why-choose-card-title';
      h.textContent = titleCell.textContent.trim();
      card.append(h);
    }

    if (descCell) {
      const p = document.createElement('p');
      p.className = 'why-choose-card-desc';
      p.textContent = descCell.textContent.trim();
      card.append(p);
    }

    grid.append(card);
  });

  block.append(grid);
}

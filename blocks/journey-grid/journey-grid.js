/**
 * Authoring rows (first cell is a keyword):
 *   intro | <eyebrow text> | <heading text>
 *   card  | <number>       | <title> | <description> | <tags>
 */
function readRows(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      key: cells[0] ? cells[0].textContent.trim().toLowerCase() : '',
      cells: cells.slice(1).map((c) => c.textContent.trim()),
    };
  });
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const cards = rows.filter((r) => r.key === 'card');

  block.textContent = '';

  if (intro) {
    const header = document.createElement('div');
    header.className = 'journey-grid-header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'journey-grid-eyebrow';
    [eyebrow.textContent] = intro.cells;
    const heading = document.createElement('h2');
    heading.className = 'journey-grid-heading';
    heading.textContent = intro.cells[1] || '';
    header.append(eyebrow, heading);
    block.append(header);
  }

  const grid = document.createElement('div');
  grid.className = 'journey-grid-cards';
  cards.forEach((c) => {
    const [num, title, desc, tags] = c.cells;
    const card = document.createElement('div');
    card.className = 'journey-grid-card';

    const number = document.createElement('p');
    number.className = 'journey-grid-card-number';
    number.textContent = num || '';

    const h = document.createElement('h3');
    h.className = 'journey-grid-card-title';
    h.textContent = title || '';

    const p = document.createElement('p');
    p.className = 'journey-grid-card-desc';
    p.textContent = desc || '';

    card.append(number, h, p);

    if (tags) {
      const t = document.createElement('p');
      t.className = 'journey-grid-card-tags';
      t.textContent = tags;
      card.append(t);
    }
    grid.append(card);
  });

  block.append(grid);
}

/**
 * Authoring rows (first cell is a keyword):
 *   intro | <eyebrow text> | <heading text>
 *   tile  | <tile title>   | <tile description>
 *   stat  | <stat value>   | <stat label>
 */
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

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const tiles = rows.filter((r) => r.key === 'tile');
  const stats = rows.filter((r) => r.key === 'stat');

  block.textContent = '';

  if (intro) {
    const header = document.createElement('div');
    header.className = 'trust-section-header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'trust-section-eyebrow';
    eyebrow.textContent = intro.a;
    const heading = document.createElement('h2');
    heading.className = 'trust-section-heading';
    heading.textContent = intro.b;
    header.append(eyebrow, heading);
    block.append(header);
  }

  if (tiles.length) {
    const grid = document.createElement('div');
    grid.className = 'trust-section-grid';
    tiles.forEach((t) => {
      const cell = document.createElement('div');
      cell.className = 'trust-section-tile';
      const title = document.createElement('h3');
      title.className = 'trust-section-tile-title';
      title.textContent = t.a;
      const desc = document.createElement('p');
      desc.className = 'trust-section-tile-desc';
      desc.textContent = t.b;
      cell.append(title, desc);
      grid.append(cell);
    });
    block.append(grid);
  }

  if (stats.length) {
    const strip = document.createElement('div');
    strip.className = 'trust-section-stats';
    stats.forEach((s) => {
      const stat = document.createElement('div');
      stat.className = 'trust-section-stat';
      const value = document.createElement('p');
      value.className = 'trust-section-stat-value';
      value.textContent = s.a;
      const label = document.createElement('p');
      label.className = 'trust-section-stat-label';
      label.textContent = s.b;
      stat.append(value, label);
      strip.append(stat);
    });
    block.append(strip);
  }
}

/**
 * Comparison table. Each authored row becomes a table row; cells map to
 * columns. The first row is the red column header, the first cell of every
 * subsequent row is the bold row label.
 */
export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  const table = document.createElement('div');
  table.className = 'feature-table';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const line = document.createElement('div');
    line.className = 'feature-row';
    if (i === 0) line.classList.add('feature-headrow');

    cells.forEach((c, ci) => {
      const cell = document.createElement('div');
      cell.className = 'feature-cell';
      if (ci === 0) cell.classList.add('feature-label');
      [...c.childNodes].forEach((n) => cell.append(n.cloneNode(true)));
      line.append(cell);
    });

    table.append(line);
  });

  block.append(table);
}

/**
 * Interest-rate table. Authored rows:
 *   <caption>                         (single cell → top header bar)
 *   <Nature> | <Rate of Interest>     (two cells → column header)
 *   <full-width subheading>           (single cell → spanning row)
 *   <label> | <value>                 (two cells → data row)
 *   <notes list>                      (single cell, holds <ol> → spanning row)
 *
 * The first row is treated as the caption bar, the second as the column
 * header. Remaining rows render as data (2 cells) or full-width (1 cell).
 */
export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  const table = document.createElement('div');
  table.className = 'savings-bank-a-c-table';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const line = document.createElement('div');
    line.className = 'savings-bank-a-c-row';

    if (i === 0 && cells.length === 1) {
      line.classList.add('savings-bank-a-c-caption');
    } else if (i === 1) {
      line.classList.add('savings-bank-a-c-headrow');
    } else if (cells.length === 1) {
      line.classList.add('savings-bank-a-c-full');
    }

    cells.forEach((c) => {
      const cell = document.createElement('div');
      cell.className = 'savings-bank-a-c-cell';
      [...c.childNodes].forEach((n) => cell.append(n.cloneNode(true)));
      line.append(cell);
    });

    table.append(line);
  });

  block.append(table);
}

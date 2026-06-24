/* global WebImporter */

/**
 * Parser for native data tables (table.table-bordered) on the Kotak savings page.
 * Emits the EDS "table (bordered)" block: first row holds only the block name +
 * variant, each subsequent row is a data row preserving cell inner HTML.
 */
export default function parse(element, { document }) {
  const sourceTable = element.matches('table') ? element : element.querySelector('table');
  if (!sourceTable) return;

  const cells = [['Table (bordered)']];

  [...sourceTable.rows].forEach((row) => {
    const rowCells = [...row.cells].map((cell) => {
      const div = document.createElement('div');
      div.innerHTML = cell.innerHTML;
      return div;
    });
    cells.push(rowCells);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Table (bordered)', cells });
  element.replaceWith(block);
}

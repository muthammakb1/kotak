/**
 * Authoring rows — one row per step:
 *   <step title> | <step description>
 *
 * Renders the steps as equal columns, each with a red title bar above a
 * grey body panel. The section heading and intro lines stay as default
 * content above the block.
 */
export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'account-steps-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const step = document.createElement('div');
    step.className = 'account-steps-step';

    const head = document.createElement('div');
    head.className = 'account-steps-head';
    head.textContent = cells[0] ? cells[0].textContent.trim() : '';
    step.append(head);

    const body = document.createElement('div');
    body.className = 'account-steps-body';
    if (cells[1]) {
      [...cells[1].childNodes].forEach((n) => body.append(n.cloneNode(true)));
    }
    step.append(body);

    grid.append(step);
  });

  block.append(grid);
}

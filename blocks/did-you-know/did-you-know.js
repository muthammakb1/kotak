/**
 * "Do You Qualify?" eligibility callout.
 *
 * Authoring rows (first cell is a keyword):
 *   heading | <lead words> | <highlighted words>
 *   body    | <description text>
 *   cta     | <link label>  | <link>
 *
 * Renders a bold split heading on the left (highlighted part in brand red) and,
 * separated by a vertical rule, a description with a text-link CTA on the right.
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
  const heading = rows.find((r) => r.key === 'heading');
  const body = rows.find((r) => r.key === 'body');
  const cta = rows.find((r) => r.key === 'cta');

  block.textContent = '';

  const card = document.createElement('div');
  card.className = 'did-you-know-card';

  if (heading) {
    const h = document.createElement('h2');
    h.className = 'did-you-know-heading';
    const lead = heading.cells[0] ? heading.cells[0].textContent.trim() : '';
    const accent = heading.cells[1] ? heading.cells[1].textContent.trim() : '';
    if (lead) {
      const span = document.createElement('span');
      span.className = 'did-you-know-heading-lead';
      span.textContent = lead;
      h.append(span);
    }
    if (accent) {
      const span = document.createElement('span');
      span.className = 'did-you-know-heading-accent';
      span.textContent = accent;
      h.append(span);
    }
    card.append(h);
  }

  const right = document.createElement('div');
  right.className = 'did-you-know-content';

  if (body && body.cells[0]) {
    const p = document.createElement('p');
    p.className = 'did-you-know-body';
    p.textContent = body.cells[0].textContent.trim();
    right.append(p);
  }

  if (cta) {
    const label = cta.cells[0] ? cta.cells[0].textContent.trim() : '';
    const linkCell = cta.cells[1];
    let href = '#';
    if (linkCell) {
      const a = linkCell.querySelector('a');
      href = a ? a.getAttribute('href') : linkCell.textContent.trim() || '#';
    }
    if (label) {
      const link = document.createElement('a');
      link.className = 'did-you-know-cta';
      link.href = href;
      link.textContent = label;
      right.append(link);
    }
  }

  card.append(right);
  block.append(card);
}

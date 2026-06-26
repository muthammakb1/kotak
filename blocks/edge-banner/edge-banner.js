/**
 * Authoring rows:
 *   row 1: <heading>
 *   row 2: <cta label> | <cta href>   (or a single cell with a link)
 */
function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

export default function decorate(block) {
  const rows = [...block.children];

  const heading = rows[0] ? text(rows[0].children[0]) : '';
  let ctaLabel = '';
  let ctaHref = '';
  if (rows[1]) {
    const cells = [...rows[1].children];
    const anchor = rows[1].querySelector('a');
    if (cells.length >= 2) {
      ctaLabel = text(cells[0]);
      ctaHref = anchor ? anchor.getAttribute('href') : text(cells[1]);
    } else if (anchor) {
      ctaLabel = anchor.textContent.trim();
      ctaHref = anchor.getAttribute('href');
    }
  }

  block.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'edge-banner-inner';

  if (heading) {
    const h = document.createElement('h2');
    h.className = 'edge-banner-heading';
    h.textContent = heading;
    inner.append(h);
  }

  if (ctaLabel && ctaHref) {
    const cta = document.createElement('a');
    cta.className = 'edge-banner-cta';
    cta.href = ctaHref;
    cta.textContent = ctaLabel;
    inner.append(cta);
  }

  block.append(inner);
}

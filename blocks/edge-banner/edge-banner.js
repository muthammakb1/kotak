/**
 * Authoring rows come in pairs (one pair per panel):
 *   <heading>
 *   <cta label> | <cta href>   (or a single cell with a link)
 *
 * One pair renders a single centred banner. Two pairs render a split
 * "compare-callback" banner with two panels side by side.
 */
function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

function ctaFrom(row) {
  if (!row) return null;
  const cells = [...row.children];
  const anchor = row.querySelector('a');
  let label = '';
  let href = '';
  if (cells.length >= 2) {
    label = text(cells[0]);
    href = anchor ? anchor.getAttribute('href') : text(cells[1]);
  } else if (anchor) {
    label = anchor.textContent.trim();
    href = anchor.getAttribute('href');
  }
  if (!label || !href) return null;
  const a = document.createElement('a');
  a.className = 'edge-banner-cta';
  a.href = href;
  a.textContent = label;
  return a;
}

export default function decorate(block) {
  const rows = [...block.children];

  // group rows into [heading, cta] pairs
  const panels = [];
  for (let i = 0; i < rows.length; i += 2) {
    const heading = text(rows[i].children[0]);
    const cta = ctaFrom(rows[i + 1]);
    if (heading || cta) panels.push({ heading, cta });
  }

  block.textContent = '';
  if (panels.length > 1) block.classList.add('edge-banner-split');

  panels.forEach((p) => {
    const inner = document.createElement('div');
    inner.className = 'edge-banner-inner';

    if (p.heading) {
      const h = document.createElement('h2');
      h.className = 'edge-banner-heading';
      h.textContent = p.heading;
      inner.append(h);
    }
    if (p.cta) inner.append(p.cta);

    block.append(inner);
  });
}

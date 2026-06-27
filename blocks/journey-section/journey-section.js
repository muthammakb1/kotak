/**
 * Authoring rows (first cell is a keyword):
 *   intro | <heading>
 *   step  | <icon-key> | <step title> | <step body>
 *
 * icon-key is one of: card, document, vkyc
 */
const ICONS = {
  card: '<path d="M5 16.5 4 17a2 2 0 0 1-2-2.3l.7-4.2a2 2 0 0 1 1-1.4l9-5a2 2 0 0 1 2.7.8l1.5 2.7"/><rect x="9.5" y="8" width="13" height="8.5" rx="1.5" transform="rotate(12 16 12)"/><line x1="10.5" y1="11.5" x2="22" y2="14"/>',
  document: '<rect x="5" y="3" width="12" height="16" rx="1.5"/><rect x="8" y="6" width="12" height="16" rx="1.5"/><line x1="10.5" y1="10" x2="16" y2="10"/><line x1="10.5" y1="13" x2="16" y2="13"/><circle cx="12" cy="17" r="1.5"/>',
  vkyc: '<rect x="3" y="5" width="18" height="13" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c0-1.7 1.3-3 3-3s3 1.3 3 3"/><line x1="14" y1="9" x2="18" y2="9"/><line x1="14" y1="12" x2="17" y2="12"/><circle cx="19" cy="18" r="3.5"/><polyline points="17.6 18 18.6 19 20.4 17"/>',
};

function iconSvg(key) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.4');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[key] || ICONS.card;
  return svg;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      key: cells[0] ? cells[0].textContent.trim().toLowerCase() : '',
      a: cells[1] ? cells[1].textContent.trim() : '',
      aImg: cells[1] ? cells[1].querySelector('img') : null,
      b: cells[2] ? cells[2].textContent.trim() : '',
      c: cells[3] ? cells[3].textContent.trim() : '',
    };
  });

  const intro = rows.find((r) => r.key === 'intro');
  const steps = rows.filter((r) => r.key === 'step');

  block.textContent = '';

  if (intro) {
    const h = document.createElement('h2');
    h.className = 'journey-section-title';
    h.textContent = intro.a;
    block.append(h);
  }

  if (steps.length) {
    const grid = document.createElement('div');
    grid.className = 'journey-section-steps';
    steps.forEach((s) => {
      const step = document.createElement('div');
      step.className = 'journey-section-step';

      const icon = document.createElement('span');
      icon.className = 'journey-section-icon';
      if (s.aImg) {
        const img = document.createElement('img');
        img.src = s.aImg.getAttribute('src');
        img.alt = '';
        img.loading = 'lazy';
        icon.append(img);
      } else {
        icon.append(iconSvg(s.a));
      }

      const title = document.createElement('p');
      title.className = 'journey-section-step-title';
      title.textContent = s.b;

      const body = document.createElement('p');
      body.className = 'journey-section-step-body';
      body.textContent = s.c;

      step.append(icon, title, body);
      grid.append(step);
    });
    block.append(grid);
  }
}

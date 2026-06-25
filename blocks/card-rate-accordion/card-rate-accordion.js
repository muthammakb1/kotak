/**
 * Authoring: one row per accordion item.
 *   <title> | <body (rich text)>
 * Optional first row with a single cell acts as the section heading.
 */
export default function decorate(block) {
  const rows = [...block.children];

  block.textContent = '';

  const list = document.createElement('div');
  list.className = 'card-rate-accordion-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    // section heading: single-cell row
    if (cells.length === 1) {
      const h = document.createElement('h2');
      h.className = 'card-rate-accordion-heading';
      h.textContent = cells[0].textContent.trim();
      block.append(h);
      return;
    }

    const title = cells[0] ? cells[0].textContent.trim() : '';
    const bodyCell = cells[1];
    if (!title) return;

    const item = document.createElement('div');
    item.className = 'card-rate-accordion-item';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'card-rate-accordion-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span>${title}</span><span class="card-rate-accordion-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><polyline points="8.5 10.5 12 14 15.5 10.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

    const panel = document.createElement('div');
    panel.className = 'card-rate-accordion-panel';
    panel.hidden = true;
    const inner = document.createElement('div');
    inner.className = 'card-rate-accordion-content';
    inner.innerHTML = bodyCell ? bodyCell.innerHTML : '';
    panel.append(inner);

    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
      panel.hidden = open;
    });

    item.append(trigger, panel);
    list.append(item);
  });

  block.append(list);
}

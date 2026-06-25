/**
 * Authoring rows (first cell is a keyword):
 *   intro  | <eyebrow> | <heading>
 *   badge  | <badge text>
 *   chip   | <chip label>
 *   note   | <footer note text>
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
  const badge = rows.find((r) => r.key === 'badge');
  const chips = rows.filter((r) => r.key === 'chip');
  const note = rows.find((r) => r.key === 'note');

  block.textContent = '';

  const card = document.createElement('div');
  card.className = 'product-finder-card';

  const header = document.createElement('div');
  header.className = 'product-finder-header';

  const text = document.createElement('div');
  text.className = 'product-finder-intro';
  if (intro) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'product-finder-eyebrow';
    eyebrow.textContent = intro.a;
    const heading = document.createElement('h2');
    heading.className = 'product-finder-heading';
    heading.textContent = intro.b;
    text.append(eyebrow, heading);
  }
  header.append(text);

  if (badge) {
    const b = document.createElement('p');
    b.className = 'product-finder-badge';
    b.innerHTML = `<span class="product-finder-badge-dot" aria-hidden="true"></span><span>${badge.a}</span>`;
    header.append(b);
  }
  card.append(header);

  if (chips.length) {
    const list = document.createElement('div');
    list.className = 'product-finder-chips';
    chips.forEach((c) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'product-finder-chip';
      chip.textContent = c.a;
      list.append(chip);
    });
    card.append(list);
  }

  if (note) {
    const n = document.createElement('p');
    n.className = 'product-finder-note';
    n.textContent = note.a;
    card.append(n);
  }

  block.append(card);
}

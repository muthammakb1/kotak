/**
 * Authoring rows (first cell is a keyword):
 *   intro | <heading>
 *   card  | image | title | fee | bullets(ul) | applyLabel | applyHref | knowLabel | knowHref
 */
function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

function linkHref(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  if (a) return a.getAttribute('href');
  return cell.textContent.trim();
}

export default function decorate(block) {
  const rows = [...block.children];

  const intro = rows.find((r) => text(r.children[0]).toLowerCase() === 'intro');
  const filters = rows.filter((r) => text(r.children[0]).toLowerCase() === 'filter');
  const cards = rows.filter((r) => text(r.children[0]).toLowerCase() === 'card');

  block.textContent = '';

  if (intro) {
    const h = document.createElement('h2');
    h.className = 'compare-cards-title';
    h.textContent = text(intro.children[1]);
    block.append(h);
  }

  if (filters.length) {
    const wrap = document.createElement('div');
    wrap.className = 'compare-cards-filters';

    const heading = document.createElement('p');
    heading.className = 'compare-cards-filters-heading';
    heading.textContent = 'Choose a filter';
    wrap.append(heading);

    const bar = document.createElement('div');
    bar.className = 'compare-cards-filter-bar';

    const dropdowns = [];
    const closeAll = (except) => {
      dropdowns.forEach((d) => {
        if (d !== except) {
          d.classList.remove('is-open');
          d.querySelector('.compare-cards-dropdown-toggle').setAttribute('aria-expanded', 'false');
        }
      });
    };

    filters.forEach((row) => {
      const groupName = text(row.children[1]);
      const options = text(row.children[2]).split(',').map((s) => s.trim()).filter(Boolean);
      if (!options.length) return;

      const dropdown = document.createElement('div');
      dropdown.className = 'compare-cards-dropdown';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'compare-cards-dropdown-toggle';
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = `<span>${groupName}</span><span class="compare-cards-dropdown-caret" aria-hidden="true">⌄</span>`;

      const panel = document.createElement('div');
      panel.className = 'compare-cards-dropdown-panel';
      panel.hidden = true;

      const panelTitle = document.createElement('p');
      panelTitle.className = 'compare-cards-dropdown-title';
      panelTitle.textContent = groupName;
      panel.append(panelTitle);

      const list = document.createElement('div');
      list.className = 'compare-cards-dropdown-list';
      const inputs = [];
      options.forEach((opt) => {
        const id = `cc-${groupName}-${opt}`.replace(/\s+/g, '-').toLowerCase();
        const item = document.createElement('label');
        item.className = 'compare-cards-dropdown-option';
        item.setAttribute('for', id);
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.value = opt;
        const span = document.createElement('span');
        span.textContent = opt;
        item.append(cb, span);
        list.append(item);
        inputs.push(cb);
      });
      panel.append(list);

      const footer = document.createElement('div');
      footer.className = 'compare-cards-dropdown-footer';
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'compare-cards-dropdown-clear';
      clear.textContent = 'Clear';
      const apply = document.createElement('button');
      apply.type = 'button';
      apply.className = 'compare-cards-dropdown-apply';
      apply.textContent = 'Apply';
      footer.append(clear, apply);
      panel.append(footer);

      const setOpen = (open) => {
        dropdown.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
      };

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = panel.hidden;
        closeAll(dropdown);
        setOpen(willOpen);
      });
      clear.addEventListener('click', () => { inputs.forEach((cb) => { cb.checked = false; }); });
      apply.addEventListener('click', () => setOpen(false));

      dropdown.append(toggle, panel);
      bar.append(dropdown);
      dropdowns.push(dropdown);
    });

    document.addEventListener('click', () => closeAll(null));

    wrap.append(bar);
    block.append(wrap);
  }

  const grid = document.createElement('div');
  grid.className = 'compare-cards-grid';

  cards.forEach((row) => {
    const cells = [...row.children];
    const img = cells[1] ? cells[1].querySelector('img') : null;
    const title = text(cells[2]);
    const fee = text(cells[3]);
    const bulletsCell = cells[4];
    const applyLabel = text(cells[5]);
    const applyHref = linkHref(cells[6]);
    const knowLabel = text(cells[7]);
    const knowHref = linkHref(cells[8]);

    const card = document.createElement('div');
    card.className = 'compare-cards-card';

    if (img) {
      const media = document.createElement('div');
      media.className = 'compare-cards-media';
      const picture = document.createElement('img');
      picture.src = img.getAttribute('src');
      picture.alt = title || 'card image';
      picture.loading = 'lazy';
      media.append(picture);
      if (title) {
        const t = document.createElement('p');
        t.className = 'compare-cards-card-title';
        t.textContent = title;
        media.append(t);
      }
      if (fee) {
        const f = document.createElement('p');
        f.className = 'compare-cards-fee';
        f.textContent = fee;
        media.append(f);
      }
      card.append(media);
    }

    if (bulletsCell) {
      let ul = bulletsCell.querySelector('ul');
      if (!ul) {
        const items = bulletsCell.innerHTML.split(/<br\s*\/?>|\n/).map((s) => s.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        if (items.length) {
          ul = document.createElement('ul');
          items.forEach((it) => {
            const li = document.createElement('li');
            li.textContent = it;
            ul.append(li);
          });
        }
      }
      if (ul) {
        ul.classList.add('compare-cards-bullets');
        card.append(ul);
      }
    }

    if ((applyLabel && applyHref) || (knowLabel && knowHref)) {
      const actions = document.createElement('div');
      actions.className = 'compare-cards-actions';
      if (applyLabel && applyHref) {
        const a = document.createElement('a');
        a.className = 'compare-cards-apply';
        a.href = applyHref;
        a.textContent = applyLabel;
        actions.append(a);
      }
      if (knowLabel && knowHref) {
        const k = document.createElement('a');
        k.className = 'compare-cards-know';
        k.href = knowHref;
        k.innerHTML = `<span>${knowLabel}</span><svg class="compare-cards-know-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="11 9 14 12 11 15" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        actions.append(k);
      }
      card.append(actions);
    }

    grid.append(card);
  });

  block.append(grid);
}

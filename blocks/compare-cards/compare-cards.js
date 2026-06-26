/**
 * Authoring rows (first cell is a keyword):
 *   intro  | <heading text> | <optional subheading text>
 *   card   | <image> | <title> | <highlight/fee> | <ul bullets>
 *            | <primary label> | <primary link> | <secondary label> | <secondary link>
 *
 * Renders a centred heading + subheading and a grid of cards. Each card
 * overlays its title on the image, then lists a highlight, bullet points,
 * and up to two call-to-action links (primary button + link).
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

function textOf(cell) {
  return cell ? cell.textContent.trim() : '';
}

function linkFrom(labelCell, linkCell, variant) {
  const label = textOf(labelCell);
  const anchor = linkCell ? linkCell.querySelector('a') : null;
  const href = anchor ? anchor.getAttribute('href') : textOf(linkCell);
  if (!label || !href) return null;
  const a = document.createElement('a');
  a.className = `compare-cards-cta compare-cards-${variant}`;
  a.href = href;
  a.textContent = label;
  return a;
}

function buildCard(cells) {
  const [imgCell, titleCell, highlightCell, bulletsCell,
    primaryLabel, primaryLink, secondaryLabel, secondaryLink] = cells;

  const card = document.createElement('div');
  card.className = 'compare-cards-card';

  const figure = document.createElement('div');
  figure.className = 'compare-cards-figure';
  const pic = imgCell ? imgCell.querySelector('picture, img') : null;
  if (pic) figure.append(pic.tagName === 'PICTURE' ? pic : pic.closest('picture') || pic);

  const title = document.createElement('h3');
  title.className = 'compare-cards-title';
  title.textContent = textOf(titleCell);
  figure.append(title);
  card.append(figure);

  const body = document.createElement('div');
  body.className = 'compare-cards-body';

  const highlight = highlightCell && highlightCell.textContent.trim()
    ? highlightCell.cloneNode(true) : null;
  if (highlight) {
    highlight.className = 'compare-cards-highlight';
    body.append(highlight);
  }

  const list = bulletsCell ? bulletsCell.querySelector('ul') : null;
  if (list) {
    list.className = 'compare-cards-list';
    body.append(list);
  }

  const actions = document.createElement('div');
  actions.className = 'compare-cards-actions';
  const primary = linkFrom(primaryLabel, primaryLink, 'primary');
  const secondary = linkFrom(secondaryLabel, secondaryLink, 'secondary');
  if (primary) actions.append(primary);
  if (secondary) actions.append(secondary);
  if (primary || secondary) body.append(actions);

  card.append(body);
  return card;
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const cards = rows.filter((r) => r.key === 'card');

  block.textContent = '';

  if (intro) {
    const header = document.createElement('div');
    header.className = 'compare-cards-header';

    const heading = document.createElement('h2');
    heading.className = 'compare-cards-heading';
    heading.textContent = textOf(intro.cells[0]);
    header.append(heading);

    if (intro.cells[1] && intro.cells[1].textContent.trim()) {
      const sub = document.createElement('p');
      sub.className = 'compare-cards-subheading';
      sub.textContent = textOf(intro.cells[1]);
      header.append(sub);
    }
    block.append(header);
  }

  const grid = document.createElement('div');
  grid.className = 'compare-cards-grid';
  cards.forEach((c) => grid.append(buildCard(c.cells)));
  block.append(grid);
}

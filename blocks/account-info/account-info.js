/**
 * A rich-text block: authored as a single cell holding headings, paragraphs
 * and lists. The decorator lifts that content up to the block root so the CSS
 * can style headings (centred navy), red bullets, and the italic note.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;
  const nodes = [...cell.childNodes];
  block.textContent = '';
  nodes.forEach((n) => block.append(n));
}

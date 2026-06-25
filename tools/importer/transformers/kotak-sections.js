/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kotak section restructure + section metadata.
 *
 * Runs in afterTransform — AFTER the block parsers have replaced their source
 * elements with WebImporter block tables.
 *
 * On the source page, the article body, FAQ and Read Next blocks all live
 * inside ONE shared wrapper (body > div:nth-of-type(8)). If left nested, EDS
 * collapses them into a single section, so the FAQ / Read Next light-grey
 * section backgrounds can't be applied. This transformer therefore hoists each
 * block into its own top-level section (a direct child group of the main
 * element) separated by <hr>, and appends a Section Metadata block to the
 * styled sections.
 *
 *   1. Hero Banner                    block: hero            style: null
 *   2. Article Body + Related Sidebar block: columns         style: null
 *   3. FAQ Accordion                  block: accordion       style: light-grey
 *   4. Read Next (Article Cards)      block: knowledge-hub   style: light-grey
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const document = element.ownerDocument;

  // Ordered section list. Prefer payload.template.sections; fall back to a
  // self-contained definition so the transformer works standalone.
  let sections;
  if (payload && payload.template && Array.isArray(payload.template.sections)) {
    sections = payload.template.sections.map((s) => ({
      block: Array.isArray(s.blocks) && s.blocks.length ? s.blocks[0] : null,
      style: s.style || null,
    }));
  } else {
    sections = [
      { block: 'hero', style: null },
      { block: 'columns', style: null },
      { block: 'accordion', style: 'light-grey' },
      { block: 'knowledge-hub', style: 'light-grey' },
    ];
  }

  // Match a parsed block table by its header-row text (the block name).
  // WebImporter renders the block name with title-casing and spaces
  // (e.g. "Knowledge Hub" for the knowledge-hub block), so normalise both the
  // header text and the configured block name to a comparable key by
  // lowercasing and stripping spaces, hyphens and any "(variant)" suffix.
  const tables = Array.from(element.querySelectorAll('table'));
  const normalize = (s) => (s || '')
    .toLowerCase()
    .replace(/\(.*\)/, '')
    .replace(/[\s-]+/g, '')
    .trim();
  const headerKey = (table) => {
    const firstRow = table.querySelector('tr');
    return firstRow ? normalize(firstRow.textContent) : '';
  };

  // Build an ordered list of section "bundles": each is the block table plus
  // any heading(s) that immediately precede it (e.g. the "Frequently Asked
  // Questions" / "Read Next" H2s that sit just before the block table).
  const bundles = [];
  sections.forEach(({ block, style }) => {
    if (!block) return;
    const table = tables.find((t) => headerKey(t) === normalize(block));
    if (!table) return;

    const nodes = [];
    // Pull in immediately-preceding heading siblings (in document order).
    let prev = table.previousElementSibling;
    const leadingHeadings = [];
    while (prev && /^H[1-6]$/.test(prev.tagName)) {
      leadingHeadings.unshift(prev);
      prev = prev.previousElementSibling;
    }
    nodes.push(...leadingHeadings, table);
    bundles.push({ nodes, style });
  });

  if (!bundles.length) return;

  // Detach every bundle node from its current parent.
  bundles.forEach(({ nodes }) => nodes.forEach((n) => n.remove()));

  // Remove whatever non-content wrappers remain (now emptied of their blocks).
  Array.from(element.children).forEach((child) => child.remove());

  // Re-append each bundle as its own top-level section, separated by <hr>.
  bundles.forEach(({ nodes, style }, idx) => {
    if (idx > 0) {
      element.append(document.createElement('hr'));
    }
    nodes.forEach((n) => element.append(n));
    if (style) {
      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style },
      });
      element.append(metaBlock);
    }
  });
}

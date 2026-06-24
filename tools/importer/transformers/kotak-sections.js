/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kotak section breaks + section metadata.
 *
 * Driven by payload.template.sections (from tools/importer/page-templates.json).
 * For the savings-account template there are 15 sections; 3 carry a style
 * ("light-grey"): legacy-accounts (rc12), knowledge (rc16), testimonials (rc21).
 *
 * For each section (processed in reverse document order so earlier inserts
 * don't shift later anchors):
 *   - If the section has a `style`, append a "Section Metadata" block right
 *     after the section element.
 *   - If the section is not the first and has preceding content, insert an
 *     <hr> before the section element.
 *
 * Section selectors come from the template (verified against
 * migration-work/cleaned.html). Runs in afterTransform only.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve each section's anchor element (scoped to the main element being
  // transformed), preserving the template order.
  const resolved = sections.map((section) => {
    let el = null;
    try {
      el = element.querySelector(section.selector);
    } catch (e) {
      el = null;
    }
    return { section, el };
  });

  // Process in reverse so DOM insertions don't invalidate earlier matches.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];
    if (!el) continue;

    // Section Metadata block for styled sections — insert after the section.
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (el.nextSibling) {
        el.parentElement.insertBefore(block, el.nextSibling);
      } else {
        el.parentElement.appendChild(block);
      }
    }

    // Section break before every non-first section. Sections may begin a new
    // parent container (e.g. body > div.amp-page > ...:nth-of-type(1)), so do
    // NOT gate on previousElementSibling — every non-first section needs an
    // <hr> so the importer flattens it into a distinct section.
    if (i > 0) {
      const hr = doc.createElement('hr');
      el.parentElement.insertBefore(hr, el);
    }
  }
}

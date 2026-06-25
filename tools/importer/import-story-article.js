/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import accordionParser from './parsers/accordion.js';
import knowledgeHubParser from './parsers/knowledge-hub.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/kotak-cleanup.js';
import sectionsTransformer from './transformers/kotak-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'story-article',
  description: 'Stories-in-focus article page: hero banner with title, article body with sidebar related-links, FAQ accordion, and a Read Next cards section.',
  urls: [
    'https://www.kotak.bank.in/en/stories-in-focus/nri/how-to-invest-in-gold-as-an-nri.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['div.heroslider.section'],
    },
    {
      name: 'columns',
      instances: ['section.articles-details > div.container > div.row'],
    },
    {
      name: 'accordion',
      instances: ['div.faq.section'],
    },
    {
      name: 'knowledge-hub',
      instances: ['div.keepreading.section'],
    },
  ],
  sections: [
    {
      id: 'rc5',
      name: 'Hero Banner',
      selector: 'div.heroslider.section',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'rc7c1',
      name: 'Article Body + Related Information Sidebar',
      selector: 'section.articles-details > div.container > div.row',
      style: null,
      blocks: ['columns'],
      defaultContent: [],
    },
    {
      id: 'rc7c2',
      name: 'Frequently Asked Questions (FAQ Accordion)',
      selector: 'div.faq.section',
      style: 'light-grey',
      blocks: ['accordion'],
      defaultContent: [],
    },
    {
      id: 'rc7c3',
      name: 'Read Next (Article Cards)',
      selector: 'div.keepreading.section',
      style: 'light-grey',
      blocks: ['knowledge-hub'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  hero: heroParser,
  columns: columnsParser,
  accordion: accordionParser,
  'knowledge-hub': knowledgeHubParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

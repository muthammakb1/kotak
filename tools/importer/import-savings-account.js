/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCarouselParser from './parsers/hero-carousel.js';
import infoCarouselParser from './parsers/info-carousel.js';
import cardsAccountParser from './parsers/cards-account.js';
import knowledgeHubParser from './parsers/knowledge-hub.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import highlightGridParser from './parsers/highlight-grid.js';
import featureCardsParser from './parsers/feature-cards.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/kotak-cleanup.js';
import sectionsTransformer from './transformers/kotak-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-carousel': heroCarouselParser,
  'info-carousel': infoCarouselParser,
  'cards-account': cardsAccountParser,
  'knowledge-hub': knowledgeHubParser,
  'accordion-faq': accordionFaqParser,
  'highlight-grid': highlightGridParser,
  'feature-cards': featureCardsParser,
  'cards-testimonial': cardsTestimonialParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'savings-account',
  description: 'Kotak savings account product page with hero slider, offers, account variants, features, and FAQs',
  urls: [
    'https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html',
  ],
  blocks: [
    {
      name: 'hero-carousel',
      instances: [
        'section.sa-hero-slider',
      ],
    },
    {
      name: 'info-carousel',
      instances: [
        'div.iwantto.section div.what-we-offer.insurance-wantTo > div.white-bg-wrapper > div.row',
        'body > div.amp-page > div.wrapper.section:nth-of-type(1) div.iconslider.section',
        'body > div.amp-page > div.newoffers.section div.owl-carousel.common-slider',
      ],
    },
    {
      name: 'cards-account',
      instances: [
        'div.iparys_inherited div.row.sa-card-container.af-card-container',
      ],
    },
    {
      name: 'knowledge-hub',
      instances: [
        'body > div.amp-page > div.wrapper.section:nth-of-type(5) div.columncontrol.section',
      ],
    },
    {
      name: 'accordion-faq',
      instances: [
        'body > div.amp-page > div.wrapper.section:nth-of-type(7) div.card-rate-box.option2.prod-accordion',
      ],
    },
    {
      name: 'highlight-grid',
      instances: [
        'body > div.amp-page > div.wrapper.section:nth-of-type(8) div.columncontrol.section',
      ],
    },
    {
      name: 'feature-cards',
      instances: [
        'body > div.amp-page > div.wrapper.section:nth-of-type(9) div.columncontrol.section',
      ],
    },
    {
      name: 'cards-testimonial',
      instances: [
        'body > div.amp-page > div.wrapper.section:nth-of-type(10) div.testimonial.section',
      ],
    },
  ],
  sections: [
    { id: 'rc4', name: 'breadcrumb', selector: 'body > div:nth-of-type(5)', style: null, blocks: [], defaultContent: ['body > div:nth-of-type(5)'] },
    { id: 'rc5', name: 'hero', selector: 'body > div:nth-of-type(6) > div.heroslider.section', style: null, blocks: ['hero-carousel'], defaultContent: [] },
    { id: 'rc8', name: 'intro', selector: 'body > div:nth-of-type(7) > div.wrapper.section:nth-of-type(1)', style: null, blocks: [], defaultContent: ['body > div:nth-of-type(7) > div.wrapper.section:nth-of-type(1)'] },
    { id: 'rc9', name: 'why-choose', selector: 'body > div:nth-of-type(7) > div.wrapper.section:nth-of-type(2)', style: null, blocks: ['info-carousel'], defaultContent: [] },
    { id: 'rc11', name: 'account-variants', selector: 'body > div:nth-of-type(7) > div.iparys_inherited', style: null, blocks: ['cards-account'], defaultContent: [] },
    { id: 'rc12', name: 'legacy-accounts', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(1)', style: 'light-grey', blocks: ['info-carousel'], defaultContent: [] },
    { id: 'rc13', name: 'rates-compare', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(2)', style: null, blocks: [], defaultContent: ['body > div.amp-page > div.wrapper.section:nth-of-type(2)'] },
    { id: 'rc14', name: 'offers', selector: 'body > div.amp-page > div.newoffers.section', style: null, blocks: ['info-carousel'], defaultContent: [] },
    { id: 'rc15', name: 'how-to-open', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(4)', style: null, blocks: [], defaultContent: ['body > div.amp-page > div.wrapper.section:nth-of-type(4)'] },
    { id: 'rc16', name: 'knowledge', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(5)', style: 'light-grey', blocks: ['knowledge-hub'], defaultContent: [] },
    { id: 'rc17', name: 'cta-banner', selector: 'body > div.amp-page > div.callBack.section', style: null, blocks: [], defaultContent: ['body > div.amp-page > div.callBack.section'] },
    { id: 'rc18', name: 'faq', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(7)', style: null, blocks: ['accordion-faq'], defaultContent: [] },
    { id: 'rc19', name: 'related-videos', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(8)', style: null, blocks: ['highlight-grid'], defaultContent: [] },
    { id: 'rc20', name: 'related-products', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(9)', style: null, blocks: ['feature-cards'], defaultContent: [] },
    { id: 'rc21', name: 'testimonials', selector: 'body > div.amp-page > div.wrapper.section:nth-of-type(10)', style: 'light-grey', blocks: ['cards-testimonial'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections last (afterTransform)
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

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
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

/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kotak site-wide cleanup.
 *
 * Scope decision (per migration brief): KEEP the existing AEM EDS site header
 * and footer. The source site's header chrome (logo, mega-menu, login,
 * search), notification/modal/overlay widgets, and the source footer are
 * NON-AUTHORABLE for this import and must be stripped so only the main product
 * content (breadcrumb -> hero -> intro -> why-choose -> accounts -> amp-page
 * sections, i.e. rc4..rc21) survives.
 *
 * All selectors below were verified against migration-work/cleaned.html for
 * https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Selectors are SPECIFIC (class / id based) rather than coarse structural
 * (`header`, `footer`, `body > div:nth-of-type(n)`): on the live page the main
 * product content is delivered inside the same AEM chrome subtree, so removing
 * the broad `header` element (or low nth-of-type body children) would also
 * delete the main content. Each selector below targets a self-contained,
 * non-authorable chrome subtree only.
 *
 * IMPORTANT — default-content sections (rc13 "rates-compare" and rc15
 * "how-to-open") are multi-column / tabular content that must remain DEFAULT
 * CONTENT (native tables/headings/paragraphs/lists). This transformer does NOT
 * wrap or block-ify them; it only removes non-authorable chrome. Block
 * conversion is driven solely by the explicit block parsers + page-templates
 * mappings, so untouched multi-column wrappers pass through as plain content.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Interactive / overlay chrome removed before block parsing so it cannot
    // interfere with block matching. Selectors verified in cleaned.html:
    //   #notification_widget / .header-info-box -> downtime banner section
    //   [id^="modal-widget-"]                   -> notification widget host
    //   .notificationWidgetId                   -> empty widget placeholder
    //   .modal                                  -> reach-us / get-help / audio / success popups
    //   .overlay                                -> popup backdrop
    //   #search-modal / .search-modal-popup     -> header search popup
    //   .back-to-top                            -> floating scroll-to-top widget
    WebImporter.DOMUtils.remove(element, [
      '#notification_widget',
      '.header-info-box',
      '[id^="modal-widget-"]',
      '.notificationWidgetId',
      '.modal',
      '.overlay',
      '#search-modal',
      '.search-modal-popup',
      '.back-to-top',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Source header chrome (the existing EDS header is kept). All selectors
    // verified in cleaned.html as header-only subtrees:
    //   .header-logo / .header-menulogo-container -> brand logo block
    //   .header-menu                              -> primary mega-menu nav
    //   .header-login-container / .header-login   -> login button cluster
    //   .login-btn-ul                             -> login flyout list
    //   .header-divider                           -> menu separators
    //   .dropup.group-site-dropdown               -> group-site switcher
    //   .mobile-header-container                  -> mobile header bar
    //   .headerfooter-container                   -> mobile sticky bottom nav
    WebImporter.DOMUtils.remove(element, [
      '.header-logo',
      '.header-menulogo-container',
      '.header-menu',
      '.header-login-container',
      '.header-login',
      '.login-btn-ul',
      '.header-divider',
      '.dropup.group-site-dropdown',
      '.mobile-header-container',
      '.headerfooter-container',
    ]);

    // Source footer chrome (the existing EDS footer is kept). Verified in
    // cleaned.html:
    //   footer.footer               -> main footer landmark
    //   .experiencefragment.section -> footer contact-card XF
    //   .secondaryfooter.section    -> secondary footer links bar
    //   .sec-footer-container        -> secondary footer list wrapper
    //   .copyright-box               -> copyright strip
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.experiencefragment.section',
      '.secondaryfooter.section',
      '.sec-footer-container',
      '.copyright-box',
    ]);

    // Safe non-authorable leftovers.
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'iframe',
      'link',
      'style',
      'script',
      'input',
      'audio',
    ]);

    // Strip tracking / interaction attributes that authors would never set.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-gtm');
    });
  }
}

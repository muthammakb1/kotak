/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kotak site-wide cleanup.
 *
 * Removes non-authorable site chrome so only the main content sections
 * (rc4-rc21) survive for import. The site header (notification widget +
 * header.header-container + mobile nav), success/reach-us modal overlays,
 * the floating "back to top" widget, the footer, and stray hidden inputs
 * are stripped here.
 *
 * IMPORTANT: The breadcrumb (body > div:nth-of-type(5)) is intentionally
 * KEPT — it is an authored content section (template section "breadcrumb",
 * rc4) for this migration and must NOT be removed.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Notification/promo widget bar above the header.
    // Found: <div id="modal-widget-..."><section id="notification_widget" class="header-info-box ...">
    // The modal-widget id carries a per-scrape timestamp suffix, so target stable hooks.
    WebImporter.DOMUtils.remove(element, [
      '#notification_widget',
      '.header-info-box',
    ]);

    // Site modals / popup overlays (reach-us + success popups; rc22-rc24).
    // Found: <div class="modal overlay-currentnode ... success-modal fade get-help-popup">
    //        <div class="modal fade write-to-us-popup reach-modal-PopUp reachUs">
    WebImporter.DOMUtils.remove(element, [
      '.modal',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome.
    // Found: <header class="header-container ...">  (line 52)
    //        <nav class="mobile-header">             (line 1335, header chrome)
    //        <footer class="footer">                 (line 9378)
    //        <div class="back-to-top">               (line 9570, floating widget)
    WebImporter.DOMUtils.remove(element, [
      'header.header-container',
      'header',
      'nav.mobile-header',
      'footer.footer',
      'footer',
      '.back-to-top',
    ]);

    // Stray hidden inputs left by the site shell.
    // Found: <input id="unica-icon">, <input id="startTime">,
    //        <input class="productCategory">, <input class="productParentPage">
    WebImporter.DOMUtils.remove(element, [
      '#unica-icon',
      '#startTime',
      '.productCategory',
      '.productParentPage',
    ]);

    // Safe leftover/non-content elements.
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'iframe',
    ]);
  }
}

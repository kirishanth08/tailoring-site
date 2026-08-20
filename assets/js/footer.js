/* ==========================================================================
   STITCHCRAFT — Reusable Footer Component
   --------------------------------------------------------------------------
   Injects the site footer (links, contact, newsletter, bottom bar) into
   every page. Like nav.js, edit once to update the whole template.

   Usage: place an empty <footer id="siteFooter"></footer> in your page and
   include this script AFTER the Bootstrap bundle. The script adds the
   'site-footer' class (dark walnut + cream/gold styling) automatically.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('siteFooter');
    if (!host) return;
    host.classList.add('site-footer');

    var footerHTML =
      '<div class="container">' +
        '<div class="row g-4 g-lg-5">' +

          /* Brand & about */
          '<div class="col-lg-4 col-md-6">' +
            '<a class="brand mb-3" href="index.html">' +
              '<span class="brand-logo"><i class="bi bi-scissors"></i></span>' +
              '<span class="brand-name" style="color:#f3ede2;">StitchCraft<small>Tailor &amp; Alterations</small></span>' +
            '</a>' +
            '<p class="mt-3" style="max-width:20rem;">Since 1987 we have perfected the craft of the needle and thread — bespoke tailoring, precise alterations and a fit you can feel.</p>' +
            '<div class="footer-social mt-3">' +
              '<a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>' +
              '<a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>' +
              '<a href="#" aria-label="X (Twitter)"><i class="bi bi-twitter-x"></i></a>' +
              '<a href="#" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>' +
            '</div>' +
          '</div>' +

          /* Quick links */
          '<div class="col-lg-2 col-md-6 col-6">' +
            '<h5>Quick Links</h5>' +
            '<div class="d-flex flex-column">' +
              '<a class="footer-link" href="about.html"><i class="bi bi-chevron-double-right"></i>About Us</a>' +
              '<a class="footer-link" href="services.html"><i class="bi bi-chevron-double-right"></i>Our Services</a>' +
              '<a class="footer-link" href="pricing.html"><i class="bi bi-chevron-double-right"></i>Pricing</a>' +
              '<a class="footer-link" href="blog.html"><i class="bi bi-chevron-double-right"></i>Blog &amp; Guides</a>' +
              '<a class="footer-link" href="contact.html"><i class="bi bi-chevron-double-right"></i>Contact Us</a>' +
            '</div>' +
          '</div>' +

          /* Services links */
          '<div class="col-lg-2 col-md-6 col-6">' +
            '<h5>Services</h5>' +
            '<div class="d-flex flex-column">' +
              '<a class="footer-link" href="service-details.html#hemming"><i class="bi bi-chevron-double-right"></i>Hemming</a>' +
              '<a class="footer-link" href="service-details.html#resizing"><i class="bi bi-chevron-double-right"></i>Resizing</a>' +
              '<a class="footer-link" href="service-details.html#zipper"><i class="bi bi-chevron-double-right"></i>Zipper Repair</a>' +
              '<a class="footer-link" href="service-details.html#tailoring"><i class="bi bi-chevron-double-right"></i>Bespoke</a>' +
              '<a class="footer-link" href="service-details.html#bridal"><i class="bi bi-chevron-double-right"></i>Bridal</a>' +
              '<a class="footer-link" href="service-details.html#restoration"><i class="bi bi-chevron-double-right"></i>Repairs</a>' +
            '</div>' +
          '</div>' +

          /* Contact + newsletter */
          '<div class="col-lg-4 col-md-6">' +
            '<h5>Get In Touch</h5>' +
            '<ul class="footer-contact list-unstyled mb-3">' +
              '<li><i class="bi bi-geo-alt-fill"></i><span>42 Threadneedle Street, Mayfair, London</span></li>' +
              '<li><i class="bi bi-telephone-fill"></i><a href="tel:+15551234567">+1 (555) 123-4567</a></li>' +
              '<li><i class="bi bi-envelope-fill"></i><a href="mailto:hello@stitchcraft.com">hello@stitchcraft.com</a></li>' +
            '</ul>' +
            '<form class="footer-newsletter" onsubmit="event.preventDefault(); this.reset(); alert(\'Thanks for subscribing to the StitchCraft newsletter!\');">' +
              '<label class="fs-8 fw-medium text-uppercase letter-spacing-1 mb-2 d-block" for="footerEmail">Newsletter</label>' +
              '<div class="input-group">' +
                '<input type="email" class="form-control" id="footerEmail" placeholder="Your email address" required>' +
                '<button class="btn btn-accent px-3" type="submit" aria-label="Subscribe"><i class="bi bi-send-fill"></i></button>' +
              '</div>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="footer-bottom">' +
        '<div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">' +
          '<span>&copy; <span class="js-year">2026</span> StitchCraft. All rights reserved.</span>' +
          '<span class="d-flex gap-3">' +
            '<a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Sitemap</a>' +
          '</span>' +
        '</div>' +
      '</div>';

    host.innerHTML = footerHTML;

    /* Keep the copyright year current */
    var yearEl = host.querySelector('.js-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();

/* ==========================================================================
   STITCHCRAFT — Reusable Navigation Component
   --------------------------------------------------------------------------
   Injects the site header (main navigation) into every page.
   Because the nav lives in a single file, editing the menu once updates
   the whole template.

   Usage: place an empty <header id="siteNav"></header> in your page and
   include this script AFTER the Bootstrap bundle. The current page is
   detected automatically from the file name.
   ========================================================================== */

(function () {
  'use strict';

  /* Resolve the active page slug from the current URL */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function isActive(slug) {
    return page === slug;
  }

  /* The six core services — shared by desktop dropdown + mobile menu */
  var services = [
    { label: 'Hemming &amp; Lengthening', href: 'service-details.html#hemming', icon: 'bi-arrows-vertical', page: 'service-details.html' },
    { label: 'Resizing &amp; Fitting', href: 'service-details.html#resizing', icon: 'bi-arrows-expand-vertical', page: 'service-details.html' },
    { label: 'Zipper Repair', href: 'service-details.html#zipper', icon: 'bi-lock', page: 'service-details.html' },
    { label: 'Bespoke Tailoring', href: 'service-details.html#tailoring', icon: 'bi-scissors', page: 'service-details.html' },
    { label: 'Bridal Alterations', href: 'service-details.html#bridal', icon: 'bi-gem', page: 'service-details.html' },
    { label: 'Repairs &amp; Restoration', href: 'service-details.html#restoration', icon: 'bi-wrench-adjustable', page: 'service-details.html' }
  ];

  var servicesActive = isActive('services.html') || isActive('service-details.html');

  /* Build a nav <li> with optional children (dropdown) */
  function navItem(label, href, opts) {
    opts = opts || {};
    var active = opts.active === true || isActive(opts.page || '');
    var dropdown = opts.children && opts.children.length;

    if (dropdown) {
      var items = opts.children
        .map(function (c) {
          if (c.divider) return '<li><hr class="dropdown-divider"></li>';
          var cActive = isActive(c.page) ? ' active' : '';
          return '<li><a class="dropdown-item' + cActive + '" href="' + c.href + '">' +
            (c.icon ? '<i class="bi ' + c.icon + '"></i>' : '') +
            c.label + '</a></li>';
        })
        .join('');
      return '<li class="nav-item dropdown">' +
        '<a class="nav-link dropdown-toggle' + (active ? ' active' : '') +
        '" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">' +
        label + '</a>' +
        '<ul class="dropdown-menu">' + items + '</ul></li>';
    }

    return '<li class="nav-item"><a class="nav-link' + (active ? ' active' : '') +
      '" href="' + href + '">' + label + '</a></li>';
  }

  /* Mobile service links — indented group under the Services entry */
  var mobileServices = services
    .map(function (s) {
      return '<a class="nav-link ms-3 fs-6" href="' + s.href + '"><i class="bi ' + s.icon + ' me-2"></i>' + s.label + '</a>';
    })
    .join('');

  var headerHTML =
    /* ------- Main navigation ------- */
    '<nav class="main-nav" aria-label="Main navigation">' +
      '<div class="container">' +
        '<div class="d-flex align-items-center justify-content-between gap-3">' +

          /* Brand */
          '<a class="brand" href="index.html">' +
            '<span class="brand-logo"><i class="bi bi-scissors"></i></span>' +
            '<span class="brand-name">StitchCraft<small>Tailor &amp; Alterations</small></span>' +
          '</a>' +

          /* Desktop menu */
          '<ul class="navbar-nav d-none d-xl-flex align-items-center flex-row gap-1 mb-0">' +
            navItem('Home', 'index.html', {
              active: isActive('index.html') || isActive('home-2.html'),
              children: [
                { label: 'Home 01 — Services Hub', href: 'index.html', icon: 'bi-house-door', page: 'index.html' },
                { label: 'Home 02 — Shop &amp; Booking', href: 'home-2.html', icon: 'bi-shop', page: 'home-2.html' }
              ]
            }) +
            navItem('Services', 'services.html', {
              active: servicesActive,
              children: services.concat([
                { divider: true },
                { label: 'All Services', href: 'services.html', icon: 'bi-grid-1x2', page: 'services.html' }
              ])
            }) +
            navItem('Pricing', 'pricing.html', { page: 'pricing.html' }) +
            navItem('About', 'about.html', { page: 'about.html' }) +
            navItem('Blog', 'blog.html', { page: 'blog.html' }) +
            navItem('Contact', 'contact.html', { page: 'contact.html' }) +
          '</ul>' +

          /* Right actions */
          '<div class="d-flex align-items-center gap-2">' +
            '<button class="theme-toggle d-none d-md-inline-grid" id="themeToggle" type="button" title="Toggle dark / light mode">' +
              '<i class="bi bi-moon-stars"></i><i class="bi bi-sun"></i>' +
            '</button>' +
            '<button class="rtl-toggle d-none d-lg-inline-block" id="rtlToggle" type="button" title="Toggle LTR / RTL layout">RTL</button>' +
            '<a class="btn btn-accent d-none d-lg-inline-flex" href="home-2.html#booking"><i class="bi bi-calendar-check me-2"></i>Book Now</a>' +
            '<button class="navbar-toggler d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-label="Toggle navigation">' +
              '<i class="bi bi-list fs-4"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</nav>' +

    /* ------- Mobile off-canvas menu ------- */
    '<div class="offcanvas offcanvas-end" tabindex="-1" id="mobileNav" aria-labelledby="mobileNavLabel">' +
      '<div class="offcanvas-header border-bottom">' +
        '<a class="brand" href="index.html">' +
          '<span class="brand-logo"><i class="bi bi-scissors"></i></span>' +
          '<span class="brand-name">StitchCraft<small>Tailor &amp; Alterations</small></span>' +
        '</a>' +
        '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
      '</div>' +
      '<div class="offcanvas-body">' +
        '<nav class="nav flex-column">' +
          '<a class="nav-link' + (page === 'index.html' ? ' active' : '') + '" href="index.html"><i class="bi bi-house-door me-2"></i>Home</a>' +
          '<a class="nav-link' + (page === 'home-2.html' ? ' active' : '') + '" href="home-2.html"><i class="bi bi-shop me-2"></i>Home 02 — Shop</a>' +
          '<span class="nav-link fw-semibold' + (servicesActive ? ' active' : '') + '"><i class="bi bi-sliders me-2"></i>Our Services</span>' +
          mobileServices +
          '<a class="nav-link ms-3 fs-6" href="services.html"><i class="bi bi-grid-1x2 me-2"></i>All Services</a>' +
          '<a class="nav-link' + (page === 'pricing.html' ? ' active' : '') + '" href="pricing.html"><i class="bi bi-tags me-2"></i>Pricing</a>' +
          '<a class="nav-link' + (page === 'about.html' ? ' active' : '') + '" href="about.html"><i class="bi bi-people me-2"></i>About Us</a>' +
          '<a class="nav-link' + (page === 'blog.html' ? ' active' : '') + '" href="blog.html"><i class="bi bi-journal-text me-2"></i>Blog &amp; Guides</a>' +
          '<a class="nav-link' + (page === 'contact.html' ? ' active' : '') + '" href="contact.html"><i class="bi bi-envelope me-2"></i>Contact</a>' +
        '</nav>' +
        '<hr>' +
        '<a class="btn btn-accent w-100" href="home-2.html#booking"><i class="bi bi-calendar-check me-2"></i>Book Now</a>' +
        '<div class="d-flex align-items-center gap-2 mt-2">' +
          '<button class="theme-toggle d-inline-grid flex-fill" id="themeToggleMobile" type="button">' +
            '<i class="bi bi-moon-stars"></i><i class="bi bi-sun"></i>' +
          '</button>' +
          '<button class="rtl-toggle flex-fill" id="rtlToggleMobile" type="button">RTL</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('siteNav');
    if (host) {
      host.classList.add('site-header');
      host.innerHTML = headerHTML;
    }
  });
})();

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

  /* Build a nav <li> with optional children (dropdown) */
  function navItem(label, href, opts) {
    opts = opts || {};
    var active = opts.active === true || isActive(opts.page || '');
    var dropdown = opts.children && opts.children.length;

    if (dropdown) {
      var items = opts.children
        .map(function (c) {
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
            navItem('Home', 'index.html', { active: page === 'index.html', children: [
              { label: 'Home Page 1 — General Services', href: 'index.html', icon: 'bi-house-door', page: 'index.html' },
              { label: 'Home Page 2 — Tailor Shop', href: 'home-2.html', icon: 'bi-shop', page: 'home-2.html' }
            ]}) +
            navItem('About', 'about.html', { page: 'about.html' }) +
            navItem('Services', 'services.html', { page: 'services.html' }) +
            navItem('Pricing', 'pricing.html', { page: 'pricing.html' }) +
            navItem('Blog', 'blog.html', { page: 'blog.html' }) +
            navItem('Contact', 'contact.html', { page: 'contact.html' }) +
          '</ul>' +

          /* Right actions */
          '<div class="d-flex align-items-center gap-2">' +
            '<button class="theme-toggle d-none d-md-inline-grid" id="themeToggle" type="button" title="Toggle dark / light mode">' +
              '<i class="bi bi-moon-stars"></i><i class="bi bi-sun"></i>' +
            '</button>' +
            '<button class="rtl-toggle d-none d-lg-inline-block" id="rtlToggle" type="button" title="Toggle LTR / RTL layout">RTL</button>' +
            /* Auth area — filled by auth.js (Login/Sign Up or profile pill) */
            '<div class="d-flex align-items-center gap-2" id="navAuthArea"></div>' +
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
          '<a class="nav-link' + (page === 'index.html' ? ' active' : '') + '" href="index.html"><i class="bi bi-house-door me-2"></i>Home 1 — General</a>' +
          '<a class="nav-link' + (page === 'home-2.html' ? ' active' : '') + '" href="home-2.html"><i class="bi bi-shop me-2"></i>Home 2 — Tailor Shop</a>' +
          '<a class="nav-link' + (page === 'about.html' ? ' active' : '') + '" href="about.html"><i class="bi bi-people me-2"></i>About Us</a>' +
          '<a class="nav-link' + (page === 'services.html' ? ' active' : '') + '" href="services.html"><i class="bi bi-sliders me-2"></i>Services</a>' +
          '<a class="nav-link' + (page === 'service-details.html' ? ' active' : '') + '" href="service-details.html"><i class="bi bi-stack me-2"></i>Service Details</a>' +
          '<a class="nav-link' + (page === 'pricing.html' ? ' active' : '') + '" href="pricing.html"><i class="bi bi-tags me-2"></i>Pricing</a>' +
          '<a class="nav-link' + (page === 'blog.html' ? ' active' : '') + '" href="blog.html"><i class="bi bi-journal-text me-2"></i>Blog</a>' +
          '<a class="nav-link' + (page === 'blog-details.html' ? ' active' : '') + '" href="blog-details.html"><i class="bi bi-file-earmark-text me-2"></i>Blog Details</a>' +
          '<a class="nav-link' + (page === 'contact.html' ? ' active' : '') + '" href="contact.html"><i class="bi bi-envelope me-2"></i>Contact</a>' +
          '<a class="nav-link" href="admin/index.html"><i class="bi bi-speedometer2 me-2"></i>Admin Dashboard</a>' +
        '</nav>' +
        '<hr>' +
        '<div class="d-flex align-items-center gap-2 mt-2">' +
          '<button class="theme-toggle d-inline-grid flex-fill" id="themeToggleMobile" type="button">' +
            '<i class="bi bi-moon-stars"></i><i class="bi bi-sun"></i>' +
          '</button>' +
          '<button class="rtl-toggle flex-fill" id="rtlToggleMobile" type="button">RTL</button>' +
        '</div>' +
        /* Auth area — filled by auth.js (Login / Sign Up buttons or profile) */
        '<div class="d-grid gap-2 mt-3" id="navAuthMobile"></div>' +
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

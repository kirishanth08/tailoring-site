/* ==========================================================================
   STITCHCRAFT — Global Behaviours
   --------------------------------------------------------------------------
   1. Theme toggle (dark / light) with localStorage persistence
   2. RTL / LTR direction toggle with RTL stylesheet injection
   3. Sticky navbar shadow on scroll
   4. Reveal-on-scroll animations
   5. Animated number counters
   6. Blog search & category filter helpers
   7. Back-to-top button
   ========================================================================== */

(function () {
  'use strict';

  var html = document.documentElement;

  /* ==========================================================
     1. THEME TOGGLE — dark / light
     ========================================================== */
  var THEME_KEY = 'stitchcraft-theme';
  var storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* noop */ }

  function applyTheme(theme) {
    if (theme === 'dark') html.setAttribute('data-theme', 'dark');
    else html.removeAttribute('data-theme');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* noop */ }
  }

  /* Initial theme: stored value, else OS preference */
  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isDark = html.getAttribute('data-theme') === 'dark';
        applyTheme(isDark ? 'light' : 'dark');
      });
    });
  });

  /* ==========================================================
     2. RTL / LTR DIRECTION TOGGLE
     ========================================================== */
  var RTL_KEY = 'stitchcraft-dir';
  var storedDir = null;
  try { storedDir = localStorage.getItem(RTL_KEY); } catch (e) { /* noop */ }

  function loadRtlStylesheet() {
    if (document.getElementById('rtlCss')) return;
    /* Resolve the stylesheet path relative to this script so it also works
       when a page lives in a sub-folder. */
    var scripts = document.getElementsByTagName('script');
    var src = scripts.length ? scripts[scripts.length - 1].src : '';
    var base = src.replace(/^(.*\/)assets\/js\/main\.js.*$/, '$1'); /* up to template root */
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = 'rtlCss';
    link.href = base + 'assets/css/rtl.css';
    document.head.appendChild(link);
  }

  function applyDir(dir) {
    if (dir === 'rtl') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
      loadRtlStylesheet();
    } else {
      html.removeAttribute('dir');
      html.setAttribute('lang', 'en');
    }
    try { localStorage.setItem(RTL_KEY, dir); } catch (e) { /* noop */ }
    updateRtlButtons();
  }

  function updateRtlButtons() {
    var isRtl = html.getAttribute('dir') === 'rtl';
    var btns = document.querySelectorAll('#rtlToggle, #rtlToggleMobile');
    btns.forEach(function (b) { b.textContent = isRtl ? 'LTR' : 'RTL'; });
  }

  if (storedDir === 'rtl') applyDir('rtl');

  document.addEventListener('DOMContentLoaded', function () {
    updateRtlButtons(); /* keep label in sync on load (login/register pages start as "EN") */
    var btns = document.querySelectorAll('#rtlToggle, #rtlToggleMobile');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isRtl = html.getAttribute('dir') === 'rtl';
        applyDir(isRtl ? 'ltr' : 'rtl');
      });
    });
  });

  /* ==========================================================
     3. STICKY NAVBAR SHADOW
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.main-nav');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('is-scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  /* ==========================================================
     4. REVEAL ON SCROLL
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var revealEls = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });

    /* Stagger children of a .reveal-stagger container */
    var staggerGroups = document.querySelectorAll('.reveal-stagger');
    staggerGroups.forEach(function (group) {
      var delay = 0;
      group.querySelectorAll('.reveal').forEach(function (el) {
        el.style.transitionDelay = delay + 'ms';
        delay += 100;
      });
    });
  });

  /* ==========================================================
     5. ANIMATED COUNTERS
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var counters = document.querySelectorAll('.counter[data-count]');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      var duration = 1800;
      var start = null;
      var suffix = el.getAttribute('data-suffix') || '';
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  });

  /* ==========================================================
     6. BLOG SEARCH + CATEGORY FILTER
     ----------------------------------------------------------
     Optional. Add the markup attributes below to use on a blog
     listing page:
       - <input data-blog-search>        live keyword filter
       - <select data-blog-cat>          category dropdown filter
       - article[data-category="..."]    posts tagged with a category
       - <div data-blog-empty>           shown when no results match
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.querySelector('[data-blog-search]');
    var catSelect = document.querySelector('[data-blog-cat]');
    var posts = Array.prototype.slice.call(document.querySelectorAll('article[data-category]'));
    if ((!searchInput && !catSelect) || !posts.length) return;

    var empty = document.querySelector('[data-blog-empty]');

    function filter() {
      var q = (searchInput ? searchInput.value.toLowerCase().trim() : '');
      var cat = catSelect ? catSelect.value : 'all';
      var visible = 0;
      posts.forEach(function (post) {
        var text = post.textContent.toLowerCase();
        var matchCat = cat === 'all' || post.getAttribute('data-category') === cat;
        var matchText = !q || text.indexOf(q) !== -1;
        var show = matchCat && matchText;
        post.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.classList.toggle('d-none', visible > 0);
    }

    if (searchInput) searchInput.addEventListener('input', filter);
    if (catSelect) catSelect.addEventListener('change', filter);
  });

  /* ==========================================================
     7. BACK TO TOP BUTTON
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-back-top]');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('d-flex', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ==========================================================
     8. SITE-WIDE FLOWING BACKGROUND + MOUSE PARALLAX
     Injects one fixed ambient layer behind the whole page
     (z-index:-1 in CSS) so it never overlays images or content.
     Soft blurred accent blobs drift continuously; moving the
     pointer nudges them via --px / --py. The hero keeps its
     cursor spotlight (--spot-x / --spot-y).
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var flow = document.createElement('div');
    flow.className = 'site-flow';
    flow.setAttribute('aria-hidden', 'true');
    flow.innerHTML =
      '<span class="site-flow-layer site-flow-1"></span>' +
      '<span class="site-flow-layer site-flow-2"></span>' +
      '<span class="site-flow-layer site-flow-3"></span>';
    document.body.insertBefore(flow, document.body.firstChild);

    /* Falling thread strands — straight, uneven, slanted lines drifting down */
    var threads = document.createElement('div');
    threads.className = 'site-threads';
    threads.setAttribute('aria-hidden', 'true');
    threads.innerHTML =
      '<span class="strand strand-1"></span>' +
      '<span class="strand strand-2"></span>' +
      '<span class="strand strand-3"></span>' +
      '<span class="strand strand-4"></span>';
    document.body.insertBefore(threads, document.body.firstChild);

    if (reduced) return;

    /* Pointer parallax — gently nudges the ambient blobs */
    window.addEventListener('pointermove', function (e) {
      var px = (e.clientX / window.innerWidth - 0.5) * 22;
      var py = (e.clientY / window.innerHeight - 0.5) * 14;
      flow.style.setProperty('--px', px.toFixed(1));
      flow.style.setProperty('--py', py.toFixed(1));
    }, { passive: true });

    /* Cursor spotlight — still follows the pointer inside the hero */
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--spot-x', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
        hero.style.setProperty('--spot-y', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
      });
    }
  });

  /* ==========================================================
     9. SERVICE DETAILS — show only the clicked service
     Page is loaded with #resizing, #jackets, etc. from the
     services grid; hide every article except the one selected.
     ========================================================== */
  (function () {
    var wrapper = document.getElementById('serviceArticles');
    if (!wrapper) return;

    var serviceImages = {
      hemming: 's1', resizing: 's2', jackets: 's3', zipper: 's4',
      repairs: 's5', restoration: 's6', tailoring: 's7', shirts: 's8', bridal: 's9'
    };

    function showServiceFromHash() {
      var hash = (location.hash || '').replace('#', '');
      var articles = wrapper.querySelectorAll('article');

      if (!hash) {
        articles.forEach(function (a) { a.classList.remove('d-none'); });
        return; // opened directly — show the full catalog
      }

      var target = wrapper.querySelector('article#' + hash);
      if (!target) {
        articles.forEach(function (a) { a.classList.remove('d-none'); });
        return;
      }

      articles.forEach(function (a) {
        a.classList.toggle('d-none', a !== target);
      });

      var name = '';
      var heading = target.querySelector('h2.section-title');
      if (heading) name = heading.textContent.trim();
      if (name) {
        var heroTitle = document.querySelector('.page-hero .page-title');
        if (heroTitle) heroTitle.textContent = name;
        var crumb = document.querySelector('.page-hero .breadcrumb-item.active');
        if (crumb) crumb.textContent = name;
        document.title = name + ' | StitchCraft';
      }

      /* Swap the hero photo to this service's own image (s1–s9) */
      var heroImg = document.getElementById('serviceHeroImg');
      if (heroImg && serviceImages[hash]) {
        heroImg.src = 'assets/images/' + serviceImages[hash] + '.webp';
        if (name) heroImg.alt = name;
      }

      target.scrollIntoView({ block: 'start' });
    }

    document.addEventListener('DOMContentLoaded', showServiceFromHash);
    window.addEventListener('hashchange', showServiceFromHash);
  })();

  /* ==========================================================
     10. BLOG DETAILS — show only the clicked post
     Page is loaded with #denim-hem, #relaxed-blazer, etc. from
     the blog cards; hide every article except the one selected.
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.getElementById('blogArticles');
    if (!wrapper) return;
    var posts = Array.prototype.slice.call(wrapper.querySelectorAll('article[id]'));
    if (!posts.length) return;
    var hash = (location.hash || '').replace('#', '');
    var target = posts.filter(function (p) { return p.id === hash; })[0] || posts[0];

    posts.forEach(function (p) {
      if (p !== target) p.classList.add('d-none');
    });

    function set(id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value;
    }

    var title = target.getAttribute('data-title') || '';
    set('blogTitle', title);
    set('blogCategory', target.getAttribute('data-category') || 'Article');
    set('blogAuthor', target.getAttribute('data-author') || '');
    set('blogDate', target.getAttribute('data-date') || '');
    set('blogRead', target.getAttribute('data-read') || '');
    if (title) document.title = title + ' | StitchCraft Blog';

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
})();

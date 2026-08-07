/* ==========================================================================
   STITCHCRAFT — Client-Side Authentication (demo, no backend)
   --------------------------------------------------------------------------
   Drives registration, sign-in and the navbar "profile" state using
   localStorage so the demo flow works end-to-end:

     1. register.html -> creates the account, shows a success toast, then
                         redirects to login.html
     2. login.html    -> verifies credentials, saves a session, then
                         redirects to index.html
     3. any page with the navbar -> the right side swaps Login / Sign Up
                         for a profile pill (avatar + first name + menu)

   Storage keys:
     stitchcraft-users   -> array of { first, last, email, phone, password }
     stitchcraft-session -> { first, last, email }

   Include AFTER nav.js + main.js. The auth containers live in nav.js:
   #navAuthArea (desktop actions) and #navAuthMobile (off-canvas menu).
   ========================================================================== */

(function () {
  'use strict';

  var USERS_KEY = 'stitchcraft-users';
  var SESSION_KEY = 'stitchcraft-session';

  /* ---------------- Storage helpers ---------------- */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* noop */ }
  }

  function getUsers() { return read(USERS_KEY, []); }
  function getSession() { return read(SESSION_KEY, null); }

  function saveUser(user) {
    var users = getUsers();
    users.push(user);
    write(USERS_KEY, users);
  }

  function findUser(email) {
    var emailKey = String(email || '').trim().toLowerCase();
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (String(users[i].email || '').trim().toLowerCase() === emailKey) return users[i];
    }
    return null;
  }

  function setSession(user) {
    write(SESSION_KEY, { first: user.first, last: user.last, email: user.email });
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* noop */ }
  }

  function initials(user) {
    return ((user.first || '').charAt(0) + (user.last || '').charAt(0)).toUpperCase() || '?';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------- Toast notifications ---------------- */

  function showToast(message, type) {
    type = type || 'success';
    var wrap = document.getElementById('authToastWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'authToastWrap';
      wrap.className = 'auth-toast-wrap';
      wrap.setAttribute('aria-live', 'polite');
      wrap.setAttribute('aria-atomic', 'true');
      document.body.appendChild(wrap);
    }
    var el = document.createElement('div');
    el.className = 'auth-toast auth-toast-' + type;
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<i class="bi ' + (type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill') + '"></i>' +
      '<span>' + escapeHtml(message) + '</span>';
    wrap.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 350);
    }, 2400);
  }

  /* ---------------- Navbar profile state ---------------- */

  function renderAuthNav() {
    var session = getSession();

    var desktop = document.getElementById('navAuthArea');
    if (desktop) {
      desktop.innerHTML = session
        ? '<div class="dropdown">' +
            '<a href="#" class="nav-profile dropdown-toggle d-none d-sm-flex align-items-center gap-2" data-bs-toggle="dropdown" role="button" aria-expanded="false">' +
              '<span class="profile-avatar">' + escapeHtml(initials(session)) + '</span>' +
              '<span class="profile-name d-none d-lg-inline">' + escapeHtml(session.first) + '</span>' +
            '</a>' +
            '<ul class="dropdown-menu dropdown-menu-end">' +
              '<li><a class="dropdown-item text-danger" href="#" data-auth-logout><i class="bi bi-box-arrow-right me-2"></i>Log out</a></li>' +
            '</ul>' +
          '</div>'
        : '<a href="login.html" class="btn btn-outline-dark btn-sm d-none d-sm-inline-flex align-items-center"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>' +
          '<a href="register.html" class="btn btn-accent btn-sm d-none d-sm-inline-flex align-items-center">Sign Up</a>';
    }

    var mobile = document.getElementById('navAuthMobile');
    if (mobile) {
      mobile.innerHTML = session
        ? '<div class="d-flex align-items-center gap-2 px-1">' +
            '<span class="profile-avatar">' + escapeHtml(initials(session)) + '</span>' +
            '<div class="min-w-0">' +
              '<div class="fw-medium text-truncate">' + escapeHtml(session.first) + ' ' + escapeHtml(session.last) + '</div>' +
              '<div class="fs-8 text-muted-2 text-truncate">' + escapeHtml(session.email) + '</div>' +
            '</div>' +
            '<a href="#" class="btn btn-outline-danger btn-sm ms-auto" data-auth-logout title="Log out"><i class="bi bi-box-arrow-right"></i></a>' +
          '</div>'
        : '<a href="login.html" class="btn btn-outline-dark"><i class="bi bi-box-arrow-in-right me-2"></i>Login</a>' +
          '<a href="register.html" class="btn btn-accent">Sign Up</a>';
    }
  }

  /* ---------------- Login form ---------------- */

  function bindLoginForm() {
    var form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = (document.getElementById('loginEmail').value || '').trim();
      var pass = document.getElementById('loginPass').value || '';

      var user = findUser(email);
      if (!user) {
        showToast('No account found for this email. Please create an account first.', 'error');
        return;
      }
      if (user.password !== pass) {
        showToast('Incorrect password. Please try again.', 'error');
        return;
      }

      setSession(user);
      showToast('Welcome back, ' + user.first + '! Redirecting…');
      setTimeout(function () { window.location.href = 'index.html'; }, 1600);
    });
  }

  /* ---------------- Register form ---------------- */

  function bindRegisterForm() {
    var form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var first = (document.getElementById('regFirst').value || '').trim();
      var last = (document.getElementById('regLast').value || '').trim();
      var email = (document.getElementById('regEmail').value || '').trim();
      var phone = (document.getElementById('regPhone').value || '').trim();
      var pass = document.getElementById('regPass').value || '';
      var pass2 = document.getElementById('regPass2').value || '';

      if (pass.length < 8) {
        showToast('Password must be at least 8 characters long.', 'error');
        return;
      }
      if (pass !== pass2) {
        showToast('Passwords do not match. Please re-enter them.', 'error');
        return;
      }
      if (findUser(email)) {
        showToast('An account with this email already exists. Please sign in.', 'error');
        return;
      }

      saveUser({ first: first, last: last, email: email, phone: phone, password: pass });
      showToast('Account created successfully! Redirecting to sign in…');
      setTimeout(function () { window.location.href = 'login.html'; }, 2000);
    });
  }

  /* ---------------- Logout (delegated) ---------------- */

  function bindLogout() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest ? e.target.closest('[data-auth-logout]') : null;
      if (!trigger) return;
      e.preventDefault();
      clearSession();
      renderAuthNav();
      showToast('You have been logged out.');
    });
  }

  /* ---------------- Init ---------------- */

  document.addEventListener('DOMContentLoaded', function () {
    renderAuthNav();
    bindLogout();
    bindLoginForm();
    bindRegisterForm();
  });

  /* Public API for other scripts */
  window.StitchAuth = {
    isLoggedIn: function () { return !!getSession(); },
    getUser: getSession,
    logout: clearSession
  };
})();

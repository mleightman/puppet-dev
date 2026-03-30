/* ==========================================================================
   The Puppet Developer Installation — App JS
   Navigation, OS toggle, progress, clipboard, dark mode, mobile nav
   ========================================================================== */

(function () {
  'use strict';

  // ---- Phase Lookup Table ----
  var PHASES = {
    '00': '00-mindset.html',
    '01': '01-project-scope.html',
    '02': '02-github.html',
    '03': '03-railway.html',
    '04': '04-env-vars-databases.html',
    '05': '05-terminal.html',
    '06': '06-claude-code-cli.html',
    '07': '07-settings-plugins.html',
    '08': '08-claude-md.html',
    '09': '09-daily-skills.html',
    '10': '10-c-i-loop.html',
    '11': '11-nuts-workflow.html',
    '12': '12-steering-and-rules.html',
    '13': '13-documentation.html',
    '14': '14-testing.html',
    '15': '15-when-things-go-wrong.html',
    '16': '16-multi-window.html',
    '17': '17-telegram.html',
    '18': '18-cloud-tasks.html',
    '19': '19-reference.html'
  };

  // ---- localStorage Helper ----
  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Silent degradation — features work for session but don't persist
    }
  }

  // ---- State ----
  var currentPhaseId = null;
  var fetchController = null;
  var loadGeneration = 0;

  // ---- DOM References ----
  var content = document.getElementById('content');
  var navItems = document.querySelectorAll('.nav-item');
  var hamburger = document.querySelector('.hamburger');
  var sidebar = document.querySelector('.sidebar');
  var backdrop = document.querySelector('.sidebar-backdrop');
  var progressFill = document.querySelector('.progress-fill');
  var progressText = document.querySelector('.progress-text');
  var themeToggle = document.querySelector('.theme-toggle');
  var osButtons = document.querySelectorAll('.os-btn');
  var totalPhases = navItems.length;

  // ---- Navigation ----

  function getPhaseFromHash() {
    var hash = window.location.hash;
    if (hash && hash.indexOf('#phase-') === 0) {
      return hash.replace('#phase-', '');
    }
    return null;
  }

  function loadPhase(phaseId) {
    // Guard: don't reload current phase
    if (phaseId === currentPhaseId) return;

    // Validate phase exists in lookup
    var filename = PHASES[phaseId];
    if (!filename) {
      showError();
      return;
    }

    // Abort any in-flight fetch
    if (fetchController) {
      fetchController.abort();
    }
    fetchController = new AbortController();

    // Generation counter prevents stale responses from updating DOM
    loadGeneration++;
    var thisGeneration = loadGeneration;
    var requestedPhase = phaseId;

    fetch('phases/' + filename, { signal: fetchController.signal })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.text();
      })
      .then(function (html) {
        // Discard stale response if user navigated away during fetch
        if (thisGeneration !== loadGeneration) return;

        // Validate it's a fragment, not a full document
        if (html.indexOf('<!DOCTYPE') !== -1 || html.indexOf('<html') !== -1) {
          throw new Error('Received full document instead of fragment');
        }

        // Update state BEFORE setting hash (prevents infinite loop)
        currentPhaseId = requestedPhase;
        content.innerHTML = html;

        // Update hash without triggering re-load
        if (window.location.hash !== '#phase-' + requestedPhase) {
          window.location.hash = '#phase-' + requestedPhase;
        }

        // Update nav active state
        updateActiveNav(requestedPhase);

        // Scroll to top
        window.scrollTo(0, 0);

        // Focus the h1 for accessibility (tabindex=-1 keeps it out of tab order)
        var h1 = content.querySelector('h1');
        if (h1) {
          h1.setAttribute('tabindex', '-1');
          h1.focus();
        }

        // Initialize interactive features (in try-catch so shell stays functional)
        try {
          initPhaseFeatures();
        } catch (e) {
          // Phase content still displays even if features fail
        }

        // Close mobile nav if open
        closeMobileNav();
      })
      .catch(function (err) {
        if (err.name === 'AbortError') return; // Silent — user navigated away
        showError();
      });
  }

  function showError() {
    content.innerHTML =
      '<div class="load-error">' +
        '<h2>Phase not found</h2>' +
        '<p>This phase could not be loaded. It may not exist yet.</p>' +
        '<a href="#phase-00">Go to Phase 0</a>' +
      '</div>';
    currentPhaseId = null;
  }

  function updateActiveNav(phaseId) {
    navItems.forEach(function (item) {
      if (item.getAttribute('data-phase') === phaseId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Listen for hash changes (back/forward buttons)
  window.addEventListener('hashchange', function () {
    var phaseId = getPhaseFromHash();
    if (phaseId !== null) {
      loadPhase(phaseId);
    }
    // Close mobile nav on any hash change
    closeMobileNav();
  });

  // Nav item clicks
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var phaseId = this.getAttribute('data-phase');
      loadPhase(phaseId);
    });
  });

  // ---- Phase Features (re-initialized after each phase load) ----

  function initPhaseFeatures() {
    initClipboard();
    initOsContent();
    initChecklist();
    // Syntax highlighting for code blocks (Prism.js loaded via CDN)
    if (typeof Prism !== 'undefined') {
      Prism.highlightAllUnder(content);
    }
  }

  // ---- Clipboard ----

  function initClipboard() {
    var codeBlocks = content.querySelectorAll('pre');
    codeBlocks.forEach(function (pre) {
      // Skip if already wrapped
      if (pre.parentElement && pre.parentElement.classList.contains('code-block')) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      var toolbar = document.createElement('div');
      toolbar.className = 'code-toolbar';

      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        copyToClipboard(text, btn);
      });

      toolbar.appendChild(btn);
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(toolbar);
      wrapper.appendChild(pre);
    });
  }

  function copyToClipboard(text, btn) {
    // Try Clipboard API first, fall back to execCommand
    try {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(btn);
      }).catch(function () {
        fallbackCopy(text, btn);
      });
    } catch (e) {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {
      btn.textContent = 'Failed';
      btn.setAttribute('aria-label', 'Failed to copy code');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
      }, 2000);
    }
    document.body.removeChild(textarea);
  }

  function showCopied(btn) {
    btn.textContent = 'Copied!';
    btn.setAttribute('aria-label', 'Code copied to clipboard');
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.classList.remove('copied');
    }, 2000);
  }

  // ---- OS Toggle ----

  var currentOs = 'mac'; // Default

  function detectOs() {
    var saved = storageGet('puppet-dev-os-preference');
    if (saved === 'mac' || saved === 'win') {
      return saved;
    }

    // Auto-detect
    try {
      if (navigator.userAgentData && navigator.userAgentData.platform) {
        var platform = navigator.userAgentData.platform.toLowerCase();
        if (platform.indexOf('win') !== -1) return 'win';
        return 'mac';
      }
    } catch (e) {
      // Fall through
    }

    var ua = navigator.userAgent || '';
    if (ua.indexOf('Windows') !== -1) return 'win';
    return 'mac';
  }

  function setOs(os) {
    currentOs = os;
    storageSet('puppet-dev-os-preference', os);

    // Update buttons
    osButtons.forEach(function (btn) {
      var btnOs = btn.getAttribute('data-os-select');
      if (btnOs === os) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Update visible content
    initOsContent();
  }

  function initOsContent() {
    var osElements = content.querySelectorAll('[data-os]');
    osElements.forEach(function (el) {
      if (el.getAttribute('data-os') === currentOs) {
        el.classList.add('os-visible');
      } else {
        el.classList.remove('os-visible');
      }
    });
  }

  osButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setOs(this.getAttribute('data-os-select'));
    });
  });

  // ---- Progress Tracking ----

  function getCompleted() {
    var raw = storageGet('puppet-dev-completed-phases');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  function saveCompleted(completed) {
    storageSet('puppet-dev-completed-phases', JSON.stringify(completed));
  }

  function togglePhaseComplete(phaseId) {
    var completed = getCompleted();
    var idx = completed.indexOf(phaseId);
    if (idx === -1) {
      completed.push(phaseId);
    } else {
      completed.splice(idx, 1);
    }
    saveCompleted(completed);
    updateProgressUI();
  }

  function updateProgressUI() {
    var completed = getCompleted();
    var count = completed.length;
    var pct = totalPhases > 0 ? (count / totalPhases) * 100 : 0;

    progressFill.style.width = pct + '%';
    progressFill.setAttribute('aria-valuenow', count);
    progressFill.setAttribute('aria-valuemax', totalPhases);
    progressText.textContent = count + ' / ' + totalPhases;

    // Update nav checkmarks
    navItems.forEach(function (item) {
      var phase = item.getAttribute('data-phase');
      if (completed.indexOf(phase) !== -1) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
    });
  }

  function initChecklist() {
    var checkbox = content.querySelector('.phase-complete-check');
    if (!checkbox) return;

    var phaseId = checkbox.getAttribute('data-phase');
    var completed = getCompleted();
    checkbox.checked = completed.indexOf(phaseId) !== -1;

    checkbox.addEventListener('change', function () {
      togglePhaseComplete(phaseId);
    });
  }

  // ---- Dark Mode Toggle ----

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  themeToggle.addEventListener('click', function () {
    if (isDarkMode()) {
      document.documentElement.setAttribute('data-theme', 'light');
      storageSet('puppet-dev-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      storageSet('puppet-dev-theme', 'dark');
    }
  });

  // ---- Mobile Nav ----

  function openMobileNav() {
    sidebar.classList.add('open');
    backdrop.classList.add('visible');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
  }

  function closeMobileNav() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('visible');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
  }

  function toggleMobileNav() {
    if (sidebar.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  hamburger.addEventListener('click', toggleMobileNav);
  backdrop.addEventListener('click', closeMobileNav);

  // Escape key closes mobile nav
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeMobileNav();
      hamburger.focus();
    }
  });

  // ---- Init ----

  // Set OS preference
  currentOs = detectOs();
  setOs(currentOs);

  // Update progress UI
  updateProgressUI();

  // Load initial phase from hash or default to phase-00
  var initialPhase = getPhaseFromHash() || '00';
  loadPhase(initialPhase);

})();

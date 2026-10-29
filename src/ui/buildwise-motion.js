/* BuildWise UI motion controller v20261029g — strengthened
   Progressive enhancement only; no auth/data mutation. */
(function () {
  'use strict';
  if (window.__bwMotionControllerLoaded) return;
  window.__bwMotionControllerLoaded = true;

  var reduce = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  var seen = new WeakSet();

  function placeLiquidIndicator() {
    var nav = document.getElementById('bottomNav') || document.querySelector('.bottom-nav');
    if (!nav) return;
    var active = nav.querySelector('.nav-item.active') || nav.querySelector('[aria-current="page"]');
    if (!active) {
      nav.style.setProperty('--bw-pill-width', '0px');
      return;
    }
    var nr = nav.getBoundingClientRect();
    var ar = active.getBoundingClientRect();
    var left = Math.max(0, ar.left - nr.left);
    var width = Math.max(0, ar.width);
    nav.style.setProperty('--bw-pill-left', left + 'px');
    nav.style.setProperty('--bw-pill-width', width + 'px');
  }

  var ENTER_SELECTORS = [
    '.stats > *',
    '.data-grid > *',
    '.two-col > *',
    '.auth-card',
    '.public-hero',
    '.public-grid > *',
    '.role-card',
    '.gateway-card',
    '.property-card',
    '.lead-card',
    '.deal-card',
    '.project-card',
    '.match-card',
    '.integration-card',
    '.stat',
    '.card'
  ].join(', ');

  function animateNewSurfaces(root) {
    if (reduce() || !root) return;
    var nodes = [];
    if (root.nodeType === 1 && root.matches && root.matches(ENTER_SELECTORS)) {
      nodes.push(root);
    }
    if (root.querySelectorAll) {
      try {
        nodes.push.apply(nodes, root.querySelectorAll(ENTER_SELECTORS));
      } catch (e) { /* ignore */ }
    }
    nodes.forEach(function (el) {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('bw-motion-enter');
    });
  }

  function sync() {
    animateNewSurfaces(document.body);
    placeLiquidIndicator();
  }

  function onNavClick(e) {
    var item = e.target && e.target.closest && e.target.closest('#bottomNav .nav-item, .bottom-nav .nav-item');
    if (item) {
      requestAnimationFrame(function () {
        placeLiquidIndicator();
        setTimeout(placeLiquidIndicator, 60);
        setTimeout(placeLiquidIndicator, 320);
      });
    }
  }

  var start = function () {
    sync();
    var target = document.body;
    if (!target) return;

    var observer = new MutationObserver(function (records) {
      var navDirty = false;
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.type === 'childList' && record.addedNodes.length) {
          for (var j = 0; j < record.addedNodes.length; j++) {
            var n = record.addedNodes[j];
            if (n.nodeType === 1) animateNewSurfaces(n);
          }
        }
        if (record.target && record.target.closest) {
          if (record.target.closest('#bottomNav') || record.target.closest('.bottom-nav')) {
            navDirty = true;
          }
        }
        if (record.type === 'attributes' && record.target && record.target.closest) {
          if (record.target.closest('#bottomNav') || record.target.closest('.bottom-nav')) {
            navDirty = true;
          }
        }
      }
      if (navDirty || document.getElementById('bottomNav') || document.querySelector('.bottom-nav')) {
        requestAnimationFrame(placeLiquidIndicator);
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'aria-current']
    });

    document.addEventListener('click', onNavClick, true);
    window.addEventListener('resize', placeLiquidIndicator, { passive: true });
    window.addEventListener('orientationchange', function () {
      setTimeout(placeLiquidIndicator, 80);
    }, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(placeLiquidIndicator).catch(function () {});
    }

    var mainEl = document.getElementById('main') || document.querySelector('main');
    if (mainEl) {
      var mainObs = new MutationObserver(function () {
        requestAnimationFrame(function () {
          animateNewSurfaces(mainEl);
          placeLiquidIndicator();
        });
      });
      mainObs.observe(mainEl, { childList: true, subtree: false });
    }

    window.__bwMotionSync = sync;
    window.__bwMotionEnter = animateNewSurfaces;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

/* BuildWise live CRM bridge 2026-10-27b */
(function () {
  // Full menu (search + construction/calc) instead of narrow CRM_PHASE_NAV
  window.__BUILDWISE_CRM_ONLY = false;

  function patchDb() {
    if (!window.db || !window.db.from) return false;
    if (window.db.__bwSafePatched) return true;
    var orig = window.db.from.bind(window.db);
    window.db.from = function (table) {
      if (table === 'properties_client') return orig('crm_property_safe');
      return orig(table);
    };
    window.db.__bwSafePatched = true;
    return true;
  }

  if (!patchDb()) {
    var t = setInterval(function () {
      if (patchDb()) clearInterval(t);
    }, 40);
    setTimeout(function () { clearInterval(t); }, 20000);
  }
})();

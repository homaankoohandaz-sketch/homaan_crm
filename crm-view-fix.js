/* BuildWise live CRM bridge 2026-10-29c
 * IMPORTANT: Do NOT rewrite properties_client -> crm_property_safe.
 * properties_client has is_starred/file_tags; crm_property_safe does not.
 * Redirecting caused: count=6039 but list empty (column error).
 */
(function () {
  window.__BUILDWISE_CRM_ONLY = false;

  function patchSelectStrip() {
    if (!window.db || !window.db.from || window.db.__bwSelectPatched) return !!window.db;
    var origFrom = window.db.from.bind(window.db);
    window.db.from = function (table) {
      var q = origFrom(table);
      if (!q || typeof q.select !== 'function') return q;
      var origSelect = q.select.bind(q);
      q.select = function (cols, opts) {
        // If a future view lacks triage columns, strip them so list still loads
        if (typeof cols === 'string' && (table === 'crm_property_safe' || table === 'properties_client')) {
          // keep is_starred/file_tags for properties_client; only strip for safe view
          if (table === 'crm_property_safe') {
            cols = cols
              .split(',')
              .map(function (c) { return c.trim(); })
              .filter(function (c) {
                return c && c !== 'is_starred' && c !== 'file_tags';
              })
              .join(',');
          }
        }
        return origSelect(cols, opts);
      };
      return q;
    };
    window.db.__bwSelectPatched = true;
    return true;
  }

  if (!patchSelectStrip()) {
    var t = setInterval(function () {
      if (patchSelectStrip()) clearInterval(t);
    }, 40);
    setTimeout(function () { clearInterval(t); }, 20000);
  }
})();

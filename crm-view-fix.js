/* BuildWise CRM view fix: use crm_property_safe when properties_client is denied */
(function () {
  function patch() {
    if (!window.db || !window.db.from) return false;
    const orig = window.db.from.bind(window.db);
    window.db.from = function (table) {
      if (table === 'properties_client') {
        return orig('crm_property_safe');
      }
      return orig(table);
    };
    return true;
  }
  if (!patch()) {
    const t = setInterval(function () {
      if (patch()) clearInterval(t);
    }, 50);
    setTimeout(function () { clearInterval(t); }, 15000);
  }
})();

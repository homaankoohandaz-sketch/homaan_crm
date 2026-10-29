/* BuildWise analysis-engine UI — safe load without undefined globals */
(function () {
  try {
    var nav = typeof ALL_NAV !== 'undefined' ? ALL_NAV : window.__BW_ALL_NAV;
    if (nav && Array.isArray(nav) && typeof nav.splice === 'function') {
      var hasPrice = nav.some(function (x) { return x && x[0] === 'price_engine'; });
      if (!hasPrice) nav.splice(5, 0, ['price_engine', 'Price Engine'], ['cost_engine', 'Cost Engine']);
    }
  } catch (e) {}

  var originalGo = typeof go === 'function' ? go : null;
  if (originalGo) {
    go = async function (x) {
      if (x === 'price_engine') return typeof priceEngine === 'function' ? priceEngine() : originalGo(x);
      if (x === 'cost_engine') return typeof costEngine === 'function' ? costEngine() : originalGo(x);
      return originalGo(x);
    };
  }
})();

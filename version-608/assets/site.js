(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '×' : '☰';
    });
  }

  var input = document.querySelector('[data-search-input]');
  var region = document.querySelector('[data-region-filter]');
  var type = document.querySelector('[data-type-filter]');
  var year = document.querySelector('[data-year-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function valueOf(node) {
    return node ? node.value.trim().toLowerCase() : '';
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }
    var q = valueOf(input);
    var r = valueOf(region);
    var t = valueOf(type);
    var y = valueOf(year);
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var ok = true;
      if (q && text.indexOf(q) === -1) ok = false;
      if (r && text.indexOf(r) === -1) ok = false;
      if (t && text.indexOf(t) === -1) ok = false;
      if (y && text.indexOf(y) === -1) ok = false;
      card.classList.toggle('hidden-card', !ok);
    });
  }

  [input, region, type, year].forEach(function (node) {
    if (node) {
      node.addEventListener('input', filterCards);
      node.addEventListener('change', filterCards);
    }
  });
})();

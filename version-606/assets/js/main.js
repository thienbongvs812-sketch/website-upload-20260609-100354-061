(function () {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        window.setInterval(function () {
            show(current + 1);
        }, 5000);
    }

    var grid = document.querySelector("[data-filter-grid]");
    var input = document.querySelector("[data-filter-input]");
    var typeSelect = document.querySelector("[data-type-filter]");
    var yearSelect = document.querySelector("[data-year-filter]");
    var emptyState = document.querySelector("[data-empty-state]");

    function applyQueryFromUrl() {
        if (!input) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
            input.value = q;
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function filterCards() {
        if (!grid) {
            return;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        var query = normalize(input && input.value);
        var type = normalize(typeSelect && typeSelect.value);
        var year = normalize(yearSelect && yearSelect.value);
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-region"),
                card.getAttribute("data-tags")
            ].join(" "));
            var cardType = normalize(card.getAttribute("data-type"));
            var cardYear = normalize(card.getAttribute("data-year"));
            var matched = true;

            if (query && haystack.indexOf(query) === -1) {
                matched = false;
            }
            if (type && cardType.indexOf(type) === -1) {
                matched = false;
            }
            if (year && cardYear.indexOf(year) === -1) {
                matched = false;
            }
            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-visible", visible === 0);
        }
    }

    applyQueryFromUrl();
    filterCards();

    [input, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
            control.addEventListener("input", filterCards);
            control.addEventListener("change", filterCards);
        }
    });
})();

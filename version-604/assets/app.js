document.addEventListener("DOMContentLoaded", function () {
    bindMenu();
    bindHero();
    bindSearchForms();
    bindLocalFilters();
    bindPlayers();
});

function bindMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
        return;
    }
    button.addEventListener("click", function () {
        panel.classList.toggle("is-open");
    });
}

function bindHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
        return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var active = 0;
    function show(index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === active);
        });
    }
    if (prev) {
        prev.addEventListener("click", function () {
            show(active - 1);
        });
    }
    if (next) {
        next.addEventListener("click", function () {
            show(active + 1);
        });
    }
    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            show(index);
        });
    });
    if (slides.length > 1) {
        window.setInterval(function () {
            show(active + 1);
        }, 5200);
    }
}

function bindSearchForms() {
    var forms = document.querySelectorAll("[data-site-search]");
    forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = form.querySelector("input");
            var query = input ? input.value.trim() : "";
            if (query) {
                window.location.href = "./search.html?q=" + encodeURIComponent(query);
            }
        });
    });
}

function textFor(card) {
    return [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-tags") || "",
        card.textContent || ""
    ].join(" ").toLowerCase();
}

function bindLocalFilters() {
    var containers = document.querySelectorAll("[data-filter-area]");
    containers.forEach(function (area) {
        var input = area.querySelector("[data-card-filter]");
        var chips = Array.prototype.slice.call(area.querySelectorAll("[data-filter-chip]"));
        var cards = Array.prototype.slice.call(area.querySelectorAll("[data-card]"));
        var empty = area.querySelector("[data-empty]");
        var activeType = "all";
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        if (input && initialQuery) {
            input.value = initialQuery;
        }
        function apply() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var visible = 0;
            cards.forEach(function (card) {
                var type = card.getAttribute("data-kind") || "";
                var matchType = activeType === "all" || type === activeType;
                var matchText = !query || textFor(card).indexOf(query) !== -1;
                var ok = matchType && matchText;
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        if (input) {
            input.addEventListener("input", apply);
        }
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                activeType = chip.getAttribute("data-filter-chip") || "all";
                chips.forEach(function (item) {
                    item.classList.toggle("is-active", item === chip);
                });
                apply();
            });
        });
        apply();
    });
}

function bindPlayers() {
    var players = document.querySelectorAll("[data-stream]");
    players.forEach(function (box) {
        var video = box.querySelector("video");
        var cover = box.querySelector(".player-cover");
        var button = box.querySelector("[data-play]");
        var stream = box.getAttribute("data-stream");
        var ready = false;
        function start() {
            if (!video || !stream) {
                return;
            }
            if (!ready) {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                video.controls = true;
                ready = true;
            }
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var play = video.play();
            if (play && typeof play.catch === "function") {
                play.catch(function () {});
            }
        }
        if (button) {
            button.addEventListener("click", start);
        }
        if (cover) {
            cover.addEventListener("click", start);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (!ready) {
                    start();
                }
            });
        }
    });
}

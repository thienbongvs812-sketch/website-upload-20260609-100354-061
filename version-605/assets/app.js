(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupImages() {
        document.querySelectorAll('img').forEach(function (image) {
            image.addEventListener('error', function () {
                image.classList.add('image-failed');
            });
        });
    }

    function setupMobileNav() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5000);
    }

    function setupSearch() {
        var grid = document.querySelector('[data-search-grid]');
        if (!grid) {
            return;
        }
        var queryInput = document.querySelector('[data-filter-query]');
        var categorySelect = document.querySelector('[data-filter-category]');
        var yearSelect = document.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (queryInput && initialQuery) {
            queryInput.value = initialQuery;
        }
        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }
        function applyFilter() {
            var query = normalize(queryInput && queryInput.value);
            var category = categorySelect ? categorySelect.value : '';
            var year = yearSelect ? yearSelect.value : '';
            cards.forEach(function (card) {
                var text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.region + ' ' + card.dataset.type + ' ' + card.dataset.year);
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchCategory = !category || card.dataset.category === category;
                var matchYear = !year || card.dataset.year === year;
                card.classList.toggle('search-hidden', !(matchQuery && matchCategory && matchYear));
            });
        }
        [queryInput, categorySelect, yearSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', applyFilter);
                element.addEventListener('change', applyFilter);
            }
        });
        applyFilter();
    }

    function setupPlayers() {
        document.querySelectorAll('.js-player').forEach(function (video) {
            var stream = video.getAttribute('data-stream');
            var frame = video.closest('.video-frame');
            var playButton = frame ? frame.querySelector('.js-play-video') : null;
            if (!stream) {
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
            function playVideo() {
                var action = video.paused ? video.play() : video.pause();
                if (action && typeof action.catch === 'function') {
                    action.catch(function () {});
                }
            }
            if (playButton) {
                playButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    playVideo();
                });
            }
            video.addEventListener('click', playVideo);
            video.addEventListener('play', function () {
                if (frame) {
                    frame.classList.add('is-playing');
                }
            });
            video.addEventListener('pause', function () {
                if (frame) {
                    frame.classList.remove('is-playing');
                }
            });
            video.addEventListener('ended', function () {
                if (frame) {
                    frame.classList.remove('is-playing');
                }
            });
        });
    }

    ready(function () {
        setupImages();
        setupMobileNav();
        setupHero();
        setupSearch();
        setupPlayers();
    });
})();

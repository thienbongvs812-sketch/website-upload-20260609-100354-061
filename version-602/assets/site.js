(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        var mobilePanel = document.querySelector('[data-mobile-panel]');

        if (menuButton && mobilePanel) {
            menuButton.addEventListener('click', function () {
                mobilePanel.classList.toggle('is-open');
            });
        }

        var sliders = document.querySelectorAll('[data-hero-slider]');
        sliders.forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
            var prev = slider.querySelector('[data-hero-prev]');
            var next = slider.querySelector('[data-hero-next]');
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            if (prev) {
                prev.addEventListener('click', function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener('click', function () {
                    show(current + 1);
                    start();
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(Number(dot.getAttribute('data-hero-dot')) || 0);
                    start();
                });
            });

            slider.addEventListener('mouseenter', stop);
            slider.addEventListener('mouseleave', start);
            show(0);
            start();
        });

        var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.js-search-input'));
        var yearFilters = Array.prototype.slice.call(document.querySelectorAll('.js-year-filter'));
        var typeFilters = Array.prototype.slice.call(document.querySelectorAll('.js-type-filter'));
        var cards = Array.prototype.slice.call(document.querySelectorAll('.js-filter-card'));
        var emptyState = document.querySelector('[data-empty-state]');

        function valueOf(list) {
            return list.length ? String(list[0].value || '').trim().toLowerCase() : '';
        }

        function applyFilters() {
            if (!cards.length) {
                return;
            }

            var query = valueOf(searchInputs);
            var year = valueOf(yearFilters);
            var type = valueOf(typeFilters);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchYear = !year || String(card.getAttribute('data-year')).toLowerCase() === year;
                var matchType = !type || String(card.getAttribute('data-type')).toLowerCase() === type;
                var matched = matchQuery && matchYear && matchType;
                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        searchInputs.concat(yearFilters).concat(typeFilters).forEach(function (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        });
    });

    window.initMoviePlayer = function (videoId, source, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var attached = false;

        if (!video || !source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video.hlsController = hls;
            } else {
                video.src = source;
            }
        }

        function play() {
            attach();
            video.controls = true;

            if (overlay) {
                overlay.classList.add('is-hidden');
            }

            var promise = video.play();

            if (promise && promise.catch) {
                promise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove('is-hidden');
            }
        });
    };
})();

(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const backToTop = document.querySelector('[data-back-to-top]');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            backToTop.classList.toggle('is-visible', window.scrollY > 500);
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const previous = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let activeIndex = 0;
        let timer = null;

        const showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        };

        const startTimer = function () {
            timer = window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        };

        const resetTimer = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            startTimer();
        };

        if (previous) {
            previous.addEventListener('click', function () {
                showSlide(activeIndex - 1);
                resetTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(activeIndex + 1);
                resetTimer();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                resetTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    const urlQuery = new URLSearchParams(window.location.search).get('q') || '';
    const searchQueryInput = document.querySelector('[data-search-query]');

    if (searchQueryInput) {
        searchQueryInput.value = urlQuery;
    }

    const filterPanels = Array.from(document.querySelectorAll('[data-filter-panel]'));

    filterPanels.forEach(function (panel) {
        const section = panel.closest('section') || document;
        const list = section.querySelector('[data-filter-list]');
        const cards = list ? Array.from(list.querySelectorAll('[data-filter-card]')) : [];
        const textInput = panel.querySelector('[data-local-filter]');
        const yearSelect = panel.querySelector('[data-year-filter]');
        const typeSelect = panel.querySelector('[data-type-filter]');
        const sortSelect = panel.querySelector('[data-sort-filter]');
        const emptyState = section.querySelector('[data-empty-state]');

        if (!list || !cards.length) {
            return;
        }

        if (textInput && urlQuery && section.querySelector('[data-search-list]')) {
            textInput.value = urlQuery;
        }

        const normalize = function (value) {
            return (value || '').toString().trim().toLowerCase();
        };

        const applyFilters = function () {
            const text = normalize(textInput ? textInput.value : '');
            const year = yearSelect ? yearSelect.value : '';
            const type = typeSelect ? typeSelect.value : '';
            const sort = sortSelect ? sortSelect.value : 'default';
            let visibleCards = [];

            cards.forEach(function (card) {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.tags,
                    card.dataset.year,
                    card.dataset.type
                ].join(' '));
                const matchesText = !text || haystack.includes(text);
                const matchesYear = !year || card.dataset.year === year;
                const matchesType = !type || card.dataset.type === type;
                const isVisible = matchesText && matchesYear && matchesType;

                card.classList.toggle('is-filter-hidden', !isVisible);

                if (isVisible) {
                    visibleCards.push(card);
                }
            });

            if (sort !== 'default') {
                visibleCards.sort(function (a, b) {
                    if (sort === 'score') {
                        return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
                    }

                    if (sort === 'year') {
                        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                    }

                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
                });

                visibleCards.forEach(function (card) {
                    list.appendChild(card);
                });
            }

            if (emptyState) {
                emptyState.hidden = visibleCards.length !== 0;
            }
        };

        [textInput, yearSelect, typeSelect, sortSelect].forEach(function (control) {
            if (!control) {
                return;
            }

            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        });

        applyFilters();
    });
})();

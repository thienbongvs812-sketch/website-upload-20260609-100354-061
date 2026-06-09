
(function () {
  var input = document.getElementById('search-input');
  var title = document.getElementById('search-title');
  var results = document.getElementById('search-results');
  var data = window.MOVIE_SEARCH_DATA || [];

  if (!input || !title || !results || !data.length) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  input.value = initialQuery;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function buildCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster-frame" href="' + escapeHtml(movie.url) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.style.display=\'none\'">',
      '    <span class="score-chip">热度 ' + escapeHtml(movie.score) + '</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p class="movie-meta">' + escapeHtml([movie.region, movie.year, movie.type].filter(Boolean).join(' · ')) + '</p>',
      '    <p class="movie-brief">' + escapeHtml(movie.brief) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function render(query) {
    var keyword = query.trim().toLowerCase();
    var matched;

    if (!keyword) {
      matched = data.slice(0, 24);
      title.textContent = '热门推荐';
    } else {
      matched = data.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.brief,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        return haystack.indexOf(keyword) !== -1;
      }).slice(0, 120);
      title.textContent = '搜索“' + query + '”的结果';
    }

    if (!matched.length) {
      results.innerHTML = '<div class="content-card"><h2>没有找到相关影片</h2><p>可以尝试更换片名、年份、地区或类型关键词。</p></div>';
      return;
    }

    results.innerHTML = matched.map(buildCard).join('\n');
  }

  input.addEventListener('input', function () {
    render(input.value);
  });

  render(initialQuery);
})();

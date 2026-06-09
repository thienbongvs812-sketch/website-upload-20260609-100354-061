
import { H as Hls } from './hls-vendor-dru42stk.js';

function initializePlayer(video) {
  if (!video || video.dataset.ready === 'true') {
    return Promise.resolve(video);
  }

  var source = video.getAttribute('data-src');
  if (!source) {
    return Promise.resolve(video);
  }

  video.dataset.ready = 'true';

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return Promise.resolve(video);
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    window.currentHlsPlayer = hls;

    return new Promise(function (resolve) {
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        resolve(video);
      });
      window.setTimeout(function () {
        resolve(video);
      }, 1200);
    });
  }

  video.src = source;
  return Promise.resolve(video);
}

function bindPlayer() {
  var button = document.querySelector('[data-play-button]');
  var video = document.querySelector('#movie-player');

  if (!button || !video) {
    return;
  }

  button.addEventListener('click', function () {
    initializePlayer(video).then(function () {
      button.classList.add('is-hidden');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    });
  });

  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      button.classList.remove('is-hidden');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindPlayer);
} else {
  bindPlayer();
}

import { H as Hls } from './hls.js';

const playerBlocks = Array.from(document.querySelectorAll('[data-player]'));

playerBlocks.forEach(function (block) {
    const video = block.querySelector('video');
    const button = block.querySelector('.play-overlay');
    const status = block.querySelector('[data-player-status]');

    if (!video || !button) {
        return;
    }

    const sourceUrl = video.dataset.src;
    let hlsInstance = null;

    const setStatus = function (message) {
        if (status) {
            status.textContent = message;
        }
    };

    const prepareVideo = function () {
        if (video.dataset.ready === 'true') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            video.dataset.ready = 'true';
            setStatus('正在使用原生高清播放');
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            video.dataset.ready = 'true';
            setStatus('正在初始化高清播放');
            return;
        }

        video.src = sourceUrl;
        video.dataset.ready = 'true';
        setStatus('正在尝试播放');
    };

    const startPlayback = function () {
        prepareVideo();
        video.controls = true;
        button.classList.add('is-hidden');

        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                button.classList.remove('is-hidden');
                setStatus('点击播放按钮继续');
            });
        }
    };

    button.addEventListener('click', startPlayback);

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('playing', function () {
        button.classList.add('is-hidden');
        setStatus('正在播放');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            setStatus('已暂停');
        }
    });

    video.addEventListener('ended', function () {
        setStatus('播放结束');
    });

    video.addEventListener('error', function () {
        button.classList.remove('is-hidden');
        setStatus('播放暂时不可用');
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
});

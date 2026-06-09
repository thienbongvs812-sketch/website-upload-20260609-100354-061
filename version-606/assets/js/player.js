(function () {
    function mount(id, url) {
        var root = document.getElementById(id);
        if (!root) {
            return;
        }

        var video = root.querySelector("video");
        var button = root.querySelector(".player-overlay");
        var started = false;
        var hls = null;

        if (!video || !button) {
            return;
        }

        function activate() {
            if (!started) {
                started = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            }

            button.classList.add("is-hidden");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        button.addEventListener("click", activate);
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("ended", function () {
            if (hls && typeof hls.stopLoad === "function") {
                hls.stopLoad();
            }
        });
    }

    window.MoviePlayer = {
        mount: mount
    };
})();

const youTubeApiReady = new Promise(resolve => {
    if (window.YT?.Player) {
        resolve(window.YT);
        return;
    }

    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
});

class VideoPlayer extends HTMLElement {
    async connectedCallback() {
        const title = this.getAttribute("title");
        const videoId = this.getAttribute("video-id");

        this.innerHTML = `
            <div class="clip-overlay absolute z-1 inset-0 text-white transition duration-500 flex flex-col p-6 justify-between bg-cover bg-center bg-[url('https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg')]">
                <span class="clip-play absolute grid p-3 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40">
                    <img src="assets/jump.svg" alt="" class="h-8 col-start-1 row-start-1 transition duration-500">
                    <img src="assets/play.svg" alt="Play" class="h-8 col-start-1 row-start-1 transition duration-500 opacity-0">
                </span>
                <div class="clip-gradient absolute inset-0 bg-gradient-to-br from-violette/50 to-violette/10 transition duration-500 opacity-0 hover:opacity-100 content-end cursor-pointer hidden">
                    <span class="absolute p-3 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-violette to-pink">
                        <img src="assets/play.svg" alt="Play" class="h-8">
                    </span>
                    <span class="clip-title absolute top-0 left-0 mx-8 my-6 text-xl font-bold line-clamp-1">${title ? title : ""}</span>
                </div>
                <span class="clip-duration z-10 text-xs p-1 px-2 rounded-full bg-black bg-opacity-50 w-fit self-end transition duration-500 opacity-0">0:00</span>
            </div>
            <div class="youtube-player w-full h-full" data-video-id="${videoId}"></div>
        `;

        await youTubeApiReady
        initPlayerLogic(this);
    }
}

customElements.define("video-player", VideoPlayer);

function setVideoDuration(player, durationElement) {
    const duration = player.getDuration();

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function initPlayerLogic(video) {
    const playerContainer = video.querySelector(".youtube-player");
    const overlayElement = video.querySelector(".clip-overlay");
    const gradientElement = video.querySelector(".clip-gradient");
    const durationElement = video.querySelector(".clip-duration");
    const playElement = video.querySelector(".clip-play");

    const player = new YT.Player(playerContainer, {
        videoId: playerContainer.dataset.videoId,
        playerVars: {
            playsinline: 1,
            rel: 0
        },
        events: {
            onReady: () => {
                setVideoDuration(player, durationElement);

                gradientElement.classList.remove('hidden');
                durationElement.classList.remove('opacity-0');
                playElement.querySelectorAll("img").forEach(img => {
                    img.classList.toggle("opacity-0");
                });

                overlayElement.addEventListener("click", () => {
                    overlayElement.style.opacity = "0";
                    overlayElement.style.pointerEvents = "none";

                    player.playVideo();
                });
            },

            onStateChange: event => {
                if (event.data === YT.PlayerState.PLAYING) {
                    video.dispatchEvent(new CustomEvent("video-playing"));
                    document.querySelectorAll("video-player").forEach(otherVideo => {
                        if (otherVideo !== video) {
                            otherVideo.player?.pauseVideo();
                        }
                    });
                }

                if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                    video.dispatchEvent(new CustomEvent("video-paused"));
                }
            }
        }
    });

    video.player = player;
}
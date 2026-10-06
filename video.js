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
            <div class="clip-overlay absolute rounded-2xl z-1 inset-0 text-white transition duration-500 flex flex-col p-6 justify-between bg-cover bg-center cursor-pointer"
            style="background-image: url('https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg')">
                <div class="clip-gradient absolute rounded-2xl inset-0 bg-gradient-to-br from-transparent to-violette/50 transition duration-500 opacity-0 hover:opacity-100 content-end">
                    <span class="clip-play absolute p-4 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-violette to-pink">
                        <img src="assets/play.svg" alt="Play">
                    </span>
                    <span class="clip-title text-xl m-4 font-bold line-clamp-1">${title ? title : ""}</span>
                </div>
                <span class="clip-duration text-xs p-1 px-2 rounded-full bg-black bg-opacity-50 w-fit self-end">0:00</span>
            </div>
            <div class="youtube-player rounded-2xl w-full h-full" data-video-id="${videoId}"></div>
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

    durationElement.textContent =
        `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function initPlayerLogic(video) {
    const playerContainer = video.querySelector(".youtube-player");
    const overlayElement = video.querySelector(".clip-overlay");
    const durationElement = video.querySelector(".clip-duration");

    const player = new YT.Player(playerContainer, {
        videoId: playerContainer.dataset.videoId,
        playerVars: {
            playsinline: 1,
            rel: 0
        },
        events: {
            onReady: () => {
                setVideoDuration(player, durationElement);
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

    overlayElement.addEventListener("click", () => {
        overlayElement.style.opacity = "0";
        overlayElement.style.pointerEvents = "none";

        player.playVideo();
    });
}
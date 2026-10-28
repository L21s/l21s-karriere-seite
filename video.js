const youtubeApiReady = new Promise(resolve => {
    if (window.YT?.Player) {
        resolve(window.YT);
        return;
    }

    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
});

class VideoPlayer extends HTMLElement {
    static get observedAttributes() {
        return ["thumbnail"];
    }

    async connectedCallback() {
        const title = this.getAttribute("title") ?? "";
        const videoId = this.getAttribute("video-id");

        this.innerHTML = `
            <div class="clip-overlay absolute z-1 inset-0 text-white transition duration-500 flex flex-col p-6 justify-between overflow-hidden bg-bggray">
                <img class="clip-thumbnail absolute inset-0 w-full h-full object-cover transition-opacity duration-500" alt="">
                <img class="clip-thumbnail absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0" alt="">

                <span class="clip-play absolute grid p-3 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40">
                    <img src="assets/jump.svg" alt="" class="h-8 col-start-1 row-start-1 transition duration-500">
                    <img src="assets/play.svg" alt="Play" class="h-8 col-start-1 row-start-1 transition duration-500 opacity-0">
                </span>
                <div class="clip-gradient absolute inset-0 bg-gradient-to-br from-violette/50 to-violette/10 transition duration-500 opacity-0 hover:opacity-100 content-end cursor-pointer hidden">
                    <span class="absolute p-3 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-violette to-pink">
                        <img src="assets/play.svg" alt="Play" class="h-8">
                    </span>
                    <span class="clip-title absolute top-0 left-0 mx-8 my-6 text-xl font-bold line-clamp-1">${title}</span>
                </div>
                <span class="clip-duration z-10 text-xs p-1 px-2 rounded-full bg-black/40 w-fit self-end transition duration-500 opacity-0">0:00</span>
            </div>
            
            <span class="clip-paused absolute p-3 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 pointer-events-none hidden">
                <img src="assets/play.svg" alt="Play" class="h-8">
            </span>

            <div class="youtube-player w-full h-full" data-video-id="${videoId}"></div>
        `;

        this.setThumbnail(this.getAttribute("thumbnail"));

        await youtubeApiReady;
        this.initPlayer();
    }

    attributeChangedCallback(name, oldImage, newImage) {
        if (name === "thumbnail" && oldImage !== newImage) {
            this.setThumbnail(newImage);
        }
    }

    setThumbnail(thumbnail) {
        const images = this.querySelectorAll(".clip-thumbnail");
        const nextImage = this.querySelector(".clip-thumbnail.opacity-0");

        nextImage.src = thumbnail || `https://i.ytimg.com/vi/${this.getAttribute("video-id")}/maxresdefault.jpg`;
        nextImage.onload = () => {
            images.forEach((image) => {
                image.classList.toggle("opacity-0");
            })
        };
    }

    initPlayer() {
        const playerContainer = this.querySelector(".youtube-player");

        this.player = new YT.Player(playerContainer, {
            videoId: playerContainer.dataset.videoId,
            playerVars: {
                playsinline: 1,
                rel: 0
            },
            events: {
                onReady: () => {
                    this.setDuration();
                    this.setOverlayInteraction();
                },

                onStateChange: event => {
                    this.handlePlayerState(event.data);
                }
            }
        });
    }

    setOverlayInteraction() {
        const overlay = this.querySelector(".clip-overlay");
        const gradient = this.querySelector(".clip-gradient");
        const playButton = this.querySelector(".clip-play");

        gradient.classList.remove("hidden");

        playButton.querySelectorAll("img").forEach(image => {
            image.classList.toggle("opacity-0");
        });

        overlay.addEventListener("click", () => {
            overlay.classList.add("opacity-0","pointer-events-none");
            this.player.playVideo();
        });
    }

    setDuration() {
        const duration = this.querySelector(".clip-duration");

        const totalSeconds = this.player.getDuration();
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        duration.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        duration.classList.remove("opacity-0");
    }

    handlePlayerState(state) {
        const pausedButton = this.querySelector(".clip-paused");

        if (state === YT.PlayerState.PLAYING) {
            this.dispatchEvent(new CustomEvent("video-playing"));
            this.pauseOtherVideos();
        }

        if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
            this.dispatchEvent(new CustomEvent("video-paused"));
        }

        if (state === YT.PlayerState.PAUSED) {
            pausedButton.classList.remove("hidden");
        }

        if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
            pausedButton.classList.add("hidden");
        }
    }

    pauseOtherVideos() {
        document.querySelectorAll("video-player").forEach(videoPlayer => {
            if (videoPlayer !== this) {
                videoPlayer.player?.pauseVideo();
            }
        });
    }
}

customElements.define("video-player", VideoPlayer);
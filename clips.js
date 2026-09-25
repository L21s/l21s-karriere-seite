const clipsContainer = document.querySelector("#clips-container");
const players = [];

async function initClips() {
    const response = await fetch("./clips.json");
    const data = await response.json();

    renderClips(data.clips);
}

function renderClips(clips) {
    clipsContainer.innerHTML = clips.map(createClip).join("");
    initPlayerLogic();
}

function getYtId(url) {
    return new URL(url).pathname.split("/")[2];
}

function setVideoDuration(player, durationElement) {
    try {
        const duration = player.getDuration();
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);

        durationElement.textContent =
            `${minutes}:${seconds.toString().padStart(2, "0")}`;
    } catch (error) {
        console.error("Videolänge konnte nicht geladen werden:", error);
    }
}

function initPlayerLogic() {
    const clips = document.querySelectorAll(".clip");

    clips.forEach(clip => {
        const playerContainer = clip.querySelector(".youtube-player");
        const overlayElement = clip.querySelector(".clip-overlay");
        const durationElement = clip.querySelector(".clip-duration");

        const player = new YT.Player(playerContainer, {
            videoId: playerContainer.dataset.videoId,
            playerVars: {
                playsinline: 0,
                rel: 0
            },

            events: {
                onReady: () => {
                    setVideoDuration(player, durationElement);
                },
                onStateChange: event => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        players
                            .filter(otherPlayer => otherPlayer !== player)
                            .forEach(otherPlayer => {
                                otherPlayer.pauseVideo();
                            });
                    }
                }
            }
        });

        players.push(player);

        overlayElement.addEventListener("click", () => {
            overlayElement.style.opacity = "0";
            overlayElement.style.pointerEvents = "none";
            player.playVideo();
        });
    });
}

function createClip(clip) {
    const videoId = getYtId(clip.source);

    return `
        <div class="clip relative flex flex-col rounded-2xl w-1/5 bg-black">
            <div class="clip-overlay absolute z-10 inset-0 text-white transition duration-500 rounded-2xl w-full h-full flex flex-col p-6 justify-between bg-cover bg-center" style="background-image:url('https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg')">
                <div class="clip-gradient absolute inset-0 bg-gradient-to-br from-transparent to-violette/50 transition duration-500 opacity-0 hover:opacity-100">
                    <span class="clip-play absolute p-4 rounded-full bg-gradient-to-br from-violette to-pink">
                        <img src="assets/play.svg" alt="Play"/>
                    </span>
                    <span class="clip-title text-xl m-4 font-bold line-clamp-1">${clip.title}</span>
                </div>
                <span class="clip-duration z-10 text-xs p-1 px-2 rounded-full bg-black bg-opacity-50 w-fit self-end">0:00</span>
            </div>
            <div class="youtube-player" data-video-id="${videoId}"></div>
        </div>
    `;
}

initClips().catch(error => {
    console.error("Fehler beim Laden der Clips:", error);
});
import { MODES, getInitialMode } from "./toggle.js";

const initialMode = getInitialMode();

class CareerCard extends HTMLElement {
    connectedCallback() {
        this.cardId = this.getAttribute("card-id");

        const tech = this.querySelector(`[data-mode="${MODES.TECH}"]`);
        const consulting = this.querySelector(`[data-mode="${MODES.CONSULTING}"]`);

        this.source = {
            [MODES.TECH]: tech ?? consulting,
            [MODES.CONSULTING]: consulting ?? tech
        };

        this.hasToggle = Boolean(tech && consulting)

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 p-8 max-md:p-0 md:max-2xl:pb-9 bg-bggray rounded-t-3xl md:rounded-2xl h-full overflow-hidden max-md:-mt-6 max-md:shadow-[0_-0.2rem_0.75rem_rgba(0,0,0,0.4)]">
                <div class="video-card-container flex relative aspect-video">
                    <div class="video-container grid w-full md:rounded-2xl overflow-hidden"></div>
                    ${this.hasToggle ? `
                        <toggle-button class="max-md:invisible absolute -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2"></toggle-button>
                    ` : ""}
                </div>
                <div class="content-container grid max-md:mx-8"></div>
            </div>
        `;

        Object.entries(this.source).forEach(([mode, source]) => {
            this.initCardContent(mode, source);
        });

        if (this.hasToggle) {
            this.setupToggleEvents();
        }

        this.switchContent(initialMode);
        document.addEventListener("mode-change", event => {
            this.switchContent(event.detail.currentMode);
        });
    }

    initCardContent(mode, source) {
        if (source) {
            this.renderContent(mode);
            this.fillContent(mode);

            if (mode === source.dataset.mode) {
                this.renderVideo(mode);
            }
        }
    }

    renderVideo(mode) {
        const container = this.querySelector(".video-container");
        const player = document.createElement("video-player");
        const videoId = this.source[mode].dataset.videoId;

        player.dataset.mode = mode;
        player.className = "card-video col-start-1 row-start-1";
        player.setAttribute("video-id", videoId);

        container.append(player);
    }

    renderContent(mode) {
        const container = this.querySelector(".content-container");
        const content = document.createElement("div");
        const color = mode === MODES.TECH ? "violette" : "pink";

        content.dataset.mode = mode;
        content.className = "col-start-1 row-start-1 flex flex-col gap-6 max-md:mb-24";
        content.innerHTML = `
            <div class="flex flex-row md:flex-col md:items-start items-center gap-1 md:gap-2 max-md:mt-2">
                <img class="-translate-x-1 w-10" loading="lazy" src="assets/icon-${mode}-${this.cardId}.gif" alt="${this.cardId}"/>
                <h1 data-slot="title" class="col-start-1 row-start-1 text-xl md:text-2xl text-black font-medium"></h1>
                <p class="md:hidden text-textgray ml-auto opacity-80 font-medium">${this.getAttribute("index")}/8</p>
            </div>
            
            <div class="col-start-1 row-start-1 flex flex-col gap-3">
                <p data-slot="subtitle" class="text-${color} font-medium"></p>
                <p data-slot="text" class="text-textgray hyphens-auto" lang="de"></p>
            </div>
        `;

        container.append(content);
    }

    fillContent(mode) {
        const contentContainer = this.querySelector(`div[data-mode="${mode}"]`);

        this.source[mode].querySelectorAll("[data-slot]").forEach(sourceElement => {
            const slot = sourceElement.dataset.slot;
            const targetElement = contentContainer.querySelector(`[data-slot="${slot}"]`);

            if (targetElement) {
                targetElement.textContent = sourceElement.textContent;
            }
        });
    }

    setupToggleEvents() {
        const videos = this.querySelectorAll("video-player");
        const toggle = this.querySelector("toggle-button");

        videos.forEach(video => {
            video.addEventListener("video-playing", () => {
                toggle.classList.add("toggle-minimized");
            });

            video.addEventListener("video-paused", () => {
                toggle.classList.remove("toggle-minimized");
            });
        });
    }

    switchContent(currentMode) {
        this.querySelectorAll(".content-container [data-mode]").forEach(contentElement => {
            contentElement.classList.toggle("is-hidden", contentElement.dataset.mode !== currentMode);
        });

        if (this.hasToggle) {
            this.showVideo(currentMode);
        } else {
            this.showThumbnail(currentMode);
        }
    }

    showVideo(currentMode) {
        const videos = this.querySelectorAll("video-player");

        videos.forEach(video => {
            const isCurrentMode = video.dataset.mode === currentMode;

            video.classList.toggle("is-hidden", !isCurrentMode);

            try {
                if (!isCurrentMode && video.player?.getPlayerState?.() === YT.PlayerState.PLAYING) {
                    video.player?.pauseVideo();
                }
            } catch (error) {
                console.warn("Video-Player noch nicht initialisiert oder pausierbar:", error)
            }
        });
    }

    showThumbnail(currentMode) {
        const player = this.querySelector("video-player");

        if (currentMode === MODES.TECH) {
            player.removeAttribute("thumbnail");
        } else {
            player.setAttribute("thumbnail", `assets/thumbnail-${currentMode}-${this.cardId}.jpg`);
        }
    }
}

customElements.define("career-card", CareerCard);
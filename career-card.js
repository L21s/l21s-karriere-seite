class CareerCard extends HTMLElement {
    connectedCallback() {
        this.icon = this.getAttribute("icon");

        const sources = {
            tech: this.querySelector('[data-mode="tech"]'),
            consulting: this.querySelector('[data-mode="consulting"]')
        };

        const hasTech = !!sources.tech;
        const hasConsulting = !!sources.consulting;
        const hasToggle = hasTech && hasConsulting;

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 p-8 max-md:p-0 md:max-2xl:pb-9 bg-bggray rounded-t-2xl md:rounded-2xl h-full overflow-hidden max-md:-mt-4 max-md:shadow-[0_-0.2rem_0.75rem_rgba(0,0,0,0.4)]">
                <div class="video-card-container flex relative aspect-video">
                    <div class="grid w-full md:rounded-2xl overflow-hidden">
                        ${this.renderVideo("tech", sources.tech)}
                        ${this.renderVideo("consulting", sources.consulting)}
                    </div>
                    ${hasToggle ? `<toggle-button class="max-md:invisible absolute -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2"></toggle-button>` : ""}
                </div>
                
                <div class="grid max-md:mx-8">
                    ${this.renderContent("tech")}
                    ${this.renderContent("consulting")}
                </div>
            </div>
        `;

        Object.entries(sources).forEach(([mode, source]) => {
            if (source) {
                this.setContent(mode, source);
            }
        });

        this.switchMode(hasTech ? "tech" : "consulting");

        if (hasToggle) {
            this.setupVideoEvents();
            document.addEventListener("mode-change", event => {
                this.switchMode(event.detail.currentMode);
            });
        }
    }

    renderVideo(mode, content) {
        return content ? `<video-player data-mode="${mode}" class="card-video col-start-1 row-start-1" video-id="${content.dataset.videoId}"></video-player>` : "";
    }

    renderContent(mode) {
        const color = mode === "tech" ? "violette" : "pink";

        return `
            <div data-mode="${mode}" class="col-start-1 row-start-1 flex flex-col gap-6">
                <div class="flex flex-row md:flex-col md:items-start items-center gap-1 md:gap-2 max-md:mt-2">
                    <img class="-translate-x-1 w-10" loading="lazy" src="assets/${this.icon}_normal.gif" alt="${this.icon}"/>
                    <h1 data-slot="title" class="col-start-1 row-start-1 text-xl md:text-2xl text-black font-medium"></h1>
                </div>

                <div class="col-start-1 row-start-1 flex flex-col gap-3">
                    <p data-slot="subtitle" class="text-${color} font-medium"></p>
                    <p data-slot="text" class="text-textgray"></p>
                </div>

                <a data-slot="button" href="#offeneStellen" class="button secondary border-${color} md:hidden bg-white hover:bg-${color}/10 rounded-full transition mt-8 mb-16">
                    <span class="text-${color}">Jetzt bewerben</span>
                </a>
            </div>
        `;
    }

    setContent(mode, source) {
        const contentContainer = this.querySelector(`div[data-mode="${mode}"]`);

        source.querySelectorAll("[data-slot]").forEach(sourceElement => {
            const slot = sourceElement.dataset.slot;
            const targetElement = contentContainer.querySelector(`[data-slot="${slot}"]`);

            if (targetElement) {
                targetElement.textContent = sourceElement.textContent;
            }
        });
    }

    setupVideoEvents() {
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

    switchMode(mode) {
        const videos = this.querySelectorAll("video-player");
        const modeElements = this.querySelectorAll("video-player[data-mode], div[data-mode]");

        videos.forEach(video => {
            if (video.dataset.mode !== mode) {
                video.player?.pauseVideo();
            }
        });

        modeElements.forEach(element => {
            element.classList.toggle("is-hidden", element.dataset.mode !== mode);
        });
    }
}

customElements.define("career-card", CareerCard);

class CareerCard extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute("icon");

        this.techContent = this.querySelector('[data-mode="tech"]');
        this.consultingContent = this.querySelector('[data-mode="consulting"]');

        const hasConsulting = !!this.consultingContent;

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 p-8 max-md:p-0 md:max-2xl:pb-9 bg-bggray rounded-t-2xl md:rounded-2xl h-full overflow-hidden max-md:-mt-4 max-md:shadow-[0_-0.2rem_0.75rem_rgba(0,0,0,0.4)]">
                <div class="video-card-container flex relative aspect-video">
                    <div class="grid w-full md:rounded-2xl overflow-hidden">
                        <video-player data-mode="tech" class="card-video col-start-1 row-start-1" video-id="${this.techContent.dataset.videoId}"></video-player>
                        ${hasConsulting ? `<video-player data-mode="consulting" class="card-video col-start-1 row-start-1" video-id="${this.consultingContent.dataset.videoId}"></video-player>` : ""}
                    </div>
                    ${hasConsulting ? `<toggle-button class="max-md:invisible absolute -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2"></toggle-button>` : ""}
                </div>
                
                <div class="grid max-md:mx-8">
                    <div data-mode="tech" class="col-start-1 row-start-1 flex flex-col gap-6">
                        <div class="flex flex-row md:flex-col md:items-start items-center gap-1 md:gap-2 max-md:mt-2">
                            <img class="-translate-x-1 w-10" loading="lazy" src="assets/${icon}_normal.gif" alt="${icon}">
                            <h1 data-slot="title" class="col-start-1 row-start-1 text-xl md:text-2xl text-black font-medium"></h1>
                        </div>

                        <div class="col-start-1 row-start-1 flex flex-col gap-3">
                            <p data-slot="subtitle" class="text-violette font-medium"></p>
                            <p data-slot="text" class="text-textgray"></p>
                        </div>

                        <a data-slot="button" href="#offeneStellen" class="button secondary md:hidden bg-white hover:bg-black rounded-full transition mt-8 mb-16">
                            <span class="text-violette">Jetzt bewerben</span>
                        </a>
                    </div>

                    <div data-mode="consulting" class="col-start-1 row-start-1 flex flex-col gap-6 is-hidden">
                        <div class="flex flex-row md:flex-col md:items-start items-center gap-1 md:gap-2 max-md:mt-2">
                            <img class="-translate-x-1 w-10" loading="lazy" src="assets/${icon}_normal.gif" alt="${icon}">
                            <h1 data-slot="title" class="col-start-1 row-start-1 text-xl md:text-2xl text-black font-medium"></h1>
                        </div>

                        <div class="col-start-1 row-start-1 flex flex-col gap-3">
                            <p data-slot="subtitle" class="text-pink font-medium"></p>
                            <p data-slot="text" class="text-textgray"></p>
                        </div>

                        <a data-slot="button" href="#offeneStellen" class="button secondary md:hidden bg-white hover:bg-black rounded-full transition mt-8 mb-16">
                            <span class="text-violette">Jetzt bewerben</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.setContent("tech", this.techContent);

        if (hasConsulting) {
            this.setContent("consulting", this.consultingContent);
            this.setupVideoEvents();

            this.switchMode(false);
            document.addEventListener("mode-change", event => {
                this.switchMode(event.detail.isConsulting);
            });
        }
    }

    setContent(mode, source) {
        const modeContent = this.querySelector(`div[data-mode="${mode}"]`)
        modeContent.querySelector(`[data-slot="title"]`).textContent = source.querySelector('[data-slot="title"]').textContent;
        modeContent.querySelector('[data-slot="subtitle"]').textContent = source.querySelector('[data-slot="subtitle"]').textContent;
        modeContent.querySelector('[data-slot="text"]').textContent = source.querySelector('[data-slot="text"]').textContent;
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

    switchMode(isConsulting) {
        const mode = isConsulting ? "consulting" : "tech";
        const videos = this.querySelectorAll("video-player");

        [...videos].find(video => video.dataset.mode !== mode)?.player?.pauseVideo();

        this.querySelectorAll('[data-mode]').forEach(element => {
            element.classList.toggle("is-hidden", element.dataset.mode !== mode);
        });
    }
}

customElements.define("career-card", CareerCard);
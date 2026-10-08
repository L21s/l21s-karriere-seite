class CareerCard extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute("icon");

        this.techContent = this.querySelector('[data-mode="tech"]');
        this.consultingContent = this.querySelector('[data-mode="consulting"]');

        const hasConsulting = !!this.consultingContent;

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 py-6 p-8 max-md:py-12 md:max-2xl:pb-9 bg-bggray md:rounded-2xl h-full">
                <div class="video-card-container flex relative aspect-video">
                    <div class="grid w-full">
                        <video-player data-slot="video-tech" class="card-video-fade col-start-1 row-start-1" video-id="${this.techContent.dataset.videoId}"></video-player>
                        ${hasConsulting ? `
                            <video-player data-slot="video-consulting" class="card-video-fade col-start-1 row-start-1" video-id="${this.consultingContent.dataset.videoId}"></video-player>
                        ` : ""}
                    </div>
                    ${hasConsulting ? `
                        <toggle-button class="max-md:invisible absolute -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2"></toggle-button>
                    ` : ""}
                </div>

                <div class="flex flex-row md:flex-col md:items-start items-center md:gap-2">
                    <img class="-translate-x-1" loading="lazy" src="assets/${icon}_normal.gif" alt="${icon}" width="40" height="40">

                    <div class="grid">
                        <h1 data-slot="title-tech" class="col-start-1 row-start-1 text-xl md:text-2xl text-black font-medium"></h1>
                        ${hasConsulting ? `
                            <h1 data-slot="title-consulting" class="col-start-1 row-start-1 text-xl md:text-2xl text-black font-medium"></h1>
                        ` : ""}
                    </div>
                </div>

                <div class="grid">
                    <div data-slot="content-tech" class="col-start-1 row-start-1 flex flex-col gap-3">
                        <p data-slot="subtitle-tech" class="text-violette font-medium"></p>
                        <p data-slot="text-tech" class="text-textgray"></p>
                    </div>

                    ${hasConsulting ? `
                        <div data-slot="content-consulting" class="col-start-1 row-start-1 flex flex-col gap-3">
                            <p data-slot="subtitle-consulting" class="text-pink font-medium"></p>
                            <p data-slot="text-consulting" class="text-textgray"></p>
                        </div>
                    ` : ""}
                </div>

                <a href="#offeneStellen" class="md:hidden rounded-full border-2 p-2 px-4 text-md text-center text-violette">
                    Jetzt bewerben
                </a>
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
        this.querySelector(`[data-slot="title-${mode}"]`).textContent = source.querySelector('[data-slot="title"]').textContent;
        this.querySelector(`[data-slot="subtitle-${mode}"]`).textContent = source.querySelector('[data-slot="subtitle"]').textContent;
        this.querySelector(`[data-slot="text-${mode}"]`).textContent = source.querySelector('[data-slot="text"]').textContent;
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
        const videoTech = this.querySelector('[data-slot="video-tech"]');
        const videoConsulting = this.querySelector('[data-slot="video-consulting"]');

        const videoToPause = isConsulting ? videoTech : videoConsulting;
        videoToPause.player?.pauseVideo();

        videoTech.classList.toggle("is-hidden", isConsulting);
        videoConsulting.classList.toggle("is-hidden", !isConsulting);

        this.querySelector('[data-slot="title-tech"]').classList.toggle("is-hidden", isConsulting);
        this.querySelector('[data-slot="title-consulting"]').classList.toggle("is-hidden", !isConsulting);

        this.querySelector('[data-slot="content-tech"]').classList.toggle("is-hidden", isConsulting);
        this.querySelector('[data-slot="content-consulting"]').classList.toggle("is-hidden", !isConsulting);
    }
}

customElements.define("career-card", CareerCard);
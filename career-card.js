class CareerCard extends HTMLElement {
    connectedCallback() {
        const videoId = this.getAttribute("video-id");
        const icon = this.getAttribute("icon");

        this.techContent = this.querySelector('[data-mode="tech"]');
        this.consultingContent = this.querySelector('[data-mode="consulting"]');

        const hasConsulting = !!this.consultingContent;

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 py-6 p-8 max-md:py-12 md:max-2xl:pb-9 bg-bggray md:rounded-2xl h-full">
                <div class="video-card-container flex relative aspect-video">
                    <video-player video-id="${videoId}"></video-player>
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
                    <div class="col-start-1 row-start-1 flex flex-col gap-3">
                        <p data-slot="subtitle-tech" class="text-violette font-medium"></p>
                        <p data-slot="text-tech" class="text-textgray"></p>
                    </div>

                    ${hasConsulting ? `
                        <div class="col-start-1 row-start-1 flex flex-col gap-3">
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

        this.querySelector('[data-slot="title-tech"]').textContent = this.techContent.querySelector('[data-slot="title"]').textContent;
        this.querySelector('[data-slot="subtitle-tech"]').textContent = this.techContent.querySelector('[data-slot="subtitle"]').textContent;
        this.querySelector('[data-slot="text-tech"]').textContent = this.techContent.querySelector('[data-slot="text"]').textContent;

        if (hasConsulting) {
            this.querySelector('[data-slot="title-consulting"]').textContent = this.consultingContent.querySelector('[data-slot="title"]').textContent;
            this.querySelector('[data-slot="subtitle-consulting"]').textContent = this.consultingContent.querySelector('[data-slot="subtitle"]').textContent;
            this.querySelector('[data-slot="text-consulting"]').textContent = this.consultingContent.querySelector('[data-slot="text"]').textContent;

            this.switchMode(false);
            document.addEventListener("mode-change", event => {
                this.switchMode(event.detail.isConsulting);
            });

            const video = this.querySelector("video-player");
            const toggle = this.querySelector("toggle-button");

            video.addEventListener("video-playing", () => {
                toggle.classList.add("toggle-minimized");
            });
            video.addEventListener("video-paused", () => {
                toggle.classList.remove("toggle-minimized");
            });
        }
    }

    switchMode(isConsulting) {
        this.querySelector('[data-slot="title-tech"]').style.visibility = isConsulting ? "hidden" : "visible";
        this.querySelector('[data-slot="subtitle-tech"]').parentElement.style.visibility = isConsulting ? "hidden" : "visible";

        this.querySelector('[data-slot="title-consulting"]').style.visibility = isConsulting ? "visible" : "hidden";
        this.querySelector('[data-slot="subtitle-consulting"]').parentElement.style.visibility = isConsulting ? "visible" : "hidden";
    }
}

customElements.define("career-card", CareerCard);
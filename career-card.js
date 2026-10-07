class CareerCard extends HTMLElement {
    connectedCallback() {
        const videoId = this.getAttribute("video-id");
        const icon = this.getAttribute("icon");

        this.techContent = this.querySelector('[data-mode="tech"]');
        this.consultingContent = this.querySelector('[data-mode="consulting"]');

        const hasToggle = !!this.consultingContent;

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 py-6 p-8 max-md:py-12 md:max-2xl:pb-9 bg-bggray md:rounded-2xl h-full">
                <div class="video-card-container flex relative aspect-video">
                    <video-player video-id="${videoId}"></video-player>
                    ${hasToggle ? `<toggle-button class="max-md:invisible absolute -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2"></toggle-button>` : ""}
                </div>
                <div class="flex flex-row md:flex-col md:items-start items-center md:gap-2">
                    <img class="-translate-x-1" loading="lazy" src="assets/${icon}_normal.gif" alt="${icon}" width="40" height="40">
                    <h1 data-slot="title" class="text-xl md:text-2xl text-black font-medium"></h1>
                </div>
                <div class="flex flex-col gap-3">
                    <p data-slot="subtitle" class="text-violette font-medium"></p>
                    <p data-slot="text" class="text-textgray"></p>
                </div>
                <a href="#offeneStellen" class="md:hidden rounded-full border-2 p-2 px-4 text-md text-center text-violette">Jetzt bewerben</a>
            </div>
        `;

        this.showMode(false);
        document.addEventListener("mode-change", event => {
            this.showMode(event.detail.isConsulting);
        });

        const video = this.querySelector("video-player");
        const toggle = this.querySelector("toggle-button");

        if (video && toggle) {
            video.addEventListener("video-playing", () => {
                toggle.classList.add("toggle-minimized");
            });

            video.addEventListener("video-paused", () => {
                toggle.classList.remove("toggle-minimized");
            });
        }
    }

    showMode(isConsulting) {
        const currentContent = isConsulting && this.consultingContent ? this.consultingContent : this.techContent;
        const subtitle = this.querySelector('[data-slot="subtitle"]')

        if (this.consultingContent) {
            subtitle.classList.toggle("text-violette", !isConsulting);
            subtitle.classList.toggle("text-pink", isConsulting);
        }

        subtitle.textContent = currentContent.querySelector('[data-slot="subtitle"]').textContent;
        this.querySelector('[data-slot="title"]').textContent = currentContent.querySelector('[data-slot="title"]').textContent;
        this.querySelector('[data-slot="text"]').textContent = currentContent.querySelector('[data-slot="text"]').textContent;
    }
}

customElements.define("career-card", CareerCard);
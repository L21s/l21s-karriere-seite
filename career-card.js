class CareerCard extends HTMLElement {
    connectedCallback() {
        const videoId = this.getAttribute("video-id");
        const icon = this.getAttribute("icon");
        const hasToggle = this.hasAttribute("toggle");

        const title = this.querySelector('[slot="title"]');
        const subtitle = this.querySelector('[slot="subtitle"]');
        const text = this.querySelector('[slot="text"]');

        this.innerHTML = `
            <div class="flex flex-col flex-grow gap-6 py-6 p-8 max-md:py-12 md:max-2xl:pb-9 bg-bggray md:rounded-2xl h-full">
                <div class="video-card-container flex relative aspect-video">
                    <video-player video-id="${videoId}"></video-player>
                    ${hasToggle ? `<toggle-button class="max-md:invisible absolute translate-x-1/2 translate-y-1/2 bottom-0 left-0.5"></toggle-button>` : ""}
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

        this.querySelector('[data-slot="title"]').append(title);
        this.querySelector('[data-slot="subtitle"]').append(subtitle);
        this.querySelector('[data-slot="text"]').append(text);

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
}

customElements.define("career-card", CareerCard);
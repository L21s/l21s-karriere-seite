class VideoCarousel extends HTMLElement {
    connectedCallback() {
        this.clips = [...this.querySelectorAll("video-player")];

        this.render();
        this.setupEvents();
        this.updateActivePlayer();
    }

    render() {
        this.innerHTML = `
            <div class="carousel relative w-full [--width:85vw] md:[--width:24rem]">
                <button class="clips-arrow prev absolute left-2 md:left-1/2 top-1/2 z-10 md:-translate-x-[calc(var(--width)/2+100%+0.75rem)] -translate-y-1/2 flex items-center justify-center size-16 rounded-full bg-black/50 text-3xl text-white disabled:opacity-30">←</button>
                <div class="clips-viewport w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div class="clips-container flex w-max flex-nowrap md:gap-4 px-[max(0px,calc((100vw-var(--width))/2))]"></div>
                </div>
                <button class="clips-arrow next absolute right-2 md:left-1/2 top-1/2 z-10 md:translate-x-[calc(var(--width)/2+0.75rem)] -translate-y-1/2 flex items-center justify-center size-16 rounded-full bg-black/50 text-3xl text-white disabled:opacity-30">→</button>
            </div>
        `;

        this.viewport = this.querySelector(".clips-viewport");
        this.container = this.querySelector(".clips-container");

        this.clips.forEach(clip => {
            clip.classList.add("w-[var(--width)]", "scale-90", "opacity-60", "shrink-0", "snap-center", "transition-all", "duration-300");
            this.container.appendChild(clip);
        });
    }

    setupEvents() {
        this.querySelector(".prev").addEventListener("click", () => this.scrollToPlayer(-1));
        this.querySelector(".next").addEventListener("click", () => this.scrollToPlayer(1));

        this.viewport.addEventListener("scroll", () => this.updateActivePlayer());

        this.clips.forEach(clip => {
            clip.addEventListener("video-playing", () => clip.scrollIntoView({
                behavior: "smooth", block: "nearest", inline: "center"
            }));
            clip.addEventListener("video-ended", () => {
                this.scrollToPlayer(1);
            });
        });
    }

    getActivePlayer() {
        const center = this.viewport.getBoundingClientRect().left + this.viewport.clientWidth / 2;

        return this.clips.reduce((closest, clip) => {
            const distance = Math.abs(clip.getBoundingClientRect().left + clip.offsetWidth / 2 - center);
            const closestDistance = Math.abs(closest.getBoundingClientRect().left + closest.offsetWidth / 2 - center);

            return distance < closestDistance ? clip : closest;
        }, this.clips[0]);
    }

    updateActivePlayer() {
        const activePlayer = this.getActivePlayer();

        this.clips.forEach(async clip => {
            const isActive = clip === activePlayer;
            const wasActive = clip.classList.contains("active");

            clip.classList.toggle("active", isActive);

            if (wasActive && !isActive) {
                clip.pauseIfPlaying();
            }
        });

        this.updateArrowButtons();
    }

    scrollToPlayer(direction) {
        const index = this.clips.indexOf(this.getActivePlayer());
        const next = Math.max(0, Math.min(this.clips.length - 1, index + direction));

        this.clips[next].scrollIntoView({
            behavior: "smooth", block: "nearest", inline: "center"
        });
    }

    updateArrowButtons() {
        const index = this.clips.indexOf(this.getActivePlayer());
        const prevButton = this.querySelector(".prev");
        const nextButton = this.querySelector(".next");

        prevButton.disabled = index === 0;
        nextButton.disabled = index === this.clips.length - 1;
    }
}

customElements.define("video-carousel", VideoCarousel);

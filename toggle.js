export const MODES = {
    TECH: "tech",
    CONSULTING: "consulting"
};

const DEFAULT_MODE = MODES.TECH;
const MODE_PARAM = "field";

let currentMode = getInitialMode();

export function getInitialMode() {
    const mode = new URLSearchParams(window.location.search).get(MODE_PARAM);
    return Object.values(MODES).includes(mode) ? mode : DEFAULT_MODE;
}

function switchCurrentMode() {
    currentMode = currentMode === MODES.TECH ? MODES.CONSULTING : MODES.TECH;

    const url = new URL(window.location.href);
    url.searchParams.set(MODE_PARAM, currentMode);

    window.history.replaceState(null, "", url);

    document.dispatchEvent(new CustomEvent("mode-change", {
        detail: {currentMode}
    }));
}

class ToggleButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="toggle-container p-1 rounded-full bg-white shadow-sm">
                <button class="toggle flex relative gap-0">
                    <span class="slider rounded-full absolute bg-violette"></span>
                    <span data-mode="${MODES.TECH}" class="label rounded-full z-10 overflow-hidden font-medium text-textgray bg-violette">
                        <svg class="text-textgray h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9L3 12L6 15M18 9L21 12L18 15M13.5 6L10.5 18"></path></svg>
                        Tech
                    </span>
                    <span data-mode="${MODES.CONSULTING}" class="label rounded-full z-10 overflow-hidden font-medium text-textgray bg-pink">
                        <svg class="text-textgray h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V7M8 7H4C2.89543 7 2 7.89543 2 9V12.5M8 7H16M16 7H20C21.1046 7 22 7.89543 22 9V12.5M2 12.5V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V12.5M2 12.5L10.5 14M10.5 14V12.5H13.5V14M10.5 14V16H13.5V14M13.5 14L22 12.5"></path></svg>
                        Consulting
                    </span>
                </button>
            </div>
        `;

        this.button = this.querySelector(".toggle");
        this.slider = this.querySelector(".slider");
        this.labels = this.querySelectorAll(".label");

        this.button.addEventListener("click", () => {
            switchCurrentMode();
            this.updateAllToggles();
        });

        this.updateToggle();
    }

    updateAllToggles() {
        document.querySelectorAll("toggle-button").forEach(toggle => {
            toggle.updateToggle();
        });
    }

    updateToggle() {
        const activeLabel = this.querySelector(`[data-mode="${currentMode}"]`);

        this.slider.style.width = `${activeLabel.offsetWidth}px`;
        this.slider.style.transform = `translateX(${activeLabel.offsetLeft}px)`;

        this.slider.classList.toggle("bg-violette", currentMode === "tech");
        this.slider.classList.toggle("bg-pink", currentMode === "consulting");

        this.labels.forEach(label => {
            label.classList.toggle("active", label.dataset.mode === currentMode);
        });
    }
}

customElements.define("toggle-button", ToggleButton);

window.addEventListener("resize", () => {
    document.querySelectorAll("toggle-button").forEach(toggle => {
        toggle.updateToggle();
    });
});
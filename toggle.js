let currentMode = "tech";

class ToggleButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="toggle-container p-1 rounded-full bg-white shadow-sm">
                <button class="toggle flex relative gap-0">
                    <span class="slider rounded-full absolute bg-violette"></span>
                    <span data-mode="tech" class="label rounded-full z-10 overflow-hidden font-medium text-textgray bg-violette active">Tech</span>
                    <span data-mode="consulting" class="label rounded-full z-10 overflow-hidden font-medium text-textgray bg-pink">Consulting</span>
                </button>
            </div>
        `;

        this.button = this.querySelector(".toggle");
        this.slider = this.querySelector(".slider");
        this.labels = this.querySelectorAll(".label");

        this.button.addEventListener("click", () => {
            currentMode = currentMode === "tech" ? "consulting" : "tech";
            this.updateAllToggles();
            document.dispatchEvent(new CustomEvent("mode-change", {
                detail: { currentMode }
            }));
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
let currentMode = "tech";

class ToggleButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="toggle-container p-1 rounded-full bg-white shadow-sm">
                <button class="toggle flex relative gap-0">
                    <span class="slider rounded-full absolute bg-violette"></span>
                    <span class="label rounded-full z-10 overflow-hidden font-medium text-textgray bg-violette active">Tech</span>
                    <span class="label rounded-full z-10 overflow-hidden font-medium text-textgray bg-pink">Consulting</span>
                </button>
            </div>
        `;

        this.button = this.querySelector(".toggle");
        this.slider = this.querySelector(".slider");
        this.labels = this.querySelectorAll(".label");

        this.button.onclick = () => {
            currentMode = currentMode === "tech" ? "consulting" : "tech";
            updateToggle();
            document.dispatchEvent(new CustomEvent("mode-change", {detail: {currentMode}}));
        };

        updateToggle();
    }
}

customElements.define("toggle-button", ToggleButton);

function updateToggle() {
    document.querySelectorAll("toggle-button").forEach(toggle => {
        const activeIndex = currentMode === "consulting" ? 1 : 0;
        const activeLabel = toggle.labels[activeIndex];

        toggle.slider.classList.toggle("bg-violette", currentMode === "tech");
        toggle.slider.classList.toggle("bg-pink", currentMode === "consulting");

        toggle.slider.style.width = activeLabel.offsetWidth + "px";
        toggle.slider.style.transform =`translateX(${activeLabel.offsetLeft}px)`;

        toggle.labels.forEach((label, index) => {
            label.classList.toggle("active", index === activeIndex);
        });
    });
}

window.addEventListener("resize", updateToggle);
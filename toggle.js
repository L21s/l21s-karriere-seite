let isConsulting = false;

class ToggleButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <button class="toggle">
                <span class="slider rounded-full bg-violette"></span>
                <span class="label font-medium active">Tech</span>
                <span class="label font-medium">Consulting</span>
            </button>
        `;

        this.classList.add("bg-white", "rounded-full");

        this.button = this.querySelector(".toggle");
        this.slider = this.querySelector(".slider");
        this.labels = this.querySelectorAll(".label");

        this.button.onclick = () => {
            isConsulting = !isConsulting;
            updateToggle();
        };

        updateToggle();
    }
}

customElements.define("toggle-button", ToggleButton);

function updateToggle() {
    document.querySelectorAll("toggle-button").forEach(toggle => {
        const activeIndex = isConsulting ? 1 : 0;
        const activeLabel = toggle.labels[activeIndex];

        toggle.slider.classList.toggle("bg-violette", !isConsulting);
        toggle.slider.classList.toggle("bg-pink", isConsulting);

        toggle.slider.style.width = activeLabel.offsetWidth + "px";
        toggle.slider.style.transform =`translateX(${activeLabel.offsetLeft}px)`;

        toggle.labels.forEach((label, index) => {
            label.classList.toggle("active", index === activeIndex);
        });
    });
}
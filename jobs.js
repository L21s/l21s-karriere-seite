const techJobs = document.querySelector("#tech-jobs");
const consultingJobs = document.querySelector("#consulting-jobs");

const techPersona = document.querySelector("#tech-persona");
const consultingPersona = document.querySelector("#consulting-persona");

async function initJobs() {
    const response = await fetch("./jobs.json");
    const data = await response.json();

    renderJobs(techJobs, data.departments.tech.jobs, "violette");
    renderJobs(consultingJobs, data.departments.consulting.jobs, "pink");

    renderPersona(techPersona, data.departments.tech.persona);
    renderPersona(consultingPersona, data.departments.consulting.persona);
}

function renderPersona(container, tags) {
    container.innerHTML = tags
        .map(tag => `<span class="tag text-sm"><span class="emoji">${tag.emoji}</span>${tag.title}</span>`)
        .join("");
}

function renderJobs(container, jobs, color) {
    container.innerHTML = jobs.map(job => createJobCard(job, color)).join("");
    initDescriptionToggle(container);
}

function initDescriptionToggle(container) {
    container.querySelectorAll(".job-card").forEach(card => {
        const description = card.querySelector(".job-card-description");
        const moreButton = card.querySelector(".job-card-description-more");

        function toggleDescription() {
            description.classList.toggle("md:line-clamp-2");
            const isCollapsed = description.classList.contains("md:line-clamp-2");

            moreButton.textContent = isCollapsed ? "Mehr" : "Weniger";
        }

        moreButton.addEventListener("click", toggleDescription);
    });
}

function createJobCard(job, color) {
    return `
        <div class="job-card">
            <div class="flex-col xl:flex-row">
                <div class="flex flex-row justify-between content-start">
                    <div>
                        <h3 class="text-xl font-bold">${job.title}</h3>
                        <p class="subtitle text-sm">M/W/D</p>
                    </div>
                    <a class="apply-button hidden md:max-xl:flex py-3 w-fit bg-white hover:bg-${color} rounded-full transition" href="${job.url}" target="_blank">
                        <span class="text-${color}">Jetzt bewerben</span>
                        <svg class="text-${color} h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
                    </a>
                </div>
                <div class="tags-container xl:flex-nowrap xl:justify-end grow">
                    <span class="tag text-sm"><span class="emoji">${job.experience.emoji}</span>${job.experience.title}</span>
                    <span class="tag text-sm">${job.employment}</span>
                    <span class="tag text-sm">${job.remote}</span>
                </div>
            </div>
            <div class="flex-col xl:flex-row">
                <div class="flex flex-col grow gap-2">
                    <p class="job-card-description md:line-clamp-2 max-sm:pb-3 hyphens-auto" lang="de">${job.description}</p>
                    <span class="job-card-description-more cursor-pointer text-${color} max-md:hidden">Mehr</span>
                </div>
                <a class="apply-button self-end md:max-xl:hidden md:py-3 w-full md:w-fit bg-white hover:bg-${color} rounded-full transition" href="${job.url}" target="_blank">
                    <span class="text-${color}">Jetzt bewerben</span>
                    <svg class="text-${color} h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg>
                </a>
            </div>
        </div>
    `;
}

initJobs().catch(error => {
    console.error("Fehler beim Laden der Jobs:", error);
});
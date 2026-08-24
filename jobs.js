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
                <div class="tags-container xl:justify-end grow">
                    <span class="tag text-sm"><span class="emoji">${job.experience.emoji}</span>${job.experience.title}</span>
                    <span class="tag text-sm">${job.employment}</span>
                    <span class="tag text-sm">${job.remote}</span>
                </div>
            </div>
            <div class="flex-col xl:flex-row">
                <div class="flex flex-col grow gap-2">
                    <p class="job-card-description md:max-lg:flex">${job.description}</p>
                    <span class="job-card-description-more text-${color} hidden lg:flex">Mehr</span>
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
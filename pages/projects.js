// Sticky Navigation Menu
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-btn");

window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    if (scrollBtn) scrollBtn.style.display = "block";
  } else {
    nav.classList.remove("sticky");
    if (scrollBtn) scrollBtn.style.display = "none";
  }
};

const projectCardsContainer = document.getElementById("project-cards");
const searchBar = document.getElementById("search-bar");
const domainFilter = document.getElementById("domain-filter");

const domainColors = {
  NLP: "#4CAF50",
  FullStack: "#2196F3",
  DataScience: "#FF5722",
  ML: "#9C27B0",
  DL: "#c23392ff",
  Default: "#9E9E9E",
};

let projects = [];

// --------------- Modal Elements ---------------
const modal = document.getElementById("project-modal");
const modalClose = modal.querySelector(".close");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalDescription = document.getElementById("modal-description");
const modalTechStack = document.getElementById("modal-tech-stack");
const modalDemoLink = document.getElementById("modal-demo-link");
const modalRepoLink = document.getElementById("modal-repo-link");
const modalPS = document.getElementById("modal-ps");
const modalDates = document.getElementById("modal-dates");

// --------------- Create Cards -----------------
function renderCards(projectsToRender) {
  projectCardsContainer.innerHTML = "";
  projectsToRender.forEach((project, index) => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    let domainTags = "";
    project.domain.forEach((domain) => {
      const color = domainColors[domain] || domainColors.Default;
      domainTags += `<span class="domain-tag" style="color: ${color}; border: 2px solid ${color};">${domain}</span>`;
    });

    card.innerHTML = `
      <div class="domain-tags-container">${domainTags}</div>
      <img src="${project.image}" alt="${project.title}" class="card-image" style="cursor:pointer;">
      <div class="card-body">
        <h3 class="project-title" style="cursor:pointer;">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="tech-stack">Tech Stack: ${project.techStack.join(", ")}</p>
        <div class="card-links">
          ${project.links.demo ? `<a href="${project.links.demo}" target="_blank">View Demo</a>` : ``}
          ${project.links.repo ? `<a href="${project.links.repo}" target="_blank">View Repo</a>` : ``}
          ${project.links.doc ? `<a href="${project.links.doc}" target="_blank">View Doc</a>` : ``}

        </div>
      </div>
    `;

    // Image click opens modal
    card.querySelector(".card-image").addEventListener("click", () => openModal(project));
    // Title click opens modal
    card.querySelector(".project-title").addEventListener("click", () => openModal(project));

    projectCardsContainer.appendChild(card);
  });
}

// --------------- Open Modal -----------------
function openModal(project) {
  modalTitle.textContent = project.title;
  modalImage.src = project.image;
  modalImage.alt = project.title;
  modalDescription.textContent = project.description;
  modalTechStack.textContent = project.techStack.join(", ");
  modalDates.textContent = `Start: ${project.startDate} | End: ${project.endDate}`;
  modalDemoLink.href = project.links.demo;
  modalRepoLink.href = project.links.repo;
  
  modalPS.textContent = project.modalContent?.ps || "";

  modal.classList.remove("hidden");
}

// --------------- Close Modal -----------------
// Close with X icon
modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// --------------- Filters & Search -----------------
function populateFilterOptions() {
  const allDomains = new Set();
  projects.forEach((p) => p.domain.forEach((d) => allDomains.add(d)));
  domainFilter.innerHTML = `<option value="All">All Domains</option>`;
  allDomains.forEach((domain) => {
    const option = document.createElement("option");
    option.value = domain;
    option.textContent = domain;
    domainFilter.appendChild(option);
  });
}

function filterProjectsByDomain(domain) {
  if (domain === "All") renderCards(projects);
  else renderCards(projects.filter(p => p.domain.includes(domain)));
}

domainFilter.addEventListener("change", (e) => {
  filterProjectsByDomain(e.target.value);
});

searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(query) ||
    p.domain.some(d => d.toLowerCase().includes(query)) ||
    p.techStack.some(t => t.toLowerCase().includes(query))
  );
  renderCards(filtered);
});

// --------------- Fetch & Init -----------------
fetch("../files/projects.json")
  .then((response) => response.json())
  .then((data) => {
    projects = data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
    populateFilterOptions();
    renderCards(projects);
    
  })
  .catch((err) => console.error(err));

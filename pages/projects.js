// Sticky Navigation Menu
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-btn");

// Show/hide sticky navigation and scroll button based on scroll position
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  } else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
};

const projects = [
    {
        title: "ChatDB",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        techStack: ["React", "Node.js", "MongoDB"],
        domain: ["Fintech", "EdTech", "HealthTech", "AgriTech"],
        image: "../images/projects/chatdb.png",
        links: { demo: "#", repo: "#" }
    },
    {
        title: "Remify",
        description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        techStack: ["Python", "Flask", "PostgreSQL"],
        domain: ["Fintech", "EdTech"],
        image: "../images/projects/remify.png",
        links: { demo: "#", repo: "#" }
    },
    {
        title: "HKD",
        description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        techStack: ["Python", "Flask", "PostgreSQL"],
        domain: ["EdTech"],
        image: "../images/projects/chatdb.png",
        links: { demo: "#", repo: "#" }
    },
    {
        title: "Cool",
        description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        techStack: ["Python", "Flask", "PostgreSQL"],
        domain: ["EdTech"],
        image: "../images/projects/chatdb.png",
        links: { demo: "#", repo: "#" }
    },
    // Add more projects as needed
];

const projectCardsContainer = document.getElementById("project-cards");
const searchBar = document.getElementById("search-bar");

// Domain-specific colors
const domainColors = {
    Fintech: "#4CAF50", // Green
    EdTech: "#2196F3",  // Blue
    HealthTech: "#FF5722", // Orange
    AgriTech: "#9C27B0",  // Purple
    Default: "#9E9E9E",  // Grey for undefined domains
};

// ------------------------ Create Project Cards --------------------------------
function renderCards(projects) {
    projectCardsContainer.innerHTML = "";
    projects.forEach((project) => {
        const card = document.createElement("div");
        card.classList.add("project-card");

        // Create domain tags dynamically for multiple domains
        let domainTags = "";
        for (const domain of project.domain) {
            const domainColor = domainColors[domain] || domainColors.Default;
            domainTags += `<span class="domain-tag" style="color: ${domainColor}; border: 2px solid ${domainColor};">${domain}</span>`;
        }

        card.innerHTML = `
            <div class="domain-tags-container">
                ${domainTags}
            </div>
            <img src="${project.image}" alt="${project.title}">
            <div class="card-body">
                <h3 class="project-title"><a href="${project.links.doc}">${project.title}</a></h3>
                <p class="project-description">${project.description}</p>
                <p class="tech-stack">Tech Stack: ${project.techStack.join(", ")}</p>
                <div class="card-links">
                    <a href="${project.links.demo}" target="_blank">View Demo</a>
                    <a href="${project.links.repo}" target="_blank">View Repo</a>
                </div>
            </div>
        `;
        projectCardsContainer.appendChild(card);
    });
}

// ------------------------ Search Funtionality --------------------------------
searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredProjects = projects.filter((project) => {
        return (
            project.title.toLowerCase().includes(query) ||
            project.domain.some((d) => d.toLowerCase().includes(query)) || // Fix for domain
            project.techStack.some((stack) =>
                stack.toLowerCase().includes(query)
            )
        );
    });
    renderCards(filteredProjects);
});

// ------------------------ Filter Functionality --------------------------------
// Populate domain filter options dynamically
function populateFilterOptions(projects) {
    const domainFilter = document.getElementById("domain-filter");
    const allDomains = new Set();

    // Collect all unique domains from projects
    projects.forEach((project) => {
        project.domain.forEach((domain) => allDomains.add(domain));
    });

    // Add each domain as an option in the filter dropdown
    allDomains.forEach((domain) => {
        const option = document.createElement("option");
        option.value = domain;
        option.textContent = domain;
        domainFilter.appendChild(option);
    });
}

// Filter projects based on selected domain
function filterProjectsByDomain(selectedDomain) {
    if (selectedDomain === "All") {
        renderCards(projects); // Show all projects
    } else {
        const filteredProjects = projects.filter((project) =>
            project.domain.includes(selectedDomain)
        );
        renderCards(filteredProjects);
    }
}

// Attach event listener to the filter dropdown
document.getElementById("domain-filter").addEventListener("change", (e) => {
    const selectedDomain = e.target.value;
    filterProjectsByDomain(selectedDomain);
});

// Initial setup
populateFilterOptions(projects); // Populate filter options
renderCards(projects); // Render all projects initially

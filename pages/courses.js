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

document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.getElementById("courses-container");
  const filterContainer = document.getElementById("filter-container");

  // Neon accent colors for different domains
  const accentColors = {
    "Software Development": "#4e342e",       // Deep Blue
    "Artificial Intelligence": "#6A1B9A",     // Deep Purple
    "Data Science": "#E11D48",               // Forest Green
    "Cybersecurity": "#e64a19",              // Burnt Orange
    "Programming": "#0277bd"
  };

  // Lighter Neon accent colors for different domains
  const lighterColors = {
    "Software Development": "#6d4c41",    // Indigo-200
    "Artificial Intelligence": "#8e24aa", // Blue-200
    "Data Science": "#FB7185",            // Emerald-200
    "Cybersecurity": "#ff5722",           // Orange-200
    "Programming": "#039be5"
  };

  // Fetch JSON data
  fetch("../files/courses.json")
    .then((response) => response.json())
    .then((coursesData) => {
      const domains = {};

      // Group courses by domain
      coursesData.forEach((course) => {
        if (!domains[course.domain]) {
          domains[course.domain] = [];
        }
        domains[course.domain].push(course);
      });

      // Add "Show All" button
      const allButton = document.createElement("a");
      allButton.innerText = "Show All";
      allButton.className = "filter active";
      allButton.dataset.filter = "all";
      allButton.style.marginRight = "15px";
      allButton.style.cursor = "pointer";
      filterContainer.appendChild(allButton);

      // Add filter buttons for each domain
      Object.keys(domains).forEach((domain) => {
        const filterButton = document.createElement("a");
        filterButton.innerText = domain;
        filterButton.className = "filter";
        filterButton.dataset.filter = domain;
        filterButton.style.marginRight = "15px";
        filterButton.style.cursor = "pointer";
        filterContainer.appendChild(filterButton);
      });

      // Create HTML for each domain
      Object.keys(domains).forEach((domain) => {
        // Create domain heading
        const domainHeading = document.createElement("div");
        domainHeading.className = `domain-heading`;
        domainHeading.dataset.domain = domain; // Attach dataset for easier filtering
        domainHeading.style.setProperty(
          "--neon-color",
          accentColors[domain] || "#fff"
        );
        domainHeading.innerText = domain;
        coursesContainer.appendChild(domainHeading);

        // Create container for the cards
        const domainSection = document.createElement("div");
        domainSection.className = `domain-container`;
        domainSection.dataset.domain = domain; // Attach dataset for easier filtering
        domainSection.style.display = "grid";
        domainSection.style.gridTemplateColumns = "repeat(3, 1fr)";
        domainSection.style.gap = "20px";

        // Create cards for each course
        domains[domain].forEach((course) => {
          const card = document.createElement("div");
          card.className = "card";
          card.style.setProperty(
            "--neon-color",
            accentColors[domain] || "#fff"
          );
          card.style.setProperty(
            "--lighter-neon-color",
            lighterColors[domain] || "#fff"
          );

          card.innerHTML = `
            <div class="heading">
              <img src="${course.orgLogo}" alt="Organization Logo">
              <div>
                ${
                  course.courseCode
                    ? `<p class="course-code">${course.courseCode}</p>`
                    : ""
                }
                ${
                  course.courseLink
                    ? `<a href="${course.courseLink}"><h3>${course.courseTitle}</h3></a>`
                    : `<h3>${course.courseTitle}</h3>`
                }
              </div>
            </div>
            <div class="meta">
              <ul>
                ${course.points.map((point) => `<li>${point}</li>`).join("")}
              </ul>
            </div>
            <div class="buttons">
              ${
                course.courseWorkLink
                  ? `<a href="${course.courseWorkLink}" target="_blank">
                      <button>Coursework</button>
                    </a>`
                  : ""
              }
              ${
                course.courseProjectLink
                  ? `<a href="${course.courseProjectLink}" target="_blank">
                      <button>Course Project</button>
                    </a>`
                  : ""
              }
            </div>
            <div class="footer">
              <hr>
              <div class="professor">
                <img src="${course.profImage}" alt="${course.profName}">
                <div>
                  <h4><a href="${course.profLink}" target="_blank">${course.profName}</a></h4>
                  <p>${course.profPosition}</p>
                </div>
              </div>
            </div>
          `;
          domainSection.appendChild(card);
        });

        // Append the domain container to the main container
        coursesContainer.appendChild(domainSection);
      });

      // Filter functionality
      const filterButtons = filterContainer.querySelectorAll(".filter");
      const domainHeadings = coursesContainer.querySelectorAll(".domain-heading");
      const domainSections = coursesContainer.querySelectorAll(".domain-container");

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Highlight the active filter
          filterButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          const filter = button.dataset.filter;

          // Show/Hide domains and their courses based on the filter
          domainHeadings.forEach((heading) => {
            if (filter === "all") {
              heading.style.display = "block";
            } else {
              heading.style.display = "none";
            }
          });

          domainSections.forEach((section) => {
            if (filter === "all" || section.dataset.domain === filter) {
              section.style.display = "grid";
            } else {
              section.style.display = "none";
            }
          });
        });
      });
    })
    .catch((error) => {
      console.error("Failed to fetch data:", error);
    });
});

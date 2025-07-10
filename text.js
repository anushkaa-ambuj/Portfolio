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

  const accentColors = {
    "Software Development": "#4e342e",
    "Artificial Intelligence": "#6A1B9A",
    "Data Science": "#E11D48",
    "Cybersecurity": "#e64a19",
    "Programming": "#0277bd"
  };

  const lighterColors = {
    "Software Development": "#6d4c41",
    "Artificial Intelligence": "#8e24aa",
    "Data Science": "#FB7185",
    "Cybersecurity": "#ff5722",
    "Programming": "#039be5"
  };

  function getYouTubeEmbedURL(url) {
    if (url.includes("youtube.com/playlist") && url.includes("list=")) {
      const listId = url.split("list=")[1].split("&")[0];
      return `https://www.youtube.com/embed/videoseries?list=${listId}`;
    } else {
      const videoId = getYouTubeVideoID(url);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return null;
  }

  function getYouTubeVideoID(url) {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  fetch("../files/courses.json")
    .then((response) => response.json())
    .then((coursesData) => {
      const domains = {};

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

      Object.keys(domains).forEach((domain) => {
        const domainHeading = document.createElement("div");
        domainHeading.className = `domain-heading`;
        domainHeading.dataset.domain = domain;
        domainHeading.style.setProperty("--neon-color", accentColors[domain] || "#fff");
        domainHeading.innerText = domain;
        coursesContainer.appendChild(domainHeading);

        const domainSection = document.createElement("div");
        domainSection.className = `domain-container`;
        domainSection.dataset.domain = domain;
        domainSection.style.display = "grid";
        domainSection.style.gridTemplateColumns = "repeat(3, 1fr)";
        domainSection.style.gap = "20px";

        domains[domain].forEach((course) => {
          const card = document.createElement("div");
          card.className = "card";
          card.style.setProperty("--neon-color", accentColors[domain] || "#fff");
          card.style.setProperty("--lighter-neon-color", lighterColors[domain] || "#fff");

          const isYouTube = course.courseLink && course.courseLink.includes("youtube.com");
          let videoEmbed = "";

          if (isYouTube) {
            const embedURL = getYouTubeEmbedURL(course.courseLink);
            if (embedURL) {
              videoEmbed = `
                <div class="video-embed">
                  <iframe width="100%" height="250px"
                    src="${embedURL}"
                    frameborder="0" 
                    allowfullscreen>
                  </iframe>
                </div>
              `;
            }
          }

          card.innerHTML = `
            <div class="body">
              ${videoEmbed}
              <div class="meta">
                <ul>
                  ${course.points.map((point) => `<li>${point}</li>`).join("")}
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <div class="heading">
                ${course.courseCode ? `<p class="course-code">${course.courseCode}</p>` : ""}
                ${course.courseLink
                  ? `<a href="${course.courseLink}" target="_blank"><h3>${course.courseTitle}</h3></a>`
                  : `<h3>${course.courseTitle}</h3>`
                }
              </div>
              <div class="footer-content">
                <div class="professor">
                  <img src="${course.profImage}" alt="${course.profName}">
                  <div>
                    <h4><a href="${course.profLink}" target="_blank">${course.profName}</a></h4>
                    <p>${course.profPosition}</p>
                  </div>
                </div>
                <div class="card-options">
                  <button class="dots-btn">⋮</button>
                  <div class="dropdown-menu">
                    ${course.repoLink ? `<a href="${course.repoLink}" target="_blank">My Repo</a>` : ""}
                    <a href="#">Save</a>
                    <a href="#">Share</a>
                    <a href="#">Report</a>
                  </div>
                </div>
              </div>
            </div>
          `;

          domainSection.appendChild(card);
        });

        coursesContainer.appendChild(domainSection);
      });

      const filterButtons = filterContainer.querySelectorAll(".filter");
      const domainHeadings = coursesContainer.querySelectorAll(".domain-heading");
      const domainSections = coursesContainer.querySelectorAll(".domain-container");

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          filterButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          const filter = button.dataset.filter;

          domainHeadings.forEach((heading) => {
            heading.style.display = filter === "all" || heading.dataset.domain === filter ? "block" : "none";
          });

          domainSections.forEach((section) => {
            section.style.display = filter === "all" || section.dataset.domain === filter ? "grid" : "none";
          });
        });
      });

      // ✅ DROPDOWN: Now the dots exist, so add listeners
      document.querySelectorAll('.dots-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const menu = this.nextElementSibling;
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
      });

      // ✅ Close all dropdowns when clicking outside
      document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
      });

    })
    .catch((error) => {
      console.error("Failed to fetch data:", error);
    });
});

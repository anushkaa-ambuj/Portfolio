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

document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.getElementById("courses-container");
  const filterContainer = document.getElementById("filter-container");

  const accentColors = {
    "Software Development": "#4e342e",
    "Artificial Intelligence": "#6A1B9A",
    "Data Science": "#E11D48",
    "Cybersecurity": "#e64a19",
    "Programming": "#0277bd",
    "CS Fundamentals": "#0D47A1"
  };

  const lighterColors = {
    "Software Development": "#6d4c41",
    "Artificial Intelligence": "#8e24aa",
    "Data Science": "#FB7185",
    "Cybersecurity": "#ff5722",
    "Programming": "#039be5",
    "CS Fundamentals": "#3949ab"
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

      // Group courses by domain
      coursesData.forEach((course) => {
        if (!domains[course.domain]) {
          domains[course.domain] = [];
        }
        domains[course.domain].push(course);
      });

      // Add "Show All" filter
      const allButton = document.createElement("a");
      allButton.innerText = "Show All";
      allButton.className = "filter active";
      allButton.dataset.filter = "all";
      allButton.style.marginRight = "15px";
      filterContainer.appendChild(allButton);

      // Add domain filters
      Object.keys(domains).forEach((domain) => {
        const filterButton = document.createElement("a");
        filterButton.innerText = domain;
        filterButton.className = "filter";
        filterButton.dataset.filter = domain;
        filterButton.style.marginRight = "15px";
        filterContainer.appendChild(filterButton);
      });

      // Generate course cards
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

        domains[domain].forEach((course) => {
          const card = document.createElement("div");
          card.className = "card";
          card.setAttribute("data-aos", "zoom-in"); // Add AOS animation
          card.style.setProperty("--neon-color", accentColors[domain] || "#fff");
          card.style.setProperty("--lighter-neon-color", lighterColors[domain] || "#fff");

          const isYouTube = course.courseLink && course.courseLink.includes("youtube.com");
          let mediaEmbed = "";

          if (isYouTube) {
            const embedURL = getYouTubeEmbedURL(course.courseLink);
            if (embedURL) {
              mediaEmbed = `
                <div class="video-embed">
                  <iframe width="100%" height="250"
                    src="${embedURL}"
                    frameborder="0" 
                    allowfullscreen>
                  </iframe>
                </div>
              `;
            }
          } else if (course.bannerImg) {
            mediaEmbed = `
              <div class="banner">
                <img src="${course.bannerImg}" alt="${course.courseTitle} Banner">
              </div>
            `;
          }

          card.innerHTML = `
            <div class="body">
              ${mediaEmbed}
              <div class="meta">
                ${course.meta && course.meta.description 
                  ? `<p class="description">${course.meta.description}</p>` : ""}
                ${course.meta && course.meta.points && course.meta.points.length > 0 
                  ? `<ul>${course.meta.points.map(point => `<li>${point}</li>`).join('')}</ul>` : ""}
              </div>
            </div>

            <div class="footer">
              <div class="heading">
                ${course.courseLink
                  ? `<a href="${course.courseLink}" target="_blank"><h3>${course.courseTitle}</h3></a>`
                  : `<h3>${course.courseTitle}</h3>`}
              </div>

              <div class="footer-content">
                <div class="professor">
                  ${course.prof.image ? `<img src="${course.prof.image || ""}" alt="${course.prof.title || ""}">` :
                    `<img src="${course.orgLogo || ""}" alt="${course.prof.subtitle || ""}">` 
                  }
                  <div>
                    <h4><a href="${course.prof.link || "#"}" target="_blank">${course.prof.title || ""}</a></h4>
                    <p>${course.prof.subtitle || ""}</p>
                  </div>
                </div>

                ${(course.repoLink || course.demoLink || course.docLink || course.videoLink) ? `
                <div class="card-options">
                  <button class="dots-btn">⋮</button>
                  <div class="dropdown-menu">
                    ${course.repoLink ? `<a href="${course.repoLink}" target="_blank"><i class="fa-solid fa-code-branch"></i> My Repo</a>` : ""}
                    ${course.demoLink ? `<a href="${course.demoLink}" target="_blank"><i class="fa-solid fa-display"></i> Live Demo</a>` : ""}
                    ${course.docLink ? `<a href="${course.docLink}" target="_blank"><i class="fa-solid fa-book"></i> Docs</a>` : ""}
                    ${course.videoLink ? `<a href="${course.videoLink}" target="_blank"><i class="fa-brands fa-youtube"></i> Video</a>` : ""}
                  </div>
                </div>
              ` : ``}

              </div>
            </div>
          `;

          domainSection.appendChild(card);
        });

        coursesContainer.appendChild(domainSection);
      });

      // Filter logic
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

      // Dropdown toggle logic
      document.querySelectorAll('.dots-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const menu = this.nextElementSibling;
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
      });

      document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
      });

      // ✅ Initialize AOS animations
      AOS.init({
        duration: 800,
        once: true
      });

    })
    .catch((error) => {
      console.error("Failed to fetch data:", error);
    });
});

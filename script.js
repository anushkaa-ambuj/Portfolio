AOS.init({
  duration: 1200,
  once: true,
});

// Sticky Navigation Menu
// Show/hide sticky navigation and scroll button based on scroll position
window.addEventListener('DOMContentLoaded', () => {
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
});


// Side Navigation Menu
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");

// Open side navigation
menuBtn.onclick = function () {
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
  if (scrollBtn) scrollBtn.style.pointerEvents = "none";
};

const hideNavMenu = () => {
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  if (scrollBtn) scrollBtn.style.pointerEvents = "auto";
};

// Close side navigation
cancelBtn.onclick = hideNavMenu;

// Close side navigation when a menu link is clicked
let navLinks = document.querySelectorAll(".menu li a");
navLinks.forEach((link) => {
  link.addEventListener("click", hideNavMenu);
});

// Tab functionality
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
        tabcontents[i].classList.remove("active");
    }

    document.getElementById(tabname).classList.add("active");
    for (var i = 0; i < tablinks.length; i++) {
        if (tabcontents[i].classList.contains("active")) {
            tablinks[i].classList.add("active");
        }
    }
}

// Projects Carousel
// const carousel = document.querySelector('.project-list');
// const leftButton = document.getElementById('leftButton');
// const rightButton = document.getElementById('rightButton');

// leftButton.addEventListener('click', () => {
//     carousel.scrollBy({
//         left: -carousel.clientWidth / 2,
//         behavior: 'smooth'
//     });
// });

// rightButton.addEventListener('click', () => {
//     carousel.scrollBy({
//         left: carousel.clientWidth / 2,
//         behavior: 'smooth'
//     });
// });

// Carousel setup
const carousel = document.querySelector('.project-list');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const paginationDots = document.getElementById('paginationDots');

let currentPage = 0;

function getVisibleItems() {
  const itemWidth = carousel.children[0].offsetWidth;
  return Math.max(1, Math.floor(carousel.offsetWidth / itemWidth));
}

function getTotalPages() {
  const totalItems = carousel.children.length;
  return Math.ceil(totalItems / getVisibleItems());
}

function scrollToPage(index) {
  carousel.scrollTo({
    left: index * carousel.clientWidth,
    behavior: 'smooth'
  });
  updateDots(index);
  currentPage = index;
}

function updateDots(activeIndex) {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === activeIndex);
  });
}

function renderDots() {
  paginationDots.innerHTML = ''; // Clear old dots
  const pages = getTotalPages();
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === currentPage) dot.classList.add('active');
    dot.addEventListener('click', () => scrollToPage(i));
    paginationDots.appendChild(dot);
  }
}

// Carousel Nav buttons
leftButton.addEventListener('click', () => {
  const totalPages = getTotalPages();
  currentPage = (currentPage - 1 + totalPages) % totalPages;
  scrollToPage(currentPage);
});

rightButton.addEventListener('click', () => {
  const totalPages = getTotalPages();
  currentPage = (currentPage + 1) % totalPages;
  scrollToPage(currentPage);
});

// Initial render and update on resize
function setupCarousel() {
  renderDots();
  scrollToPage(0); // Reset to first page on resize
}

window.addEventListener('resize', setupCarousel);
window.addEventListener('load', setupCarousel);


// Adding Random Color to the Techstack icons
const colors = [
  "#ec4899", // Hot Pink
  "#22c55e",  // Bright Lime Green
  "#0ea5e9", // Sky Blue 
  "#fb923c", // Bright Orange 
  "#8b5cf6", // Violet 
  "#ef4444", // Red 
  "#facc15", // Yellow 
  "#06b6d4", // Aqua 
  "#6366f1", // Indigo
  "#14b8a6", // Mint Teal 
  "#2563eb"  // Royal Blue 
];

document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".item-logo i");
  icons.forEach((icon, index) => {
    const color = colors[index % colors.length];
    icon.style.color = color;
  });
});

// Publications Section
window.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const items = Array.from(track.children);

  // Clone the items for seamless looping
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
});

// Contact Section
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const serviceID = "service_kw28lte";
  const templateID = "template_8gdvvju";

  emailjs.sendForm(serviceID, templateID, this)
    .then(function(response) {
      Swal.fire({
        title: '🎉 Message Sent!',
        text: 'Thanks for reaching out. I’ll get back to you shortly!',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Awesome!',
        customClass: {
          popup: 'custom-popup',
          confirmButton: 'custom-confirm'
        }
      });

      document.getElementById('contact-form').reset();
    }, function(error) {
      Swal.fire({
        title: '😕 Oops!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Okay',
        customClass: {
          popup: 'custom-popup',
          confirmButton: 'custom-confirm'
        }
      });
    });
});

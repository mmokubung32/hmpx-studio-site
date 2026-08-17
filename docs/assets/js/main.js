  function go(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('page-' + id);
    if (pg) { pg.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
    setTimeout(initFU, 80);
    closeMenu();
  }

  function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const burger = document.getElementById('navburger');
    if (!menu) return;
    const isOpen = menu.classList.toggle('open');
    backdrop.classList.toggle('open', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const burger = document.getElementById('navburger');
    if (!menu || !menu.classList.contains('open')) return;
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeMenu();
  });
  function initFU() {
    const els = document.querySelectorAll('.page.active .fu:not(.in)');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => { e.target.classList.add('in'); obs.unobserve(e.target); }, i * 65); }
      });
    }, { threshold: 0.07 });
    els.forEach(el => obs.observe(el));
  }

  const form = document.getElementById("contact-form");

  if (form) {

      const button = form.querySelector("button");

      form.addEventListener("submit", async function (e) {

          e.preventDefault();

          button.disabled = true;
          button.textContent = "Sending...";

          try {

              const formData = new FormData(form);

              const response = await fetch("/", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: new URLSearchParams(formData).toString()
              });

              if (response.ok) {

                  button.textContent = "✓ Message Sent";
                  button.style.background = "#16a34a";

                  form.reset();

                  setTimeout(() => {
                      button.textContent = "Send Message →";
                      button.disabled = false;
                      button.style.background = "";
                  }, 3000);

              } else {

                  throw new Error("Submission failed");

              }

          } catch (error) {

              console.error(error);

              button.textContent = "Try Again";
              button.style.background = "#dc2626";

              setTimeout(() => {
                  button.textContent = "Send Message →";
                  button.disabled = false;
                  button.style.background = "";
              }, 3000);

              alert("Sorry, your message could not be sent. Please try again.");

          }

      });

  }

  window.addEventListener('scroll', () => {
    document.getElementById('mn').classList.toggle('sc', window.scrollY > 40);
  });
  document.addEventListener('DOMContentLoaded', initFU);

const images = document.querySelectorAll(".responsive-image");
const viewer = document.getElementById("imageViewer");
const fullScreenImage = document.getElementById("fullScreenImage");
const closeViewer = document.getElementById("closeViewer");
const ivPrev = document.getElementById("ivPrev");
const ivNext = document.getElementById("ivNext");
const ivCounter = document.getElementById("ivCounter");
const ivDots = document.getElementById("ivDots");

let galleryImages = [];
let galleryIndex = 0;

function parseGallery(imgEl) {
  let list = [];
  if (imgEl.dataset.gallery) {
    try { list = JSON.parse(imgEl.dataset.gallery); } catch (e) { list = []; }
  }
  if (!list || !list.length) list = [imgEl.getAttribute("src")];
  return list;
}

function renderViewer() {
  fullScreenImage.src = galleryImages[galleryIndex];
  const multi = galleryImages.length > 1;

  ivPrev.style.display = multi ? "flex" : "none";
  ivNext.style.display = multi ? "flex" : "none";
  ivCounter.style.display = multi ? "block" : "none";
  ivDots.style.display = multi ? "flex" : "none";

  if (multi) {
    ivCounter.textContent = (galleryIndex + 1) + " / " + galleryImages.length;
    ivDots.innerHTML = "";
    galleryImages.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "iv-dot" + (i === galleryIndex ? " active" : "");
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        galleryIndex = i;
        renderViewer();
      });
      ivDots.appendChild(dot);
    });
  }
}

function openViewer(imgEl) {
  galleryImages = parseGallery(imgEl);
  const clickedSrc = imgEl.getAttribute("src");
  const idx = galleryImages.indexOf(clickedSrc);
  galleryIndex = idx >= 0 ? idx : 0;
  viewer.style.display = "flex";
  renderViewer();
}

function showNext() {
  if (galleryImages.length < 2) return;
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  renderViewer();
}

function showPrev() {
  if (galleryImages.length < 2) return;
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  renderViewer();
}

images.forEach(image => {
    image.addEventListener("click", function(e) {
        e.stopPropagation(); // prevents the click from reaching the viewer
        openViewer(this);
    });
});

closeViewer.addEventListener("click", function(e) {
    e.stopPropagation();
    viewer.style.display = "none";
});

viewer.addEventListener("click", function(e) {
    if (e.target === viewer) {
        viewer.style.display = "none";
    }
});

ivNext.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });
ivPrev.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });

document.addEventListener("keydown", (e) => {
  if (viewer.style.display !== "flex") return;
  if (e.key === "ArrowRight") showNext();
  else if (e.key === "ArrowLeft") showPrev();
  else if (e.key === "Escape") viewer.style.display = "none";
});

// Swipe support (touch)
let ivTouchStartX = null;
viewer.addEventListener("touchstart", (e) => {
  ivTouchStartX = e.changedTouches[0].clientX;
}, { passive: true });

viewer.addEventListener("touchend", (e) => {
  if (ivTouchStartX === null) return;
  const dx = e.changedTouches[0].clientX - ivTouchStartX;
  if (Math.abs(dx) > 40) { dx < 0 ? showNext() : showPrev(); }
  ivTouchStartX = null;
}, { passive: true });
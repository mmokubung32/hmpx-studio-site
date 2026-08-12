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

images.forEach(image => {
    image.addEventListener("click", function(e) {
        e.stopPropagation(); // prevents the click from reaching the viewer
        
        viewer.style.display = "flex";
        fullScreenImage.src = this.src;
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
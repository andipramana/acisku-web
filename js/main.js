(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Footer year ----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Navbar glass on scroll ----
  const navbar = document.getElementById("navbar");
  const onNavScroll = () => {
    if (window.scrollY > 12) navbar.classList.add("is-scrolled");
    else navbar.classList.remove("is-scrolled");
  };
  onNavScroll();
  window.addEventListener("scroll", onNavScroll, { passive: true });

  // ---- Mobile menu ----
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    const openMenu = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      mobileMenu.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  if (prefersReducedMotion) return; // skip parallax/tilt/cursor-glow entirely

  // ---- Cursor glow (desktop only) ----
  const cursorGlow = document.querySelector(".cursor-glow");
  if (cursorGlow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let glowActive = false;
    window.addEventListener(
      "pointermove",
      (e) => {
        cursorGlow.style.setProperty("--mx", `${e.clientX}px`);
        cursorGlow.style.setProperty("--my", `${e.clientY}px`);
        if (!glowActive) {
          cursorGlow.classList.add("is-active");
          glowActive = true;
        }
      },
      { passive: true }
    );
  }

  // ---- Parallax on scroll (hero landscape layers) ----
  const parallaxLayers = document.querySelectorAll(".parallax-layer");
  const hero = document.querySelector(".hero");
  let ticking = false;

  const updateScrollParallax = () => {
    ticking = false;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = -rect.top; // px scrolled past hero top
    parallaxLayers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed || "0.1");
      layer.style.transform = `translate3d(0, ${progress * speed * 0.35}px, 0)`;
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollParallax);
        ticking = true;
      }
    },
    { passive: true }
  );

  // ---- Mouse parallax + 3D tilt on hero visual ----
  const heroVisual = document.getElementById("heroVisual");
  const phoneMock = document.getElementById("phoneMock");
  // NOTE: .floating-card / .floating-dot / .floating-spark carry a CSS
  // `animation` that drives `transform` (bob / spin-slow). Writing an inline
  // style.transform on those same elements would fight the CSS animation for
  // the `transform` property and cause visible jitter. So the mouse-tilt
  // effect below only ever writes to each element's inner `.floating-tilt`
  // wrapper, which has no CSS animation of its own — data-speed still lives
  // on the outer element.
  const floaters = Array.from(
    document.querySelectorAll(".floating-card, .floating-dot, .floating-spark")
  ).map((el) => ({
    speed: parseFloat(el.dataset.speed || "0.3"),
    target: el.querySelector(".floating-tilt") || el,
  }));

  if (heroVisual && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let rafId = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    heroVisual.addEventListener("pointermove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    heroVisual.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (phoneMock) {
        phoneMock.style.setProperty("--rx", `${6 - currentY * 14}deg`);
        phoneMock.style.setProperty("--ry", `${-10 + currentX * 20}deg`);
      }
      floaters.forEach(({ speed, target }) => {
        target.style.setProperty("--tilt-x", `${currentX * 30 * speed}px`);
        target.style.setProperty("--tilt-y", `${currentY * 30 * speed}px`);
        target.style.transform = `translate(var(--tilt-x, 0), var(--tilt-y, 0))`;
      });

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }
  }
})();

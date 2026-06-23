const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionLinks = navLinks.filter((link) => {
  const href = link.getAttribute("href") || "";
  return href.startsWith("#");
});
const pageLinks = navLinks.filter((link) => link.dataset.pageLink);
const reveals = [...document.querySelectorAll(".reveal")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const currentYear = document.querySelector("#current-year");
const currentPage = document.body.dataset.page;

const syncHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 10);
};

const closeMenu = () => {
  if (!header || !navToggle) {
    return;
  }

  header.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const syncPageLinkState = () => {
  pageLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.pageLink === currentPage);
  });
};

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

if (reveals.length) {
  const revealVisibleItems = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    reveals.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < viewportHeight * 0.92 && rect.bottom > 0;

      if (isVisible) {
        item.classList.add("is-visible");
      }
    });
  };

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  reveals.forEach((item) => revealObserver.observe(item));
  window.addEventListener("load", revealVisibleItems, { once: true });
  window.addEventListener("scroll", revealVisibleItems, { passive: true });
  requestAnimationFrame(revealVisibleItems);
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionLinks.forEach((link) => {
          const targetId = link.getAttribute("href");
          const isMatch = targetId === `#${entry.target.id}`;
          link.classList.toggle("is-active", isMatch);
        });

        syncPageLinkState();
      });
    },
    {
      threshold: 0.45,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  syncPageLinkState();
}

if (contactForm && feedback && contactForm.dataset.demo === "true") {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      feedback.textContent =
        "\uD544\uC218 \uD56D\uBAA9\uC744 \uBA3C\uC800 \uC785\uB825\uD574\uC8FC\uC138\uC694.";
      return;
    }

    feedback.textContent =
      "\uB370\uBAA8 \uD398\uC774\uC9C0\uC774\uBBC0\uB85C \uC2E4\uC81C \uC804\uC1A1\uC740 \uC774\uB8CC\uC5D0\uC9C0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC6B4\uC601 \uB2E8\uACC4\uC5D0\uC11C\uB294 \uBA54\uC77C \uB610\uB294 CRM \uC5F0\uB3D9\uC73C\uB85C \uBC14\uB85C \uD655\uC7A5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.";
    contactForm.reset();
  });
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

syncPageLinkState();
syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

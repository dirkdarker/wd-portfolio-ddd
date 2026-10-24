(() => {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const navList = document.querySelector(".nav-links");

  function setMenu(open) {
    navList.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  }
  menuBtn.addEventListener("click", () => setMenu(!navList.classList.contains("open")));
  navList.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Highlight the menu item for the section in view ---------- */
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Works: index rows filter the gallery ---------- */
  const rows = [...document.querySelectorAll(".index-row")];
  const cards = [...document.querySelectorAll(".polaroid")];
  const label = document.getElementById("works-label");
  const empty = document.getElementById("works-empty");
  const layout = document.getElementById("works-layout");
  const desc = document.getElementById("works-desc");

  rows.forEach((row) =>
    row.addEventListener("click", () => {
      const turningOff = row.getAttribute("aria-pressed") === "true";
      const f = turningOff ? "all" : row.dataset.filter;

      rows.forEach((r) => r.setAttribute("aria-pressed", String(!turningOff && r === row)));
      let shown = 0;
      cards.forEach((c) => {
        c.hidden = f !== "all" && c.dataset.category !== f;
        if (!c.hidden) shown++;
      });
      label.textContent = turningOff ? "all works" : row.querySelector(".t").textContent.replace(/^\d+\.\s*/, "");
      empty.classList.toggle("show", shown === 0);

      const text = turningOff ? "" : row.dataset.desc || "";
      desc.querySelector("p").textContent = text;
      desc.hidden = !text;
      layout.classList.toggle("has-desc", Boolean(text));

      document.querySelector(".works-body").scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  /* ---------- Works: click an item to enlarge it ---------- */
  const box = document.querySelector(".lightbox");
  const boxImg = box.querySelector("img");
  const boxCap = box.querySelector(".caption");

  cards.forEach((card) =>
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      if (!img || !img.naturalWidth) return; // skip if the picture is missing
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      boxCap.textContent = card.querySelector("figcaption").textContent;
      box.showModal();
    })
  );
  box.querySelector(".close").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });

  /* ---------- Contact form ---------- */
  const form = document.querySelector("form");
  const status = document.querySelector(".form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;

    form.querySelectorAll("input, textarea").forEach((f) => {
      const bad = !f.value.trim() || !f.checkValidity();
      f.setAttribute("aria-invalid", String(bad));
      if (bad && !firstBad) firstBad = f;
    });

    if (firstBad) {
      status.textContent = "Please fill in the highlighted fields.";
      firstBad.focus();
      return;
    }

    // Opens the visitor's email app. For a real inbox form, swap this for Formspree.
    const name = form.elements.name.value.trim();
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(
      form.elements.message.value.trim() + "\n\n" + name + "\n" + form.elements.email.value.trim()
    );
    status.textContent = "Opening your email app…";
    location.href = "mailto:" + (form.dataset.email || "you@example.com") + "?subject=" + subject + "&body=" + body;
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

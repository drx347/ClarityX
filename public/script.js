const modal = document.querySelector("#script-modal");
const tutorialModal = document.querySelector("#tutorial-modal");
const modalTitle = document.querySelector("#modal-title");
const modalType = document.querySelector("#modal-type");
const modalStatus = document.querySelector("#modal-status");
const modalCode = document.querySelector("#modal-code");
const tutorialTitle = document.querySelector("#tutorial-title");
const tutorialContent = document.querySelector("#tutorial-content");
const copyButton = document.querySelector("[data-copy-script]");
const cardActions = document.querySelectorAll("[data-card-action]");
const scriptCards = document.querySelectorAll(".script-card");
const scriptSearch = document.querySelector("#script-search");
const filterButtons = document.querySelectorAll("[data-filter]");
const emptyState = document.querySelector("#empty-state");
const closeButtons = document.querySelectorAll("[data-close-modal]");
const closeTutorialButtons = document.querySelectorAll("[data-close-tutorial]");

let activeScript = "";
let activeTutorial = "";
let tutorialTimers = [];
let activeFilter = "all";
let lastScrollY = window.scrollY;
const filterMotionMs = 190;

// Logika Hide Header saat Scroll
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 0) return;

    const isScrollingDown = currentScrollY > lastScrollY;
    const shouldHide = currentScrollY > 60 && isScrollingDown;
    
    navbar.classList.toggle("is-hidden", shouldHide);
    lastScrollY = currentScrollY;
  }, { passive: true });
}

function clearTutorialTimers() {
  tutorialTimers.forEach((timer) => window.clearTimeout(timer));
  tutorialTimers = [];
}

function queueTutorialStep(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  tutorialTimers.push(timer);
}

function getCardData(card) {
  const scriptTemplate = card.querySelector("[data-script-content]");
  const tutorialTemplate = card.querySelector("[data-tutorial-content]");
  const scriptStatus = card.dataset.scriptStatus || "Work";

  return {
    script: scriptTemplate ? scriptTemplate.content.textContent.trim() : "",
    tutorial: tutorialTemplate ? tutorialTemplate.content.textContent.trim() : "",
    status: scriptStatus,
    title: card.dataset.scriptTitle || "Untitled Script",
    type: card.dataset.scriptType || "Script",
  };
}

function openScriptModal(card) {
  const cardData = getCardData(card);

  activeScript = cardData.script;
  activeTutorial = cardData.tutorial;
  modalTitle.textContent = cardData.title;
  modalType.textContent = cardData.type;
  modalStatus.textContent = cardData.status;
  modalStatus.className = `status-badge ${cardData.status.toLowerCase()}`;
  modalCode.textContent = activeScript;
  tutorialTitle.textContent = `Tutorial: ${cardData.title}`;
  tutorialContent.textContent = activeTutorial || "Tulis catatan penggunaan script ini di template data-tutorial-content.";
  copyButton.classList.remove("is-copied");
  copyButton.querySelector(".copy-label").textContent = "Copy Script";
  modal.classList.remove("is-copying", "is-tutorial", "is-done");
  clearTutorialTimers();

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeScriptModal() {
  clearTutorialTimers();
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!tutorialModal.classList.contains("is-open")) {
    document.body.style.overflow = "";
  }
}

function openTutorialModal() {
  tutorialModal.classList.add("is-open");
  tutorialModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeTutorialModal() {
  tutorialModal.classList.remove("is-open");
  tutorialModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function continueToTutorial() {
  modal.classList.add("is-copying");
  copyButton.classList.add("is-copied");
  copyButton.querySelector(".copy-label").textContent = "Copied";

  clearTutorialTimers();
  queueTutorialStep(() => {
    modal.classList.add("is-tutorial");
  }, 260);

  queueTutorialStep(() => {
    modal.classList.add("is-done");
    copyButton.querySelector(".copy-label").textContent = "Done";
  }, 580);

  queueTutorialStep(() => {
    closeScriptModal();
    openTutorialModal();
  }, 940);
}

function getSearchText(card) {
  return [
    card.dataset.scriptTitle,
    card.dataset.scriptType,
    card.dataset.scriptStatus,
    card.querySelector(".script-tag")?.textContent,
    card.querySelector("h3")?.textContent,
    card.querySelector("p")?.textContent,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function filterScripts() {
  const query = scriptSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  scriptCards.forEach((card, index) => {
    const status = (card.dataset.scriptStatus || "").toLowerCase();
    const matchesFilter = activeFilter === "all" || status === activeFilter;
    const matchesSearch = !query || getSearchText(card).includes(query);
    const isVisible = matchesFilter && matchesSearch;

    if (isVisible) {
      visibleCount += 1;
      card.hidden = false;
      card.style.setProperty("--motion-order", index);
      card.classList.remove("is-leaving", "is-hidden");
      card.classList.add("is-entering");

      window.setTimeout(() => {
        card.classList.remove("is-entering");
      }, filterMotionMs);
    } else if (!card.hidden) {
      card.classList.remove("is-entering");
      card.classList.add("is-leaving");

      window.setTimeout(() => {
        card.hidden = true;
        card.classList.remove("is-leaving");
        card.classList.add("is-hidden");
      }, filterMotionMs);
    } else {
      card.classList.add("is-hidden");
    }
  });

  emptyState.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    filterScripts();
  });
});

scriptSearch.addEventListener("input", filterScripts);

cardActions.forEach((button) => {
  button.addEventListener("click", () => {
    openScriptModal(button.closest(".script-card"));
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeScriptModal);
});

closeTutorialButtons.forEach((button) => {
  button.addEventListener("click", closeTutorialModal);
});

copyButton.addEventListener("click", async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(activeScript);
    } else {
      const fallback = document.createElement("textarea");
      fallback.value = activeScript;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      fallback.remove();
    }

    continueToTutorial();
  } catch {
    copyButton.querySelector(".copy-label").textContent = "Copy failed";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && tutorialModal.classList.contains("is-open")) {
    closeTutorialModal();
    return;
  }

  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeScriptModal();
  }
});

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
const closeButtons = document.querySelectorAll("[data-close-modal]");
const closeTutorialButtons = document.querySelectorAll("[data-close-tutorial]");

let activeScript = "";
let activeTutorial = "";
let tutorialTimer = null;

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
  modal.classList.remove("is-copied");
  clearTimeout(tutorialTimer);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeScriptModal() {
  clearTimeout(tutorialTimer);
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
  modal.classList.add("is-copied");
  copyButton.classList.add("is-copied");
  copyButton.querySelector(".copy-label").textContent = "Copied";

  clearTimeout(tutorialTimer);
  tutorialTimer = setTimeout(() => {
    closeScriptModal();
    openTutorialModal();
  }, 450);
}

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

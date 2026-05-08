const modal = document.querySelector("#script-modal");
const modalTitle = document.querySelector("#modal-title");
const modalType = document.querySelector("#modal-type");
const modalStatus = document.querySelector("#modal-status");
const modalCode = document.querySelector("#modal-code");
const copyButton = document.querySelector("[data-copy-script]");
const cardActions = document.querySelectorAll("[data-card-action]");
const closeButtons = document.querySelectorAll("[data-close-modal]");

let activeScript = "";

function getCardData(card) {
  const scriptTemplate = card.querySelector("[data-script-content]");
  const scriptStatus = card.dataset.scriptStatus || "Work";

  return {
    script: scriptTemplate ? scriptTemplate.content.textContent.trim() : "",
    status: scriptStatus,
    title: card.dataset.scriptTitle || "Untitled Script",
    type: card.dataset.scriptType || "Script",
  };
}

function openScriptModal(card) {
  const cardData = getCardData(card);

  activeScript = cardData.script;
  modalTitle.textContent = cardData.title;
  modalType.textContent = cardData.type;
  modalStatus.textContent = cardData.status;
  modalStatus.className = `status-badge ${cardData.status.toLowerCase()}`;
  modalCode.textContent = activeScript;
  copyButton.classList.remove("is-copied");
  copyButton.querySelector(".copy-label").textContent = "Copy Script";
  modal.classList.remove("is-copied");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeScriptModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

cardActions.forEach((button) => {
  button.addEventListener("click", () => {
    openScriptModal(button.closest(".script-card"));
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeScriptModal);
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

    modal.classList.add("is-copied");
    copyButton.classList.add("is-copied");
    copyButton.querySelector(".copy-label").textContent = "Copied";
  } catch {
    copyButton.querySelector(".copy-label").textContent = "Copy failed";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeScriptModal();
  }
});

const QUERIES = {
  videoPlayer: "ytd-player",
  controls: ".ytp-right-controls",
  fullscreenBtn: ".ytp-fullscreen-button",
  sizeBtn: ".ytp-size-button",
};

const BUTTON_CLASSES = ["ywf-button", "ytp-button"];
const LOADED_ATTRIBUTE = "ywf-active";
const SHORTCUT_KEY = "w";

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener(
  "keydown",
  (e) => {
    // capture theater mode toggle to prevent style issues
    if (e.key === "t") {
      const videoPlayer = document.querySelector(QUERIES.videoPlayer);
      if (videoPlayer) {
        const isActive = videoPlayer.hasAttribute(LOADED_ATTRIBUTE);
        if (isActive) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    } else if (e.key.toLowerCase() === SHORTCUT_KEY) {
      if (!isOnCorrectPage()) return;
      const button = document.querySelector(`.${BUTTON_CLASSES[0]}`);
      if (button) button.click();
    }
  },
  { capture: true, passive: false }
);

(async () => {
  while (true) {
    const controls = document.querySelector(
      `${QUERIES.controls}:not(:has(.ywf-button))`
    );
    const fullscreenBtn = document.querySelector(QUERIES.fullscreenBtn);
    if (!controls || !fullscreenBtn) {
      await wait(500);
      continue;
    }

    const button = createButton();
    let wasTheater = isInTheaterMode();
    button.addEventListener("click", () => {
      const player = document.querySelector(QUERIES.videoPlayer);
      const isActive = player.toggleAttribute(LOADED_ATTRIBUTE);

      // return to correct mode after closing
      const isTheater = isInTheaterMode();
      if ((!isTheater && isActive) || (!wasTheater && !isActive)) {
        const sizeBtn = document.querySelector(QUERIES.sizeBtn);
        if (sizeBtn) sizeBtn.click();
      }
      wasTheater = isTheater;
    });

    controls.insertBefore(button, fullscreenBtn);
  }
})();

function createButton(title = "Windowed Fullscreen") {
  const button = document.createElement("button");
  title = `${title} (${SHORTCUT_KEY})`;
  button.setAttribute("data-title-no-tooltip", title);
  button.setAttribute("aria-label", title);
  button.setAttribute("title", title);
  button.setAttribute("aria-keyshortcuts", SHORTCUT_KEY);
  button.classList.add(...BUTTON_CLASSES);

  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%" class="style-scope ytd-player ytp-svg-fill" style="padding: 15%; box-sizing: border-box;"><title>fit-to-screen-outline</title><path d="M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z" /></svg>`;
  return button;
}

function isInTheaterMode() {
  const isTheater = document.querySelector(
    `#player-theater-container ${QUERIES.videoPlayer}`
  );

  return !!isTheater;
}

function isOnCorrectPage() {
  return window.location.pathname.startsWith("/watch");
}

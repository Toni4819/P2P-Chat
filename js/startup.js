// startup.js

import { PeerManager, localPeerId } from "./peer/utils/PeerManager.js";

window.addEventListener("DOMContentLoaded", () => {
  // === Overlay ===
  const overlay = document.createElement("div");
  overlay.id = "startOverlay";
  overlay.style = `
    position: fixed;
    inset: 0;
    background: #111;
    color: white;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    z-index: 999999;
    flex-direction: column;
  `;

  overlay.innerHTML = `
    <p>Tap to start</p>
    <button id="startButton" style="
      padding: 12px 24px;
      font-size: 20px;
      border-radius: 8px;
      border: none;
      background: #4caf50;
      color: white;
    ">Start</button>
  `;

  document.body.appendChild(overlay);

  function showStartOverlay() {
    overlay.style.display = "flex";
  }

  let autoStarted = false;

  try {
    PeerManager.init(() => {
      autoStarted = true;
      console.log("PeerJS auto-start OK:", localPeerId);
      window.appStart(); // ← ICI
    });

    setTimeout(() => {
      if (!autoStarted) {
        console.warn("Auto-start failed → showing Start button");
        showStartOverlay();
      }
    }, 300);
  } catch (e) {
    console.warn("Auto-start error → showing Start button", e);
    showStartOverlay();
  }

  document.getElementById("startButton").onclick = () => {
    PeerManager.init(() => {
      console.log("PeerJS started after user interaction:", localPeerId);
      overlay.remove();
      window.appStart(); // ← ICI
    });
  };
});

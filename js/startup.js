// startup.js

import { PeerManager } from "./peer/utils/PeerManager.js";

window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.id = "startOverlay";
  overlay.style = `
    position: fixed;
    inset: 0;
    background: #111;
    color: white;
    display: flex;
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

  // IMPORTANT : PeerManager.init() est préparé mais pas exécuté
  PeerManager.prepare();

  document.getElementById("startButton").onclick = () => {
    console.log("User interaction → starting PeerJS");

    PeerManager.start(() => {
      overlay.remove();

      window.appStart();

      const url = new URL(location.href);
      const peer = url.searchParams.get("peer");

      if (peer) {
        PeerManager.connect(peer, () => {
          window.openChat(peer, "Unknown");
        });
      }
    });
  };
});

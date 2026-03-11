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

  // === Start only after user interaction (iPad requirement) ===
  document.getElementById("startButton").onclick = () => {
    PeerManager.init(() => {
      console.log("PeerJS started:", localPeerId);
      overlay.remove();

      const url = new URL(location.href);
      const peer = url.searchParams.get("peer");

      // Start the app UI
      window.appStart();

      // Auto-connect if ?peer=xxx is in URL
      if (peer) {
        console.log("Auto-connecting to peer:", peer);
        PeerManager.connect(peer, () => {
          window.openChat(peer, "Unknown");
        });
      }
    });
  };
});

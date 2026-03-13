// startup.js
import { PeerManager } from "./peer/utils/PeerManager.js";

window.addEventListener("DOMContentLoaded", () => {

  // 1) Vérifier si PeerJS tourne déjà (sans créer de Peer)
  const peerAlreadyRunning =
    window.Peer &&
    Array.isArray(window.Peer._instances) &&
    window.Peer._instances.length > 0;

  if (peerAlreadyRunning) {
    console.log("PeerJS déjà actif → lancement UI");
    window.appStart();
    return;
  }

  // 2) Charger ou créer peerjs_id (string simple)
  let peerId = localStorage.getItem("peerjs_id");
  if (!peerId) {
    peerId = crypto.randomUUID();
    localStorage.setItem("peerjs_id", peerId);
  }

  // 3) Overlay iOS (nécessaire pour autoriser WebRTC)
  const overlay = document.createElement("div");
  overlay.style = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    z-index: 999999;
  `;
  overlay.textContent = "Click to start";
  document.body.appendChild(overlay);

  // 4) Tentative auto-start (IMPORTANT : init doit recevoir une fonction)
  try {
    PeerManager.init((id) => {
      // PeerJS prêt
      overlay.remove();
      localStorage.setItem("peerjs_id", id);
      window.appStart();
    });
  } catch (e) {
    console.warn("Auto-start PeerJS failed:", e);
  }

  // 5) iOS → tap obligatoire si auto-start échoue
  overlay.onclick = () => {
    PeerManager.init((id) => {
      overlay.remove();
      localStorage.setItem("peerjs_id", id);
      window.appStart();
    });
  };
});

// startup.js
import { PeerManager } from "./peer/utils/PeerManager.js";

window.addEventListener("DOMContentLoaded", async () => {
  const url = new URL(location.href);
  const invitedPeer = url.searchParams.get("peer");
  const invitedName = url.searchParams.get("name");

  // === 0) Vérifier si un client PeerJS tourne déjà (sans créer Peer) ===
  const peerAlreadyRunning = window.Peer?._instances?.length > 0;

  if (peerAlreadyRunning) {
    console.log("PeerJS déjà actif → startup ignoré");
    window.appStart();
    return;
  }

  // === 1) Charger l'ID sauvegardée dans p2p_profile_peerjs ===
  let savedId = localStorage.getItem("p2p_profile_peerjs");

  // === 2) Si aucune ID sauvegardée → en créer une ===
  if (!savedId) {
    savedId = "peer_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("p2p_profile_peerjs", savedId);
    console.log("Nouvelle ID générée :", savedId);
  }

  // === Overlay minimaliste ===
  const overlay = document.createElement("div");
  overlay.id = "startOverlay";
  overlay.style = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    z-index: 999999;
    flex-direction: column;
    text-align: center;
    user-select: none;
  `;
  overlay.innerHTML = `<p style="opacity:0.9">Click to start</p>`;
  document.body.appendChild(overlay);

  // === 3) Tentative auto-start avec ID forcée ===
  let id = null;
  try {
    id = await PeerManager.init(savedId);
  } catch (e) {
    id = null;
  }

  // === 4) Auto-start OK ===
  if (PeerManager.peer?.id) {
    overlay.remove();

    // Sauvegarder l'ID si PeerJS en a généré une autre
    localStorage.setItem("p2p_profile_peerjs", PeerManager.peer.id);

    window.appStart();

    if (invitedPeer) {
      PeerManager.connect(invitedPeer, () => {
        window.openChat(invitedPeer, invitedName || "Unknown");
      });
    }

    url.searchParams.delete("peer");
    url.searchParams.delete("name");
    history.replaceState({}, "", url.pathname);
    return;
  }

  // === 5) Auto-start FAIL → iPad → attendre un tap ===
  overlay.onclick = async () => {
    await PeerManager.init(savedId);

    if (!PeerManager.peer?.id) return; // iOS refuse encore

    overlay.remove();

    localStorage.setItem("p2p_profile_peerjs", PeerManager.peer.id);

    window.appStart();

    if (invitedPeer) {
      PeerManager.connect(invitedPeer, () => {
        window.openChat(invitedPeer, invitedName || "Unknown");
      });
    }

    url.searchParams.delete("peer");
    url.searchParams.delete("name");
    history.replaceState({}, "", url.pathname);
  };
});

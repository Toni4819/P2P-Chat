// startup.js
import { PeerManager } from "./peer/utils/PeerManager.js";

window.addEventListener("DOMContentLoaded", async () => {
  const url = new URL(location.href);
  const invitedPeer = url.searchParams.get("peer");
  const invitedName = url.searchParams.get("name");

  // 0) Vérifier si un client PeerJS tourne déjà (sans créer Peer)
  const peerAlreadyRunning = !!(window.Peer && Array.isArray(window.Peer._instances) && window.Peer._instances.length > 0);

  if (peerAlreadyRunning) {
    console.log("PeerJS déjà actif → startup ignoré");
    window.appStart();
    return;
  }

  // 1) Charger ou créer l'ID stockée
  let savedId = localStorage.getItem("p2p_profile_peerjs");
  if (!savedId) {
    // UUID propre ; fallback si crypto.randomUUID non dispo
    savedId = (typeof crypto !== "undefined" && crypto.randomUUID) ? `peer_${crypto.randomUUID()}` : `peer_${Math.random().toString(36).slice(2,10)}`;
    localStorage.setItem("p2p_profile_peerjs", savedId);
    console.log("Nouvelle ID générée :", savedId);
  }

  // 2) Overlay minimal pour iOS (sera retiré si auto-start fonctionne)
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
    font-size: 20px;
    z-index: 999999;
    flex-direction: column;
    text-align: center;
    user-select: none;
  `;
  overlay.innerHTML = `<p style="opacity:0.95; margin:0">Click to start</p>`;
  document.body.appendChild(overlay);

  // 3) Tentative d'auto-start (on passe UNIQUEMENT la string savedId)
  try {
    await PeerManager.init(savedId);
  } catch (e) {
    console.warn("PeerManager.init auto-start failed:", e);
  }

  // 4) Si auto-start a créé un peer avec un id valide
  if (PeerManager.peer?.id) {
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
    return;
  }

  // 5) Auto-start a échoué (iOS) → attendre un tap utilisateur
  overlay.onclick = async () => {
    try {
      await PeerManager.init(savedId);
    } catch (e) {
      console.warn("PeerManager.init on click failed:", e);
    }

    if (!PeerManager.peer?.id) return; // iOS peut encore refuser

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

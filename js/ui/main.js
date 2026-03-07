// main.js

function handleAutoAddFromURL() {
  const params = new URLSearchParams(location.search);
  const peerId = params.get("peer");
  const name = params.get("name");

  if (!peerId) return;

  let c = contacts.find((c) => c.peerId === peerId);
  if (!c) {
    c = addContact(name || "Peer " + peerId.slice(0, 6), peerId);
    saveContacts(contacts);
  }

  renderSidebar();
  openChat(c.peerId, c.name);
}

window.onload = () => {
  renderSidebar();
  handleAutoAddFromURL();

  if (isSafariBrowser()) {
    console.log("Safari detected → PeerJS will start manually.");
    showProfilePanel(true);
  } else {
    ensurePeerReady(() => {
      showProfilePanel(false);
    });
  }
};

document.addEventListener("click", (e) => {
  const qr = document.getElementById("qrcode");
  if (!qr) return;

  if (e.target === qr) {
    qr.classList.toggle("expanded");
  }
});

function appendChat(sender, msg) {
  const log = document.getElementById("chatLog");
  if (!log) return;
  const line = document.createElement("div");
  line.textContent = sender + ": " + msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

/* ---------------- PROFILE PANEL ---------------- */

function showProfilePanel() {
  const main = document.getElementById("mainPanel");

  const link = `${location.origin}/P2P-Local-Chat/?peer=${localPeerId} &name=${encodeURIComponent(profile.name)}`;

  main.innerHTML = `
    <h2>My profile</h2>

    <label>Your name</label>
    <input id="myName" value="${profile.name}">
    <button id="saveName">Save</button>

    <h3>Share your link</h3>
    <div id="myQR"></div>
    <pre>${link}</pre>
  `;

  new QRCode(document.getElementById("myQR"), {
    text: link,
    width: 200,
    height: 200,
  });

  document.getElementById("saveName").onclick = () => {
    profile.name = document.getElementById("myName").value.trim();
    saveProfile(profile);
    alert("Name updated");
  };
}

/* ---------------- ADD CONTACT PANEL ---------------- */

function showAddContactPanel() {
  const main = document.getElementById("mainPanel");

  main.innerHTML = `
    <h2>Add contact</h2>

    <label>Name</label>
    <input id="newName">

    <label>PeerJS ID</label>
    <input id="newPeerId">

    <button id="saveContact">Save</button>
  `;

  document.getElementById("saveContact").onclick = () => {
    const name = document.getElementById("newName").value.trim();
    const peerId = document.getElementById("newPeerId").value.trim();

    if (!name || !peerId) return alert("Missing fields");

    const c = addContact(name, peerId);
    renderSidebar();
    showContactPanel(c.id);
  };
}

/* ---------------- CONTACT PANEL ---------------- */

let currentContact = null;

function showContactPanel(id) {
  const c = getContact(id);
  if (!c) return;
  currentContact = c;

  const main = document.getElementById("mainPanel");
  main.innerHTML = `
    <h2>Chat with ${c.name}</h2>
    <p>PeerID: ${c.peerId}</p>
    <button id="connectBtn">Connect</button>
    <span id="connStatus"></span>

    <div id="chatLog"></div>
    <textarea id="chatMsg"></textarea>
    <button id="sendMsgBtn">Send</button>
  `;

  document.getElementById("connectBtn").onclick = () => {
    const status = document.getElementById("connStatus");
    status.textContent = " Connecting…";

    connectToPeer(c.peerId, () => {
      status.textContent = " Connected";
    });
  };

  document.getElementById("sendMsgBtn").onclick = () => {
    const msg = document.getElementById("chatMsg").value.trim();
    if (!msg) return;

    try {
      sendToPeer(c.peerId, msg);
      appendChat(profile.name, msg);
      document.getElementById("chatMsg").value = "";
    } catch {
      appendChat("System", "Not connected");
    }
  };
}

/* ---------------- PEER MESSAGE HANDLER ---------------- */

onPeerMessage = (peerId, name, msg) => {
  if (!currentContact) return;
  if (currentContact.peerId !== peerId) return;
  appendChat(name, msg);
};

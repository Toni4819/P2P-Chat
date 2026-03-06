let peer = null;
let localPeerId = null;
let connections = new Map();

let onPeerMessage = null;
let onPeerIncoming = null;

function initPeer(onReady) {
  let savedId = localStorage.getItem("peerjs_id");

  peer = new Peer(savedId || undefined);

  peer.on("open", (id) => {
    localPeerId = id;
    localStorage.setItem("peerjs_id", id);
    console.log("PeerJS ID:", id);
    onReady && onReady(id);
  });

  peer.on("connection", (conn) => {
    setupConn(conn);
    connections.set(conn.peer, conn);
    onPeerIncoming && onPeerIncoming(conn);
  });

  peer.on("error", (err) => console.error("PeerJS error:", err));
}

function setupConn(conn) {
  conn.on("data", (raw) => {
    const data = JSON.parse(raw);

    // Auto-add if unknown
    let c = contacts.find((c) => c.peerId === data.peerId);
    if (!c) {
      c = addContact(data.name, data.peerId);
      renderSidebar();
    }

    // Auto-update name
    if (c.name !== data.name) {
      c.name = data.name;
      saveContacts(contacts);
      renderSidebar();
    }

    // Forward to UI
    onPeerMessage && onPeerMessage(data.peerId, data.name, data.msg);
  });

  conn.on("close", () => {
    connections.delete(conn.peer);
  });
}

function connectToPeer(peerId, onOpen) {
  if (connections.has(peerId)) {
    const c = connections.get(peerId);
    if (c.open) return onOpen && onOpen(c);
  }

  const conn = peer.connect(peerId);
  setupConn(conn);

  conn.on("open", () => {
    connections.set(peerId, conn);
    onOpen && onOpen(conn);
  });

  return conn;
}

function sendToPeer(peerId, msg) {
  const conn = connections.get(peerId);
  if (!conn || !conn.open) throw new Error("Not connected");
  conn.send(
    JSON.stringify({
      peerId: localPeerId,
      name: profile.name,
      msg,
    }),
  );
}

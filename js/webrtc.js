let activeConn = null;

function connectToPeer(targetId) {
  if (!peer) return;

  activeConn = peer.connect(targetId);

  activeConn.on("open", () => {
    addMessage("Connected to " + targetId, false);
  });

  activeConn.on("data", (data) => {
    addMessage(data, false);
  });
}

peer?.on("connection", (conn) => {
  activeConn = conn;

  conn.on("data", (data) => {
    addMessage(data, false);
  });

  conn.on("open", () => {
    addMessage("Peer connected: " + conn.peer, false);
  });
});

function sendMessage(text) {
  if (activeConn && activeConn.open) {
    activeConn.send(text);
    addMessage(text, true);
  }
}

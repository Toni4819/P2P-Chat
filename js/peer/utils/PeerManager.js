export let localPeerId = null;

export const PeerManager = {
  peer: null,
  connections: new Map(),
  ready: false,

  init(onReady) {
    this.peer = new Peer(localStorage.getItem("peerjs_id") || undefined);

    this.peer.on("open", (id) => {
      localPeerId = id;
      this.ready = true;
      onReady && onReady(id);
    });

    this.peer.on("connection", (conn) => {
      this.setupConn(conn);
    });
  },

  setupConn(conn) {
    conn.on("data", (raw) => {
      MessageHandler.receiveRaw(conn.peer, raw);
    });

    this.connections.set(conn.peer, conn);
  },

  connect(peerId, onOpen) {
    if (!this.ready) return null;

    const conn = this.peer.connect(peerId);
    this.setupConn(conn);

    conn.on("open", () => {
      onOpen && onOpen(conn);
    });

    return conn;
  },

  send(peerId, data) {
    const conn = this.connections.get(peerId);
    if (!conn || !conn.open) throw new Error("Not connected");
    conn.send(JSON.stringify(data));
  },
  getLocalId() {
    return localPeerId;
  },
};

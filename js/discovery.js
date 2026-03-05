let peer = null;
let roomConn = null;
let myId = null;
let myName = "";
let peersList = {};

const ROOM_HOST_ID = "p2p-room-host-001"; // fixed ID for the room server

function startDiscovery(name) {
  myName = name;

  peer = new Peer({
    debug: 2,
  });

  peer.on("open", (id) => {
    myId = id;
    connectToRoomHost();
  });

  peer.on("connection", (conn) => {
    // If someone connects directly to us (chat), handled in webrtc.js
  });
}

function connectToRoomHost() {
  roomConn = peer.connect(ROOM_HOST_ID);

  roomConn.on("open", () => {
    roomConn.send({
      type: "join",
      id: myId,
      name: myName,
    });
  });

  roomConn.on("data", (msg) => {
    if (msg.type === "userlist") {
      peersList = msg.users;
      updateUserList();
    }
  });
}

function updateUserList() {
  const users = document.getElementById("users");
  const buttons = document.querySelectorAll(".toggle-btn");

  users.innerHTML = "";
  buttons.forEach((btn) => users.appendChild(btn));

  for (const id in peersList) {
    if (id === myId) continue;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = peersList[id];
    div.onclick = () => connectToPeer(id);
    users.appendChild(div);
  }
}

const bc = new BroadcastChannel("p2p-discovery");
const peers = {};
let myId = crypto.randomUUID();
let myName = "";

function startPresence(name) {
  myName = name;

  setInterval(() => {
    bc.postMessage({
      type: "presence",
      id: myId,
      name: myName,
      ts: Date.now(),
    });
  }, 2000);

  bc.onmessage = (ev) => {
    const msg = ev.data;

    if (msg.type === "presence") {
      peers[msg.id] = {
        name: msg.name,
        ts: msg.ts,
      };
      updateUserList();
    }

    if (msg.type === "offer" && msg.to === myId) {
      handleOffer(msg);
    }

    if (msg.type === "answer" && msg.to === myId) {
      handleAnswer(msg);
    }
  };
}

function updateUserList() {
  const users = document.getElementById("users");
  users.innerHTML = "";

  for (const id in peers) {
    if (id === myId) continue;
    if (Date.now() - peers[id].ts > 5000) continue;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = peers[id].name;
    div.onclick = () => connectToPeer(id);
    users.appendChild(div);
  }
}

let visible = true;
let scanning = true;

let beaconPC = null;
let beaconCandidates = [];
let knownPeers = {};

function startDiscovery(name) {
  myName = name;
  createBeaconPeer();
  startBeaconLoop();
  startScanLoop();
}

function createBeaconPeer() {
  beaconPC = new RTCPeerConnection({ iceServers: [] });

  beaconPC.onicecandidate = (ev) => {
    if (ev.candidate) {
      beaconCandidates.push(ev.candidate.candidate);
    }
  };

  beaconPC.createOffer({ iceRestart: true }).then((o) => {
    beaconPC.setLocalDescription(o);
  });
}

function startBeaconLoop() {
  setInterval(() => {
    if (!visible) return;
    if (beaconCandidates.length === 0) return;

    const msg = {
      type: "beacon",
      id: myId,
      name: myName,
      candidates: beaconCandidates,
    };

    localStorage.setItem("p2p_beacon", JSON.stringify(msg));
  }, 1500);
}

window.addEventListener("storage", (ev) => {
  if (!scanning) return;
  if (ev.key !== "p2p_beacon") return;

  const msg = JSON.parse(ev.newValue || "{}");
  if (!msg.id || msg.id === myId) return;

  knownPeers[msg.id] = {
    name: msg.name,
    candidates: msg.candidates,
    ts: Date.now(),
  };

  updateUserList();
});

function updateUserList() {
  const users = document.getElementById("users");
  users.innerHTML = "";

  for (const id in knownPeers) {
    if (Date.now() - knownPeers[id].ts > 5000) continue;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = knownPeers[id].name;
    div.onclick = () => connectToPeer(id, knownPeers[id].candidates);
    users.appendChild(div);
  }
}

function toggleVisibility() {
  visible = !visible;
  document.getElementById("btnVisible").textContent = visible
    ? "Visible"
    : "Hidden";
}

function toggleScan() {
  scanning = !scanning;
  document.getElementById("btnScan").textContent = scanning
    ? "Scanning"
    : "Stopped";
}
window.addEventListener("storage", (ev) => {
  if (ev.key !== "p2p_signal") return;

  const msg = JSON.parse(ev.newValue || "{}");
  if (!msg.type) return;
  if (msg.to !== myId) return;

  if (msg.type === "offer") handleOffer(msg);
  if (msg.type === "answer") handleAnswer(msg);
});

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
      ts: Date.now(),
    };

    localStorage.setItem("p2p_beacon", JSON.stringify(msg));
  }, 1500);
}

function startScanLoop() {
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
}

function updateUserList() {
  const users = document.getElementById("users");
  const buttons = document.querySelectorAll(".toggle-btn");

  users.innerHTML = "";
  buttons.forEach((btn) => users.appendChild(btn));

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
  const btn = document.getElementById("btnVisible");
  btn.classList.toggle("active", visible);
  btn.textContent = visible ? "Visible" : "Hidden";
}

function toggleScan() {
  scanning = !scanning;
  const btn = document.getElementById("btnScan");
  btn.classList.toggle("active", scanning);
  btn.textContent = scanning ? "Scanning" : "Stopped";
}

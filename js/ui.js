// DOM elements
const deviceNameInput = document.getElementById("deviceName");
const saveProfileBtn = document.getElementById("saveProfile");
const localIdSpan = document.getElementById("localId");

const createOfferBtn = document.getElementById("createOffer");
const offerText = document.getElementById("offerText");

const remoteOfferTA = document.getElementById("remoteOffer");
const createAnswerBtn = document.getElementById("createAnswer");
const answerText = document.getElementById("answerText");

const remoteAnswerTA = document.getElementById("remoteAnswer");
const applyAnswerBtn = document.getElementById("applyAnswer");

const outgoing = document.getElementById("outgoing");
const sendBtn = document.getElementById("send");

const statusSpan = document.getElementById("status");
const logDiv = document.getElementById("log");

// Init profile UI
deviceNameInput.value = profile.name;
localIdSpan.textContent = profile.id;

saveProfileBtn.onclick = () => {
  profile.name = deviceNameInput.value || profile.name;
  saveProfile(profile);
  log("Profile updated: " + profile.name);
};

// Logging
function log(msg) {
  const line = document.createElement("div");
  line.textContent = "[" + new Date().toLocaleTimeString() + "] " + msg;
  logDiv.appendChild(line);
  logDiv.scrollTop = logDiv.scrollHeight;
}

function setStatus(s) {
  statusSpan.textContent = s;
}

// QR code (optional)
let qr = null;
if (window.QRCode) {
  qr = new QRCode(document.getElementById("qrcode"), {
    text: "",
    width: 256,
    height: 256,
  });
}

function updateQR(text) {
  if (!qr) return;
  qr.clear();
  qr.makeCode(text);
}

// Create offer (A)
createOfferBtn.onclick = async () => {
  isOfferer = true;
  createPeerConnection();

  channel = pc.createDataChannel("chat");
  setupChannel();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitForICE();

  const token = btoa(JSON.stringify(pc.localDescription));
  offerText.textContent = token;
  updateQR(token);

  log("Offer created. Share this token with the other device.");
};

// Create answer (B)
createAnswerBtn.onclick = async () => {
  const raw = remoteOfferTA.value.trim();
  if (!raw) return log("No offer token provided.");

  isOfferer = false;
  createPeerConnection();

  let offer;
  try {
    offer = JSON.parse(atob(raw));
  } catch {
    return log("Invalid offer token.");
  }

  await pc.setRemoteDescription(offer);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await waitForICE();

  const token = btoa(JSON.stringify(pc.localDescription));
  answerText.textContent = token;

  log("Answer created. Send this token back to A.");
};

// Apply answer (A)
applyAnswerBtn.onclick = async () => {
  const raw = remoteAnswerTA.value.trim();
  if (!raw) return log("No answer token provided.");
  if (!pc || !isOfferer) return log("No active offerer connection.");

  let answer;
  try {
    answer = JSON.parse(atob(raw));
  } catch {
    return log("Invalid answer token.");
  }

  await pc.setRemoteDescription(answer);
  log("Answer applied. Connecting...");
};

// Send chat message
sendBtn.onclick = () => {
  if (!channel || channel.readyState !== "open") {
    return log("DataChannel is not open.");
  }

  const msg = outgoing.value.trim();
  if (!msg) return;

  const full = profile.name + ": " + msg;
  channel.send(full);
  log("Sent: " + full);

  outgoing.value = "";
};

let pc = null;
let channel = null;

/* ------------------------------
   TOKEN COMPRESSION / DECOMPRESSION
-------------------------------- */

function encodeToken(obj) {
  const json = JSON.stringify(obj);
  const compressed = pako.deflate(json);
  const b64 = btoa(String.fromCharCode(...compressed));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeToken(token) {
  const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const json = pako.inflate(bytes, { to: "string" });
  return JSON.parse(json);
}

/* ------------------------------
   PEER CONNECTION
-------------------------------- */

function createPeerConnection() {
  pc = new RTCPeerConnection();

  pc.onicecandidate = (e) => {
    if (!e.candidate) console.log("ICE gathering complete");
  };

  pc.onconnectionstatechange = () => {
    console.log("Connection state:", pc.connectionState);
  };

  pc.ondatachannel = (e) => {
    channel = e.channel;
    setupChannel();
  };
}

function setupChannel() {
  channel.onopen = () => appendChat("System", "Connection established");
  channel.onmessage = (e) => appendChat("Peer", e.data);
  channel.onclose = () => appendChat("System", "Connection closed");
}

async function waitForICE() {
  if (pc.iceGatheringState === "complete") return;
  await new Promise((resolve) => {
    const check = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", check);
        resolve();
      }
    };
    pc.addEventListener("icegatheringstatechange", check);
  });
}

/* ------------------------------
   OFFER / ANSWER
-------------------------------- */

async function createOfferToken() {
  createPeerConnection();
  channel = pc.createDataChannel("chat");
  setupChannel();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitForICE();

  return encodeToken(pc.localDescription);
}

async function createAnswerToken(offerToken) {
  createPeerConnection();

  const offer = decodeToken(offerToken);
  await pc.setRemoteDescription(offer);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await waitForICE();

  return encodeToken(pc.localDescription);
}

async function applyAnswerToken(answerToken) {
  const answer = decodeToken(answerToken);
  await pc.setRemoteDescription(answer);
}

/* ------------------------------
   CONNECTION WAIT + TIMEOUT
-------------------------------- */

function waitForConnection() {
  return new Promise((resolve) => {
    const check = () => {
      if (pc && pc.connectionState === "connected") resolve(true);
      else if (
        pc &&
        ["failed", "disconnected", "closed"].includes(pc.connectionState)
      )
        resolve(false);
      else setTimeout(check, 150);
    };
    check();
  });
}

function waitForConnectionOrTimeout(ms) {
  return Promise.race([
    waitForConnection(),
    new Promise((resolve) => setTimeout(() => resolve(false), ms)),
  ]);
}

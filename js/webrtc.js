let pc = null;
let channel = null;
let isOfferer = false;

function createPeerConnection() {
  pc = new RTCPeerConnection();

  pc.onicecandidate = (e) => {
    if (!e.candidate) console.log("ICE complete");
  };

  pc.ondatachannel = (e) => {
    channel = e.channel;
    setupChannel();
  };

  pc.onconnectionstatechange = () => {
    console.log("State:", pc.connectionState);
  };
}

function setupChannel() {
  channel.onopen = () => appendChat("System", "Channel open");
  channel.onmessage = (e) => appendChat("Peer", e.data);
}

async function waitICE() {
  if (pc.iceGatheringState === "complete") return;
  await new Promise((res) => {
    pc.addEventListener("icegatheringstatechange", () => {
      if (pc.iceGatheringState === "complete") res();
    });
  });
}

async function createOfferToken() {
  isOfferer = true;
  createPeerConnection();
  channel = pc.createDataChannel("chat");
  setupChannel();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitICE();

  return btoa(JSON.stringify(pc.localDescription));
}

async function createAnswerToken(offerToken) {
  isOfferer = false;
  createPeerConnection();

  const offer = JSON.parse(atob(offerToken));
  await pc.setRemoteDescription(offer);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await waitICE();

  return btoa(JSON.stringify(pc.localDescription));
}

async function applyAnswerToken(answerToken) {
  const answer = JSON.parse(atob(answerToken));
  await pc.setRemoteDescription(answer);
}

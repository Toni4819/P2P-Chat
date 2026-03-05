let pc = null;
let channel = null;
let isOfferer = false;

function createPeerConnection() {
  pc = new RTCPeerConnection();

  pc.onicecandidate = (e) => {
    if (!e.candidate) log("ICE gathering completed.");
  };

  pc.onconnectionstatechange = () => {
    log("Connection state: " + pc.connectionState);
    if (pc.connectionState === "connected") setStatus("connected");
    if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
      setStatus("disconnected");
    }
  };

  pc.ondatachannel = (event) => {
    channel = event.channel;
    setupChannel();
    log("DataChannel received.");
  };
}

function setupChannel() {
  channel.onopen = () => {
    log("DataChannel opened.");
    setStatus("connected");
  };

  channel.onmessage = (e) => {
    log("Received: " + e.data);
  };

  channel.onclose = () => {
    log("DataChannel closed.");
    setStatus("disconnected");
  };
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

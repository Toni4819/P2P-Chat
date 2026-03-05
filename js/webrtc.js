let pc;
let dataChannel;

function createPeerConnection() {
  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.ondatachannel = (ev) => {
    dataChannel = ev.channel;
    setupDataChannel();
  };

  pc.onicecandidate = (ev) => {
    if (!ev.candidate) {
      bc.postMessage({
        type: "offer",
        from: myId,
        to: targetPeer,
        sdp: pc.localDescription,
      });
    }
  };
}

function connectToPeer(peerId) {
  targetPeer = peerId;
  createPeerConnection();

  dataChannel = pc.createDataChannel("chat");
  setupDataChannel();

  pc.createOffer().then((o) => {
    pc.setLocalDescription(o);
  });
}

function handleOffer(msg) {
  targetPeer = msg.from;
  createPeerConnection();

  pc.setRemoteDescription(msg.sdp).then(() => {
    pc.createAnswer().then((a) => {
      pc.setLocalDescription(a);
      bc.postMessage({
        type: "answer",
        from: myId,
        to: msg.from,
        sdp: a,
      });
    });
  });
}

function handleAnswer(msg) {
  pc.setRemoteDescription(msg.sdp);
}

function setupDataChannel() {
  dataChannel.onopen = () => console.log("Connected");
  dataChannel.onmessage = (ev) => addMessage(ev.data, false);
}

function sendMessage(text) {
  if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(text);
    addMessage(text, true);
  }
}

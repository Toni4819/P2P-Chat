window.onload = () => {
  const name = prompt("Enter your device name:");
  startDiscovery(name || "Anonymous");

  document.getElementById("btnVisible").onclick = toggleVisibility;
  document.getElementById("btnScan").onclick = toggleScan;

  document.getElementById("sendBtn").onclick = () => {
    const input = document.getElementById("msgInput");
    sendMessage(input.value);
    input.value = "";
  };
};

function addMessage(text, me) {
  const box = document.createElement("div");
  box.className = "msg" + (me ? " me" : "");
  box.textContent = text;
  document.getElementById("messages").appendChild(box);
  document.getElementById("messages").scrollTop = 999999;
}

function toggleVisibility() {
  const btn = document.getElementById("btnVisible");
  btn.classList.toggle("active");
}

function toggleScan() {
  const btn = document.getElementById("btnScan");
  btn.classList.toggle("active");
}

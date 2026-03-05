window.onload = () => {
  const name = prompt("Enter your device name:");
  startPresence(name || "Anonymous");

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

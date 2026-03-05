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

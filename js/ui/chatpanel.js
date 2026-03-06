/* ------------------------------
   UTILS
-------------------------------- */

function validateOfferToken(token) {
  try {
    const obj = decodeToken(token);
    return obj.type === "offer";
  } catch {
    return false;
  }
}

function truncateToken(token, len = 12) {
  return token.length <= len ? token : token.slice(0, len) + "...";
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

function appendChat(sender, msg) {
  const log = document.getElementById("chatLog");
  if (!log) return;
  const line = document.createElement("div");
  line.textContent = sender + ": " + msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

/* ------------------------------
   ADD CONTACT PANEL
-------------------------------- */

async function showAddContactPanel() {
  const main = document.getElementById("mainPanel");

  const myOfferToken = await createOfferToken();

  main.innerHTML = `
    <h2>Add contact</h2>

    <h3>Your offer</h3>
    <div class="qrContainer" id="myOfferQR"></div>
    <div><span class="tokenShort" id="myOfferShort"></span></div>
    <pre id="myOfferFull"></pre>

    <h3>Partner offer</h3>
    <textarea id="partnerOffer" placeholder="Paste partner's offer token"></textarea>

    <button id="linkBtn">Link devices</button>

    <div id="linkStatus"></div>
  `;

  /* QR code */
  new QRCode(document.getElementById("myOfferQR"), {
    text: myOfferToken,
    width: 200,
    height: 200,
  });

  /* Token tronqué + copie */
  const shortSpan = document.getElementById("myOfferShort");
  shortSpan.textContent = truncateToken(myOfferToken);
  shortSpan.onclick = () => copyToClipboard(myOfferToken);

  document.getElementById("myOfferFull").textContent = myOfferToken;

  /* Link devices */
  document.getElementById("linkBtn").onclick = async () => {
    const partnerToken = document.getElementById("partnerOffer").value.trim();
    const status = document.getElementById("linkStatus");

    if (!partnerToken) return alert("Paste partner's offer token");
    if (!validateOfferToken(partnerToken))
      return alert("Invalid partner offer token");

    status.textContent = `Testing connection to ${truncateToken(partnerToken)}…`;

    let answerToken;
    try {
      answerToken = await createAnswerToken(partnerToken);
    } catch {
      status.textContent = "Error creating answer (invalid offer?)";
      return;
    }

    status.innerHTML = `
      <p>Send this answer to your partner:</p>
      <div class="qrContainer" id="answerQR"></div>
      <div><span class="tokenShort" id="answerShort"></span></div>
      <pre id="answerFull"></pre>
      <p>Waiting for connection (10s)…</p>
    `;

    new QRCode(document.getElementById("answerQR"), {
      text: answerToken,
      width: 200,
      height: 200,
    });

    const shortAns = document.getElementById("answerShort");
    shortAns.textContent = truncateToken(answerToken);
    shortAns.onclick = () => copyToClipboard(answerToken);

    document.getElementById("answerFull").textContent = answerToken;

    const connected = await waitForConnectionOrTimeout(10000);

    if (!connected) {
      status.innerHTML += `<p><b>Result:</b> timeout or unreachable.</p>`;
      return;
    }

    status.innerHTML += `<p><b>Result:</b> connection established.</p>`;

    const name = prompt("Enter contact name:");
    if (!name) return;

    const c = addContact(name, partnerToken);
    renderSidebar();
    showContactPanel(c.id);
  };
}

/* ------------------------------
   CONTACT PANEL (CHAT ONLY)
-------------------------------- */

function showContactPanel(id) {
  const c = getContact(id);
  if (!c) return;

  const main = document.getElementById("mainPanel");
  main.innerHTML = `
    <h2>Chat with ${c.name}</h2>

    <div id="chatLog"></div>
    <textarea id="chatMsg" placeholder="Message..."></textarea>
    <button id="sendMsgBtn">Send</button>
  `;

  document.getElementById("sendMsgBtn").onclick = () => {
    const msg = document.getElementById("chatMsg").value.trim();
    if (!msg) return;

    if (!channel || channel.readyState !== "open") {
      appendChat("System", "Channel not open");
      return;
    }

    channel.send(profile.name + ": " + msg);
    appendChat(profile.name, msg);
    document.getElementById("chatMsg").value = "";
  };
}

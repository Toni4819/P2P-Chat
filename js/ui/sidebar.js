function renderSidebar() {
  const sb = document.getElementById("sidebar");
  sb.innerHTML = `
    <h2>Contacts</h2>
    <div id="contactList"></div>
    <button id="addContactBtn">Add contact</button>
    <button id="myProfileBtn">My profile</button>
  `;

  document.getElementById("addContactBtn").onclick = showAddContactPanel;
  document.getElementById("myProfileBtn").onclick = showProfilePanel;

  renderContactList();
}

function renderContactList() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.forEach((c) => {
    const div = document.createElement("div");
    div.className = "contactItem";

    div.innerHTML = `
      <span class="contactName">${c.name} (${c.peerId.slice(0, 6)}…)</span>
      <i class="iconoir-trash deleteBtn" data-id="${c.id}"></i>
    `;

    // Ouvrir le chat
    div.querySelector(".contactName").onclick = () => showContactPanel(c.id);

    // Supprimer avec confirmation
    div.querySelector(".deleteBtn").onclick = (e) => {
      e.stopPropagation();
      confirmDeleteContact(c);
    };

    list.appendChild(div);
  });
}

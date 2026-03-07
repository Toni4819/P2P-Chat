// sidebar.js

import { contacts, getContact, saveContacts } from "./contacts.js";
import {
  showAddContactPanel,
  showProfilePanel,
  showContactPanel,
} from "./chatpanel.js";

export function renderSidebar() {
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
    div.dataset.peerid = c.peerId;

    div.innerHTML = `
      <span class="contactName">${c.name} (${c.peerId.slice(0, 6)}…)</span>
      <img src="img/svg/trash-alt.svg" class="deleteBtn" data-id="${c.id}">
    `;

    div.querySelector(".contactName").onclick = () => showContactPanel(c.id);

    div.querySelector(".deleteBtn").onclick = (e) => {
      e.stopPropagation();
      confirmDeleteContact(c);
    };

    list.appendChild(div);
  });
}

function confirmDeleteContact(contact) {
  const overlay = document.createElement("div");
  overlay.id = "confirmOverlay";
  overlay.style.display = "flex";

  const box = document.createElement("div");
  box.id = "confirmBox";

  box.innerHTML = `
    <h3>Delete contact?</h3>
    <p>Are you sure you want to delete "${contact.name}"?</p>
    <div class="confirmButtons">
      <button id="confirmYes">Delete</button>
      <button id="confirmNo">Cancel</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById("confirmYes").onclick = () => {
    deleteContact(contact.id);
    overlay.remove();
  };

  document.getElementById("confirmNo").onclick = () => overlay.remove();
}

function deleteContact(id) {
  const newList = contacts.filter((c) => c.id !== id);
  saveContacts(newList);
  location.reload(); // simple, propre, évite les états incohérents
}

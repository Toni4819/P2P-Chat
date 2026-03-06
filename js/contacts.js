const contactsKey = "p2p_contacts_peerjs";

function loadContacts() {
  const raw = localStorage.getItem(contactsKey);
  return raw ? JSON.parse(raw) : [];
}

function saveContacts(list) {
  localStorage.setItem(contactsKey, JSON.stringify(list));
}

let contacts = loadContacts();

function addContact(name, peerId) {
  const c = {
    id: crypto.randomUUID(),
    name,
    peerId,
  };
  contacts.push(c);
  saveContacts(contacts);
  return c;
}

function getContact(id) {
  return contacts.find((c) => c.id === id);
}

function confirmDeleteContact(contact) {
  const overlay = document.getElementById("confirmOverlay");
  const text = document.getElementById("confirmText");
  const yes = document.getElementById("confirmYes");
  const no = document.getElementById("confirmNo");

  text.textContent = `Are you sure you want to delete "${contact.name}"?`;

  overlay.style.display = "flex";

  yes.onclick = () => {
    deleteContact(contact.id);
    overlay.style.display = "none";
  };

  no.onclick = () => {
    overlay.style.display = "none";
  };
}

function deleteContact(id) {
  contacts = contacts.filter((c) => c.id !== id);
  saveContacts(contacts);
  renderSidebar();

  const main = document.getElementById("mainPanel");
  main.innerHTML = "<h2>Select a contact</h2>";
}

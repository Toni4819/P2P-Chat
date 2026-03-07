// contacts.js

export const contactsKey = "p2p_contacts_peerjs";

export function loadContacts() {
  const raw = localStorage.getItem(contactsKey);
  return raw ? JSON.parse(raw) : [];
}

export function saveContacts(list) {
  localStorage.setItem(contactsKey, JSON.stringify(list));
}

export let contacts = loadContacts();

export function addContact(name, peerId) {
  const c = {
    id: crypto.randomUUID(),
    name,
    peerId,
  };
  contacts.push(c);
  saveContacts(contacts);
  return c;
}

export function getContact(id) {
  return contacts.find((c) => c.id === id);
}

export function flashContact(peerId) {
  const el = document.querySelector(`[data-peerid="${peerId}"]`);
  if (!el) return;
  el.classList.add("unread");
}

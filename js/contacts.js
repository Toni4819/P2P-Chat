const contactsKey = "p2p_contacts";

function loadContacts() {
  const raw = localStorage.getItem(contactsKey);
  return raw ? JSON.parse(raw) : [];
}

function saveContacts(list) {
  localStorage.setItem(contactsKey, JSON.stringify(list));
}

let contacts = loadContacts();

function addContact(name, offerToken) {
  const c = {
    id: crypto.randomUUID(),
    name,
    offerToken,
  };
  contacts.push(c);
  saveContacts(contacts);
  return c;
}

function getContact(id) {
  return contacts.find((c) => c.id === id);
}

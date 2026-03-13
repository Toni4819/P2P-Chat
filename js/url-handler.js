// url-handler.js
import { addContact } from "./ui/contacts.js";
import { openChat } from "./ui/chat.js";

export function handleURLParams() {
  const params = new URLSearchParams(window.location.search);

  const peer = params.get("peer");
  const name = params.get("name");

  if (!peer || !name) return;
  addContact(peer, name);

  openChat(peer, name);

  window.history.replaceState({}, "", window.location.pathname);
}

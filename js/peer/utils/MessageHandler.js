import {
  appendMessage,
  currentChatPeerId,
  saveMessage,
} from "../../ui/chat.js";
import { flashContact } from "../../ui/contacts.js";
import { AckManager } from "./AckManager.js";
import { Parser } from "./Parser.js";
import { PeerManager, localPeerId } from "./PeerManager.js";
import { Renderer } from "./Renderer.js";

export const MessageHandler = {
  receiveRaw(peerId, raw) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    if (data.type === "msg") {
      this.receiveMessage(peerId, data);
      return;
    }

    if (data.type === "ack") {
      AckManager.receiveAck(peerId, data.id);
      return;
    }
  },

  receiveMessage(peerId, data) {
    const timestamp = Date.now();

    // ACK immédiat
    PeerManager.send(peerId, {
      type: "ack",
      id: data.id,
      peerId: localPeerId,
    });

    // Sauvegarde brute
    saveMessage(peerId, "them", data.msg, timestamp, "received", data.id);

    // Parsing
    const parts = Parser.parse(data.msg);

    // Rendu
    const html = Renderer.render(parts);

    // Affichage
    if (currentChatPeerId === peerId) {
      appendMessage("them", html, timestamp, "received");
    } else {
      flashContact(peerId);
    }
  },
};

import { updateMessageStatus } from "../../ui/chat.js";

export const AckManager = {
  pending: {},

  track(peerId, id) {
    this.pending[id] = { peerId };
  },

  receiveAck(peerId, id) {
    console.log("ACK REÇU:", peerId, id);
    updateMessageStatus(peerId, id, "received");
    delete this.pending[id];
  },
};

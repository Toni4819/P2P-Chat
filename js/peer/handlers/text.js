import { escapeHtml } from "../utils/escape.js";

export const TextHandler = {
  type: "text",

  render(value) {
    return escapeHtml(value);
  },
};

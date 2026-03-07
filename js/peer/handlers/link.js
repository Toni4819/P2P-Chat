import { escapeHtml } from "../utils/escape.js";

export const LinkHandler = {
  type: "link",

  render(url) {
    return `<a href="${url}" target="_blank">${escapeHtml(url)}</a>`;
  },
};

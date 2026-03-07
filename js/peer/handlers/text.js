export const TextHandler = {
  type: "text",

  render(value) {
    return escapeHtml(value);
  },
};

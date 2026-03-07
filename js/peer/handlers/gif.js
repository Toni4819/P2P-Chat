export const GifHandler = {
  type: "gif",

  render(url) {
    return `<img src="${url}" class="chatImage">`;
  },
};

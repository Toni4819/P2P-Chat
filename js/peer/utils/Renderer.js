export const Renderer = {
  render(parts) {
    return parts
      .map((p) => {
        switch (p.type) {
          case "text":
            return TextHandler.render(p.value);
          case "link":
            return LinkHandler.render(p.value);
          case "gif":
            return GifHandler.render(p.value);
          case "file":
            return FileHandler.renderIncoming(p);
          default:
            return TextHandler.render(p.value);
        }
      })
      .join(" ");
  },
};

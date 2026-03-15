import { FileHandler } from "../handlers/file.js";
import { GifHandler } from "../handlers/gif.js";
import { LinkHandler } from "../handlers/link.js";
import { TextHandler } from "../handlers/text.js";

export const Renderer = {
  render(parts) {
    let html = "";

    for (const p of parts) {
      let chunk = "";

      switch (p.type) {
        case "text":
          chunk = TextHandler.render(p.value);
          break;

        case "link":
          chunk = LinkHandler.render(p.value);
          break;

        case "gif":
          chunk = GifHandler.render(p.value);
          break;

        case "file":
          chunk = FileHandler.renderIncoming(p);
          break;

        default:
          chunk = TextHandler.render(p.value);
      }

      if (chunk.startsWith("<div") || chunk.startsWith("<img")) {
        html += chunk + "\n";
      } else {
        html += chunk + " ";
      }
    }

    return html.trim();
  },
};

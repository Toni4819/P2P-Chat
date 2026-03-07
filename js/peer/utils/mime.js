export const Mime = {
  fromFilename(name) {
    const ext = name.split(".").pop().toLowerCase();

    const map = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      gif: "image/gif",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      mp4: "video/mp4",
      pdf: "application/pdf",
    };

    return map[ext] || "application/octet-stream";
  },
};

export const AudioHandler = {
  type: "audio",

  render(url) {
    return `
      <audio controls>
        <source src="${url}">
        Your browser does not support audio playback.
      </audio>
    `;
  },
};

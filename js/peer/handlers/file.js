export const FileHandler = {
  type: "file",

  renderIncoming(fileObj) {
    const { name, size, mime, data } = fileObj;

    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);

    return `
      <div class="fileMessage">
        <strong>${escapeHtml(name)}</strong> (${Math.round(size / 1024)} KB)
        <br>
        <a href="${url}" download="${escapeHtml(name)}">Download</a>
      </div>
    `;
  },
};

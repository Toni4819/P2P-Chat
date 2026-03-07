export const Detect = {
  isGif(url) {
    return /^https?:\/\/.*\.gif$/i.test(url);
  },

  isLink(url) {
    return /^https?:\/\//i.test(url);
  },

  isImage(url) {
    return /^https?:\/\/.*\.(png|jpg|jpeg|webp)$/i.test(url);
  },
};
export function isSafariBrowser() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

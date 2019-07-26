
export function getImageSrc(src: string) {
  return src.indexOf('http') === 0 ? src : `https://cdn.annatarhe.com/${src}-copyrightDB`
}

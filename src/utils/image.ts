
export function getImageSrc(src: string) {
  return src.indexOf('http') === 0 ? src : `https://clippingkk-cdn.annatarhe.com/${src}-copyrightDB`
}

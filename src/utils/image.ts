
export function getImageSrc(src: string) {
  return src.indexOf('http') === 0 ? src : `https://clippingkk-cdn.annatarhe.com/${src}-copyrightDB`
}

/**
 * calc a color by percent
 * @param color hex color
 * @param percent 40/-40
 *
 * @example shadeColor("#63C6FF",40)
 * @example shadeColor("#63C6FF",-40)
 */
export function shadeColor(color: string, percent: number) {
    var R = parseInt(color.substring(1,3),16)
    var G = parseInt(color.substring(3,5),16)
    var B = parseInt(color.substring(5,7),16)

    R = R * (100 + percent) / 100
    G = G * (100 + percent) / 100
    B = B * (100 + percent) / 100

    R = (R<255)?R:255
    G = (G<255)?G:255
    B = (B<255)?B:255

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16))
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16))
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16))

    return "#"+RR+GG+BB;
}

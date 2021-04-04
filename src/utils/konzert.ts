import { getSystemInfo } from "@remax/wechat"

export enum UTPService {
  clipping = 'clipping',
  book = 'book'
}

export function getUTPLink(service: UTPService, params: Object, sysInfo?: WechatMiniprogram.SystemInfo): string {
  if (!sysInfo) {
    return ''
  }
  const d = Object.
    keys(params).
    reduce((acc, cur) => {
      acc.push(`${cur}=${(params as any)[cur]}`)
      return acc
    }, [] as string[])
    .join('&')
    console.log("service: ", service.toString())
  const distUrl = encodeURIComponent(`https://konzert.annatarhe.com/${service.toString()}.html?${d}`)

  const screenWidth = sysInfo.screenWidth > 375 ? 375 : sysInfo.screenWidth
  const dpi = sysInfo.pixelRatio

  return `https://utp.annatarhe.com/?url=${distUrl}&isMobile=true&isFullPage=true&viewPortWidth=${screenWidth}&width=${screenWidth * dpi}&deviceScaleFactor=${dpi}&viewPortHeight=768`
}

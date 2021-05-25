import { getSystemInfo } from "@remax/wechat"

export enum UTPService {
  clipping = 'clipping',
  book = 'book'
}

export enum KonzertTheme {
  classic = 0,
  colorful = 1,
  dark = 2,
  young = 3,
  light = 4,
}

export const KonzertThemeMap: {[k in KonzertTheme]: string} = {
  [KonzertTheme.classic]: '经典',
  [KonzertTheme.colorful]: '彩色',
  [KonzertTheme.dark]: '暗黑',
  [KonzertTheme.young]: '青春',
  [KonzertTheme.light]: '亮丽',
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
  const distUrl = encodeURIComponent(`https://konzert.annatarhe.com/${service.toString()}.html?${d}`)

  const screenWidth = sysInfo.screenWidth > 375 ? 375 : sysInfo.screenWidth
  const dpi = sysInfo.pixelRatio

  return `https://utp.annatarhe.com/?url=${distUrl}&isMobile=true&isFullPage=true&viewPortWidth=${screenWidth}&width=${screenWidth * dpi}&deviceScaleFactor=${dpi}&viewPortHeight=768`
}

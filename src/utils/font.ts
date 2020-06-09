import Taro from '@tarojs/taro'

const fonts = [{
  source: 'https://fonts.gstatic.cnpmjs.org/s/lato/v16/S6uyw4BMUTPHjxAwXjeu.woff2'
}, {
  source: 'https://fonts.gstatic.cnpmjs.org/s/lato/v16/S6uyw4BMUTPHjx4wXg.woff2'
}]

export function loadFont() {
  return Promise.all(
    fonts.map(f => Taro.loadFontFace({
      global: true,
      family: 'Lato',
      source: `url(${f.source})`,
      desc: {
        weight: '400'
      }
    }))
  )
}

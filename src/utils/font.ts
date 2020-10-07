import React from 'react'
import Taro from '@tarojs/taro'

const fonts = [{
  family: 'Lato',
  source: 'https://fonts.gstatic.cnpmjs.org/s/lato/v16/S6uyw4BMUTPHjxAwXjeu.woff2'
}, {
  family: 'Lato',
  source: 'https://fonts.gstatic.cnpmjs.org/s/lato/v16/S6uyw4BMUTPHjx4wXg.woff2'
}, {
  family: 'YSHaoShenTi',
  source: 'https://qcloud-1251807749.file.myqcloud.com/YSHaoShenTi.ttf'
}]

export function loadFont() {
  return Promise.all(
    fonts.map(f => Taro.loadFontFace({
      global: true,
      family: f.family,
      source: `url(${f.source})`,
      // desc: {
      //   weight: '400'
      // },
    }))
  )
}

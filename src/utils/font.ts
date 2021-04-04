import React from 'react'
import { loadFontFace } from 'remax/wechat'


const fonts = [{
  family: 'Lato',
  source: 'https://fonts.gstatic.cnpmjs.org/s/lato/v16/S6uyw4BMUTPHjxAwXjeu.woff2'
}, {
  family: 'Lato',
  source: 'https://fonts.gstatic.cnpmjs.org/s/lato/v16/S6uyw4BMUTPHjx4wXg.woff2'
}, {
  family: 'LxgwWenKai',
  source: 'https://qcloud-1251807749.cos.ap-shanghai.myqcloud.com/LXGWWenKai-Regular20210327.ttf'
}]

export function loadFont() {
  return Promise.all(
    fonts.map(f => loadFontFace({
      global: true,
      family: f.family,
      source: `url(${f.source})`,
      // desc: {
      //   weight: '400'
      // },
    }))
  )
}

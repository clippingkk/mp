import React from 'react'

import { Image } from 'remax/wechat'
import { getImageSrc } from '../../utils/image';

type KKImageProps = {
  src?: string,
}

function KKImage({ src }: KKImageProps) {
  if (!src) {
    return null
  }
  return (
    <Image
      src={getImageSrc(src)}
      className='local-class'
    />
  )
}

KKImage.externalClasses = ['local-class']

export default KKImage

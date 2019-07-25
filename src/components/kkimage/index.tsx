import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'
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

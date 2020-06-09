import Taro from '@tarojs/taro'
import { View, Navigator, Text } from '@tarojs/components'
import { IClippingItem } from '../../services/types'

import './style.styl'

type ClippingItemProps = {
  clipping: IClippingItem
}

function ClippingItem(props: ClippingItemProps) {
  return (
    <Navigator
      url={`/pages/clipping/clipping?id=${props.clipping.id}`}
      className='clipping'
    >
      <Text className='clipping-title'>{props.clipping.title}</Text>
      <Text className='clipping-content'>{props.clipping.content}</Text>
    </Navigator>
  )
}

export default ClippingItem

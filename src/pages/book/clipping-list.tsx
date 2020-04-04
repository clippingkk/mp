import Taro from '@tarojs/taro'
import { IClippingItem } from '../../services/clippings'
import Info from '../../components/info/info'
import { View, Navigator, Text } from '@tarojs/components'

import './clipping-list.styl'

type ClippingList = {
  clippings: IClippingItem[]
  loading: boolean
  reachEnd: boolean
}

function ClippingList(props: ClippingList) {
  return (
    <View className='clippings'>
      {props.clippings.map(c => (
        <Navigator
          url={`/pages/clipping/clipping?id=${c.id}`}
          key={c.id}
          className='clipping'
        >
          <Text className='clipping-title'>{c.title}</Text>
          <Text className='clipping-content'>{c.content}</Text>
        </Navigator>
      ))}
      {props.loading && (
        <Info text='😂 还在加载...' />
      )}
      {props.reachEnd && (
        <Info text='😮 再往下就没有了' />
      )}
    </View>
  )
}

export default ClippingList

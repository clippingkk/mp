import React from 'react'
import Taro from '@tarojs/taro'
import Info from '../../components/info/info'
import { View, Navigator, Text } from '@tarojs/components'
import ClippingItem from '../../components/clipping-item/clipping-item'
import { IClippingItem } from '../../services/types'

type ClippingList = {
  clippings: IClippingItem[]
  loading: boolean
  reachEnd: boolean
}

function ClippingList(props: ClippingList) {
  return (
    <View className='clippings'>
      {props.clippings.map((c: IClippingItem) => (
        <ClippingItem clipping={c} key={c.id} />
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

ClippingList.defaultProps = {
  clippings: []
}

export default ClippingList

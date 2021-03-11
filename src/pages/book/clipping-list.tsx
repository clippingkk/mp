import React from 'react'

import Info from '../../components/info/info'
import { View, Navigator, Text } from 'remax/wechat'
import ClippingItem from '../../components/clipping-item/clipping-item'
import { IClippingItem } from '../../services/types'
import { book_book_clippings } from '../../schema/__generated__/book'

type ClippingList = {
  clippings: readonly book_book_clippings[]
  loading: boolean
  reachEnd: boolean
}

function ClippingList(props: ClippingList) {
  return (
    <View className='clippings'>
      {props.clippings.map(c => (
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

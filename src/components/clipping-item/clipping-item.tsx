import React from 'react'

import { View, Navigator, Text } from 'remax/wechat'

import './style.styl'
import { profile_me_recents } from '../../schema/__generated__/profile'

type ClippingItemProps = {
  clipping: profile_me_recents
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

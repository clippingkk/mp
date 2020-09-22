import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './card.styl'

type CardProps = {
  children: any
}

function Card(props: CardProps) {
  return (
    <View className='cls-name card'>
      {props.children}
    </View>
  )
}

Card.externalClasses = ['cls-name']

export default Card

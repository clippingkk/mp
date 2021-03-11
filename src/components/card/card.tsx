import React from 'react'

import { View } from 'remax/wechat'

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

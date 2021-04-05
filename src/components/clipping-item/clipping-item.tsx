import React from 'react'

import { Navigator, Text } from 'remax/wechat'

import styles from './style.styl'


type ClippingItemProps = {
  clipping: {
    id: number
    title: string
    content: string
  }
}

function ClippingItem(props: ClippingItemProps) {
  return (
    <Navigator
      url={`/pages/clipping/clipping?id=${props.clipping.id}`}
      className={styles.clipping + ' with-fade-in'}
    >
      <Text className={styles['clipping-title']}>{props.clipping.title}</Text>
      <Text className={styles['clipping-content']}>{props.clipping.content}</Text>
    </Navigator>
  )
}

export default ClippingItem

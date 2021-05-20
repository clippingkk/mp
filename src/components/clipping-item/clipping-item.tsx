import React from 'react'

import { Navigator, Text } from 'remax/wechat'
import { WenquBook } from '../../services/wenqu'

import styles from './style.styl'


type ClippingItemProps = {
  clipping: {
    id: number
    title: string
    content: string
  }
  book?: WenquBook
}

function ClippingItem(props: ClippingItemProps) {
  return (
    <Navigator
      url={`/pages/clipping/clipping?id=${props.clipping.id}`}
      className={styles.clipping + ' with-fade-in'}
    >
      <Text className={styles['clipping-content']}>
        {props.clipping.content}
      </Text>
      <Text className={styles['clipping-title']}>
        {props.book?.title ?? props.clipping.title}
      </Text>
    </Navigator>
  )
}

export default ClippingItem

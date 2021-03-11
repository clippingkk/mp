import React from 'react'
import { Navigator, View, Text } from 'remax/wechat'
import { useSingleBook } from '../../hooks/book'
import { WenquBook } from '../../services/wenqu'

import styles from './book.module.styl'
type BookCoverProps = {
  book: WenquBook
}

function BookCover(props: BookCoverProps) {
  const b = props.book
  if (!b) {
    return null
  }

  return (
    <Navigator
      className={styles.book}
      key={b.id}
      style={{ backgroundImage: `url(${b.image})` }}
      url={`/pages/book/index?id=${b.id}&bookId=${b.doubanId}`}
    >
      <View className={styles.info}>
        <Text className={styles.title}>{b.title}</Text>
        <Text className={styles.author}>{b.author}</Text>
      </View>
    </Navigator>
  )
}

export default BookCover

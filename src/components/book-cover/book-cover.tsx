import React from 'react'
import { Navigator, View, Text } from '@tarojs/components'
import { useSingleBook } from '../../hooks/book'

const styles = require('./book.module.styl')
type BookCoverProps = {
  doubanId: string
}

function BookCover(props: BookCoverProps) {
  const b = useSingleBook(props.doubanId)

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

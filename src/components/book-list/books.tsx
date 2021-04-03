import React from 'react'

import { View } from 'remax/wechat'
import Info from '../../components/info/info'
import BookCover from '../../components/book-cover/book-cover'
import { books_books } from '../../schema/__generated__/books'
import { useMultipBook } from '../../hooks/book'
import styles from './books.styl'


type BooksProps = {
  books: readonly books_books[]
  loading: boolean
  reachEnd: boolean
}

function BookList(props: BooksProps) {
  const bs = useMultipBook(props.books.map(x => x.doubanId))
  return (
    <View className={styles.books}>
      {bs.map(b => (
        <BookCover book={b} key={b.doubanId} />
      ))}
      {props.loading && (
        <Info text='😂 还在加载...' key='loading' />
      )}
      {props.reachEnd && (
        <Info text='😮 再往下就没有了' withTip key='done' />
      )}
    </View>
  )
}

BookList.defaultProps = {
  books: [],
  loading: true,
  reachEnd: false
}

export default BookList

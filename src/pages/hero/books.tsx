import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { IBook } from '../../services/books'
import Info from '../../components/info/info'
import { book_book } from '../../schema/__generated__/book'
import BookCover from '../../components/book-cover/book-cover'
import { books_books } from '../../schema/__generated__/books'
import { useMultipBook } from '../../hooks/book'

const styles = require('./books.module.styl')

type BooksProps = {
  books: readonly books_books[]
  loading: boolean
  reachEnd: boolean
}

function Books(props: BooksProps) {
  const bs = useMultipBook(props.books.map(x => x.doubanId))
  return (
    <View className={styles.books}>
      {bs.map(b => (
        <BookCover book={b} key={b.doubanId} />
      ))}
      {props.loading && (
        <Info text='😂 还在加载...' />
      )}
      {props.reachEnd && (
        <Info text='😮 再往下就没有了' withTip />
      )}
    </View>
  )
}

Books.defaultProps = {
  books: [],
  loading: true,
  reachEnd: false
}

export default Books

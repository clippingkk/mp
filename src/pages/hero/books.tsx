import Taro from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { IBook } from '../../services/books'
import Info from '../../components/info/info'

const styles = require('./books.module.styl')

type BooksProps = {
  books: IBook[]
  loading: boolean
  reachEnd: boolean
}

function Books(props: BooksProps) {
  return (
    <View className={styles.books}>
      {props.books.map(b => (
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

Books.defaultProps = {
  books: [],
  loading: true,
  reachEnd: false
}

export default Books

import Taro, {
  useRouter,
  useEffect,
  useState,
  useCallback,
  useRef,
  useReachBottom
} from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { getBookClippings, searchBookDetail, IBook } from '../../services/books'
import { useSelector } from '@tarojs/redux'
import NavigationBar from '../../components/navigation-bar'
import { IClippingItem } from '../../services/clippings'
import { useNavigateUp } from '../../hooks/navigationbar'
import ClippingList from './clipping-list'

import './book.styl'
import Divider from '../../components/divider/divider'
import Card from '../../components/card/card'

function useBookAndClippings(bookID: number) {
  const [book, setBook] = useState<IBook>({} as IBook)
  const [clippings, setClippings] = useState<IClippingItem[]>([])
  const [loading, setLoading] = useState(false)
  const offset = useRef(0)
  const [reachEnd, setReachEnd] = useState(false)

  const { userID } = useSelector<any, { userID: number }>(store => ({
    userID: store.user.profile.id,
  }))

  const loadMoreClippings = useCallback(() => {
    if (reachEnd || loading) {
      return Promise.resolve()
    }

    setLoading(true)

    return getBookClippings(userID, bookID, offset.current).then(res => {
      if (res.length < 20) {
        setReachEnd(true)
      }
      setClippings(c => [...c, ...res])
      offset.current += 20
    }).finally(() => {
      setLoading(false)
    })
  }, [bookID, userID, reachEnd, loading])

  useEffect(() => {
    Promise.all([
      searchBookDetail(bookID),
      loadMoreClippings()
    ]).then(res => {
      setBook(res[0])
    })
  }, [bookID, userID])

  return {
    book,
    loading,
    clippings,
    loadMoreClippings,
    reachEnd
  }

}

function BookPage() {
  const route = useRouter()
  const bookID = ~~route.params.id
  const doubanID = ~~route.params.bookId

  const { book, clippings, loadMoreClippings, reachEnd, loading } = useBookAndClippings(doubanID)
  const onNavigateUp = useNavigateUp()

  useReachBottom(() => {
    loadMoreClippings()
  })


  return (
    <View>
      <NavigationBar hasHolder={true} onBack={onNavigateUp}>
        {book.title}
      </NavigationBar>
      <View className='container'>
        <Card cls-name='book'>
          <Image src={book.image} className='book-cover' />
          <View className='book-info'>
            <Text className='book-title'>{book.title}</Text>
            <Text className='book-author'>{book.author}</Text>
            <Text className='book-summary'>{book.summary}</Text>
          </View>
        </Card>
        <Divider />
        <View className='clippings'>
          <ClippingList
            loading={loading}
            reachEnd={reachEnd}
            clippings={clippings}
          />
        </View>
      </View>
    </View>
  )
}

export default BookPage

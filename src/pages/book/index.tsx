import Taro, { useRouter, useEffect, useState, useCallback } from '@tarojs/taro'
import { View } from '@tarojs/components';
import { getBookClippings, searchBookDetail, IBook } from '../../services/books';
import { useSelector } from '@tarojs/redux';
import NavigationBar from '../../components/navigation-bar';
import { IClippingItem } from '../../services/clippings';
import { useNavigateUp } from '../../hooks/navigationbar';

function useBookAndClippings(bookID: number) {
  const [book, setBook] = useState<IBook>({} as IBook)
  const [clippings, setClippings] = useState<IClippingItem[]>([])
  const [loading, setLoading] = useState(true)

  const { userID } = useSelector<any, { userID: number }>(store => ({
    userID: store.user.profile.id,
  }))

  const loadMoreClippings = useCallback(() => {
    getBookClippings(userID, bookID, 0).then(res => {
      setClippings(c => [...c, ...res])
    })
  }, [bookID, userID])

  useEffect(() => {
    searchBookDetail(bookID).then(res => {
      setBook(res)
    })

    loadMoreClippings()
  }, [bookID, userID])

  return {
    book,
    clippings
  }

}

function BookPage() {
  const route = useRouter()
  const bookID = ~~route.params.id
  const doubanID = ~~route.params.bookId

  const { book, clippings } = useBookAndClippings(doubanID)

  const onNavigateUp = useNavigateUp()

  return (
    <View>
      <NavigationBar hasHolder={true} onBack={onNavigateUp}>
        {book.title}
      </NavigationBar>
      <View >
        body
      </View>
    </View>
  )
}

export default BookPage

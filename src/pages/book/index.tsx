import React, {
  useEffect,
  useCallback, useState, useRef
} from 'react'
import Taro, {
  useReachBottom, getCurrentInstance
} from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { getBookClippings, searchBookDetail, IBook } from '../../services/books'
import { useSelector } from 'react-redux'
import NavigationBar from '../../components/navigation-bar'
import { useNavigateUp } from '../../hooks/navigationbar'
import ClippingList from './clipping-list'

import './book.styl'
import Divider from '../../components/divider/divider'
import Card from '../../components/card/card'
import { IClippingItem } from '../../services/types'

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
  const params = getCurrentInstance().router?.params
  const bookID = ~~(params?.id ?? 0)
  const doubanID = ~~(params?.bookId ?? 0)

  const { book, clippings, loadMoreClippings, reachEnd, loading } = useBookAndClippings(doubanID)
  const onNavigateUp = useNavigateUp()

  useReachBottom(() => {
    loadMoreClippings()
  })


  return (
    <View>
      <NavigationBar hasHolder={true} onBack={onNavigateUp}>
        <Text>{book.title}</Text>
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

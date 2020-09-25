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
import { useSingleBook } from '../../hooks/book'
import { useQuery } from '@apollo/client'
import bookQuery from '../../schema/book.graphql'
import { book, bookVariables } from '../../schema/__generated__/book'
import { DEFAULT_LOADING_IMAGE, PAGINATION_STEP } from '../../constants/config'

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
  const doubanID = params?.bookId ?? '0'

  const b = useSingleBook(doubanID)

  const [reachEnd, setReachEnd] = useState(false)

  const { data, loading, fetchMore } = useQuery<book, bookVariables>(bookQuery, {
    variables: {
      id: ~~doubanID,
      pagination: {
        limit: PAGINATION_STEP,
        offset: 0
      }
    }
  })

  // const { book, clippings, loadMoreClippings, reachEnd, loading } = useBookAndClippings(doubanID)
  const onNavigateUp = useNavigateUp()

  useReachBottom(() => {
    if (loading) {
      return
    }
    fetchMore({
      variables: {
        pagination: {
          offset: data?.book.clippings.length,
          limit: PAGINATION_STEP,
        }
      },
      updateQuery(prev: book, { fetchMoreResult}) {
        if (!fetchMoreResult || fetchMoreResult.book.clippings.length < PAGINATION_STEP) {
          setReachEnd(true)
          return
        }

        return {
          ...prev,
          book: {
            ...prev.book,
            clippings: [
              ...prev.book.clippings,
              ...fetchMoreResult.book.clippings
            ]
          }
        }
      }
    })
  })

  return (
    <View>
      <NavigationBar hasHolder={true} onBack={onNavigateUp}>
        <Text>{b?.title}</Text>
      </NavigationBar>
      <View className='container'>
        <Card cls-name='book'>
          <Image src={b?.image ?? DEFAULT_LOADING_IMAGE} className='book-cover' />
          <View className='book-info'>
            <Text className='book-title'>{b?.title}</Text>
            <Text className='book-author'>{b?.author}</Text>
            <Text className='book-summary'>{b?.summary}</Text>
          </View>
        </Card>
        <Divider />
        <View className='clippings'>
          <ClippingList
            loading={loading}
            reachEnd={reachEnd}
            clippings={data?.book.clippings}
          />
        </View>
      </View>
    </View>
  )
}

export default BookPage

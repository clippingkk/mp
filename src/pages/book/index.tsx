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
import { useSingleBook } from '../../hooks/book'
import { useQuery } from '@apollo/client'
import colorThief from 'miniapp-color-thief'
import bookQuery from '../../schema/book.graphql'
import { book, bookVariables } from '../../schema/__generated__/book'
import { DEFAULT_LOADING_IMAGE, PAGINATION_STEP } from '../../constants/config'

let lastBookId = ''

function useThemeColor(img: string): string {
  Taro.canvasGetImageData({
    canvasId: '',
    x: 0,
    y: 0,
    width: 300,
    height: 400,
  }).then(res => {
    const palette = colorThief(res.data)
      .palette()
      .getHex()
    console.log(palette); // [[0,0,0],[0,0,0],[0,0,0]...]
  })
  return ''
}


function BookPage() {
  const params = getCurrentInstance().router?.params
  let doubanID = ''
  if (params?.bookId) {
    lastBookId = params.bookId
    doubanID = params.bookId
  } else {
    doubanID = lastBookId
  }

  const b = useSingleBook(doubanID)

  const [reachEnd, setReachEnd] = useState(false)

  const { data, loading, fetchMore } = useQuery<book, bookVariables>(bookQuery, {
    variables: {
      id: ~~doubanID,
      pagination: {
        limit: PAGINATION_STEP,
        offset: 0
      }
    },
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
      updateQuery(prev: book, { fetchMoreResult }) {
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
    <View className='book-page'>
      <NavigationBar hasHolder={false} onBack={onNavigateUp}>
        <Text></Text>
      </NavigationBar>
      <View>
        <Image src={b?.image ?? DEFAULT_LOADING_IMAGE} className='book-cover' />
        <View className='book-header-detail'>
          <Image src={b?.image ?? DEFAULT_LOADING_IMAGE} className='book-img' />
          <View className='book-info'>
            <Text className='book-title'>{b?.title}</Text>
            <Text className='book-author'>{b?.author}</Text>
            <Text className='book-summary'>{b?.summary}</Text>
          </View>
        </View>
      </View>
      <View className='container'>
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

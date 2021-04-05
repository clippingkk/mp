import React, { useEffect, useState } from 'react'
import {
  View, Image, Text, canvasGetImageData, Button,
} from 'remax/wechat'
import { useQuery as usePageQuery } from 'remax'
import NavigationBar from '../../components/navigation-bar'
import { useNavigateUp } from '../../hooks/navigationbar'
import ClippingList from './clipping-list'

import './book.styl'
import Divider from '../../components/divider/divider'
import { useSingleBook } from '../../hooks/book'
import { useApolloClient, useQuery } from '@apollo/client'
import colorThief from 'miniapp-color-thief'
import bookQuery from '../../schema/book.graphql'
import { book, bookVariables, book_book } from '../../schema/__generated__/book'
import { DEFAULT_LOADING_IMAGE, PAGINATION_STEP } from '../../constants/config'
import { usePageEvent } from 'remax/macro';
import ClippingShare from '../../components/konzert/clipping'
import { UTPService } from '../../utils/konzert'
import { useSelector } from 'react-redux'
import { TGlobalStore } from '../../reducers'
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin'

let lastBookId = ''

function useThemeColor(img: string): string {
  canvasGetImageData({
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
  const params = usePageQuery()
  let doubanID = ''
  if (params?.bookId) {
    lastBookId = params.bookId
    doubanID = params.bookId
  } else {
    doubanID = lastBookId
  }

  const b = useSingleBook(doubanID)

  const [bookRes, setBookResp] = useState<book_book | null>(null)
  const client = useApolloClient()
  const [loading, setLoading] = useState(false)

  const [reachEnd, setReachEnd] = useState(false)

  useEffect(() => {
    setLoading(true)
    client.query<book, bookVariables>({
      query: bookQuery,
      variables: {
        id: ~~doubanID,
        pagination: {
          limit: PAGINATION_STEP,
          offset: 0
        }
      },
    }).then(res => {
      setBookResp(res.data.book)
    }).finally(() => {
      setLoading(false)
    })
  }, [])
  const user = useSelector<TGlobalStore, wechatLogin_mpAuth_user>(s => s.user.profile)
  const [vis, setVis] = useState(false)

  const onNavigateUp = useNavigateUp()
  usePageEvent('onReachBottom', () => {
    if (loading) {
      return
    }
    setLoading(true)
    client.query<book, bookVariables>({
      query: bookQuery,
      variables: {
        id: ~~doubanID,
        pagination: {
          limit: PAGINATION_STEP,
          offset: bookRes?.clippings.length || 0
        }
      },
    }).then(res => {
      if (res.data.book.clippings.length < PAGINATION_STEP) {
        setReachEnd(true)
      }
      setBookResp(s => ({
        ...(s || {} as any),
        clippings: s?.clippings.concat(res.data.book.clippings)
      }))
    }).finally(() => {
      setLoading(false)
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
          <View className='book-header-main'>
            <Image src={b?.image ?? DEFAULT_LOADING_IMAGE} className='book-img' />
            <View className='book-info'>
              <Text className='book-title'>{b?.title}</Text>
              <Text className='book-author'>{b?.author}</Text>
            </View>
          </View>
          <Text className='book-summary'>{b?.summary}</Text>
          <Button
            className='book--button__share'
            onClick={() => {
              setVis(true)
            }}
          >Share the Book</Button>
        </View>

        {vis && (
          <ClippingShare
            shareType={UTPService.book}
            cid={0}
            bid={b?.id || 0}
            uid={user.id}
            onCancel={() => {
              setVis(false)
            }}
          />
        )}

      </View>
      <View className='container'>
        <Divider />
        <View className='clippings'>
          <ClippingList
            loading={loading}
            reachEnd={reachEnd}
            clippings={bookRes?.clippings}
          />
        </View>
      </View>
    </View>
  )
}

export default BookPage

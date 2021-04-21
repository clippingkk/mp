import React, { useCallback, useEffect, useRef, useState } from 'react'
// import Taro, { useShareAppMessage, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Text, navigateTo, showToast } from 'remax/wechat'
import './hero.styl'
import NavigationBar from '../../components/navigation-bar';
import { useSelector } from 'react-redux';
import NotBindContent from '../../components/not-bind-content';
import Books from '../../components/book-list/books';
import { useApolloClient, useQuery } from '@apollo/client';
import booksQuery from '../../schema/books.graphql'
import { TGlobalStore } from '../../reducers';
import { books, booksVariables, books_books } from '../../schema/__generated__/books';
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin';
import { PAGINATION_STEP } from '../../constants/config';
import { usePageEvent } from '@remax/macro';
import { bookVariables } from '../../schema/__generated__/book';

function HeroPage() {
  const user = useSelector<TGlobalStore, wechatLogin_mpAuth_user>(s => s.user.profile)
  const hasBind = !user.email.endsWith('@clippingkk.annatarhe.com')

  const [reachEnd, setReachEnd] = useState(false)
  const [loading, setLoading] = useState(false)

  const [bs, setBs] = useState<readonly books_books[]>([])
  const client = useApolloClient()

  useEffect(() => {
    setLoading(true)
    client.query<books, booksVariables>({
      query: booksQuery,
      variables: {
        pagination: {
          limit: PAGINATION_STEP,
          offset: 0,
        }
      }
    }).then(res => {
      setBs(res.data.books)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  usePageEvent('onPullDownRefresh', () => {
    setLoading(true)
    client.query<books, booksVariables>({
      query: booksQuery,
      variables: {
        pagination: {
          limit: PAGINATION_STEP,
          offset: 0,
        }
      }
    }).then(res => {
      setBs(res.data.books)
    }).finally(() => {
      setLoading(false)
    })
    // refetch({
    //   pagination: {
    //     limit: PAGINATION_STEP,
    //     offset: 0
    //   }
    // })
  })

  // useEffect(() => {
  //   bookLengthRef.current = bs?.books?.length ?? 0
  // }, [bs?.books.length])
  // console.log("bsbsbsbs", bs?.books)

  usePageEvent('onReachBottom', () => {
    if (loading || reachEnd) {
      return
    }
    setLoading(true)
    client.query<books, booksVariables>({
      query: booksQuery,
      fetchPolicy: 'no-cache',
      variables: {
        pagination: {
          limit: PAGINATION_STEP,
          offset: bs.length,
        }
      }
    }).then(res => {
      if (res.data.books.length < PAGINATION_STEP) {
        setReachEnd(true)
      }
      setBs(
        s => s.concat(res.data.books)
          .reduce((acc: books_books[], cur: books_books) => {
            const idx = acc.findIndex(x => x.doubanId === cur.doubanId)

            if (idx === -1) {
              acc.push(cur)
            }
            return acc
          }, [] as any[])
      )
    }).finally(() => {
      setLoading(false)
    })
    // console.log(bs?.books.length, bookLengthRef.current)
    // fetchMore({
    //   variables: {
    //     pagination: {
    //       limit: PAGINATION_STEP,
    //       offset: bs?.books.length
    //     }
    //   }
    // }).then(res => {
    //   console.log("fetch more: ", res)
    // })
  })

  usePageEvent('onShareAppMessage', () => {
    return {
      title: 'kindle 书摘管理',
      page: '/pages/landing/landing'
    }
  })

  const onNavigateUp = useCallback(() => {
    showToast({
      title: '搜索在下个版本支持哦~',
      icon: 'none'
    })
    return
    navigateTo({
      url: '/pages/search/search'
    })
  }, [])
  return (
    <View className='hero'>
      <NavigationBar hasHolder homeIcon='👀' onBack={onNavigateUp}>
        <Text className='hero-title'>我看过的</Text>
      </NavigationBar>
      <View className='hero-body'>
        {hasBind && bs ? (
          <Books
            books={bs!}
            loading={loading}
            reachEnd={reachEnd}
          />
        ) : (
          <NotBindContent />
        )}
      </View>
    </View>
  )
}

export default HeroPage

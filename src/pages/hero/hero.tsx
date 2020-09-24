import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useShareAppMessage, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './hero.styl'
import NavigationBar from '../../components/navigation-bar';
import { useSelector } from 'react-redux';
import NotBindContent from '../../components/not-bind-content';
import Books from './books';
import { useQuery } from '@apollo/client';
import booksQuery from '../../schema/books.graphql'
import { TGlobalStore } from '../../reducers';
import { books, booksVariables } from '../../schema/__generated__/books';

const PAGINATION_STEP = 10

function HeroPage() {
  const { userID, hasBind } = useSelector<TGlobalStore, { userID: number, hasBind: boolean }>(store => ({
    userID: store.user.profile.id,
    hasBind: store.user.profile.id === 1
  }))

  const [reachEnd, setReachEnd] = useState(false)

  const { data: books, fetchMore, loading, error, refetch } = useQuery<books, booksVariables>(booksQuery, {
    variables: {
      pagination: {
        limit: PAGINATION_STEP,
        offset: 0
      }
    },
  })

  usePullDownRefresh(() => {
    refetch({
      pagination: {
        limit: PAGINATION_STEP,
        offset: 0
      }
    })
  })

  useReachBottom(() => {
    fetchMore({
      variables: {
        limit: 10,
        offset: books?.books.length
      },
      updateQuery(prev: books, { fetchMoreResult }) {
        if (!fetchMoreResult || fetchMoreResult.books.length < PAGINATION_STEP) {
          setReachEnd(true)
          return prev
        }

        return {
          ...prev,
          books: {
            ...prev.books,
            ...fetchMoreResult.books
          }
        } as books
      }
    })
  })

  useShareAppMessage(() => {
    return {
      title: 'kindle 书摘管理',
      page: '/pages/landing/landing'
    }
  })

  const onNavigateUp = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/search/search'
    })
  }, [])

  return (
    <View className='hero'>
      <NavigationBar hasHolder homeIcon='👀' onBack={onNavigateUp}>
        <Text className='hero-title'>我看过的</Text>
      </NavigationBar>
      <View className='hero-body'>
        {hasBind && books?.books ? (
          <Books
            books={books.books!}
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

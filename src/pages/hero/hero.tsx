import Taro, { Component, useShareAppMessage, useState, useRef, useCallback, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './hero.styl'
import NavigationBar from '../../components/navigation-bar';
import { useSelector } from '@tarojs/redux';
import NotBindContent from '../../components/not-bind-content';
import Books from './books';
import { useBookList } from './hooks';

function HeroPage() {
  const { userID, hasBind } = useSelector<any, { userID: number, hasBind: boolean }>(store => ({
    userID: store.user.profile.id,
    hasBind: store.user.hasBind
  }))

  const { books, loadMore, loading, reachEnd } = useBookList(userID)
  usePullDownRefresh(() => {
    loadMore(true)
  })

  useReachBottom(() => {
    loadMore()
  })


  useShareAppMessage(() => {
    return {
      title: 'kindle 书摘管理',
      page: '/pages/landing/landing'
    }
  })

  return (
    <View className='hero'>
      <NavigationBar hasHolder>
        我看过的
        </NavigationBar>
      <View className='hero-body'>
        {hasBind ? (
          <Books books={books} loading={loading} reachEnd={reachEnd} />
        ) : (
            <NotBindContent />
          )}
      </View>
    </View>
  )
}

export default HeroPage

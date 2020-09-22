import Taro, { Component, useShareAppMessage, useState, useRef, useCallback, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './hero.styl'
import NavigationBar from '../../components/navigation-bar';
import { useSelector } from 'react-redux';
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
        {hasBind ? (
          <Books books={books} loading={loading} reachEnd={reachEnd} />
        ) : (
            <NotBindContent />
          )}
      </View>
    </View>
  )
}

HeroPage.config = {
  // backgroundColorTop: 'rgba(1,119,215,0.8)',
  backgroundColor: '#ecf0f1',
  // backgroundColorBottom: '#ffffff'
}

export default HeroPage

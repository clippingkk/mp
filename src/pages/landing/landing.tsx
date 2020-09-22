import React, { useEffect, useCallback } from 'react'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import styles from './landing.module.styl'
import { authFlow } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../actions/user';

function getClippingID(scene?: string) {
  if (!scene) {
    return null
  }

  // c=8!b=2
  const sceneData = decodeURIComponent(scene.trim())

  const parsedScene = sceneData.split('!').reduce((acc: any, current: string) => {
    const [k, v] = current.split('=')
    acc[k] = v
    return acc
  }, {})

  return parsedScene.c
}

function Landing() {
  const dispatch = useDispatch()
  const params = getCurrentInstance().router?.params
  const onLogin = useCallback(() => {
    Taro.showLoading({ mask: true, title: 'Loading...' })
    authFlow().then(resp => {
      dispatch(updateUserInfo(resp))
      setTimeout(() => {
        // c is clipping
        const c = getClippingID(params?.scene)
        Taro.hideLoading()
        if (c) {
          return Taro.redirectTo({
            url: `/pages/clipping/clipping?id=${c}`
          })
        }

        return Taro.switchTab({
          url: '/pages/hero/hero'
        })
      }, 100)
    }).catch(e => {
      console.log(e)
      Taro.hideLoading()
      Taro.showToast({
        title: '🤷️ 哎呀呀，登陆出错了',
        icon: 'none'
      })
    })
  }, [params])

  useEffect(() => {
    onLogin()
  }, [])

  return (
    <View className={styles.container}>
      <Text> Loading... </Text>
      <Button className={styles.retry} onClick={onLogin}>Retry</Button>
    </View>
  )
}

export default Landing

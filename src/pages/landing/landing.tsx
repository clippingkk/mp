import React, { useEffect, useCallback } from 'react'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import styles from './landing.module.styl'
import { authFlow } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../actions/user';
import { useLazyQuery } from '@apollo/client'
import authQuery from '../../schema/login.graphql'
import { wechatLogin, wechatLoginVariables } from '../../schema/__generated__/wechatLogin';
import { updateToken } from '../../store/global';

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
  const [exec, { data, called, loading, error }] = useLazyQuery<wechatLogin, wechatLoginVariables>(authQuery)
  const onLogin = useCallback(async () => {
    if (loading) {
      return
    }
    const res = await Taro.login()
    await exec({
      variables: {
        code: res.code
      }
    })
  }, [params, exec, loading ])

  useEffect(() => {
    if (!called) {
      return
    }
    if (!data) {
      return
    }
    updateToken(data.mpAuth.token)
      dispatch(updateUserInfo(data.mpAuth.user))
      setTimeout(() => {
        // c is clipping
        const c = getClippingID(params?.scene)
        if (c) {
          return Taro.redirectTo({
            url: `/pages/clipping/clipping?id=${c}`
          })
        }

        return Taro.switchTab({
          url: '/pages/hero/hero'
        })
      }, 100)
  }, [data, called])

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

import React, { useEffect, useCallback } from 'react'
import { View, Text, Button, hideLoading, login, redirectTo, showLoading, showToast, switchTab } from 'remax/wechat'
import styles from './landing.module.styl'
import { authFlow } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../actions/user';
import { useLazyQuery } from '@apollo/client'
import authQuery from '../../schema/login.graphql'
import { wechatLogin, wechatLoginVariables } from '../../schema/__generated__/wechatLogin';
import { updateToken } from '../../store/global';
import { usePageInstance } from '@remax/framework-shared';

function getClippingID(params: any) {
  if (!params) {
    return null
  }

  if (params.c) {
    return params.c
  }

  if (!params.scene) {
    return null
  }

  // c=8!b=2
  const sceneData = decodeURIComponent(params.scene.trim())

  const parsedScene = sceneData.split('!').reduce((acc: any, current: string) => {
    const [k, v] = current.split('=')
    acc[k] = v
    return acc
  }, {})

  return parsedScene.c
}

function Landing() {
  const dispatch = useDispatch()
  const params = usePageInstance().router?.params
  const [exec, { data, called, loading, error }] = useLazyQuery<wechatLogin, wechatLoginVariables>(authQuery)
  const onLogin = useCallback(async () => {
    if (loading) {
      return
    }
    showLoading({
      mask: true,
      title: 'Loading'
    })
    const res = await login()
    exec({
      variables: {
        code: res.code
      }
    })
  }, [exec, loading])

  useEffect(() => {
    if (called && error) {
      hideLoading()
      showToast({
        icon: 'none',
        title: error.message
      })
      return
    }
    if (!called) {
      return
    }
    if (!data) {
      return
    }
    updateToken(data.mpAuth.token)
    dispatch(updateUserInfo(data.mpAuth.user, data.mpAuth.token))
    setTimeout(() => {
      // c is clipping
      const c = getClippingID(params)
      hideLoading()
      if (c) {
        return redirectTo({
          url: `/pages/clipping/clipping?id=${c}`
        })
      }

      return switchTab({
        url: '/pages/hero/hero'
        // url: '/pages/user/user'
      })
    }, 100)
  }, [data, called, error])

  useEffect(() => {
    onLogin()
  }, [])

  return (
    <View className={styles.container}>
      {loading && (
        <Text> Loading... </Text>
      )}
      {called && error && (
        <Button className={styles.retry} onClick={onLogin}>Retry</Button>
      )}
    </View>
  )
}

export default Landing

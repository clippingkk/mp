import React, { useCallback, useEffect } from 'react'

import { View, Form, Button, Input, Text, scanCode, showToast, showLoading, hideLoading } from 'remax/wechat';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../actions/user';
import { useNavigateUp } from '../../hooks/navigationbar';
import bindMutation from '../../schema/bind.graphql'
import { useApolloClient, useMutation } from '@apollo/client';
import Base64 from '../../utils/base64'
import { wechatBindByKey, wechatBindByKeyVariables } from '../../schema/__generated__/wechatBindByKey';
import { updateToken } from '../../store/global';

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function BindingPage() {
  const dispatch = useDispatch()

  const [exec, { data, called, loading, error }] = useMutation<wechatBindByKey, wechatBindByKeyVariables>(bindMutation)
  const client = useApolloClient()

  const onScan = useCallback(async () => {
    const d = await scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode']
    })
    const k = Base64.decode(d.rawData)

    showLoading({
      mask: true,
      title: 'loading...'
    })

    exec({
      variables: {
        key: k
      }
    }).finally(() => {
      hideLoading()
    })
  }, [])
  const onNavigateUp = useNavigateUp()

  useEffect(() => {
    if (!called) {
      return
    }
    if (loading) {
      return
    }

    if (error) {
      showToast({
        title: "❌ " + error.message,
        icon: 'none'
      })
      return
    }

    if (!data) {
      return
    }

    updateToken(data.wechatBindByKey.token)
    showToast({
      icon: 'none',
      title: '绑定成功!'
    })
    client.clearStore().
      then(() => client.resetStore()).
      then(() => delay(100)).
      then(() => {
        dispatch(updateUserInfo(data.wechatBindByKey.user, data.wechatBindByKey.token))
        onNavigateUp()
      })
  }, [called, data, loading, error])


  return (
    <View className="bind-page">
      <NavigationBar hasHolder onBack={onNavigateUp}>
        绑定账户
        </NavigationBar>
      <View className="body">
        <View className='inner'>
          <Text className='tip'>
            请使用电脑登陆 https://kindle.annatarhe.com
            </Text>
          <Text className='tip'>
            打开个人中心的 "微信小程序绑定"
          </Text>
          <Button
            onClick={onScan}
            disabled={loading}
            className='scan-btn'
          >
            Scan
             </Button>
        </View>
      </View>
    </View>
  )
}

export default BindingPage

import React, { useCallback, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Button, Input, Text } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatBinding } from '../../services/auth';
import { connect, useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../actions/user';
import { TGlobalStore } from '../../reducers';
import { useNavigateUp } from '../../hooks/navigationbar';
import bindMutation from '../../schema/bind.graphql'
import { useMutation } from '@apollo/client';
import Base64 from '../../utils/base64'
import { wechatBindByKey, wechatBindByKeyVariables } from '../../schema/__generated__/wechatBindByKey';

type InputValue = {
  email: string,
  pwd: string
}

function BindingPage() {
  const dispatch = useDispatch()

  const [exec, { data, called, loading, error }] = useMutation<wechatBindByKey, wechatBindByKeyVariables>(bindMutation)

  const onScan = useCallback(async () => {
    const d = await Taro.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode']
    })
    const k = Base64.decode(d.rawData)

    exec({
      variables: {
        key: k
      }
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
      // display error
      return
    }

    if (!data) {
      return
    }

    // TODO: update data
    dispatch(updateUserInfo(data.wechatBindByKey.user, data.wechatBindByKey.token))
    // redirect to home screen
  }, [called, data, loading, error])


  return (
      <View className="bind-page">
        <NavigationBar hasHolder onBack={onNavigateUp}>
          绑定账户
        </NavigationBar>
        <View className="body">

          <Text>请使用电脑登陆 https://kindle.annatarhe.com 打开个人中心的 "微信小程序绑定"</Text>
          <Button onClick={onScan}>Scan</Button>
        </View>
      </View>
  )
}

export default BindingPage

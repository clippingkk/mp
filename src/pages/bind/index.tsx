import React, { useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Form, Button, Input, Text } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatBinding } from '../../services/auth';
import { connect, useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../actions/user';
import { TGlobalStore } from '../../reducers';
import { useNavigateUp } from '../../hooks/navigationbar';

type InputValue = {
  email: string,
  pwd: string
}

function BindingPage() {
  const openid = useSelector<TGlobalStore, string>(s => s.user.token)
  const token = useSelector<TGlobalStore, string>(s => s.user.token)

  const dispatch = useDispatch()

  const onSubmit = useCallback(async (e) => {
    const values = e.detail.value as InputValue

    if (!values.email || !values.pwd) {
      Taro.showToast({
        icon: "none",
        title: "请填写账户哦~"
      })
      return
    }

    Taro.showLoading({ mask: true, title: 'Checking...' })

    try {
      const data = await wechatBinding(openid, values.email, values.pwd)
      dispatch(updateUserInfo(data))

      Taro.hideLoading()
      Taro.showToast({
        icon: "none",
        title: "绑定成功啦~"
      })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({
        icon: "none",
        title: "绑定失败，请重试哦"
      })
    }
  }, [openid])
  const onNavigateUp = useNavigateUp()

  return (
      <View className="bind-page">
        <NavigationBar hasHolder onBack={onNavigateUp}>
          绑定账户
        </NavigationBar>
        <View className="body">
          <Text className="tip">请输入 https://kindle.annatarhe.com 的账户密码以进行绑定，如无账户请使用电脑登陆网站注册，然后在此页面输入账户</Text>
          <Form onSubmit={onSubmit} className="bind-form">
            <Input
              type="text"
              placeholder="email"
              className="form-input"
              name="email"
              confirmType="next"
              value=""
            />
            <View className="divider" />
            <Input
              className="form-input"
              type="text"
              password
              placeholder="password"
              name="pwd"
              value=""
              confirmType="done"
            />
            <Button
              className="form-submit"
              formType="submit"
            >绑定</Button>
          </Form>
        </View>
      </View>
  )
}

export default BindingPage

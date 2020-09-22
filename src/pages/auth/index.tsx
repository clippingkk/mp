import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatLogin } from '../../services/auth';

class AuthPage extends React.Component {
  async componentDidMount() {
    Taro.showLoading()

    const { code } = await Taro.login()

    try {
      await wechatLogin(code)
      Taro.hideLoading()
    } catch (e) {
      console.log(e)
      Taro.hideLoading()
      Taro.showToast({
        icon: 'none',
        title: e.toString(),
        mask: true
      })

      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/bind/index'
        })
      }, 2000)
    }
  }
  render() {
    return (
      <View className="auth-page">
      </View>
    )
  }
}

export default AuthPage

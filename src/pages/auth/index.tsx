import React from 'react'

import { hideLoading, login, redirectTo, showLoading, showToast, View } from 'remax/wechat';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatLogin } from '../../services/auth';

class AuthPage extends React.Component {
  async componentDidMount() {
    showLoading()

    const { code } = await login()

    try {
      await wechatLogin(code)
      hideLoading()
    } catch (e) {
      console.log(e)
      hideLoading()
      showToast({
        icon: 'none',
        title: e.toString(),
        mask: true
      })

      setTimeout(() => {
        redirectTo({
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

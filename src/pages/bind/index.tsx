import Taro from '@tarojs/taro'
import { View, Form, Button, Input, Text } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatBinding } from '../../services/auth';
import { connect } from '@tarojs/redux';
import { updateUserInfo } from '../../actions/user';

type InputValue = {
  email: string,
  pwd: string
}

@connect(
  store => ({
    openid: store.user.profile.wechatOpenid,
    token: store.user.token
  }),
  dispatch => ({
    updateUserInfo(resp: any) {
      dispatch(updateUserInfo(resp))
    }
  }) as any
)
class BindPage extends Taro.Component<any, any> {

  onShareAppMessage() {
    return {
      title: '我在用 kindle 书摘哦~',
      page: '/pages/landing/landing'
    }
  }

  submit = async (e) => {
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
      const openid = this.props.openid
      const data = await wechatBinding(openid, values.email, values.pwd)
      this.props.updateUserInfo(data)

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
  }

  onBack = () => {
    Taro.navigateBack()
  }

  render() {

    return (
      <View className="bind-page">
        <NavigationBar hasHolder onBack={this.onBack}>
          绑定账户
        </NavigationBar>
        <View className="body">
          <Text className="tip">请输入 https://kindle.annatarhe.com 的账户密码以进行绑定，如无账户请使用电脑登陆网站注册，然后在此页面输入账户</Text>
          <Form onSubmit={this.submit} className="bind-form">
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
}

export default BindPage

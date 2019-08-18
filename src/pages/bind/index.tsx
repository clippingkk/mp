import Taro from '@tarojs/taro'
import { View, Form, Button, Input, Text } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatLogin, wechatBinding } from '../../services/auth';
import { connect } from '@tarojs/redux';
import { updateUserInfo } from '../../actions/user';
import { any } from 'prop-types';
import InfoBuilding from '../../components/info-building';

type InputValue = {
  email: string,
  pwd: string
}

@connect(
  store => ({
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

  componentDidShow() {
    Taro.showToast({
      title: '🤦‍ 开发太菜了，这个功能还没完成',
      icon: 'none',
      mask: true
    })

    setTimeout(() => {
      Taro.navigateBack()
    }, 2100)
  }

  submit = async (e) => {
    const values = e.detail.value as InputValue

    // values.email = "111@1.com"
    // values.pwd = "111111111"

    if (!values.email || !values.pwd) {
      Taro.showToast({
        icon: "none",
        title: "请填写账户哦~"
      })
      return
    }

    Taro.showLoading()

    try {
      // TODO: load openid
      const openid = 'o5Nd75bjsE_V_wQ7cSjodYVMW8bg'
      const data = await wechatBinding(openid, values.email, values.pwd)
      console.log(data)
      // TODO: 设定全局数据
      this.props.updateUserInfo(data)

      Taro.hideLoading()
      Taro.showToast({
        icon: "none",
        title: "绑定成功啦~"
      })

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

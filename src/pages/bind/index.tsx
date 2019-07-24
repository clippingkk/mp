import Taro from '@tarojs/taro'
import { View, Form, Button, Input, Text } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatLogin, wechatBinding } from '../../services/auth';

type InputValue = {
  email: string,
  pwd: string
}

class BindPage extends Taro.Component {
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
      const data = await wechatBinding("o5Nd75bjsE_V_wQ7cSjodYVMW8bg", values.email, values.pwd)
      console.log(data)
      // 设定全局数据

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

  render() {
    return (
      <View className="bind-page">
        <NavigationBar hasHolder>
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

import Taro from '@tarojs/taro'
import { View, Form, Button, Input } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"
import { wechatLogin } from '../../services/auth';

class BindPage extends Taro.Component {

  submit = (e) => {
    console.log(e.detail.value)
  }

  render() {
    return (
      <View className="bind-page">
        <NavigationBar hasHolder>
          绑定账户
        </NavigationBar>
        <View className="body">
          <Form onSubmit={this.submit}>
            <Input
              type="text"
              placeholder="email"
              className="form-input"
              name="email"
              confirmType="next"
              value=""
            />
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

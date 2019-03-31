import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';
import NavigationBar from '../../components/navigation-bar'

import "./styles.styl"

class AuthPage extends Taro.Component {
  render() {
    return (
      <View className="auth">
        <NavigationBar hasHolder>
          绑定账户
        </NavigationBar>
        <View className="body">
          <input type="email" />
          <input type="passowrd" />
        </View>

      </View>
    )
  }
}

export default AuthPage

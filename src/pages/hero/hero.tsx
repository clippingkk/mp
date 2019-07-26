import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './hero.styl'
import NavigationBar from '../../components/navigation-bar';
import InfoBuilding from '../../components/info-building';

export default class Hero extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='hero'>
        <NavigationBar hasHolder>
          clippingKK
        </NavigationBar>
        <View className='hero-body'>
          <InfoBuilding />
        </View>
      </View>
    )
  }
}

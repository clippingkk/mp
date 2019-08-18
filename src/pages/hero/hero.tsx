import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './hero.styl'
import NavigationBar from '../../components/navigation-bar';
import InfoBuilding from '../../components/info-building';
import { connect } from '@tarojs/redux';
import NotBindContent from '../../components/not-bind-content';

@connect(store => ({
  hasBind: store.user.hasBind
}) as any)
class Hero extends Component<any, any> {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage() {
    return {
      title: 'kindle 书摘管理',
      page: '/pages/landing/landing'
    }
  }

  render () {
    return (
      <View className='hero'>
        <NavigationBar hasHolder>
          clippingKK
        </NavigationBar>
        <View className='hero-body'>
          {this.props.hasBind ? (
            <InfoBuilding />
          ) : (
            <NotBindContent />
          )}
        </View>
      </View>
    )
  }
}
export default Hero

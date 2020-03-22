import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './user.styl'
import { connect } from '@tarojs/redux';
import UserCard from '../../components/user-card';
import InfoBuilding from '../../components/info-building';

@connect(store => ({
  user: store.user.profile,
  hasBind: store.user.hasBind
}) as any)
class User extends Component<any, any> {

  config = {
    navigationBarTitleText: '首页'
  }

  onShareAppMessage() {
    return {
      title: '我在用 kindle 书摘哦~',
      page: '/pages/landing/landing'
    }
  }

  render() {
    return (
      <View className='user'>
        <View className='user-solid-rect' />
        <View className='info-container'>
          <UserCard profile={this.props.user} hasBind={this.props.hasBind} />
          <View className="divider" />

          <InfoBuilding />
        </View>
      </View>
    )
  }
}

export default User

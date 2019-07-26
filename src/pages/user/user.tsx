import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './user.styl'
import { connect } from '@tarojs/redux';
import UserCard from '../../components/user-card';
import InfoBuilding from '../../components/info-building';

@connect(store => ({
  user: store.user.profile
}) as any)
class User extends Component<any, any> {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render() {
    return (
      <View className='user'>
        <View className='user-solid-rect' />
        <View className='info-container'>
          <UserCard profile={this.props.user} />
          <View className="divider" />

          <InfoBuilding />
        </View>
      </View>
    )
  }
}

export default User

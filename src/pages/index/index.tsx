import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar'

import styles from './index.module.styl'

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className={styles.index}>
        <NavigationBar hasHolder={false} homeIcon="hello" />
        <Text>hello</Text>
      </View>
    )
  }
}

export default Index as ComponentClass

import React from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar'

import styles from './index.module.styl'

class Index extends React.Component {

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
        <NavigationBar hasHolder>
          navigation
        </NavigationBar>
        <Text>hello</Text>
      </View>
    )
  }
}

export default Index

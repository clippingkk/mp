import React from 'react'
import { View, Button, Text } from 'remax/wechat'
import NavigationBar from '../../components/navigation-bar'

import styles from './index.module.styl'

class Index extends React.Component {

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

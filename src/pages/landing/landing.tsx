import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import styles from './landing.module.styl'
import { wechatLogin } from '../../services/auth';

function Landing() {

  useEffect(() => {
    Taro
      .login()
      .then((res => wechatLogin(res.code)))
      .then(resp => {
        console.log(resp)

        // 8
      })
  })

  return (
    <View className={styles.container}>
      Loading
    </View>
  )
}

export default Landing

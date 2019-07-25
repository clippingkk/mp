import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import styles from './landing.module.styl'
import { wechatLogin, authFlow } from '../../services/auth';
import { useDispatch } from '@tarojs/redux';
import { updateUserInfo } from '../../actions/user';

function Landing() {
  const dispatch = useDispatch()
  useEffect(() => {
    authFlow().then(resp => {
      dispatch(updateUserInfo(resp))
      setTimeout(() => {
        const opts = Taro.getLaunchOptionsSync()
        // c === clipping
        if (opts.query.c) {
          Taro.redirectTo({
            url: `/pages/clipping/clipping?id=${opts.query.c}`
          })
        }
      })
    })
  })

  return (
    <View className={styles.container}>
      Loading
    </View>
  )
}

export default Landing

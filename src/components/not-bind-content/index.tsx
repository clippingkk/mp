import React, { useCallback } from 'react'

import { View, Text, navigateTo } from 'remax/wechat';
import styles from './style.module.styl'

function NotBindContent() {
  const onClick = useCallback(() => {
    navigateTo({
      url: '/pages/bind/index'
    })
  }, [])

  return (
    <View onClick={onClick} className={styles.container}>
      <Text className={styles.big}>
        🤦‍
      </Text>
      <Text className={styles.normal}>
        你咋还没绑定账户？快点我
      </Text>
    </View>
  )
}

export default NotBindContent

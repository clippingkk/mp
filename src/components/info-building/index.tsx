import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components';

import styles from './style.module.styl'

function InfoBuilding() {

  return (
    <View className={styles.info}>
      🛠 正在施工中
    </View>
  )

}

export default InfoBuilding

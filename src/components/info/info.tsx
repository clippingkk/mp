import React from 'react'

import { View, Text } from 'remax/wechat'

const styles = require('./info.module.styl')

type InfoProps = {
  text: string
  withTip?: boolean
}

function Info(props: InfoProps) {
  return (
    <View className={styles.info}>
      <Text className={styles.txt}>
        {props.text}
      </Text>
      {props.withTip && (
        <Text className={styles.small}>其实也可以去 https://kindle.annatarhe.cn 上更新书摘哦~</Text>
      )}
    </View>
  )
}

export default Info

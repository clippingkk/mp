import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

const styles = require('./info.module.styl')

type InfoProps = {
  text: string
}

function Info(props: InfoProps) {
  return (
    <View className={styles.info}>
      <Text className={styles.txt}>
        {props.text}
      </Text>
    </View>
  )
}

export default Info

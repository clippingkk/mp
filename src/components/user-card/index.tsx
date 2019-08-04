import Taro, { useCallback } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { IUserContent } from '../../store/user/type';
import KKImage from '../kkimage';

import styles from './style.module.styl'

type UserCardProps = {
  profile: IUserContent
}

function UserCard({ profile }: UserCardProps) {
  if (!profile) {
    return null
  }
  // TODO: api return hasBinded status
  const hasBind = !profile.email.includes('@clippingkk.annatarhe.com')

  const onUserClick = useCallback(() => {
    if (hasBind) {
      return
    }

    return
    // TODO: 等后端改好了之后再开放跳转功能
    Taro.navigateTo({
      url: '/pages/bind/index'
    })

  }, [hasBind])

  return (
    <View className={styles.card} onClick={onUserClick}>
      {profile.avatar === 'null' ? (
        <View className={styles.fakeavatar}>我</View>
      ) : (
        <KKImage src={profile.avatar} local-class={styles.avatar} />
      )}
      <View className={styles.info}>
        <Text className={styles.name}>{profile.name}</Text>
        <Text className={styles.email}>
          {!hasBind ? 'unknown' : profile.email}
        </Text>
      </View>
    </View>
  )
}

export default UserCard

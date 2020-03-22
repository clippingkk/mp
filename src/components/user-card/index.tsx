import Taro, { useCallback } from '@tarojs/taro'
import { View, Text, OpenData } from '@tarojs/components';
import { IUserContent } from '../../store/user/type';
import KKImage from '../kkimage';

import styles from './style.module.styl'

type UserCardProps = {
  profile: IUserContent
  hasBind: boolean
}

function UserCard({ profile, hasBind }: UserCardProps) {
  if (!profile) {
    return null
  }

  const onUserClick = useCallback(() => {
    if (hasBind) {
      return
    }

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
        // <View className={styles.avatar}>
          <OpenData type="userAvatarUrl" className={styles.avatar} />
        // </View>
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

import Taro from '@tarojs/taro'
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
  return (
    <View className={styles.card}>
      <KKImage src={profile.avatar} local-class={styles.avatar} />
      <View className={styles.info}>
        <Text className={styles.name}>{profile.name}</Text>
        <Text className={styles.email}>{profile.email}</Text>
      </View>

    </View>
  )
}

export default UserCard

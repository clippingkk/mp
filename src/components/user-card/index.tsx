import React, { useCallback } from 'react'

import { View, Text, OpenData, navigateTo } from 'remax/wechat';

import styles from './style.module.styl'
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin';

type UserCardProps = {
  profile: wechatLogin_mpAuth_user
  hasBind: boolean
  count: number
}

function UserCard({ profile, hasBind, count }: UserCardProps) {
  if (!profile) {
    return null
  }

  const onUserClick = useCallback(() => {
    if (hasBind) {
      return
    }

    // TODO: 等后端改好了之后再开放跳转功能
    navigateTo({
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
        {count && (
          <Text className={styles.count}>已收集 {count} 条摘录</Text>
        )}
      </View>
    </View>
  )
}

export default UserCard

import React, { useEffect, useState} from 'react'
import Taro, { Component, useShareAppMessage, } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './user.styl'
import { connect, useSelector } from 'react-redux';
import UserCard from '../../components/user-card';
import InfoBuilding from '../../components/info-building';
import Info from '../../components/info/info'
import { fetchMyProfile } from '../../services/auth';
import { IHttpUserProfileResponseData, IUserProfileResponseData } from '../../services/types';
import ClippingItem from '../../components/clipping-item/clipping-item';

function useMyProfile(userId: number) {
  const [profile, setProfile] = useState<IUserProfileResponseData | null>(null)

  useEffect(() => {
    if (userId < 0) {
      return
    }
    fetchMyProfile(userId).then(res => {
      setProfile(res)
    })
  }, [userId])

  return profile
}

function User() {
  useShareAppMessage(() => ({
    title: '我在用 kindle 书摘哦~',
    page: '/pages/landing/landing'
  }))
  const { user, hasBind } = useSelector<any, any>(s => ({
    user: s.user.profile,
    hasBind: s.user.hasBind
  }))

  const profile = useMyProfile(user.id)

  return (
    <View className='user'>
      <View className='user-solid-rect' />
      <View className='info-container'>
        <UserCard profile={user} hasBind={hasBind} count={profile ? profile.clippingsCount : 0} />
        <View className="divider" />
        {(profile && profile.clippings) ? (
          profile.clippings.map(c => (
            <ClippingItem clipping={c} key={c.id} />
          ))
        ) : (
          <Info text="🤦‍♂️ 哎呀呀，你得多看书呀~" />
        )}
      </View>
    </View>
  )
}
User.config = {
  backgroundColorTop: '#8e44ad',
  backgroundColorBottom: '#ecf0f1',
}

export default User

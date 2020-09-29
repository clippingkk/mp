import React, { useEffect, useState } from 'react'
import Taro, { Component, useShareAppMessage, } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './user.styl'
import { connect, useSelector } from 'react-redux';
import UserCard from '../../components/user-card';
import InfoBuilding from '../../components/info-building';
import Info from '../../components/info/info'
import { fetchMyProfile } from '../../services/auth';
import { IHttpUserProfileResponseData, IUserProfileResponseData } from '../../services/types';
import ClippingItem from '../../components/clipping-item/clipping-item';
import { TGlobalStore } from '../../reducers';
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin';
import { useQuery } from '@apollo/client';
import profileQuery from '../../schema/profile.graphql'
import { profile, profileVariables } from '../../schema/__generated__/profile';
import { useSingleBook } from '../../hooks/book';

function User() {
  useShareAppMessage(() => ({
    title: '我在用 kindle 书摘哦~',
    page: '/pages/landing/landing'
  }))
  const user = useSelector<TGlobalStore, wechatLogin_mpAuth_user>(s => s.user.profile)

  const hasBind = !user.email.endsWith('@clippingkk.annatarhe.com')

  const { data } = useQuery<profile, profileVariables>(profileQuery, {
    variables: {
      id: user.id,
    }
  })

  const firstClipping = data?.me.recents[0]

  const b = useSingleBook(firstClipping?.bookID)
  return (
    <View className='user'>
      <View className='user-solid'>
        {b && (
          <Image
            src={b.image}
            className='user-solid-img'
            mode='scaleToFill'
          />
        )}
        <View className='user-solid-rect' />
      </View>
      <View className='info-container'>
        <UserCard
          profile={user}
          hasBind={hasBind}
          count={data?.me.clippingsCount ?? 0}
        />
        <View className="divider" />
        <View className='clippings'>
          {data?.me.recents ? (
            data.me.recents.map(c => (
              <ClippingItem clipping={c} key={c.id} />
            ))
          ) : (
              <Info text="🤦‍♂️ 哎呀呀，你得多看书呀~" />
            )}
        </View>
      </View>
    </View>
  )
}
User.config = {
  backgroundColorTop: '#8e44ad',
  backgroundColorBottom: '#ecf0f1',
}

export default User

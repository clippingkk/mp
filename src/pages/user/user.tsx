import React from 'react'
import { View, Text, Image } from 'remax/wechat'
import './user.styl'
import { useSelector } from 'react-redux';
import UserCard from '../../components/user-card';
import Info from '../../components/info/info'
import ClippingItem from '../../components/clipping-item/clipping-item';
import { TGlobalStore } from '../../reducers';
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin';
import { useQuery } from '@apollo/client';
import profileQuery from '../../schema/profile.graphql'
import { profile, profileVariables } from '../../schema/__generated__/profile';
import { useMultipBook, useSingleBook } from '../../hooks/book';
import { usePageEvent } from '@remax/macro';

function User() {
  usePageEvent('onShareAppMessage', () => ({
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

  const bs = useMultipBook(data?.me.recents.map(x => x.bookID) ?? [])

  const firstClipping = data?.me.recents[0]

  const b = bs.find(l => l.doubanId.toString() === firstClipping?.bookID)
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
              <ClippingItem
                clipping={c}
                key={c.id}
                book={bs.find(b => b.doubanId.toString() === c.bookID)}
              />
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
}

export default User

import { useApolloClient, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'remax/wechat'
import fetchSquareDataQuery from '../../schema/square.graphql'
import InfoBuilding from '../../components/info-building'
import { fetchSquareData, fetchSquareDataVariables, fetchSquareData_featuredClippings } from '../../schema/__generated__/fetchSquareData'
import { PAGINATION_STEP } from '../../constants/config'
import { fetchClipping_clipping } from '../../schema/__generated__/fetchClipping'
import ClippingItem from '../../components/clipping-item/clipping-item'
import NavigationBar from '../../components/navigation-bar'
import { useNavigateUp } from '../../hooks/navigationbar'

import styles from './style.styl'
import { useMultipBook } from '../../hooks/book'

type SquareProps = {
}

function Square(props: SquareProps) {
  const { data } = useQuery<fetchSquareData, fetchSquareDataVariables>(fetchSquareDataQuery, {
    variables: {
      pagination: {
        limit: PAGINATION_STEP,
        lastId: null
      }
    }
  })

  const bs = useMultipBook(data?.featuredClippings.map(x => x.bookID) ?? [])

  const onNavigateUp = useNavigateUp()

  return (
    <View className={styles.square}>
      <NavigationBar hasHolder homeIcon='👀' onBack={onNavigateUp}>
        <Text className='hero-title'>大家的列表</Text>
      </NavigationBar>
      <View className={styles.list}>

        {data?.featuredClippings.map(x => (
          <ClippingItem
            clipping={x}
            key={x.id}
            book={bs.find(b => b.doubanId.toString() === x.bookID)}
          />
        ))}
      </View>
    </View>
  )
}

export default Square

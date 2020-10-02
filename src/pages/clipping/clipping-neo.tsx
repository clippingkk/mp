import { useQuery } from '@apollo/client'
import Taro, { getCurrentInstance, useReady, useShareAppMessage } from '@tarojs/taro'
import React from 'react'
import { useSingleBook } from '../../hooks/book'
import { useNavigateUp } from '../../hooks/navigationbar'
import { fetchClipping, fetchClippingVariables } from '../../schema/__generated__/fetchClipping'
import fetchClippingQuery from '../../schema/clipping.graphql'
import { Button, View, Text, Canvas } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar'

type ClippingNeoProps = {
}

function useClippingPostData() {
  useReady(() => {
     const query = Taro.createSelectorQuery()
    query.select('#' + canvasID)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = Taro.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        ctx.fillRect(0, 0, 100, 100)
      })
  })
}

const canvasID = 'clippingkk-canvas'

function ClippingNeo(props: ClippingNeoProps) {
  const params = getCurrentInstance().router?.params
  const id = params?.id ? ~~(params.id) : -1

  const { data: clipping } = useQuery<fetchClipping, fetchClippingVariables>(fetchClippingQuery, {
    variables: {
      id: id
    }
  })
  const onNavigateUp = useNavigateUp()

  const bookData = useSingleBook(clipping?.clipping.bookID)
  // const { palette, onImageOK, onSave, loaded } = usePalette(bookData, clipping)

  useShareAppMessage(() => {
    return {
      title: bookData ? bookData.title : "书籍",
      path: `/pages/landing/landing?c=${id}`
    }
  })

  const loaded = true
  const onSave = () => {}

  if (!clipping || !bookData) {
    return <View />
  }

  return (
    <View
      className='clipping-page'
      style={{ backgroundImage: `url(${bookData.image})` }}
    >
      <View className='clipping-bg'>
        <NavigationBar hasHolder onBack={onNavigateUp}>
          <Text className='title'>{bookData.title}</Text>
        </NavigationBar>
        <View className='clipping-body'>
          {/* <Text className='title'>{clippingData.title}</Text> */}
          <Text className='content'>
            {clipping.clipping.content}
          </Text>
          <Text className='author'> —— {bookData.author}</Text>

          {
            loaded && (
              <Button onClick={onSave} className='btn-primary'>
                🎨 保存
              </Button>
            )
          }

          <Canvas id={canvasID} type='2d' />
        </View>
      </View>
    </View>
  )
}

export default ClippingNeo

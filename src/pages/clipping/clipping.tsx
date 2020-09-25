import React, { useEffect, useState, useCallback } from 'react'
import Taro, { useShareAppMessage, getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button, Canvas } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar';
import { getClipping } from '../../services/clippings';
import './clipping.styl'
import { searchBookDetail, IBook } from '../../services/books';
import { drawCanvas, saveLocally } from './canvas';
import { useNavigateUp } from '../../hooks/navigationbar';
import { IClippingItem } from '../../services/types';
import { useQuery } from '@apollo/client';
import fetchClippingQuery from '../../schema/clipping.graphql'
import { fetchClipping, fetchClippingVariables, fetchClipping_clipping } from '../../schema/__generated__/fetchClipping';
import { useSingleBook } from '../../hooks/book';
import { client } from '../../services/ajax';
import { WenquBook } from '../../services/wenqu';

type sysScreenSize = {
  width: number
  height: number
  ratio: number
}

interface IClippingState {
  clipping: IClippingItem
  id: number,
  book: IBook,
  sysScreenSize: sysScreenSize
}

async function ensurePermission(scope: string) {
  try {
    await Taro.authorize({
      scope: scope
    })
  } catch (e) {
    const resp = await Taro.showModal({
      title: '😁 请打开权限哦~',
      content: '🔑 打开权限我们才能提供服务呢~',
    })
    if (resp.cancel) {
      return Promise.reject('cancel')
    }
    await Taro.openSetting()
    return ensurePermission(scope)
  }
}

const canvasId = 'clippingcanvas'

function useSystemScreen() {
  const [sysScreen, setSysScreen] = useState(
    {
      width: 920,
      height: 1080,
      ratio: 2
    }
  )

  useEffect(() => {
    Taro.getSystemInfo().then(res => {
      const ratio = ~~res.pixelRatio
      setSysScreen({
        width: res.screenWidth * ratio,
        height: res.screenHeight * ratio,
        ratio
      })
    })
  }, [])

  return sysScreen
}

function useClippingData(id: number) {
  const [clippingData, setClippingData] = useState<IClippingItem | null>(null)
  const [bookData, setBookData] = useState<IBook | null>(null)
  const [sysScreen, setSysScreen] = useState(
    {
      width: 920,
      height: 1080,
      ratio: 2
    }
  )
  useEffect(() => {
    Taro.showLoading({ title: 'Loading' })
    getClipping(id).then(res => {
      setClippingData(res)
      return searchBookDetail(~~res.bookId)
    }).then(book => {
      setBookData(book)
      return book
    }).then(() => {
      return Taro.hideLoading()
    }).catch(() => {
      Taro.hideLoading()
      Taro.showToast({
        title: '🤦‍ 叼了... 没找到书摘',
        icon: 'none'
      })
    })
  }, [id])

  useEffect(() => {
    Taro.getSystemInfo().then(res => {
      const ratio = ~~res.pixelRatio
      setSysScreen({
        width: res.screenWidth * ratio,
        height: res.screenHeight * ratio,
        ratio
      })
    })
  }, [])

  return {
    clippingData,
    bookData,
    sysScreen
  }
}

function useImageSaveBtn(bookData: WenquBook | null, clippingData: fetchClipping_clipping | undefined, screen: any, id: number) {
  return useCallback(() => {
    if (!bookData || !clippingData) {
      return
    }
    ensurePermission('scope.writePhotosAlbum')
      .then(async () => {
        Taro.showLoading({ mask: true, title: 'Rendering' })
        try {
          const ctx = Taro.createCanvasContext(canvasId)
          await drawCanvas(ctx, {
            bg: bookData.image,
            // bg: `https://picsum.photos/${this.state.sysScreenSize.width}/${this.state.sysScreenSize.height}`,
            id: id,
            title: bookData.title,
            content: clippingData.content,
            author: bookData.author
          }, screen)

          await saveLocally(canvasId, screen)
          Taro.hideLoading()
          Taro.showToast({
            title: '😘 保存成功啦~',
            icon: 'none'
          })
        } catch (e) {
          console.log(e)
          Taro.hideLoading()
          Taro.showToast({
            title: '😢 啊呀呀，图片生成失败了',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        Taro.showToast({ title: '🤷‍ 木有权限', icon: 'none' })
      })
  }, [bookData, clippingData, screen, id])
}

function Clipping() {
  const params = getCurrentInstance().router?.params
  const id = params?.id ? ~~(params.id) : -1

  const { data: clipping } = useQuery<fetchClipping, fetchClippingVariables>(fetchClippingQuery, {
    variables: {
      id: id
    }
  })
  const bookData = useSingleBook(clipping?.clipping.bookID)

  // const { clippingData, bookData, sysScreen } = useClippingData(id)
  const onNavigateUp = useNavigateUp()
  const sysScreen = useSystemScreen()

  const onSave = useImageSaveBtn(bookData, clipping?.clipping, sysScreen, id)

  useShareAppMessage(() => {
    return {
      title: bookData ? bookData.title : "书籍",
      path: `/pages/landing/landing?c=${id}`
    }
  })

  useEffect(() => {
    Taro.createSelectorQuery()
  }, [])

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

          {/* <Button onClick={onSave} className='btn-primary'>
            🎨 保存
            </Button> */}
        </View>

        <Canvas
          canvasId={canvasId}
          className='out-canvas'
          style={{
            height: sysScreen.height + 'px',
            width: sysScreen.width + 'px'
          }}
        />
      </View>
    </View>
  )
}
export default Clipping

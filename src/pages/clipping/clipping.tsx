import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import Taro, { useShareAppMessage, getCurrentInstance, useDidShow, useReady, scanCode } from '@tarojs/taro'
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
import { ensurePermission, useImageSaveBtn, useSystemScreen } from './hooks';
import { fetchQRCode } from '../../services/mp';
import { API_HOST } from '../../constants/config';
import SharePostModal from './share-post';

const p = {
  width: '654rpx',
  height: '1000rpx',
  background: '#eee',
  views: [
  ],
}

const qrcodeSize = 90
const gapSize = 20

function usePalette(bookData: WenquBook | null, clipping?: fetchClipping) {
  const screen = useSystemScreen()
  const [distPath, setDistPath] = useState('')
  const [qrcodeImage, setQRCodeImage] = useState('')

  useEffect(() => {
    if (!clipping) {
      return
    }
    if (qrcodeImage) {
      return
    }
    fetchQRCode(`c=${clipping.clipping.id}`, "pages/landing/landing", qrcodeSize, true).then(res => setQRCodeImage(res))
  }, [clipping, qrcodeImage])

  const palette = useMemo(() => ({
    width: screen.width + 'rpx',
    height: screen.height + 'rpx',
    background: '#eee',
    views: [
      {
        type: 'image',
        url: `${API_HOST}/picsum-photos/${screen.width / screen.ratio}/${screen.height / screen.ratio}?blur=10`,
        css: {
          top: 0,
          left: 0,
          width: screen.width + 'rpx',
          height: screen.height + 'rpx',
          scalable: true,
        },
      },
      {
        type: 'rect',
        css: {
          top: 0,
          left: 0,
          width: screen.width + 'rpx',
          height: screen.height + 'rpx',
          color: 'radial-gradient(rgba(0, 0, 0, .3) 5%, rgba(5,5,5, .8) 60%)',
        },
      },
      {
        type: 'text',
        text: clipping?.clipping.content,
        css: {
          top: gapSize * screen.ratio + 'rpx',
          left: gapSize * screen.ratio + 'rpx',
          color: '#fff',
          width: screen.width - gapSize * screen.ratio * 2 + 'rpx',
          fontSize: gapSize * screen.ratio + 'rpx',
          lineHeight: gapSize * screen.ratio * 1.5 + 'rpx'
        },
      },
      {
        type: 'text',
        text: bookData?.title,
        css: {
          bottom: gapSize * screen.ratio * 3.5 + qrcodeSize * screen.ratio + 10 * screen.ratio + 'rpx',
          right: gapSize * screen.ratio + 'rpx',
          color: '#fff',
          width: screen.width - gapSize * 2 + 'rpx',
          textAlign: 'right',
          maxLength: 1,
          fontSize: gapSize * screen.ratio + 'rpx',
        },
      },
      {
        type: 'text',
        text: bookData?.author,
        css: {
          bottom: gapSize * screen.ratio * 2 + qrcodeSize * screen.ratio + 10 * screen.ratio + 'rpx',
          right: gapSize * screen.ratio + 'rpx',
          color: '#fff',
          width: screen.width - gapSize * 2 + 'rpx',
          textAlign: 'right',
          maxLength: 2,
          fontSize: gapSize * screen.ratio + 'rpx',
        },
      },
      {
        type: 'rect',
        css: {
          bottom: gapSize * screen.ratio + 'rpx',
          right: gapSize * screen.ratio + 'rpx',
          width: (qrcodeSize + gapSize) * screen.ratio + 'rpx',
          height: (qrcodeSize + gapSize) * screen.ratio + 'rpx',
          color: '#fff',
        },
      },
      {
        type: 'image',
        url: qrcodeImage,
        css: {
          bottom: gapSize * screen.ratio + 10 * screen.ratio + 'rpx',
          right: gapSize * screen.ratio + 10 * screen.ratio + 'rpx',
          color: '#fff',
          width: qrcodeSize * screen.ratio + 'rpx',
          height: qrcodeSize * screen.ratio + 'rpx',
        },
      },
    ],
  }), [screen, qrcodeImage])

  const onImageOK = useCallback((e) => {
    const tempPath = e.detail.path
    setDistPath(tempPath)
  }, [])

  const onSave = useCallback(async () => {
    try {
      ensurePermission('scope.writePhotosAlbum')
      Taro.showLoading({
        mask: true,
        title: '保存中...'
      })
      Taro.saveImageToPhotosAlbum({
        filePath: distPath,
      });
      Taro.hideLoading()
      Taro.showToast({
        title: '😘 保存成功啦~',
        icon: 'none'
      })
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '🤷‍ 木有权限', icon: 'none' })

    }
  }, [distPath])

  return {
    palette,
    onImageOK,
    onSave,
    loaded: distPath !== ''
  }
}

function Clipping() {
  const params = getCurrentInstance().router?.params
  const id = params?.id ? ~~(params.id) : -1

  const { data: clipping } = useQuery<fetchClipping, fetchClippingVariables>(fetchClippingQuery, {
    variables: {
      id: id
    }
  })
  const onNavigateUp = useNavigateUp()

  const bookData = useSingleBook(clipping?.clipping.bookID)
  const [visible, setVisible] = useState(false)

  useShareAppMessage(() => {
    return {
      title: bookData ? bookData.title : "书籍",
      path: `/pages/landing/landing?c=${id}`
    }
  })

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

          <Button
            onClick={() => {
              setVisible(true)
            }}
            className='btn-primary'>
            🎨 保存
              </Button>
        </View>

        {visible && (
          <SharePostModal
          onClose={() => {setVisible(false)}}
            clipping={clipping.clipping}
            book={bookData}
          />
        )}

        {/* <painter
          palette={palette}
          onImgOK={onImageOK}
          customStyle="position:fixed;top:-9999rpx"
        /> */}

      </View>
    </View>
  )
}
export default Clipping

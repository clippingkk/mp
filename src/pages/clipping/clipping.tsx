import Taro, { useState, useEffect, useCallback, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button, Canvas } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar';
import { getClipping } from '../../services/clippings';
import './clipping.styl'
import { searchBookDetail, IBook } from '../../services/books';
import { drawCanvas, saveLocally } from './canvas';
import { useNavigateUp } from '../../hooks/navigationbar';
import { IClippingItem } from '../../services/types';

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

function useImageSaveBtn(bookData: IBook | null, clippingData: IClippingItem | null, screen: any, id: number) {
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
  const id = ~~this.$router.params.id
  const { clippingData, bookData, sysScreen } = useClippingData(id)
  const onNavigateUp = useNavigateUp()

  const onSave = useImageSaveBtn(bookData, clippingData, sysScreen, id)

  useShareAppMessage(() => {
    return {
      title: bookData ? bookData.title : "书籍",
      path: `/pages/landing/landing?c=${id}`
    }
  })

  useEffect(() => {
    this.$scope.createSelectorQuery()
  }, [])

  if (!clippingData || !bookData) {
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
          <View className='clipping-card'>
            <Text className='title'>{clippingData.title}</Text>
            <Text className='content'>
              {clippingData.content}
            </Text>
            <Text className='author'> —— {bookData.author}</Text>
          </View>

          <Button onClick={onSave} className='btn-primary'>
            🎨 保存
            </Button>
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
Clipping.config = {
  navigationBarTitleText: '首页',
  backgroundColor: '#0376d7'
}

export default Clipping

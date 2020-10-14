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
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin';
import { IPostShareRender } from '../../utils/canvas/mp-render';
import { MPPostShareRender } from "../../utils/canvas/MPPostShareRender";
import { useSelector } from 'react-redux';
import { TGlobalStore } from '../../reducers';

const canvasID = 'clippingkk-canvas'

function useClippingPostData(
  clipping?: fetchClipping_clipping,
  book?: WenquBook | null,
  user?: wechatLogin_mpAuth_user
) {
  const dom = useRef<HTMLCanvasElement | null>(null)
  const render = useRef<IPostShareRender | null>(null)

  useEffect(() => {
    if (!clipping || !book) {
      return
    }
    setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query.select('#' + canvasID)
        .fields({ node: true })
        .exec((res) => {
          console.log(res)
          if (!res[0]) {
            return
          }
          const canvas = res[0].node
          dom.current = canvas
        })
    }, 500)
  }, [clipping, book])

  const doRender = useCallback(async () => {
    console.log('do render', dom.current)
    if (!dom.current) {
      return
    }
    Taro.showLoading({
      mask: true,
      title: 'Loading'
    })
    try {
      const sysInfo = await Taro.getSystemInfo()
      const postRender = new MPPostShareRender(dom.current, {
        height: sysInfo.screenHeight,
        width: sysInfo.screenWidth,
        dpr: sysInfo.pixelRatio,
        clipping: clipping!,
        bookInfo: book!,
        baseTextSize: 14,
        padding: 24,
        textFont: ['STKaiTi', 'KaiTi']
      })
      postRender.setup()
      await postRender.renderBackground()
      await postRender.renderText()
      await postRender.renderTitle()
      await postRender.renderAuthor()
      await postRender.renderBanner()
      await postRender.renderMyInfo(user)
      await postRender.renderQRCode()
      render.current = postRender
      Taro.hideLoading()
    } catch (e) {
      console.error(e)
      Taro.hideLoading()
      Taro.showToast({
        icon: 'none',
        title: e
      })
    }
  }, [book, clipping, user])

  const doSave = useCallback(async () => {
    if (!render.current) {
      Taro.showToast({
        icon: 'none',
        title: '请首先渲染图片'
      })
      return
    }

    try {
      await ensurePermission('scope.writePhotosAlbum')
      Taro.showLoading({
        mask: true,
        title: '保存中...'
      })
      await render.current?.saveToLocal()
      Taro.hideLoading()
      Taro.showToast({
        title: '😘 保存成功啦~',
        icon: 'none'
      })
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '🤷‍ 木有权限', icon: 'none' })
    }
  }, [])

  return {
    doRender,
    doSave
  }
}


type ClippingNeoProps = {
  clipping: fetchClipping_clipping
  book: WenquBook
  onClose: () => void
}

function useSysInfo() {
  const [s, setS] = useState<Taro.getSystemInfo.Result | null>(null)

  useEffect(() => {
    Taro.getSystemInfo().then(res => {
      setS(res)
    })
  }, [])

  return s
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

  useShareAppMessage(() => {
    return {
      title: bookData ? bookData.title : "书籍",
      path: `/pages/landing/landing?c=${id}`
    }
  })
  const user = useSelector<TGlobalStore, wechatLogin_mpAuth_user>(s => s.user.profile)
  const { doRender, doSave } = useClippingPostData(clipping?.clipping, bookData, user)

  const s = useSysInfo()

  if (!clipping || !bookData || !s) {
    return <View />
  }

  const clippingContent = clipping?.clipping.content.replace(/\[\d*\]/, '')

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
            {clippingContent}
          </Text>
          <Text className='author'> —— {bookData.author}</Text>

          <Button
            onClick={async () => {
              await doRender()
              await doSave()
            }}
            className='btn-primary'>
            🎨 保存
              </Button>
        </View>

        <Canvas
          id={canvasID}
          type='2d'
          className='share-canvas'
          width={s.screenWidth * s.pixelRatio}
          height={s.screenHeight * s.pixelRatio}
          style={{
            width: s?.screenWidth + 'px',
            height: s?.screenHeight + 'px',
          }}
        />

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

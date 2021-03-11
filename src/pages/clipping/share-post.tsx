import { useQuery } from '@apollo/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSingleBook } from '../../hooks/book'
import { useNavigateUp } from '../../hooks/navigationbar'
import { fetchClipping, fetchClippingVariables, fetchClipping_clipping } from '../../schema/__generated__/fetchClipping'
import fetchClippingQuery from '../../schema/clipping.graphql'
import { Button, View, Text, Canvas, createSelectorQuery, getSystemInfo, hideLoading, showLoading, showToast } from 'remax/wechat'
import NavigationBar from '../../components/navigation-bar'
import { IPostShareRender } from '../../utils/canvas/mp-render'
import { MPPostShareRender } from "../../utils/canvas/MPPostShareRender"
import { WenquBook } from '../../services/wenqu'
import { ensurePermission } from './hooks'

import './share-post.styl'
import { useSelector } from 'react-redux'
import { TGlobalStore } from '../../reducers'
import { wechatLogin_mpAuth_user } from '../../schema/__generated__/wechatLogin'

const canvasID = 'clippingkk-canvas'

function useClippingPostData(
  clipping: fetchClipping_clipping,
  book: WenquBook,
  user?: wechatLogin_mpAuth_user
) {
  const dom = useRef<HTMLCanvasElement | null>(null)
  const render = useRef<IPostShareRender | null>(null)

  useEffect(() => {
    if (!clipping || !book) {
      return
    }
    setTimeout(() => {
      const query = createSelectorQuery()
      query.select('#' + canvasID)
        .fields({ node: true })
        .exec((res) => {
          if (!res[0]) {
            return
          }
          const canvas = res[0].node
          dom.current = canvas
        })
    }, 500)
  }, [clipping, book])

  const doRender = useCallback(async () => {
    if (!dom.current) {
      return
    }
    showLoading()
    try {
      const sysInfo = await getSystemInfo()
      const postRender: IPostShareRender = new MPPostShareRender(dom.current, {
        height: sysInfo.screenHeight,
        width: sysInfo.screenWidth,
        dpr: sysInfo.pixelRatio,
        clipping,
        bookInfo: book,
        baseTextSize: 16,
        padding: 24,
        textFont: []
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
      hideLoading()
    } catch (e) {
      console.error(e)
      hideLoading()
      showToast({
        icon: 'none',
        title: e.toString ? e.toString() : '未知错误'
      })
    }
  }, [book, clipping, user])

  const doSave = useCallback(async () => {
    if (!render.current) {
      showToast({
        icon: 'none',
        title: '请首先渲染图片'
      })
      return
    }

    try {
      ensurePermission('scope.writePhotosAlbum')
      showLoading({
        mask: true,
        title: '保存中...'
      })
      render.current?.saveToLocal()
      hideLoading()
      showToast({
        title: '😘 保存成功啦~',
        icon: 'none'
      })
    } catch (e) {
      console.error(e)
      showToast({ title: '🤷‍ 木有权限', icon: 'none' })
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
  const [s, setS] = useState<any>(null)

  useEffect(() => {
    getSystemInfo().then(res => {
      setS(res)
    })
  }, [])

  return s
}

function SharePostModal(props: ClippingNeoProps) {
  const { clipping, book } = props
  const user = useSelector<TGlobalStore, wechatLogin_mpAuth_user>(s => s.user.profile)
  const { doRender, doSave } = useClippingPostData(clipping, book, user)

  const s = useSysInfo()

  if (!s) {
    return null
  }

  return (
    <View className='modal-mask' onClick={props.onClose}>
      <View>
        <Button
          onClick={async () => {
            await doRender()
            await doSave()
          }}
          className='download-btn'
        >确认保存</Button>
      </View>
    </View>
  )
}

export default SharePostModal

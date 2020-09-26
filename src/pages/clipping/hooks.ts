
import Taro, { useReady } from "@tarojs/taro"
import { useState, useEffect, useRef, useCallback } from "react"
import { fetchClipping_clipping } from "../../schema/__generated__/fetchClipping"
import { IBook, searchBookDetail } from "../../services/books"
import { getClipping } from "../../services/clippings"
import { IClippingItem } from "../../services/types"
import { WenquBook } from "../../services/wenqu"
import { drawCanvas, saveLocally } from "./canvas"

export type sysScreenSize = {
  width: number
  height: number
  ratio: number
}

export async function ensurePermission(scope: string) {
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

export function useSystemScreen() {
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

export function useCanvasShare() {
  const dom = useRef<CanvasRenderingContext2D | null>(null)
  useReady(() => {
    if (dom.current) {
      return
    }
    setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#' + canvasId)
        .fields({ node: true, size: true })
        .exec((res) => {
          console.log(res)
          if (!res[0]) {
            return
          }
          const canvas = res[0].node
          const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

          const dpr = Taro.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          ctx.fillRect(0, 0, 100, 100)
        })
    }, 1000)
  })
}

function loadCanvasCtx(): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery()
      .select('#' + canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          reject(null)
          return
        }
        const canvas: HTMLCanvasElement = res[0].node
        const ctx = canvas.getContext('2d')!

        const dpr = Taro.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        resolve(canvas)
      })
  })
}


export function useImageSaveBtn(bookData: WenquBook | null, clippingData: fetchClipping_clipping | undefined, id: number) {
  const dom = useRef<CanvasRenderingContext2D | null>(null)

  return useCallback(async () => {
    if (!bookData || !clippingData) {
      return
    }

    const canvas = await loadCanvasCtx()
    const systemInfo = await Taro.getSystemInfo()

    const screen: sysScreenSize = {
      width: systemInfo.screenWidth,
      height: systemInfo.screenHeight,
      ratio: systemInfo.pixelRatio
    }

    try {
      await ensurePermission('scope.writePhotosAlbum')
      const ctx = canvas.getContext('2d')!
      await drawCanvas(canvas, ctx, {
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
      console.error(e)
      Taro.showToast({ title: '🤷‍ 木有权限', icon: 'none' })
    }

  }, [bookData, clippingData, screen, id])
}

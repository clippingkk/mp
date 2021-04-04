import { View, Button, Image, getSystemInfo, downloadFile, showToast, Icon, saveImageToPhotosAlbum, showLoading, hideLoading } from '@remax/wechat'
import React, { useCallback, useEffect, useState } from 'react'
import { getUTPLink, UTPService } from '../../utils/konzert'
import styles from './style.styl'

type ClippingShareProps = {
  cid: number
  uid: number
  bid: number
  onSave?: (url: string) => void
  onCancel: () => void
}

function useSystemInfo() {
  const [sysInfo, setSysInfo] = useState<WechatMiniprogram.SystemInfo>()
  useEffect(() => {
    getSystemInfo().then(res => {
      setSysInfo(res)
    })
  }, [])
  return sysInfo
}

function useKonzertImage(url: string) {
  const [imageURL, setImageURL] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!url) {
      return
    }
    showLoading({
      title: 'loading...',
      mask: true
    })
    downloadFile({
      url,
      timeout: 50000
    }).then(res => {
      setImageURL(res.tempFilePath)
    }).catch(err => {
      showToast({
        title: '❌ 加载失败, 请重试',
        icon: 'none'
      })
    }).finally(() => {
      setLoading(false)
    hideLoading()
    })
  }, [url])
  return {
    imageURL,
    loading
  }
}

function ClippingShare(props: ClippingShareProps) {

  const sysInfo = useSystemInfo()

  const shareURL = getUTPLink(UTPService.clipping, {
    cid: props.cid,
    uid: props.uid,
    bid: props.bid
  }, sysInfo)
  // const shareURL = 'https://wx1.sinaimg.cn/large/6c546c01ly1gp85pkiixzj20vw1wwwy5.jpg'

  const { imageURL, loading } = useKonzertImage(shareURL)
  const onCancel = useCallback((e: any) => {
    props.onCancel()
  }, [props.onCancel])
  const onSaveImage = useCallback((e: any) => {
    e.stopPropagation()
    saveImageToPhotosAlbum({
      filePath: imageURL
    }).then(res => {
      showToast({
        title: '✔ 保存成功',
        icon: 'none'
      })
    }).catch(err => {
      console.error(err)
      showToast({
        title: '❌ 加载失败, 请重试',
        icon: 'none'
      })
    })
    if (props.onSave) {
      props.onSave(imageURL)
    }
  }, [props.onSave, imageURL])

  return (
    <View className={styles.mask} onClick={onCancel}>
      <View className={styles.container}>
        <Image src={shareURL} className={styles.poster} />
        <View>
          <Button
            onClick={onSaveImage}
            className={styles.save}>
            🎨 保存
              </Button>
        </View>
      </View>
    </View>
  )
}

export default ClippingShare

import Taro, { useEffect, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import styles from './landing.module.styl'
import { authFlow } from '../../services/auth';
import { useDispatch } from '@tarojs/redux';
import { updateUserInfo } from '../../actions/user';

function getClippingID(scene?: string) {
  if (!scene) {
    return null
  }

  // c=8!b=2
  const sceneData = decodeURIComponent(scene.trim())

  const parsedScene = sceneData.split('!').reduce((acc: any, current: string) => {
    const [k, v] = current.split('=')
    acc[k] = v
    return acc
  }, {})

  return parsedScene.c
}

function Landing() {
  const dispatch = useDispatch()
  const route = useRouter()
  useEffect(() => {
    Taro.showLoading({ mask: true, title: 'Loading...' })
    authFlow().then(resp => {
      dispatch(updateUserInfo(resp))
      setTimeout(() => {
        // c is clipping
        const c = getClippingID(route.params.scene as string | undefined)
        Taro.hideLoading()
        if (c) {
          return Taro.redirectTo({
            url: `/pages/clipping/clipping?id=${c}`
          })
        }

        return Taro.switchTab({
          url: '/pages/hero/hero'
        })
      }, 100)
    }).catch(e => {
      console.log(e)
      Taro.hideLoading()
      Taro.showToast({
        title: '🤷️ 哎呀呀，登陆出错了',
        icon: 'none'
      })
    })
  })

  return (
    <View className={styles.container}>
      Loading
    </View>
  )
}

export default Landing

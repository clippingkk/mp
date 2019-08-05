import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './styles.styl'

type NavigationBarProps = {
  hasHolder: boolean,
  homeIcon?: string
  onBack?: () => void,
  children: any
}

const defaultBackIcon = require('../../assets/back.png')

function useStatusBarSize(hasHolder: boolean) {
  const [barHeight, setBarHeight] = useState(0)
  const [platformHeight, setPlatformHeight] = useState(8)

  useEffect(() => {
    Taro.getSystemInfo().then(resp => {
      setBarHeight(resp.statusBarHeight)
      setPlatformHeight(resp.platform !== 'ios' ? 8 : 6)
    })
  }, [])

  const contentHeight = 32 + platformHeight * 2

  return {
    barHeight,
    contentHeight,
    containerHeight: hasHolder ? (contentHeight + barHeight) : 0
  }
}

function NavigationBar(props: NavigationBarProps) {

  const { barHeight, contentHeight, containerHeight } = useStatusBarSize(props.hasHolder)

  return (
    <View
      className="wepy-ui-navigation"
      style={{ height: containerHeight + 'px' }}
    >
      <View className={`navigation-bar container-class`}>
        <View className="bg" style={{ height: containerHeight + 'px' }} />
        <View className="holder" style={{ height: barHeight + 'px' }} />
        <View className="bar">
          <View
            className="touchable"
            onClick={props.onBack}
            style={{ height: contentHeight + 'px' }}
          >
            <Image
              src={props.homeIcon || defaultBackIcon}
              className={`home-icon home-icon-class`}
            />
          </View>
          <View
            className="title"
            style={{ height: contentHeight + 'px' }}
          >
            {props.children}
          </View>
        </View>
      </View>
    </View>
  )
}

NavigationBar.externalClasses = ['container-class', 'home-icon-class']

export default NavigationBar

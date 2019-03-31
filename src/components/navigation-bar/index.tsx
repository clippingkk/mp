import { ComponentClass } from 'react';
import cls from 'classnames'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import styles from './styles.module.styl'

type NavigationBarProps = {
  hasHolder: boolean,
  className?: string,
  homeIcon?: string
  homeIconClass?: string,
  containerClass?: string,
  onBack?: () => void
}

type NavigationBarState = {
  statusBarHeight: number
}

class NavigationBar extends Taro.Component<NavigationBarProps, NavigationBarState> {

  static defaultProps = {
    homeIcon: require('../../assets/back.png')
  }

  constructor(props) {
    super(props)
    this.state = {
      statusBarHeight: 0
    }
  }

  componentDidMount() {
    Taro.getSystemInfo().then(info => {
      this.setState({
        statusBarHeight: info.statusBarHeight
      })
    })
  }

  onNavigateUp = () => {
    const onBack = this.props.onBack
    if (onBack) {
      return onBack()
    }
    Taro.navigateBack()
  }

  render() {
    const { hasHolder, homeIcon, homeIconClass } = this.props
    const { statusBarHeight } = this.state
    return (
      <View
        style={{
          height: (hasHolder ? (statusBarHeight + 96) : 0) + 'rpx',
          width: '100vw'
        }}
      >
        <View
          className={styles.barContainer}
          style={{
            height: (hasHolder ? (statusBarHeight + 96) : 0) + 'rpx'
          }}
        >
          <View
            className={styles.barRow}
            style={{ height: statusBarHeight * 2 + 'rpx' }}
          />
          <View
            className={styles.titleRow}
          >
            <View
              className={styles.touchable}
              onClick={this.onNavigateUp}
            >
              <Image
                src={homeIcon as string}
                className={`${styles['back-icon']} ${homeIconClass}`}
              />
            </View>
            <View className={styles.title}>
              {this.props.children}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default NavigationBar as ComponentClass<NavigationBarProps, NavigationBarState>

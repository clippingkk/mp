import { ComponentClass } from 'react';
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import styles from './navigation-bar.module.styl'

type NavigationBarProps = {
  hasHolder: boolean,
  className?: string,
  homeIcon: string
  homeIconClass?: string
}

type NavigationBarState = {
  statusBarHeight: number
}

class NavigationBar extends Taro.Component<NavigationBarProps, NavigationBarState> {

  static defaultProps = {
    homeIcon: ""
  }

  constructor(props) {
    super(props)

    this.state = {
      statusBarHeight: 0
    }
  }

  onNavigateUp = () => {

  }

  render() {
    const { hasHolder, homeIcon } = this.props
    return (
      <View
        className={styles.bar}
        style={{
          height: hasHolder ? (this.state.statusBarHeight + 86) : 0
        }}
      >
        <View className="navigation-bar {{ containerClass }}">
          <View className="bg" style="height: {{ statusBarHeight + 86 }}rpx" />
          <View className="holder" style="height: {{ statusBarHeight }}rpx" />
          <View className="bar">
            <View
              className="touchable"
              onClick={this.onNavigateUp}
            >
              <Image
                src={homeIcon}
                className="home-icon {{ homeIconClass }}"
              />
            </View>
            <View className="title">
              {this.props.children}
            </View>
          </View>
        </View>
        </View>
    )
  }
}

export default NavigationBar as ComponentClass<NavigationBarProps, NavigationBarState>

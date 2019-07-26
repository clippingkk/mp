import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.styl'

const store = configStore()

class App extends Component {

  config: Config = {
    pages: [
      'pages/landing/landing',
      'pages/index/index',
      'pages/book/index',
      'pages/auth/index',
      'pages/bind/index',
      'pages/hero/hero',
      'pages/user/user',
      'pages/clipping/clipping'
    ],
    tabBar: {
      color: '#000000',
      selectedColor: '#2980b9',
      backgroundColor: '#ffffff',
      list: [{
        pagePath: 'pages/hero/hero',
        iconPath: './assets/dashboard-ic.png',
        selectedIconPath: './assets/dashboard-o-ic.png',
        text: 'square'
      }, {
        pagePath: 'pages/user/user',
        iconPath: './assets/face-ic.png',
        selectedIconPath: './assets/face-o-ic.png',
        text: 'user'
      }]
    },
    window: {
      navigationStyle: 'custom',
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

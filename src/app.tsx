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
      'pages/bind/index'

    ],
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

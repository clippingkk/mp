import React from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import promisedFinally from 'promise.prototype.finally'
promisedFinally.shim()
import configStore from './store'
import './app.styl'
import { loadFont } from './utils/font'
import { ApolloProvider } from '@apollo/client'
import { client } from './services/ajax'
const store = configStore()
class App extends React.Component {
  componentDidMount() {
    loadFont().then(() => {
      console.log('loaded')
    })
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          {this.props.children}
        </Provider>
      </ApolloProvider>
    )
  }
}

// Taro.render(<App />, document.getElementById('app'))

export default App

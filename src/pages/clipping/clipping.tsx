import Taro, { Component, getImageInfo } from '@tarojs/taro'
import { View, Text, Button, Canvas } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar';
import { getClipping, IClippingItem } from '../../services/clippings';
import './clipping.styl'
import { searchBookDetail, IBook } from '../../services/books';
import KKImage from '../../components/kkimage/index';
import { getImageSrc } from '../../utils/image';
import { drawCanvas } from './canvas';

interface IClippingState {
  clipping: IClippingItem
  id: number,
  book: IBook
}

async function ensurePermission(scope: string) {
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

const canvasId = 'clipping-canvas'

export default class Clipping extends Component<IClippingState> {
  config = {
    navigationBarTitleText: '首页',
    backgroundColor: '#0376d7'
  }

  state = {
    id: -1,
    clipping: {} as IClippingItem,
    book: {} as IBook
  }

  async componentDidMount() {
    const id = ~~this.$router.params.id
    const clipping = await getClipping(id)
    this.setState({ clipping, id })

    const book = await searchBookDetail(clipping.bookId)
    this.setState({ book })
    console.log(book)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  back() {
    Taro.navigateBack()
  }

  onShareAppMessage() {
    return {
      title: this.state.clipping.title,
      path: `/pages/landing/landing?c=${this.state.id}`
    }
  }

  onSaveImage = async () => {
    try {
      await ensurePermission('scope.writePhotosAlbum')
    } catch (e) {
      Taro.showToast({ title: '🤷‍ 木有权限', icon: 'none' })
      return
    }

    await drawCanvas(canvasId, {
      bg: this.state.book.image,
      id: this.state.id,
      title: this.state.clipping.title,
      content: this.state.clipping.content,
      author: this.state.book.author
    })
  }

  render () {
    return (
      <View className='clipping-page'>
        <View className='clipping-bg' />
        <KKImage src={this.state.book.image} local-class='clipping-bg' />
        <NavigationBar hasHolder onBack={this.back}>
          {this.state.clipping.title}
        </NavigationBar>
        <View className='clipping-body'>
          <View className='clipping-card'>
            <Text className='title'>{this.state.clipping.title}</Text>

            <Text className='content'>
              {this.state.clipping.content}
            </Text>

            <Text className='author'> —— {this.state.book.author}</Text>
          </View>

          <Button onClick={this.onSaveImage} className='btn-primary'>
            保存
          </Button>
        </View>

        <Canvas canvasId={canvasId} className='out-canvas' />
      </View>
    )
  }
}

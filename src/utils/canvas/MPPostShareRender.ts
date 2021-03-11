;
import { PostShareRender } from './PostShareRender';
import { IPostShareRender } from './mp-render';


export class MPPostShareRender extends PostShareRender implements IPostShareRender {
  setup() {
    const ctx = this.dom.getContext('2d');
    this.dom.width = this.config.width * this.config.dpr;
    this.dom.height = this.config.height * this.config.dpr;
    ctx?.scale(this.config.dpr, this.config.dpr);
  }
  async saveToLocal() {
    const res = await Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.renderedHeight,
      destHeight: this.renderedHeight * this.config.dpr,
      destWidth: this.config.width * this.config.dpr,
      canvas: this.dom,
      fileType: 'jpg'
    });

    return Taro.saveImageToPhotosAlbum({
      filePath: res.tempFilePath
    });
  }
}

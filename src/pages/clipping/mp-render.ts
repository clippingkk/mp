import Taro, { Image } from '@tarojs/taro'
import { API_HOST } from '../../constants/config'
import { fetchClipping_clipping } from "../../schema/__generated__/fetchClipping"
import { fetchQRCode } from '../../services/mp'
import { WenquBook } from "../../services/wenqu"

type BasicUserInfo = {
  id: number
  name: string
  avatar: string
}

type PostShareConfig = {
  width: number
  height: number
  dpr: number
  bannerInfo?: {
    avatarUrl: string
    username: string
  }
  padding: number,
  baseTextSize: number
  textFont: string
  clipping: fetchClipping_clipping
  bookInfo: WenquBook
}

export interface IPostShareRender {
  setup(): void
  renderBackground(): Promise<void>
  saveToLocal(): Promise<any>
  renderText(): Promise<void>
  renderTitle(): Promise<void>
  renderAuthor(): Promise<void>
  renderBanner(): Promise<void>
  renderMyInfo(user?: BasicUserInfo): Promise<void>
  renderQRCode(): Promise<void>
}

class BaseCanvasRender {
  // browser / mp are different
  protected dom: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected config: PostShareConfig

  // static readonly STOP_WORDS = [',', '.', ' ', '，', '。', '!', '！']
  static readonly STOP_WORDS = ['']

  protected guessMaxHeight() {
    return 0
  }

  get scaledWidth(): number {
    return this.config.width
  }
  get scaledHeight(): number {
    return this.config.height
  }
  get scaledPadding(): number {
    return this.config.padding
  }

  private setupContentFontStyle() {
    this.ctx.font = this.config.baseTextSize + 'px YSHaoShenTi,-apple-system-font,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial,sans-serif'
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'middle'
  }

  private drawOneLineText(text: string, x: number, y: number) {
    const content = text.trim()
    this.ctx.save()
    this.setupContentFontStyle()
    this.ctx.fillText(content, x, y)
    this.ctx.restore()
  }

  protected drawText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const context = this.ctx
    const words = BaseCanvasRender.STOP_WORDS.reduce<string[]>((acc, cur) => {
      if (acc.length === 0) {
        return text.split(cur)
      }

      let temp: string[] = []
      acc.forEach(x => {
        temp.push(...x.split(cur))
      })
      return temp
    }, [])
    let line = ''

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n]
      this.setupContentFontStyle()
      const metrics = context.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        this.drawOneLineText(line, x, y)
        line = words[n]
        y += lineHeight
      }
      else {
        line = testLine
      }
    }
    this.drawOneLineText(line, x, y)

    return y
  }
}

class PostShareRender extends BaseCanvasRender {
  private offsetY: number = 0
  private readonly bannerHeight = 120
  private readonly qrcodeSize = 90
  private readonly bannerGap = 15 // 120 - 90 / 2
  constructor(dom: HTMLCanvasElement, config: PostShareConfig) {
    super()
    this.dom = dom
    this.config = config
    const ctx = dom.getContext('2d')
    if (!ctx) {
      throw new Error('canvas context not found');
    }

    this.ctx = ctx
    this.offsetY = this.config.padding
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = (this.dom as any).createImage();
      img.onload = () => {
        resolve(img)
      }
      img.onerror = err => {
        console.error(err)
        reject(err)
      }
      console.log(src)
      img.src = src
    })
  }

  renderBackground(): Promise<void> {
    this.ctx.save()
    const gradient = this.ctx.createLinearGradient(0, 0, this.scaledWidth, this.scaledHeight)
    gradient.addColorStop(0, '#f2f2f2')
    gradient.addColorStop(1, '#e0e0e0')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.scaledWidth, this.scaledHeight)
    this.ctx.restore()
    return Promise.resolve()
  }
  renderText(): Promise<void> {
    this.ctx.save()
    const y = this.drawText(
      this.config.clipping.content,
      this.scaledPadding,
      this.scaledPadding * 2,
      this.scaledWidth - this.scaledPadding * 2,
      this.config.baseTextSize * 1.5
    )

    this.offsetY = y
    this.ctx.restore()
    return Promise.resolve()
  }
  renderTitle(): Promise<void> {
    this.ctx.save()
    this.ctx.font = this.config.baseTextSize * 0.7 + 'px bold YSHaoShenTi,-apple-system-font,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial,sans-serif'
    this.ctx.fillStyle = '#4F4F4F'
    this.ctx.textAlign = 'right'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(
      this.config.bookInfo.title,
      this.scaledWidth - this.scaledPadding,
      this.scaledPadding + this.offsetY + this.scaledPadding * 3,
      this.scaledWidth - this.scaledPadding * 2,
    )

    this.offsetY += this.config.baseTextSize
    this.ctx.restore()
    return Promise.resolve()
  }
  renderAuthor(): Promise<void> {
    this.ctx.save()
    this.ctx.font = this.config.baseTextSize * 0.7 + 'px bold YSHaoShenTi,-apple-system-font,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial,sans-serif'
    this.ctx.fillStyle = '#4F4F4F'
    this.ctx.textAlign = 'right'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(
      this.config.bookInfo.author,
      this.scaledWidth - this.scaledPadding,
      this.scaledPadding + this.offsetY + this.scaledPadding * 3,
      this.scaledWidth - this.scaledPadding * 2,
    )
    this.offsetY += this.config.baseTextSize
    this.ctx.restore()
    return Promise.resolve()
  }

  renderBanner(): Promise<void> {
    this.ctx.save()
    const ctx = this.ctx
    const x = this.scaledPadding
    const y = this.scaledHeight - this.bannerHeight - this.scaledPadding
    const width = this.scaledWidth - this.scaledPadding * 2
    const height = this.bannerHeight
    const defaultRadius = 5
    const radius = { tl: defaultRadius, tr: defaultRadius, br: defaultRadius, bl: defaultRadius }

    // make blur effect
    // ctx.save()
    // ctx.filter = 'blur(5px)'
    // ctx.fillStyle = 'rgba(61,126,154, .7)'
    // ctx.fillRect(x, y, width, height)
    // ctx.restore()

    // draw box
    ctx.fillStyle = 'rgba(0,0,0, .1)'
    // ctx.fillStyle = 'rgba(61,126,154, .7)'
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    ctx.shadowOffsetY = 0
    ctx.shadowOffsetX = 0
    ctx.shadowColor = '#000'
    ctx.shadowBlur = 10
    ctx.fill()

    this.ctx.restore()
    return Promise.resolve()
  }

  async renderMyInfo(user?: BasicUserInfo): Promise<void> {
    if (!user) {
      return Promise.resolve()
    }

    const avatarSize = 60
    const avatar = await this.loadImage(user.avatar)
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(
      this.scaledPadding + avatarSize,
      this.scaledHeight - this.scaledPadding - this.bannerHeight / 2 - 5,
      avatarSize / 2,
      0,
      2 * Math.PI,
      false
    )
    this.ctx.clip()
    this.ctx.drawImage(
      avatar,
      this.scaledPadding + avatarSize / 2,
      this.scaledHeight - this.scaledPadding - this.bannerHeight / 2 - avatarSize / 2 - 5,
      avatarSize,
      avatarSize
    )
    this.ctx.closePath()
    this.ctx.restore()

    this.ctx.save()
    this.ctx.font = this.config.baseTextSize * 0.7 + 'px bold YSHaoShenTi,-apple-system-font,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial,sans-serif'
    this.ctx.fillStyle = '#ffffff'
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(
      user.name,
      this.scaledPadding * 2,
      this.scaledHeight - this.scaledPadding * 2,
      this.scaledWidth - this.scaledPadding * 2.5 - this.qrcodeSize,
    )

    this.ctx.restore()
    return Promise.resolve()
  }

  async renderQRCode(): Promise<void> {
    const res = await fetchQRCode(`c=${this.config.clipping.id}`, 'pages/landing/landing', this.qrcodeSize, true)
    const qrcode = await this.loadImage(res)
    this.ctx.save()
    await this.ctx.drawImage(
      qrcode,
      this.scaledWidth - (this.qrcodeSize + this.config.padding + this.bannerGap),
      this.scaledHeight - (this.qrcodeSize + this.scaledPadding + this.bannerGap),
      this.qrcodeSize,
      this.qrcodeSize
    )

    this.ctx.restore()
    return Promise.resolve()
  }
}
export class MPPostShareRender extends PostShareRender implements IPostShareRender {
  setup() {
    const ctx = this.dom.getContext('2d')
    this.dom.width = this.config.width * this.config.dpr
    this.dom.height = this.config.height * this.config.dpr
    ctx?.scale(this.config.dpr, this.config.dpr)
  }
  async saveToLocal() {
    const res = await Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: this.config.width,
      height: this.config.height,
      destHeight: this.config.height * this.config.dpr,
      destWidth: this.config.width * this.config.dpr,
      canvas: this.dom,
      fileType: 'jpg'
    })

    return Taro.saveImageToPhotosAlbum({
      filePath: res.tempFilePath
    })
  }
}


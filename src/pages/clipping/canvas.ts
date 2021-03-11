import { getImageInfo, canvasToTempFilePath, saveImageToPhotosAlbum } from "remax/wechat"
import { fetchQRCode, fetchRandomBackground } from "../../services/mp"

function fetchImage(canvasDom: any, url: string): Promise<any> {
  const img = canvasDom.createImage()
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (e: any) => {
      reject(e)
    }

    img.src = url
  })
}


type info = {
  title: string
  content: string
  author: string
  bg: string
  id: number
}

type screenSize = {
  width: number
  height: number
  ratio: number
}

type coordinate = {
  x: number
  y: number
}

function drawMultipLineText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number, startAt: coordinate) {
  const words = text.split('');
  const x = startAt.x
  let y = startAt.y

  let line = '';

  for (var n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ''
    let metrics = ctx.measureText(testLine)
    let testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ''
      y += lineHeight
    }
    else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

const FONT_SIZE = {
  title: 26,
  content: 20,
  author: 16
}

const CANVAS_QRCODE_SIZE = 100

export async function drawCanvas(dom: HTMLCanvasElement, ctx: CanvasRenderingContext2D, info: info, size: screenSize) {
  // mock data
  // const { path, width, height } = await Taro.getImageInfo({ src: getImageSrc(info.bg) })
  // const path = await fetchRandomBackground(size.width, size.height)
  // const qrcode = await fetchQRCode(`c=${info.id}`, "pages/landing/landing", size.width, true)
  const bg = await fetchImage(dom, 'https://picsum.photos/200/300')
  const qrcode = bg


  // draw background
  ctx.save();
  ctx.drawImage(bg, 0, 0, size.width, size.height, 0, 0, size.width, size.height)
  // ctx.drawImage(path, 0, 0, size.width, size.height, 0, 0, size.width, size.height);
  ctx.fillStyle = 'rgba(0, 0, 0, .5)'
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.restore()

  // draw title and desc
  ctx.save()

  ctx.fillStyle = '#ffffff'
  ctx.font = FONT_SIZE.title * size.ratio + 'px'
  // ctx.setFontSize(FONT_SIZE.title * size.ratio)
  drawMultipLineText(ctx, info.title, size.width * 0.9, FONT_SIZE.title * size.ratio * 1.6, { x: size.width * 0.05, y: size.height * 0.1 })

  ctx.font = FONT_SIZE.content * size.ratio + 'px'
  // ctx.setFontSize(FONT_SIZE.content * size.ratio)
  drawMultipLineText(ctx, info.content, size.width * 0.9, FONT_SIZE.content * size.ratio * 1.6, { x: size.width * 0.05, y: size.height * 0.2 })
  ctx.restore()

  ctx.save()

  ctx.fillStyle = 'rgba(255, 255, 255, .5)'
  ctx.fillRect(0, size.height * 0.85, size.width, size.height * 0.15)

  ctx.fillStyle = '#000000'
  ctx.font = FONT_SIZE.author * size.ratio + 'px'
  // ctx.setFontSize(FONT_SIZE.author * size.ratio)
  drawMultipLineText(
    ctx,
    '—— ' + info.author,
    size.width * 0.9 - CANVAS_QRCODE_SIZE * size.ratio - 10,
    FONT_SIZE.author * size.ratio * 1.6,
    { x: size.width * 0.05, y: size.height * 0.9 }
  )

  const qrcodeImageInfo = await getImageInfo({ src: 'https://picsum.photos/200/300' })

  console.log(
    qrcode,
    0,
    0,
    qrcodeImageInfo.width,
    qrcodeImageInfo.height,
    size.width * 0.95 - CANVAS_QRCODE_SIZE * size.ratio,
    size.height - 5 - CANVAS_QRCODE_SIZE * size.ratio,
    qrcodeImageInfo.width,
    qrcodeImageInfo.height
  )

  ctx.drawImage(
    bg,
    // qrcode,
    0,
    0,
    qrcodeImageInfo.width,
    qrcodeImageInfo.height,
    size.width * 0.95 - CANVAS_QRCODE_SIZE * size.ratio,
    size.height - 5 - CANVAS_QRCODE_SIZE * size.ratio,
    CANVAS_QRCODE_SIZE * size.ratio,
    CANVAS_QRCODE_SIZE * size.ratio
  );
  ctx.restore()

  return new Promise(resolve => {
    console.log('rendered')
    const result = dom.toDataURL()
    console.log(result)
    resolve(result)
    // ctx.draw(false, resolve)
  })
}

export async function saveLocally(canvasId: string, size: screenSize) {
  const res = await canvasToTempFilePath({
    canvasId: canvasId,
    fileType: 'jpg'
  }) as any

  return saveImageToPhotosAlbum({
    filePath: res.tempFilePath
  })
}

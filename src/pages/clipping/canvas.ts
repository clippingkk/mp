import { getImageSrc } from "../../utils/image";
import Taro from "@tarojs/taro";
import { fetchQRCode } from "../../services/mp";


type info = {
  title: string
  content: string
  author: string
  bg: string
  id: number
}

export async function drawCanvas(cid: string, info: info) {
  const ctx = Taro.createCanvasContext(cid, null)
  // const { path } = await Taro.getImageInfo({ src: getImageSrc(info.bg) })

  const a = await fetchQRCode(`c=${info.id}`, "/pages/landing/landing", true)

  console.log(a)
}

import Taro from "@tarojs/taro";
import { API_HOST } from "../constants/config";
import { token } from "../store/global";

export async function fetchQRCode(scene: string, page: string, width: number, isHyaline: boolean): Promise<string> {
  const resp = await Taro.downloadFile({
    url: `${API_HOST}/mp/qrcode?scene=${encodeURIComponent(scene)}&page=${page}&width=${width}&isHyaline=${isHyaline}`,
    header: {
      'Authorization': `Bearer ${token}`
    }
  })

  return resp.tempFilePath
}

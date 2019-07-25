import Taro from "@tarojs/taro";
import { API_HOST } from "../constants/config";
import { token } from "../store/global";

export async function fetchQRCode(scene: string, page: string, isHyaline: boolean) {
  const resp = await Taro.downloadFile({
    url: `${API_HOST}/mp/qrcode?scene=${scene}&page=${page}&isHyaline=${isHyaline}`,
    header: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log(resp)

  return resp
}

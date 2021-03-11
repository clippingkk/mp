import { downloadFile } from "remax/wechat";
import { API_HOST } from "../constants/config";
import { token } from "../store/global";

export async function fetchQRCode(scene: string, page: string, width: number, isHyaline: boolean): Promise<string> {
  const resp = await downloadFile({
    url: `${API_HOST}/v1/mp/qrcode?scene=${encodeURIComponent(scene)}&page=${page}&width=${width}&isHyaline=${isHyaline}`,
    header: {
      'Authorization': `Bearer ${token}`
    }
  }) as any

  return resp.tempFilePath
}

export async function fetchRandomBackground(width: number, height: number): Promise<string> {
  const resp = await downloadFile({
    url: `${API_HOST}/picsum-photos/${width}/${height}?blur=10`,
    header: {
      'Authorization': `Bearer ${token}`
    }
  }) as any

  return resp.tempFilePath
}

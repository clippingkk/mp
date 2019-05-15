import Taro from '@tarojs/taro'
import { API_HOST } from '../constants/config'

export let token = Taro.getStorageSync("token")

export function updateToken(jwt: string) {
  token = jwt
  Taro.setStorageSync("token", jwt)
}

export interface IBaseResponseData {
  status: Number
  msg: string
  data: any
}

export async function request(url: string, options: RequestInit = {}): Promise<any> {
  if (token) {
    options.headers = {
      'Authorization': `Bearer ${token}`
    }
  }
  options.credentials = 'include'
  options.mode = 'cors'

  try {
    const response: IBaseResponseData = await Taro.request({
      url: API_HOST + url,
      ...(options as any)
    }).then(res => res.data)
    if (response.status !== 200) {
      throw new Error(response as any)
    }
    return response.data
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  }
}

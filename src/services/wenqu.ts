import Taro from '@tarojs/taro'
import { WENQU_SIMPLE_TOKEN, WENQU_API_HOST } from "../constants/config"

type WenquErrorResponse = {
  code: number
  error: string
}

export async function wenquRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  options.headers = {
    ...(options.headers || {}),
    'X-Simple-Check': WENQU_SIMPLE_TOKEN
  }

  try {
    const response: T = await Taro.request({
      url: WENQU_API_HOST + url,
      header: {
        'X-Simple-Check': WENQU_SIMPLE_TOKEN
      }
    }).then(res => res.data)
    if ('error' in response) {
      throw new Error(response['error'])
    }

    return response
  } catch (e) {
    Taro.showToast({
      title: '请求挂了... 一会儿再试试',
      icon: 'none'
    })
    return Promise.reject(e)
  }
}

export interface WenquBook {
  id: number
  rating: number
  author: string
  pubdate: string
  totalPages: number
  originTitle: string
  image: string
  doubanId: number
  title: string
  url: string
  press: string
  isbn: string
  tags: string[]
  authorIntro: string
  summary: string
  createdAt: string
  updatedAt: string
}

export interface WenquSearchResponse {
  count: number
  books: WenquBook[]
}

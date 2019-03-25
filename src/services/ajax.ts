import { API_HOST } from '../constants/config'

export interface IBaseResponseData {
  status: Number
  msg: string
  data: any
}

export async function request(url: string, options: RequestInit = {}): Promise<any> {
  const token = sessionStorage.getItem('token')
  if (token) {
    options.headers = {
      'Authorization': `Bearer ${token}`
    }
  }
  options.credentials = 'include'
  options.mode = 'cors'

  try {
    const response: IBaseResponseData = await fetch(API_HOST + url, options).then(res => res.json())
    if (response.status !== 200) {
      throw new Error(response.msg)
    }

    return response.data

  } catch (e) {
    console.log(e.toString())
    return Promise.reject(e)
  }
}

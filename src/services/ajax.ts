import React from 'react'
import Taro from '@tarojs/taro'
import { API_HOST } from '../constants/config'
import { token } from '../store/global';

export interface IBaseResponseData {
  status: Number
  msg: string
  data: any
}

export async function request<T>(url: string, options: any = {}): Promise<T> {
  if (token) {
    options.header = {
      'Authorization': `Bearer ${token}`,
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
      throw new Error(response.msg)
    }
    return response.data as T
  } catch (e) {
    console.log(e.toString())
    return Promise.reject(e)
  }
}

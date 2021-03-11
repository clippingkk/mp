import { login as wechatOriginLogin } from 'remax/wechat'
import { request, IBaseResponseData } from './ajax'
import { IUserContentResponse, IUserContent } from '../store/user/type'
import React from 'react'
;
import { updateToken } from '../store/global';
import { IHttpUserProfileResponseData, IResponseUser, IUserProfileResponseData, IClippingItem } from './types';

interface ILoginResponse {
  profile: IUserContentResponse,
  token: string
}

interface IUserInfo {
  profile: IUserContent
  token: string
}

export async function login(email: string, pwd: string): Promise<IUserInfo> {
  const resp = await request('/auth/login', {
    method: 'POST',
    data: { email, pwd }
  }) as ILoginResponse

  return {
    profile: {
      ...resp.profile,
      createdAt: new Date(resp.profile.createdAt),
      updatedAt: new Date(resp.profile.updatedAt),
    },
    token: resp.token
  }
}

export async function wechatLogin(code: string): Promise<IUserInfo> {
  const resp = await request('/auth/wechat/login', {
    method: 'POST',
    data: { code }
  }) as ILoginResponse
  return {
    profile: {
      ...resp.profile,
      createdAt: new Date(resp.profile.createdAt),
      updatedAt: new Date(resp.profile.updatedAt),
    },
    token: resp.token
  }
}

export async function wechatBinding(openid: string, email: string, password: string): Promise<IUserInfo> {
  const resp = await request<ILoginResponse>('/auth/wechat/bind', {
    method: 'POST',
    data: { openid, email, password }
  })

  return {
    profile: {
      ...resp.profile,
      createdAt: new Date(resp.profile.createdAt),
      updatedAt: new Date(resp.profile.updatedAt),
    },
    token: resp.token
  }
}

export async function authFlow() {
    const res = await wechatOriginLogin()
    const resp = await wechatLogin(res.code)

    updateToken(resp.token)
    return resp
}

export async function fetchMyProfile(id: number): Promise<IUserProfileResponseData> {
   const resp = await request<IHttpUserProfileResponseData>('/auth/' + id)

   return {
     ...resp,
     clippings: resp.clippings.map(c => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt)} as IClippingItem)),
     user: {
       ...resp.user,
       createdAt: new Date(resp.user.createdAt),
       updatedAt: new Date(resp.user.updatedAt)
     }
   }
}

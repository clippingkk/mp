import { request, IBaseResponseData } from './ajax'
import { IUserContentResponse, IUserContent } from '../store/user/type'
import Taro from '@tarojs/taro';
import { updateToken } from '../store/global';

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
  const resp = await request('/auth/wechat/bind', {
    method: 'POST',
    data: { openid, email, password }
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

export async function authFlow() {
    const res = await Taro.login()
    const resp = await wechatLogin(res.code)

    updateToken(resp.token)
    return resp
}

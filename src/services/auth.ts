import { request, IBaseResponseData } from './ajax'
import { UserContent } from '../store/user/type'

interface ILoginResponse extends IBaseResponseData {
  data: {
    profile: UserContent,
    token: string
  }
}

export function login(email: string, pwd: string): Promise<ILoginResponse> {
  return request('/auth/login', {
    method: 'POST',
    data: { email, pwd }
  })
}

export function wechatLogin(code: string): Promise<ILoginResponse> {
  return request('/auth/wechat/login', {
    method: 'POST',
    data: { code }
  })
}

export function wechatBinding(openid: string, email: string, password: string): Promise<ILoginResponse> {
  return request('/auth/wechat/bind', {
    method: 'POST',
    data: { openid, email, password }
  })
}

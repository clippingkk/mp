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
    body: JSON.stringify({ email, pwd })
  })
}

export function wechatLogin(code: string): Promise<ILoginResponse> {
  return request('/auth/wechat/login', {
    method: 'POST',
    body: JSON.stringify({ code })
  })
}

export function wechatBinding(code: string, email: string, pwd: string): Promise<ILoginResponse> {
  return request('/auth/wechat/bind', {
    method: 'POST',
    body: JSON.stringify({ code, email, pwd })
  })
}

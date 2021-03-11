import { getStorageSync, setStorageSync } from "remax/wechat"

export let token = getStorageSync("clippingkk:token")

export function updateToken(jwt: string) {
  token = jwt
  setStorageSync("token", jwt)
}

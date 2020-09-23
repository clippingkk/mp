import Taro from "@tarojs/taro";

export let token = Taro.getStorageSync("clippingkk:token")

export function updateToken(jwt: string) {
  token = jwt
  Taro.setStorageSync("token", jwt)
}

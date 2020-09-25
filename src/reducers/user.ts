import { USERINFO_MODIFIED } from "../constants/user.action";
import { wechatLogin_mpAuth_user } from "../schema/__generated__/wechatLogin";

export type UserInfo = {
  profile: wechatLogin_mpAuth_user,
  token: string
}

const initUserInfo = {
  profile: {
    id: -1,
    name: "Unknow",
    email: "unknow@clippingkk.annatarhe.com",
    avatar: "null",
    checked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    wechatOpenid: ''
  },
  token: ""
}

export default function userReducer(state = initUserInfo, action: any) {

  switch (action.type) {
    case USERINFO_MODIFIED:
      return {
        profile: action.user,
        token: action.token,
      }
    default:
      return state
  }
}

import { USERINFO_MODIFIED } from "../constants/user.action";
import { wechatLogin, wechatLogin_mpAuth_user } from "../schema/__generated__/wechatLogin";

export function updateUserInfo(user: wechatLogin_mpAuth_user, token: string) {
  return {
    type: USERINFO_MODIFIED,
    user,
    token
  }
}

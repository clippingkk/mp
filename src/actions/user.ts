import { USERINFO_MODIFIED } from "../constants/user.action";

export function updateUserInfo(user: any) {
  return {
    type: USERINFO_MODIFIED,
    user
  }
}

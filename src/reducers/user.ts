import { USERINFO_MODIFIED } from "../constants/user.action";

const initUserInfo = {
  id: -1,
}

export default function userReducer(state = initUserInfo, action: any) {
  switch (action.type) {
    case USERINFO_MODIFIED:
      return {
        ...action.user
      }
    default:
      return state
  }
}

import { USERINFO_MODIFIED } from "../constants/user.action";

const initUserInfo = {
  profile: {
    id: -1,
    name: "Unknow",
    email: "unknow@clippingkk.annatarhe.com",
    avatar: "null",
    checked: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  token: "",
  hasBind: false
}

export default function userReducer(state = initUserInfo, action: any) {
  switch (action.type) {
    case USERINFO_MODIFIED:
      return {
        ...action.user,
        hasBind: !action.user.profile.email.includes('@clippingkk.annatarhe.com')
      }
    default:
      return state
  }
}

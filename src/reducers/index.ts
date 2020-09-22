import { combineReducers } from 'redux'
import userReducer, { UserInfo } from './user'

export type TGlobalStore = {
  user: UserInfo
}

export default combineReducers({
  user: userReducer
})

interface IBaseResponsePlainUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  checked: boolean;
  wechatOpenid: string;
}

export interface ResponsePlainUser extends IBaseResponsePlainUser {
  createdAt: string;
  updatedAt: string;
}

export interface IResponseUser extends IBaseResponsePlainUser {
  createdAt: Date;
  updatedAt: Date;
}

interface IBaseClippingItem {
  id: number
  title: string
  content: string
  pageAt: string
  createdBy: string
  bookId: string
  dataId: string
  seq: number
}

export interface IClippingItem extends IBaseClippingItem {
  createdAt: Date
  updatedAt: Date
}

export interface IHttpClippingItem extends IBaseClippingItem {
  createdAt: string
  updatedAt: string
}

export interface IHttpUserProfileResponseData {
  user: ResponsePlainUser
  clippingsCount: number
  clippings: IHttpClippingItem[]
}

export interface IUserProfileResponseData {
  user: IResponseUser
  clippingsCount: number
  clippings: IClippingItem[]
}

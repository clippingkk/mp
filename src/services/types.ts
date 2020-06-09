export interface ResponsePlainUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
  wechatOpenid: string;
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

export interface UserProfileResponseData {
  user: ResponsePlainUser;
  clippingsCount: number;
  clippings: IHttpClippingItem[];
}

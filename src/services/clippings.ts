import { request, IBaseResponseData } from './ajax'
import { TClippingItem } from '../store/clippings/creator';
import { IClippingItem, IHttpClippingItem } from './types';

export async function getClippings(userid: number, offset: number): Promise<IClippingItem[]> {
  const response = await request<IHttpClippingItem[]>(`/clippings/clippings/${userid}?take=20&from=${offset}`)
  const list = response.map(item => ({ ...item, createdAt: new Date(item.createdAt), updatedAt: new Date(item.updatedAt) } as IClippingItem))

  return list
}

export async function getClipping(clippingid: number): Promise<IClippingItem> {
  const response = await request<IHttpClippingItem>(`/clippings/${clippingid}`)

  return {
    ...response,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt)
  }
}

export async function create(clippings: TClippingItem[]) {
  const response = await (request(`/clippings/multip/create`, {
    method: 'POST',
    body: JSON.stringify({ clippings })
  }) as Promise<IHttpClippingItem[]>)

  return response
}

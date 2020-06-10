import { request, IBaseResponseData } from './ajax'
import { ISearchAllResponseData, ISearchAllHttpResponseData, IClippingItem } from './types'

export async function searchRequest(query: string, offset = 0): Promise<ISearchAllResponseData> {
  const resp = await request<ISearchAllHttpResponseData>('/search/all', {
    method: 'POST',
    data: { query, take: 20, offset }
  })

  // FIXME: books 目前没有返回数据，暂时不用管
  if (!resp.clippings) {
    return {
      books: [],
      clippings: []
    }
  }

  const clippings = resp.clippings.map(x => ({ ...x, createdAt: new Date(x.createdAt), updatedAt: new Date(x.updatedAt) } as IClippingItem))
  return {
    books: [],
    clippings
  }
}

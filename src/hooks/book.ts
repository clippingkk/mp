import { useEffect, useState } from "react"
import { WenquBook, WenquSearchResponse, wenquRequest } from "../services/wenqu"

const cache = new Map<string, WenquBook>()

export function useSingleBook(doubanId?: string, bookID?: number): WenquBook | undefined {
  const [book, setBook] = useState<WenquBook | undefined>(undefined)

  useEffect(() => {
    if ((!doubanId || doubanId.length < 5) && !bookID) {
      return
    }
    if (doubanId && cache.has(doubanId)) {
      setBook(cache.get(doubanId)!)
      return
    }

    var searchParams = ''
    if (doubanId) {
      searchParams = `dbId=${doubanId}`
    }
    if (bookID) {
      searchParams = `id=${bookID}`
    }
    if (!searchParams) {
      return
    }

    wenquRequest<WenquSearchResponse>(`/books/search?${searchParams}`).then(res => {
      if (res.count < 1) {
        return
      }
      const b = res.books[0]
      setBook(b)
      cache.set(b.doubanId.toString(), b)
    })
  }, [doubanId, bookID])

  return book
}

export function useMultipBook(doubanIds: string[]): WenquBook[] {
  const [book, setBook] = useState<WenquBook[]>([])

  useEffect(() => {
    if (!doubanIds) {
      return
    }

    const dbIdList = doubanIds.reduce((acc, x) => {
      const f = acc.findIndex(a => a === x)
      if (f === -1) {
        acc.push(x)
      }
      return acc
    }, [] as string[])

    let shouldFetchDoubanIDs: string[] = []

    dbIdList.forEach(x => {
      if (cache.has(x)) {
        setBook(s => {
          const idx = s.findIndex(xx => xx.id.toString() === x)
          if (idx > 0) {
            return s
          }
          return s.concat([cache.get(x)!])
        })
      } else {
        shouldFetchDoubanIDs.push(x)
      }
    })

    if (shouldFetchDoubanIDs.length === 0) {
      return
    }

    const query = shouldFetchDoubanIDs.join('&dbIds=')

    wenquRequest<WenquSearchResponse>(`/books/search?dbIds=${query}`).then(res => {
      if (res.count < 1) {
        return
      }
      const b = res.books
      setBook(s => s.concat(res.books))
      b.forEach(x => {
        cache.set(x.id.toString(), x)
      })
    })
  }, [doubanIds.join('')])

  // FIXME: 有重复选项，需要干掉
  return book.reduce((acc, cur) => {
    if (acc.findIndex(x => x.doubanId === cur.doubanId) === -1) {
      acc.push(cur)
    }
    return acc
  }, [] as WenquBook[])
}

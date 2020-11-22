import { useEffect, useState } from "react"
import { WenquBook, WenquSearchResponse, wenquRequest } from "../services/wenqu"

const cache = new Map<string, WenquBook>()

export function useSingleBook(doubanId?: string): WenquBook | null {
  const [book, setBook] = useState<WenquBook | null>(null)

  useEffect(() => {
    if (!doubanId || doubanId.length < 5) {
      return
    }
    if (cache.has(doubanId)) {
      setBook(cache.get(doubanId)!)
      return
    }
    wenquRequest<WenquSearchResponse>(`/books/search?dbId=${doubanId}`).then(res => {
      if (res.count < 1) {
        return
      }
      const b = res.books[0]
      setBook(b)
      cache.set(doubanId, b)
    })
  }, [doubanId])

  return book
}

export function useMultipBook(doubanIds: string[]): WenquBook[] {
  const [book, setBook] = useState<WenquBook[]>([])

  useEffect(() => {
    if (!doubanIds) {
      return
    }
    let shouldFetchDoubanIDs: string[] = []

    doubanIds.forEach(x => {
      if (cache.has(x)) {
        setBook(s => {
          if (s.findIndex(xx => xx.id.toString() === x) > 0) {
            return s
          }
          return s.concat(cache.get(x)!)
        })
      } else {
        shouldFetchDoubanIDs.push(x)
      }
    })

    if (shouldFetchDoubanIDs.length === 0) {
      return
    }

    const query = shouldFetchDoubanIDs.join('&dbIds=').slice(1)

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

  return book
}

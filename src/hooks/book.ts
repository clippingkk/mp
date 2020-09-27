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

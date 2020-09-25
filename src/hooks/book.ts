import { useEffect, useState } from "react"
import { WenquBook, WenquSearchResponse, wenquRequest } from "../services/wenqu"

export function useSingleBook(doubanId?: string): WenquBook | null {
  const [book, setBook] = useState<WenquBook | null>(null)

  useEffect(() => {
    if (!doubanId || doubanId.length < 5) {
      return
    }
    wenquRequest<WenquSearchResponse>(`/books/search?dbId=${doubanId}`).then(res => {
      if (res.count < 1) {
        return
      }
      setBook(res.books[0])
    })

  }, [doubanId])

  return book
}

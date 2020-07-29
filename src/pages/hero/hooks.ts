import { useState, useRef, useCallback, useEffect } from "@tarojs/taro"
import { IBook, getBooks } from "../../services/books"

export function useBookList(userID: number) {
  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState(false)
  const [reachEnd, setReachEnd] = useState(false)
  const offset = useRef(0)

  const loadMore = useCallback((force: boolean = false) => {
    if (loading || reachEnd || !userID || userID < 0) {
      return
    }

    setLoading(true)
    if (force) {
      offset.current = 0
    }

    getBooks(userID, offset.current).then(b => {
      offset.current += 20
      if (force) {
        setBooks(b)
        return
      }

      if (b.length === 0) {
        setReachEnd(true)
        return
      }

      setBooks(bs => [...bs, ...b])
    }).finally(() => {
      setLoading(false)
    })
  }, [userID, loading, offset])

  useEffect(() => {
    loadMore()
  }, [])

  return {
    books,
    loadMore,
    loading,
    reachEnd
  }
}

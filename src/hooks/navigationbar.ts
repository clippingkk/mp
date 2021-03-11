import { useCallback } from 'react'
import {navigateBack, switchTab} from 'remax/wechat'

export function useNavigateUp() {
  const onNavigateUp = useCallback(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      navigateBack()
      return
    }
    // do nothing
    switchTab({
      url: '/pages/hero/hero'
    })
  }, [])

  return onNavigateUp
}


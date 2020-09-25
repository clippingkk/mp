import { useCallback } from 'react'

import Taro, { getCurrentPages } from '@tarojs/taro'

export function useNavigateUp() {
  const onNavigateUp = useCallback(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      Taro.navigateBack()
    } else {
      // do nothing
      Taro.switchTab({
        url: '/pages/hero/hero'
      })
    }
  }, [])

  return onNavigateUp
}

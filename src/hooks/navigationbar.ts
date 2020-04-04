import Taro, { useCallback, getCurrentPages } from '@tarojs/taro'

export function useNavigateUp() {
  const onNavigateUp = useCallback(() => {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      Taro.navigateBack()
    } else {
      // do nothing
    }
  }, [])

  return onNavigateUp
}
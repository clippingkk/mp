import Taro, { useState, useEffect, useCallback, useRef } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import NavigationBar from '../../components/navigation-bar'
import { searchRequest } from '../../services/search'
import Info from '../../components/info/info'
import { IHttpClippingItem, IClippingItem } from '../../services/types'
import ClippingItem from '../../components/clipping-item/clipping-item'
import { useNavigateUp } from '../../hooks/navigationbar'

import styles from './search.module.styl'

function useSearch() {
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const [clippingsResult, setClippingsResult] = useState<IClippingItem[] | null>([])

  useEffect(() => {
    if (searchText.length < 3) {
      return
    }

    if (loadingRef.current) {
      return
    }

    setLoading(true)
    loadingRef.current = true
    searchRequest(searchText, 0).then(res => {
      console.log(res)
      setClippingsResult(res.clippings)
    }).finally(() => {
      setLoading(false)
      loadingRef.current = false
    })
  }, [searchText])

  const onSearchTextChange = useCallback((e) => {
    setSearchText(e.detail.value)
  }, [])

  return {
    searchText, loading, clippingsResult, onSearchTextChange
  }
}

function SearchPage() {
  const { searchText, loading, clippingsResult, onSearchTextChange } = useSearch()

  const onNavateUp = useNavigateUp()

  return (
    <View>
      <NavigationBar hasHolder onBack={onNavateUp}>
        <Text> Search... </Text>
      </NavigationBar>
      <View className={styles['input-box']}>
        <Input
          value={searchText}
          onInput={onSearchTextChange} placeholder='👀 Input anything you want to search'
          className={styles['input']}
        />
      </View>
      <View>
        {loading && (
          <Info text='Loading...' />
        )}
        {clippingsResult && (
          clippingsResult.map(x => (
            <ClippingItem clipping={x} key={x.id} />
          ))
        )}
      </View>
    </View>
  )
}

export default SearchPage

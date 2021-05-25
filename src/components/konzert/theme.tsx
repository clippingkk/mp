import React from 'react'
import { View, Text, Button } from 'remax/wechat'
import { KonzertTheme, KonzertThemeMap } from '../../utils/konzert'
import styles from './theme.styl'

type ThemePickerProps = {
  current: KonzertTheme
  onChange: (t: KonzertTheme) => void
}

function ThemePicker(props: ThemePickerProps) {
  return (
    <View className={styles.container}>
      {Object.keys(KonzertTheme)
        .filter(x => (/\d+/.test(x)))
        .map(k => (
          <View
            className={styles.item + (k === props.current.toString() ? ` ${styles.active}` : '')}
            key={k}
            onClick={(e: any) => {
              e.stopPropagation()
              // guard if active
              if (k === props.current.toString()) {
                return
              }
              props.onChange(~~k)
            }}>
            <Button className={styles.btn}>
              {(KonzertThemeMap as any)[k]}
            </Button>
          </View>
        ))}
    </View>
  )
}

export default ThemePicker

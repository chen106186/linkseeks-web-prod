import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, Image } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { THEME_COLORS } from '@/constants/theme'

interface Iprops {
  options: SitesOption[]
  value: string | number
  onChange?: null | ((value: SitesOption) => void)
}

export interface SitesOption {
  label: string
  value: string | number
  logo: string
}

const Sites: React.FC<Iprops> = (props: Iprops) => {
  const { options, value, onChange } = props
  const [selected, setSelected] = useState(value)
  const handleClick = (v: SitesOption) => {
    if (v.value === value) {
      return
    }
    setSelected(v.value)
    if (onChange) {
      onChange(v)
    }
  }
  useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <View className={styles['container']}>
      {options.map((item) => (
        <View
          className={cx(styles['site-item'], { [styles.active]: selected === item.value })}
          onClick={() => handleClick(item)}
          key={item.value}
        >
          <View className={styles['wrap']}>
            <View className={styles['info']}>
              <Image
                src={item.logo}
                className={styles['site-icon']}
                style={{ width: pxTransform(24), height: pxTransform(18) }}
              />
              <Text className={styles['text']}>{item.label}</Text>
            </View>
            {selected === item.value ? <Icons name="Right" size={16} color={THEME_COLORS.primary} /> : null}
          </View>
        </View>
      ))}
    </View>
  )
}

Sites.defaultProps = {
  onChange: null,
}

export default Sites
